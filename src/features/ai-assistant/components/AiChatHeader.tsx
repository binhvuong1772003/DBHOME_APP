import {
  Check,
  History,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import type {
  AiAssistantDisplayMode,
  AiConversationSummary,
} from "../types/aiAssistant.types";

interface Props {
  displayMode: Exclude<AiAssistantDisplayMode, "closed">;
  mobile: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onToggleExpanded: () => void;
  conversations: AiConversationSummary[];
  activeConversationId?: string;
  isLoadingConversations: boolean;
  hasMoreConversations: boolean;
  disabledHistory: boolean;
  onSelectConversation: (id: string) => void;
  onLoadMoreConversations: () => void;
  onNewConversation: () => void;
}

export function AiChatHeader({
  displayMode,
  mobile,
  onClose,
  onMinimize,
  onToggleExpanded,
  conversations,
  activeConversationId,
  isLoadingConversations,
  hasMoreConversations,
  disabledHistory,
  onSelectConversation,
  onLoadMoreConversations,
  onNewConversation,
}: Props) {
  const { t, i18n } = useTranslation("aiAssistant");
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
      <ConversationHistoryMenu
        conversations={conversations}
        activeConversationId={activeConversationId}
        isLoading={isLoadingConversations}
        hasMore={hasMoreConversations}
        disabled={disabledHistory}
        onSelect={onSelectConversation}
        onLoadMore={onLoadMoreConversations}
        onNewConversation={onNewConversation}
        locale={i18n.language}
        labels={{
          history: t("history.title"),
          newConversation: t("history.newConversation"),
          empty: t("history.empty"),
          loading: t("history.loading"),
          loadMore: t("history.loadMore"),
          untitled: t("history.untitled"),
        }}
      />
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

function ConversationHistoryMenu({
  conversations,
  activeConversationId,
  isLoading,
  hasMore,
  disabled,
  onSelect,
  onLoadMore,
  onNewConversation,
  locale,
  labels,
}: {
  conversations: AiConversationSummary[];
  activeConversationId?: string;
  isLoading: boolean;
  hasMore: boolean;
  disabled: boolean;
  onSelect: (id: string) => void;
  onLoadMore: () => void;
  onNewConversation: () => void;
  locale: string;
  labels: Record<
    "history" | "newConversation" | "empty" | "loading" | "loadMore" | "untitled",
    string
  >;
}) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              className="size-11"
              aria-label={labels.history}
              disabled={disabled}
            >
              <History aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={6}>
          {labels.history}
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="max-h-[min(32rem,calc(100dvh-8rem))] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto p-2"
      >
        <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {labels.history}
        </DropdownMenuLabel>
        <DropdownMenuItem
          disabled={disabled}
          className="min-h-11 gap-2 px-2.5 py-2"
          onSelect={onNewConversation}
        >
          <Plus className="size-4 text-primary" aria-hidden="true" />
          <span>{labels.newConversation}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isLoading && conversations.length === 0 ? (
          <DropdownMenuItem disabled className="min-h-11 px-2.5">
            {labels.loading}
          </DropdownMenuItem>
        ) : conversations.length === 0 ? (
          <DropdownMenuItem disabled className="min-h-11 px-2.5">
            {labels.empty}
          </DropdownMenuItem>
        ) : (
          conversations.map((conversation) => {
            const title =
              conversation.title?.trim() ||
              conversation.lastMessage?.content?.trim() ||
              labels.untitled;
            const preview = conversation.summary?.trim() ||
              conversation.lastMessage?.content?.trim() ||
              "";
            const isActive = conversation.id === activeConversationId;

            return (
              <DropdownMenuItem
                key={conversation.id}
                disabled={disabled}
                className="min-h-14 items-start gap-2 px-2.5 py-2.5"
                onSelect={() => onSelect(conversation.id)}
              >
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  {isActive ? (
                    <Check className="size-3.5 text-primary" aria-hidden="true" />
                  ) : (
                    <History className="size-3.5" aria-hidden="true" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {title}
                  </span>
                  {preview && preview !== title ? (
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {preview}
                    </span>
                  ) : null}
                  <span className="mt-1 block text-[11px] text-muted-foreground">
                    {formatConversationDate(
                      conversation.lastMessageAt,
                      locale,
                    )}
                  </span>
                </span>
              </DropdownMenuItem>
            );
          })
        )}
        {hasMore ? (
          <DropdownMenuItem
            disabled={disabled || isLoading}
            className="mt-1 min-h-11 justify-center text-xs font-medium text-primary"
            onSelect={onLoadMore}
          >
            {isLoading ? labels.loading : labels.loadMore}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function formatConversationDate(value: string, locale: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
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
