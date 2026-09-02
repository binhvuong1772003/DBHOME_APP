import { useCallback, useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/api/apiResponse";
import { sendAiMessage } from "../services/aiAssistantService";
import type { AiChatMessage } from "../types/aiAssistant.types";

interface RequestOptions {
  appendUserMessage: boolean;
  replaceErrorId?: string;
}

export function useAiChat(shopSlug: string, errorFallback: string) {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const requestInFlightRef = useRef(false);
  const requestControllerRef = useRef<AbortController | null>(null);
  const messageSequenceRef = useRef(0);

  const createMessageId = useCallback(
    () => `ai-message-${++messageSequenceRef.current}`,
    [],
  );

  const request = useCallback(
    async (prompt: string, options: RequestOptions) => {
      const normalizedPrompt = prompt.trim();
      if (!normalizedPrompt || !shopSlug || requestInFlightRef.current) return;

      requestInFlightRef.current = true;
      setIsSending(true);

      if (options.replaceErrorId) {
        setMessages((current) =>
          current.filter((message) => message.id !== options.replaceErrorId),
        );
      }

      if (options.appendUserMessage) {
        setMessages((current) => [
          ...current,
          {
            id: createMessageId(),
            role: "user",
            content: normalizedPrompt,
            state: "sent",
          },
        ]);
      }

      const controller = new AbortController();
      requestControllerRef.current = controller;

      try {
        const answer = await sendAiMessage(
          shopSlug,
          normalizedPrompt,
          controller.signal,
        );
        if (controller.signal.aborted) return;

        setMessages((current) => [
          ...current,
          {
            id: createMessageId(),
            role: "assistant",
            content: answer.trim(),
            state: "sent",
          },
        ]);
      } catch (error) {
        if (controller.signal.aborted) return;

        setMessages((current) => [
          ...current,
          {
            id: createMessageId(),
            role: "assistant",
            content: getAiErrorMessage(error, errorFallback),
            state: "error",
            retryPrompt: normalizedPrompt,
          },
        ]);
      } finally {
        if (!controller.signal.aborted) {
          requestInFlightRef.current = false;
          requestControllerRef.current = null;
          setIsSending(false);
        }
      }
    },
    [createMessageId, errorFallback, shopSlug],
  );

  const sendMessage = useCallback(
    (prompt: string) =>
      request(prompt, {
        appendUserMessage: true,
      }),
    [request],
  );

  const retryMessage = useCallback(
    (message: AiChatMessage) => {
      if (!message.retryPrompt) return Promise.resolve();
      return request(message.retryPrompt, {
        appendUserMessage: false,
        replaceErrorId: message.id,
      });
    },
    [request],
  );

  useEffect(
    () => () => {
      requestControllerRef.current?.abort();
      requestInFlightRef.current = false;
    },
    [],
  );

  return { messages, isSending, sendMessage, retryMessage };
}

function getAiErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof AxiosError)) return fallback;

  const response = (error as AxiosError<ApiErrorResponse>).response;
  return response?.data?.error?.message || fallback;
}
