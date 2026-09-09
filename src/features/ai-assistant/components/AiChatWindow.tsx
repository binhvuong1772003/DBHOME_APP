import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/common/use-mobile";
import { cn } from "@/lib/utils";
import type {
  AiAssistantDisplayMode,
  AiChatMessage,
  AiConversationSummary,
} from "../types/aiAssistant.types";
import { AiChatHeader } from "./AiChatHeader";
import { AiComposer } from "./AiComposer";
import { AiMessageList } from "./AiMessageList";

interface Props {
  displayMode: Exclude<AiAssistantDisplayMode, "closed">;
  draft: string;
  messages: AiChatMessage[];
  isSending: boolean;
  isLoadingHistory: boolean;
  isLoadingOlderMessages: boolean;
  hasOlderMessages: boolean;
  historyError: string | null;
  conversations: AiConversationSummary[];
  activeConversationId?: string;
  isLoadingConversations: boolean;
  hasMoreConversations: boolean;
  onClose: () => void;
  onDraftChange: (draft: string) => void;
  onMinimize: () => void;
  onRetry: (message: AiChatMessage) => void;
  onSend: (prompt: string) => void;
  onToggleExpanded: () => void;
  onSelectConversation: (id: string) => void;
  onLoadMoreConversations: () => void;
  onLoadOlderMessages: () => void;
  onRetryHistory: () => void;
  onNewConversation: () => void;
}

export function AiChatWindow(props: Props) {
  const { t } = useTranslation("aiAssistant");
  const isMobile = useIsMobile();
  const content = <ChatPanel {...props} mobile={isMobile} />;

  if (isMobile) {
    return (
      <Sheet open onOpenChange={(open) => !open && props.onClose()}>
        <SheetContent
          side="bottom"
          className="h-dvh max-h-dvh gap-0 overflow-hidden rounded-none border-x-0 border-b-0 p-0"
        >
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Card
      role="dialog"
      aria-modal="false"
      aria-label={t("title")}
      className={cn(
        "fixed bottom-6 right-6 z-40 gap-0 overflow-hidden py-0 shadow-xl",
        props.displayMode === "expanded"
          ? "h-[min(48rem,calc(100dvh-3rem))] w-[42rem] max-w-[calc(100vw-3rem)]"
          : "h-[min(38rem,calc(100dvh-3rem))] w-[25rem] max-w-[calc(100vw-3rem)]",
      )}
    >
      {content}
    </Card>
  );
}

function ChatPanel({
  activeConversationId,
  conversations,
  displayMode,
  draft,
  hasMoreConversations,
  hasOlderMessages,
  historyError,
  isLoadingConversations,
  isLoadingHistory,
  isLoadingOlderMessages,
  messages,
  isSending,
  mobile,
  onClose,
  onDraftChange,
  onLoadMoreConversations,
  onLoadOlderMessages,
  onMinimize,
  onNewConversation,
  onRetry,
  onRetryHistory,
  onSelectConversation,
  onSend,
  onToggleExpanded,
}: Props & { mobile: boolean }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-card">
      <AiChatHeader
        activeConversationId={activeConversationId}
        conversations={conversations}
        displayMode={displayMode}
        disabledHistory={
          isSending || isLoadingHistory || isLoadingOlderMessages
        }
        hasMoreConversations={hasMoreConversations}
        isLoadingConversations={isLoadingConversations}
        mobile={mobile}
        onClose={onClose}
        onLoadMoreConversations={onLoadMoreConversations}
        onMinimize={onMinimize}
        onNewConversation={onNewConversation}
        onSelectConversation={onSelectConversation}
        onToggleExpanded={onToggleExpanded}
      />
      <AiMessageList
        hasOlderMessages={hasOlderMessages}
        historyError={historyError}
        isLoadingHistory={isLoadingHistory}
        isLoadingOlderMessages={isLoadingOlderMessages}
        messages={messages}
        isSending={isSending}
        onLoadOlderMessages={onLoadOlderMessages}
        onPromptSelect={onSend}
        onRetry={onRetry}
        onRetryHistory={onRetryHistory}
      />
      <AiComposer
        autoFocus={!mobile}
        draft={draft}
        isSending={isSending}
        onDraftChange={onDraftChange}
        onSend={onSend}
      />
    </div>
  );
}
