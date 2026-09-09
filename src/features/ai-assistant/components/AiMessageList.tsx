import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AiChatMessage } from "../types/aiAssistant.types";
import { AiEmptyState } from "./AiEmptyState";
import { AiMessage } from "./AiMessage";

interface Props {
  messages: AiChatMessage[];
  isSending: boolean;
  isLoadingHistory: boolean;
  isLoadingOlderMessages: boolean;
  hasOlderMessages: boolean;
  historyError: string | null;
  onPromptSelect: (prompt: string) => void;
  onRetry: (message: AiChatMessage) => void;
  onLoadOlderMessages: () => void;
  onRetryHistory: () => void;
}

export function AiMessageList({
  messages,
  isSending,
  isLoadingHistory,
  isLoadingOlderMessages,
  hasOlderMessages,
  historyError,
  onPromptSelect,
  onRetry,
  onLoadOlderMessages,
  onRetryHistory,
}: Props) {
  const { t } = useTranslation("aiAssistant");
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const scrollToLatest = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, []);

  useEffect(() => {
    if (!isNearBottom) return;
    const frame = window.requestAnimationFrame(scrollToLatest);
    return () => window.cancelAnimationFrame(frame);
  }, [isNearBottom, isSending, messages.length, scrollToLatest]);

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={viewportRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-busy={isLoadingHistory || isLoadingOlderMessages}
        aria-label={t("conversation")}
        className="h-full overscroll-contain overflow-y-auto px-4 py-4"
        onScroll={(event) => {
          const target = event.currentTarget;
          const distanceFromBottom =
            target.scrollHeight - target.scrollTop - target.clientHeight;
          setIsNearBottom(distanceFromBottom < 80);
        }}
      >
        {historyError ? (
          <div
            className="mb-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
            role="alert"
          >
            <p>{historyError}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={onRetryHistory}
            >
              {t("error.retry")}
            </Button>
          </div>
        ) : null}
        {isLoadingHistory ? (
          <HistorySkeleton />
        ) : messages.length === 0 && !isSending ? (
          <AiEmptyState disabled={isSending} onSelect={onPromptSelect} />
        ) : (
          <div className="space-y-3">
            {hasOlderMessages ? (
              <div className="flex justify-center pb-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isLoadingOlderMessages}
                  onClick={onLoadOlderMessages}
                >
                  {isLoadingOlderMessages
                    ? t("history.loadingOlder")
                    : t("history.loadOlder")}
                </Button>
              </div>
            ) : null}
            {messages.map((message) => (
              <AiMessage
                key={message.id}
                message={message}
                onRetry={onRetry}
              />
            ))}
            {isSending ? <ThinkingMessage /> : null}
          </div>
        )}
      </div>

      {!isNearBottom && messages.length ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background shadow-md"
          onClick={scrollToLatest}
        >
          <ArrowDown aria-hidden="true" />
          {t("jumpToLatest")}
        </Button>
      ) : null}
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="space-y-4 py-2" aria-hidden="true">
      <Skeleton className="h-16 w-[78%] rounded-xl" />
      <Skeleton className="ml-auto h-12 w-[65%] rounded-xl" />
      <Skeleton className="h-20 w-[82%] rounded-xl" />
    </div>
  );
}

function ThinkingMessage() {
  const { t } = useTranslation("aiAssistant");

  return (
    <div className="flex justify-start" role="status">
      <div className="rounded-xl border bg-muted/55 px-3.5 py-3">
        <span className="sr-only">{t("thinking")}</span>
        <span className="flex items-center gap-1" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="size-1.5 animate-pulse rounded-full bg-muted-foreground motion-reduce:animate-none"
              style={{ animationDelay: `${index * 140}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
