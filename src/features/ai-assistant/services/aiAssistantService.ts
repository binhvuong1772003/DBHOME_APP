import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/api/apiResponse";
import type { AiChatResponse } from "../types/aiAssistant.types";

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
