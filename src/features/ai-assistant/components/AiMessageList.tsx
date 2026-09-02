import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { AiChatMessage } from "../types/aiAssistant.types";
import { AiEmptyState } from "./AiEmptyState";
import { AiMessage } from "./AiMessage";

interface Props {
  messages: AiChatMessage[];
  isSending: boolean;
  onPromptSelect: (prompt: string) => void;
  onRetry: (message: AiChatMessage) => void;
}

export function AiMessageList({
  messages,
  isSending,
  onPromptSelect,
  onRetry,
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
        aria-label={t("conversation")}
        className="h-full overscroll-contain overflow-y-auto px-4 py-4"
        onScroll={(event) => {
          const target = event.currentTarget;
          const distanceFromBottom =
            target.scrollHeight - target.scrollTop - target.clientHeight;
          setIsNearBottom(distanceFromBottom < 80);
        }}
      >
        {messages.length === 0 && !isSending ? (
          <AiEmptyState disabled={isSending} onSelect={onPromptSelect} />
        ) : (
          <div className="space-y-3">
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
