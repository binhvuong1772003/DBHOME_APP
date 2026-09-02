import {
  Maximize2,
  Minimize2,
  Minus,
  Sparkles,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AiAssistantDisplayMode } from "../types/aiAssistant.types";

interface Props {
  displayMode: Exclude<AiAssistantDisplayMode, "closed">;
  mobile: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onToggleExpanded: () => void;
}

export function AiChatHeader({
  displayMode,
  mobile,
  onClose,
  onMinimize,
  onToggleExpanded,
}: Props) {
  const { t } = useTranslation("aiAssistant");
  const title = (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-foreground">
          {t("title")}
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
          <span className="size-1.5 rounded-full bg-secondary" aria-hidden="true" />
          {t("ready")}
        </span>
      </span>
    </div>
  );
  const actions = (
    <div className="flex shrink-0 items-center gap-2">
      <HeaderAction
        label={t("actions.minimize")}
        icon={Minus}
        onClick={onMinimize}
      />
      {!mobile ? (
        <HeaderAction
          label={
            displayMode === "expanded"
              ? t("actions.restore")
              : t("actions.expand")
          }
          icon={displayMode === "expanded" ? Minimize2 : Maximize2}
          onClick={onToggleExpanded}
        />
      ) : null}
      <HeaderAction label={t("actions.close")} icon={X} onClick={onClose} />
    </div>
  );

  if (mobile) {
    return (
      <SheetHeader className="flex-row items-center justify-between gap-3 border-b px-4 py-3 text-left">
        <SheetTitle asChild>{title}</SheetTitle>
        <SheetDescription className="sr-only">
          {t("description")}
        </SheetDescription>
        {actions}
      </SheetHeader>
    );
  }

  return (
    <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
      {title}
      {actions}
    </header>
  );
}

function HeaderAction({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: typeof X;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          className="size-11"
          aria-label={label}
          onClick={onClick}
        >
          <Icon aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={6}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
