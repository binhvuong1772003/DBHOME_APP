import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const supportedLanguages = [
  { value: "vi", label: "Tiếng Việt", shortLabel: "VI" },
  { value: "en", label: "English", shortLabel: "EN" },
] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage?.split("-")[0] ?? "vi";

  const handleLanguageChange = (language: string) => {
    localStorage.setItem("language", language);
    void i18n.changeLanguage(language);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Change language"
          title="Change language"
        >
          <Languages aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={currentLanguage}
          onValueChange={handleLanguageChange}
        >
          {supportedLanguages.map((language) => (
            <DropdownMenuRadioItem key={language.value} value={language.value}>
              <span className="w-6 text-xs font-semibold text-muted-foreground">
                {language.shortLabel}
              </span>
              <span>{language.label}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
