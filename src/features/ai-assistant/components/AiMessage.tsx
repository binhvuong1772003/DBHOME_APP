import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AiChatMessage } from "../types/aiAssistant.types";
import { AiMessageContent } from "./AiMessageContent";

export function AiMessage({
  message,
  onRetry,
}: {
  message: AiChatMessage;
  onRetry: (message: AiChatMessage) => void;
}) {
  const { t } = useTranslation("aiAssistant");
  const isUser = message.role === "user";

  if (message.state === "error") {
    return (
      <div className="flex justify-start" role="alert">
        <div className="max-w-[85%] rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <p className="break-words leading-5">{message.content}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => onRetry(message)}
              >
                {t("error.retry")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
      aria-label={isUser ? t("message.user") : t("message.assistant")}
    >
      <div
        className={cn(
          "max-w-[85%] overflow-hidden rounded-xl px-3.5 py-2.5 text-sm [overflow-wrap:anywhere]",
          isUser
            ? "bg-primary text-primary-foreground"
            : "border bg-muted/55 text-foreground",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap leading-6">{message.content}</p>
        ) : (
          <AiMessageContent content={message.content} />
        )}
      </div>
    </div>
  );
}
