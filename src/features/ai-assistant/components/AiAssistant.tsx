import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAiChat } from "../hooks/useAiChat";
import type { AiAssistantDisplayMode } from "../types/aiAssistant.types";
import { AiAssistantLauncher } from "./AiAssistantLauncher";

const AiChatWindow = lazy(() =>
  import("./AiChatWindow").then((module) => ({
    default: module.AiChatWindow,
  })),
);

export function AiAssistant({ shopSlug }: { shopSlug: string }) {
  const { t } = useTranslation("aiAssistant");
  const [displayMode, setDisplayMode] =
    useState<AiAssistantDisplayMode>("closed");
  const [draft, setDraft] = useState("");
  const launcherRef = useRef<HTMLButtonElement>(null);
  const shouldRestoreLauncherFocusRef = useRef(false);
  const chat = useAiChat(shopSlug, t("error.fallback"));

  const dismiss = useCallback(() => {
    shouldRestoreLauncherFocusRef.current = true;
    setDisplayMode("closed");
  }, []);

  useEffect(() => {
    if (
      displayMode !== "closed" ||
      !shouldRestoreLauncherFocusRef.current
    ) {
      return;
    }

    shouldRestoreLauncherFocusRef.current = false;
    const frame = window.requestAnimationFrame(() => launcherRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [displayMode]);

  return (
    <TooltipProvider delayDuration={300}>
      {displayMode === "closed" ? (
        <AiAssistantLauncher
          buttonRef={launcherRef}
          onOpen={() => setDisplayMode("compact")}
        />
      ) : (
        <Suspense fallback={<AiChatFallback />}>
          <AiChatWindow
            displayMode={displayMode}
            draft={draft}
            messages={chat.messages}
            isSending={chat.isSending}
            onClose={dismiss}
            onDraftChange={setDraft}
            onMinimize={dismiss}
            onRetry={(message) => void chat.retryMessage(message)}
            onSend={(prompt) => void chat.sendMessage(prompt)}
            onToggleExpanded={() =>
              setDisplayMode((current) =>
                current === "expanded" ? "compact" : "expanded",
              )
            }
          />
        </Suspense>
      )}
    </TooltipProvider>
  );
}

function AiChatFallback() {
  return (
    <div className="fixed inset-0 z-40 flex h-dvh w-full flex-col gap-4 border bg-card p-4 shadow-xl md:inset-auto md:bottom-6 md:right-6 md:h-[min(38rem,calc(100dvh-3rem))] md:w-[25rem] md:max-w-[calc(100vw-3rem)] md:rounded-xl">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="min-h-0 w-full flex-1" />
      <Skeleton className="h-11 w-full" />
    </div>
  );
}
