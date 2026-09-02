import { MessageCircle, Sparkles } from "lucide-react";
import type { Ref } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AiAssistantLauncher({
  buttonRef,
  onOpen,
}: {
  buttonRef?: Ref<HTMLButtonElement>;
  onOpen: () => void;
}) {
  const { t } = useTranslation("aiAssistant");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={buttonRef}
          type="button"
          size="icon"
          className="fixed bottom-6 right-6 z-40 size-14 rounded-full shadow-lg"
          aria-label={t("launcher")}
          onClick={onOpen}
        >
          <MessageCircle className="size-6" aria-hidden="true" />
          <Sparkles
            className="absolute right-2 top-2 size-3.5"
            aria-hidden="true"
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left" sideOffset={8}>
        {t("launcher")}
      </TooltipContent>
    </Tooltip>
  );
}
