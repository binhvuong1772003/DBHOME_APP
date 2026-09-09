import { useState } from "react";
import { FolderPlus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useServiceCategories } from "../hooks/useServiceCategories";
import type { ServiceCategory } from "@/types/service";

interface CreateServiceCategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (category: ServiceCategory) => void;
  categories?: ServiceCategory[];
  categoriesLoading?: boolean;
  categoriesError?: string | null;
}

export function CreateServiceCategorySheet({ open, onOpenChange, onCreated, categories: providedCategories, categoriesLoading: providedCategoriesLoading, categoriesError: providedCategoriesError }: CreateServiceCategorySheetProps) {
  const { t } = useTranslation("service");
  const { categories: loadedCategories, isLoading: loadedCategoriesLoading, isCreating, error, create } = useServiceCategories({ load: providedCategories === undefined && open, limit: 50 });
  const categories = providedCategories ?? loadedCategories;
  const isLoading = providedCategories !== undefined ? (providedCategoriesLoading ?? false) : loadedCategoriesLoading;
  const categoryError = providedCategories !== undefined ? providedCategoriesError : null;
  const [name, setName] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setValidationError(t("category.nameRequired"));
      return;
    }
    if (trimmedName.length > 100) {
      setValidationError(t("category.nameTooLong"));
      return;
    }
    setValidationError("");
    const created = await create(trimmedName);
    if (!created) return;
    setName("");
    onOpenChange(false);
    onCreated?.(created);
  };

  const close = () => {
    if (isCreating) return;
    setValidationError("");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={(value) => value ? onOpenChange(true) : close()}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md">
        <SheetHeader className="border-b px-5 py-5 pr-16 text-left">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><FolderPlus className="size-5" aria-hidden="true" /></div>
            <div className="min-w-0"><SheetTitle>{t("category.createTitle")}</SheetTitle><SheetDescription className="mt-1">{t("category.createDescription")}</SheetDescription></div>
          </div>
        </SheetHeader>
        <SheetClose asChild><Button type="button" variant="ghost" size="icon" className="absolute right-3 top-3 size-11 rounded-full sm:right-4 sm:top-4 sm:size-9" aria-label={t("category.close")} disabled={isCreating}><X aria-hidden="true" /></Button></SheetClose>

        <form onSubmit={handleSubmit} className="flex min-h-[calc(100dvh-5rem)] flex-col">
          <div className="flex-1 space-y-6 px-5 py-5 sm:px-6">
            <div className="space-y-2">
              <Label htmlFor="service-category-name">{t("category.nameLabel")}</Label>
              <Input id="service-category-name" value={name} onChange={(event) => { setName(event.target.value); setValidationError(""); }} placeholder={t("category.namePlaceholder")} maxLength={100} autoFocus className="h-11" />
              {(validationError || categoryError || error) && <p role="alert" className="text-sm text-destructive">{validationError || categoryError || error}</p>}
              <p className="text-xs text-muted-foreground">{t("category.nameHint")}</p>
            </div>

            <div className="space-y-3">
              <div><p className="text-sm font-semibold">{t("category.existingTitle")}</p><p className="mt-1 text-sm text-muted-foreground">{t("category.existingDescription")}</p></div>
              {isLoading ? <div className="space-y-2" aria-busy="true">{[0, 1, 2].map((item) => <div key={item} className="h-11 animate-pulse rounded-lg bg-muted" />)}</div> : categories.length > 0 ? <div className="flex flex-wrap gap-2">{categories.map((category) => <span key={category.id} className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm">{category.name}</span>)}</div> : <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">{t("category.empty")}</p>}
            </div>
          </div>
          <div className="mt-auto flex flex-col-reverse gap-2 border-t bg-background px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <Button type="button" variant="outline" className="min-h-11" onClick={close} disabled={isCreating}>{t("category.cancel")}</Button>
            <Button type="submit" className="min-h-11" disabled={isCreating || !name.trim()}>{isCreating ? t("category.creating") : t("category.create")}</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
