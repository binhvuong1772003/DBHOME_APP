import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/api/apiResponse";
import type {
  AiChatResponse,
  AiConversationListResponse,
  AiConversationMessagesResponse,
} from "../types/aiAssistant.types";

interface CursorParams {
  cursor?: string;
  limit?: number;
}

export async function listAiConversations(
  shopSlug: string,
  params: CursorParams = {},
  signal?: AbortSignal,
) {
  const { data: response } = await axiosClient.get<
    ApiSuccessResponse<AiConversationListResponse>
  >(`/api/ai/shops/${shopSlug}/conversations`, {
    params: { limit: params.limit ?? 20, ...(params.cursor ? { cursor: params.cursor } : {}) },
    signal,
    timeout: 15_000,
  });

  return response.data;
}

export async function listAiConversationMessages(
  shopSlug: string,
  conversationId: string,
  params: CursorParams = {},
  signal?: AbortSignal,
) {
  const { data: response } = await axiosClient.get<
    ApiSuccessResponse<AiConversationMessagesResponse>
  >(
    `/api/ai/shops/${shopSlug}/conversations/${conversationId}/messages`,
    {
      params: { limit: params.limit ?? 50, ...(params.cursor ? { cursor: params.cursor } : {}) },
      signal,
      timeout: 15_000,
    },
  );

  return response.data;
}

export async function sendAiMessage(
  shopSlug: string,
  message: string,
  conversationId?: string,
  signal?: AbortSignal,
) {
  const { data: response } = await axiosClient.post<
    ApiSuccessResponse<AiChatResponse>
  >(
    `/api/ai/shops/${shopSlug}/chat`,
    { message, ...(conversationId ? { conversationId } : {}) },
    { signal, timeout: 60_000 },
  );

  const answer = response.data.message?.trim();
  const conversationIdFromResponse = response.data.conversationId;
  if (
    !answer ||
    !/^[0-9a-fA-F]{24}$/.test(conversationIdFromResponse ?? "")
  ) {
    throw new Error("Invalid AI response");
  }

  return {
    conversationId: conversationIdFromResponse,
    message: answer,
  };
}
