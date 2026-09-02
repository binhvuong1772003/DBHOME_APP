import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/api/apiResponse";
import type { AiChatResponse } from "../types/aiAssistant.types";

export async function sendAiMessage(
  shopSlug: string,
  message: string,
  signal?: AbortSignal,
) {
  const { data: response } = await axiosClient.post<
    ApiSuccessResponse<AiChatResponse>
  >(
    `/api/ai/shops/${shopSlug}/chat`,
    { message },
    { signal, timeout: 60_000 },
  );

  const answer = response.data.message?.trim();
  if (!answer) {
    throw new Error("Invalid AI response");
  }

  return answer;
}
