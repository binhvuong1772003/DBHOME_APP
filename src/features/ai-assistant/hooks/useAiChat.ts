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
  const [conversationId, setConversationId] = useState<string | undefined>(() =>
    readConversationId(shopSlug),
  );
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
        const response = await sendAiMessage(
          shopSlug,
          normalizedPrompt,
          conversationId,
          controller.signal,
        );
        if (controller.signal.aborted) return;

        setConversationId(response.conversationId);
        persistConversationId(shopSlug, response.conversationId);
        setMessages((current) => [
          ...current,
          {
            id: createMessageId(),
            role: "assistant",
            content: response.message.trim(),
            state: "sent",
          },
        ]);
      } catch (error) {
        if (controller.signal.aborted) return;

        if (
          conversationId &&
          error instanceof AxiosError &&
          error.response?.status === 404
        ) {
          setConversationId(undefined);
          clearConversationId(shopSlug);
        }

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
    [conversationId, createMessageId, errorFallback, shopSlug],
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

  useEffect(() => {
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    requestInFlightRef.current = false;
    setMessages([]);
    setConversationId(readConversationId(shopSlug));
    setIsSending(false);
    messageSequenceRef.current = 0;
  }, [shopSlug]);

  useEffect(
    () => () => {
      requestControllerRef.current?.abort();
      requestInFlightRef.current = false;
    },
    [],
  );

  return {
    messages,
    conversationId,
    isSending,
    sendMessage,
    retryMessage,
  };
}

const conversationStorageKey = (shopSlug: string) =>
  `shn-ai-conversation:${shopSlug}`;

function readConversationId(shopSlug: string) {
  if (typeof window === "undefined") return undefined;

  try {
    const conversationId = window.sessionStorage.getItem(
      conversationStorageKey(shopSlug),
    );
    if (!conversationId) return undefined;
    if (/^[0-9a-fA-F]{24}$/.test(conversationId)) return conversationId;

    clearConversationId(shopSlug);
    return undefined;
  } catch {
    return undefined;
  }
}

function persistConversationId(shopSlug: string, conversationId: string) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(
      conversationStorageKey(shopSlug),
      conversationId,
    );
  } catch {
    // The in-memory conversation still works when session storage is blocked.
  }
}

function clearConversationId(shopSlug: string) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(conversationStorageKey(shopSlug));
  } catch {
    // Nothing to clear when session storage is unavailable.
  }
}

function getAiErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof AxiosError)) return fallback;

  const response = (error as AxiosError<ApiErrorResponse>).response;
  return response?.data?.error?.message || fallback;
}
