import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/common/use-mobile";
import { cn } from "@/lib/utils";
import type {
  AiAssistantDisplayMode,
  AiChatMessage,
} from "../types/aiAssistant.types";
import { AiChatHeader } from "./AiChatHeader";
import { AiComposer } from "./AiComposer";
import { AiMessageList } from "./AiMessageList";

interface Props {
  displayMode: Exclude<AiAssistantDisplayMode, "closed">;
  draft: string;
  messages: AiChatMessage[];
  isSending: boolean;
  onClose: () => void;
  onDraftChange: (draft: string) => void;
  onMinimize: () => void;
  onRetry: (message: AiChatMessage) => void;
  onSend: (prompt: string) => void;
  onToggleExpanded: () => void;
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
  displayMode,
  draft,
  messages,
  isSending,
  mobile,
  onClose,
  onDraftChange,
  onMinimize,
  onRetry,
  onSend,
  onToggleExpanded,
}: Props & { mobile: boolean }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-card">
      <AiChatHeader
        displayMode={displayMode}
        mobile={mobile}
        onClose={onClose}
        onMinimize={onMinimize}
        onToggleExpanded={onToggleExpanded}
      />
      <AiMessageList
        messages={messages}
        isSending={isSending}
        onPromptSelect={onSend}
        onRetry={onRetry}
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
