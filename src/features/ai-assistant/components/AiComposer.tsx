import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  draft: string;
  isSending: boolean;
  autoFocus?: boolean;
  onDraftChange: (draft: string) => void;
  onSend: (prompt: string) => void;
}

export function AiComposer({
  draft,
  isSending,
  autoFocus,
  onDraftChange,
  onSend,
}: Props) {
  const { t } = useTranslation("aiAssistant");
  const canSend = Boolean(draft.trim()) && !isSending;

  const submit = () => {
    if (!canSend) return;
    const prompt = draft.trim();
    onDraftChange("");
    onSend(prompt);
  };

  return (
    <form
      className="border-t bg-background p-3"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <label htmlFor="ai-assistant-composer" className="sr-only">
        {t("composer.label")}
      </label>
      <div className="flex items-end gap-2 rounded-xl border bg-card p-1.5 shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
        <Textarea
          id="ai-assistant-composer"
          value={draft}
          rows={1}
          autoFocus={autoFocus}
          disabled={isSending}
          aria-describedby="ai-assistant-keyboard-hint"
          placeholder={t("composer.placeholder")}
          className="min-h-11 max-h-32 resize-none border-0 bg-transparent px-2.5 py-2.5 shadow-none focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent"
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              submit();
            }
          }}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Button
                type="submit"
                size="icon-lg"
                className="size-11 rounded-lg"
                disabled={!canSend}
                aria-label={t("composer.send")}
                aria-busy={isSending}
              >
                <Send aria-hidden="true" />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={8}>
            {t("composer.send")}
          </TooltipContent>
        </Tooltip>
      </div>
      <p id="ai-assistant-keyboard-hint" className="sr-only">
        {t("composer.keyboardHint")}
      </p>
    </form>
  );
}
