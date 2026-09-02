import { CalendarDays, Sparkles, UsersRound, WalletCards } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const suggestions = [
  { key: "todaysAppointments", icon: CalendarDays },
  { key: "unpaidAppointments", icon: WalletCards },
  { key: "workingToday", icon: UsersRound },
  { key: "businessSummary", icon: Sparkles },
] as const;

export function AiEmptyState({
  disabled,
  onSelect,
}: {
  disabled: boolean;
  onSelect: (prompt: string) => void;
}) {
  const { t } = useTranslation("aiAssistant");

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-8 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Sparkles className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-base font-semibold">{t("empty.title")}</h2>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
        {t("empty.description")}
      </p>
      <div className="mt-5 grid w-full max-w-md gap-2 sm:grid-cols-2">
        {suggestions.map(({ key, icon: Icon }) => {
          const prompt = t(`suggestions.${key}`);
          return (
            <Button
              key={key}
              type="button"
              variant="outline"
              className="h-auto min-h-11 justify-start whitespace-normal px-3 py-2 text-left text-xs"
              disabled={disabled}
              onClick={() => onSelect(prompt)}
            >
              <Icon className="size-4 text-primary" aria-hidden="true" />
              <span>{prompt}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
