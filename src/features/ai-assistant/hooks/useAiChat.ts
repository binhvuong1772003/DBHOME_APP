import { useCallback, useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/api/apiResponse";
import {
  listAiConversationMessages,
  listAiConversations,
  sendAiMessage,
} from "../services/aiAssistantService";
import type {
  AiChatMessage,
  AiConversationMessage,
  AiConversationSummary,
} from "../types/aiAssistant.types";

interface RequestOptions {
  appendUserMessage: boolean;
  replaceErrorId?: string;
}

export function useAiChat(shopSlug: string, errorFallback: string) {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(() =>
    readConversationId(shopSlug),
  );
  const [conversations, setConversations] = useState<AiConversationSummary[]>([]);
  const [conversationCursor, setConversationCursor] = useState<string | null>(
    null,
  );
  const [hasMoreConversations, setHasMoreConversations] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);
  const [hasOlderMessages, setHasOlderMessages] = useState(false);
  const [messageCursor, setMessageCursor] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const requestInFlightRef = useRef(false);
  const requestControllerRef = useRef<AbortController | null>(null);
  const historyControllerRef = useRef<AbortController | null>(null);
  const conversationListRequestRef = useRef(false);
  const messageRequestRef = useRef(false);
  const didLoadActiveConversationRef = useRef(false);
  const messageSequenceRef = useRef(0);

  const createMessageId = useCallback(
    () => `ai-message-${++messageSequenceRef.current}`,
    [],
  );

  const loadConversations = useCallback(
    async ({ append = false }: { append?: boolean } = {}) => {
      if (!shopSlug || conversationListRequestRef.current) return;
      if (append && !hasMoreConversations) return;

      conversationListRequestRef.current = true;
      setIsLoadingConversations(true);
      setHistoryError(null);

      try {
        const response = await listAiConversations(
          shopSlug,
          {
            limit: 20,
            ...(append && conversationCursor
              ? { cursor: conversationCursor }
              : {}),
          },
        );
        setConversations((current) =>
          append ? [...current, ...response.items] : response.items,
        );
        setConversationCursor(response.nextCursor);
        setHasMoreConversations(response.hasMore);
      } catch (error) {
        if (!isAbortError(error)) {
          setHistoryError(getAiErrorMessage(error, errorFallback));
        }
      } finally {
        conversationListRequestRef.current = false;
        setIsLoadingConversations(false);
      }
    },
    [conversationCursor, errorFallback, hasMoreConversations, shopSlug],
  );

  const loadConversationMessages = useCallback(
    async (id: string, cursor?: string) => {
      if (!shopSlug || !id || messageRequestRef.current) return;

      historyControllerRef.current?.abort();
      const controller = new AbortController();
      historyControllerRef.current = controller;
      messageRequestRef.current = true;
      const loadingOlder = Boolean(cursor);
      if (loadingOlder) setIsLoadingOlderMessages(true);
      else setIsLoadingMessages(true);
      setHistoryError(null);

      try {
        const response = await listAiConversationMessages(
          shopSlug,
          id,
          { limit: 50, ...(cursor ? { cursor } : {}) },
          controller.signal,
        );
        if (controller.signal.aborted) return;

        const nextMessages = response.items.map(mapConversationMessage);
        setMessages((current) =>
          loadingOlder ? [...nextMessages, ...current] : nextMessages,
        );
        setMessageCursor(response.nextCursor);
        setHasOlderMessages(response.hasMore);
        didLoadActiveConversationRef.current = true;
      } catch (error) {
        if (!controller.signal.aborted && !isAbortError(error)) {
          if (error instanceof AxiosError && error.response?.status === 404) {
            setConversationId(undefined);
            clearConversationId(shopSlug);
            setMessages([]);
            setMessageCursor(null);
            setHasOlderMessages(false);
          }
          setHistoryError(getAiErrorMessage(error, errorFallback));
        }
      } finally {
        if (historyControllerRef.current === controller) {
          historyControllerRef.current = null;
          messageRequestRef.current = false;
          setIsLoadingMessages(false);
          setIsLoadingOlderMessages(false);
        }
      }
    },
    [errorFallback, shopSlug],
  );

  const initialize = useCallback(async () => {
    await loadConversations();
    if (
      conversationId &&
      !didLoadActiveConversationRef.current &&
      !messageRequestRef.current
    ) {
      await loadConversationMessages(conversationId);
    }
  }, [conversationId, loadConversationMessages, loadConversations]);

  const selectConversation = useCallback(
    async (id: string) => {
      if (!id || id === conversationId || isSending) return;

      setConversationId(id);
      persistConversationId(shopSlug, id);
      setMessages([]);
      setMessageCursor(null);
      setHasOlderMessages(false);
      didLoadActiveConversationRef.current = false;
      await loadConversationMessages(id);
    },
    [conversationId, isSending, loadConversationMessages, shopSlug],
  );

  const startNewConversation = useCallback(() => {
    if (isSending) return;
    historyControllerRef.current?.abort();
    messageRequestRef.current = false;
    setConversationId(undefined);
    clearConversationId(shopSlug);
    setMessages([]);
    setMessageCursor(null);
    setHasOlderMessages(false);
    setHistoryError(null);
    didLoadActiveConversationRef.current = true;
  }, [isSending, shopSlug]);

  const loadOlderMessages = useCallback(() => {
    if (!conversationId || !messageCursor || isLoadingOlderMessages) return;
    return loadConversationMessages(conversationId, messageCursor);
  }, [conversationId, isLoadingOlderMessages, loadConversationMessages, messageCursor]);

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
        didLoadActiveConversationRef.current = true;
        setMessages((current) => [
          ...current,
          {
            id: createMessageId(),
            role: "assistant",
            content: response.message.trim(),
            state: "sent",
          },
        ]);
        void loadConversations();
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
    [
      conversationId,
      createMessageId,
      errorFallback,
      loadConversations,
      shopSlug,
    ],
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
    setConversations([]);
    setConversationCursor(null);
    setHasMoreConversations(false);
    setHistoryError(null);
    didLoadActiveConversationRef.current = false;
  }, [shopSlug]);

  useEffect(
    () => () => {
      requestControllerRef.current?.abort();
      historyControllerRef.current?.abort();
      requestInFlightRef.current = false;
      messageRequestRef.current = false;
    },
    [],
  );

  return {
    messages,
    conversationId,
    conversations,
    hasMoreConversations,
    hasOlderMessages,
    historyError,
    isLoadingConversations,
    isLoadingMessages,
    isLoadingOlderMessages,
    isSending,
    initialize,
    loadConversations,
    loadOlderMessages,
    selectConversation,
    sendMessage,
    startNewConversation,
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

function mapConversationMessage(message: AiConversationMessage): AiChatMessage {
  return {
    id: message.id,
    role: message.role === "USER" ? "user" : "assistant",
    content: message.content,
    state: "sent",
    createdAt: message.createdAt,
  };
}

function isAbortError(error: unknown) {
  return error instanceof AxiosError && error.code === "ERR_CANCELED";
}
