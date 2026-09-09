import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, FolderPlus, ImageIcon, Loader2, Plus, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFieldArray, useWatch, type SubmitHandler, type UseFormReturn } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import UploadImage from "@/components/common/UploadImage";
import { useServiceCategories } from "../hooks/useServiceCategories";
import { OptionItem } from "./OptionItem";
import { ServicePreviewPanel } from "./CreateServicePreview";
import { CreateServiceCategorySheet } from "./CreateServiceCategorySheet";
import type { CreateServiceInput } from "@/validations/serviceSchema";

interface ServiceEditorFormProps {
  mode: "create" | "edit";
  form: UseFormReturn<CreateServiceInput>;
  onSubmit: SubmitHandler<CreateServiceInput>;
  isSubmitting: boolean;
  imageFiles: File[];
  setImageFiles: (files: File[]) => void;
  existingImageUrl?: string | null;
  apiError?: string | null;
  isLoading?: boolean;
  loadError?: string | null;
  onRetry?: () => void;
  onReset?: () => void;
  onCancel: () => void;
}

export function ServiceEditorForm({ mode, form, onSubmit, isSubmitting, imageFiles, setImageFiles, existingImageUrl, apiError, isLoading = false, loadError, onRetry, onReset, onCancel }: ServiceEditorFormProps) {
  const { t } = useTranslation("service");
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "options" });
  const { categories, isLoading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useServiceCategories();
  const selectedCategoryId = useWatch({ control: form.control, name: "categoryId" });
  const selectedCategoryName = categories.find((category) => category.id === selectedCategoryId)?.name;
  const imagePreviewUrl = useMemo(() => imageFiles[0] ? URL.createObjectURL(imageFiles[0]) : null, [imageFiles]);

  useEffect(() => () => { if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl); }, [imagePreviewUrl]);

  const addOption = () => append({ name: "", isRequired: false, sortOrder: fields.length, values: [{ name: "", price: 0, duration: 0 }] });
  const resetForm = () => { onReset?.(); if (!onReset) form.reset(); setImageFiles([]); };

  if (isLoading) {
    return <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8"><div className="space-y-4" aria-busy="true"><div className="h-8 w-56 animate-pulse rounded bg-muted" /><div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,.75fr)]"><div className="h-[34rem] animate-pulse rounded-2xl bg-muted" /><div className="h-[30rem] animate-pulse rounded-2xl bg-muted" /></div></div></main>;
  }

  if (loadError) {
    return <main className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-4 text-center"><Alert variant="destructive"><AlertDescription>{loadError}</AlertDescription></Alert><div className="mt-4 flex gap-2"><Button type="button" variant="outline" onClick={onRetry}>{t("editor.retry")}</Button><Button type="button" variant="ghost" onClick={onCancel}>{t("editor.cancel")}</Button></div></main>;
  }

  return (
    <main className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-3 border-b border-border/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0"><Button type="button" variant="ghost" className="mb-2 min-h-11 gap-2 px-0 text-muted-foreground hover:text-foreground" onClick={onCancel}><ArrowLeft className="size-4" aria-hidden="true" />{t("editor.cancel")}</Button><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{mode === "edit" ? t("editor.editTitle") : t("editor.createTitle")}</h1><p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{mode === "edit" ? t("editor.editDescription") : t("editor.createDescription")}</p></div>
        </header>
        {apiError && <Alert variant="destructive" className="mb-5"><AlertDescription>{apiError}</AlertDescription></Alert>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,.75fr)]">
              <div className="space-y-5">
                <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6" aria-labelledby="service-basic-heading">
                  <div className="mb-5 flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><ImageIcon className="size-4" aria-hidden="true" /></div><div><h2 id="service-basic-heading" className="font-semibold">{t("editor.basicInformation")}</h2><p className="text-sm text-muted-foreground">{t("editor.createDescription")}</p></div></div>
                  <div className="space-y-5">
                    <FormField control={form.control} name="name" render={({ field }) => <FormItem><FormLabel>{t("editor.name")}</FormLabel><FormControl><Input {...field} placeholder={t("editor.namePlaceholder")} className="h-11" /></FormControl><FormMessage /></FormItem>} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField control={form.control} name="categoryId" render={({ field }) => <FormItem><div className="flex items-center justify-between gap-2"><FormLabel>{t("editor.category")}</FormLabel><Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground" onClick={() => setCategorySheetOpen(true)}><FolderPlus className="mr-1.5 size-3.5" aria-hidden="true" />{t("editor.newCategory")}</Button></div><Select value={field.value || "__none__"} onValueChange={(value) => field.onChange(value === "__none__" ? "" : value)}><FormControl><SelectTrigger className="h-11"><SelectValue placeholder={categoriesLoading ? t("editor.categoriesLoading") : t("editor.categoryPlaceholder")} /></SelectTrigger></FormControl><SelectContent><SelectItem value="__none__">{t("editor.noCategory")}</SelectItem>{categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent></Select>{categoriesError && <p className="text-sm text-destructive">{t("editor.categoriesError")}</p>}<FormMessage /></FormItem>} />
                      <FormField control={form.control} name="basePrice" render={({ field }) => <FormItem><FormLabel>{t("editor.price")}</FormLabel><FormControl><Input type="number" min="0" inputMode="decimal" value={field.value ?? ""} onChange={(event) => field.onChange(event.target.valueAsNumber || 0)} placeholder="0" className="h-11" /></FormControl><FormMessage /></FormItem>} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField control={form.control} name="durationMin" render={({ field }) => <FormItem><FormLabel>{t("editor.duration")}</FormLabel><FormControl><Input type="number" min="1" inputMode="numeric" value={field.value ?? ""} onChange={(event) => field.onChange(event.target.valueAsNumber || 0)} placeholder="60" className="h-11" /></FormControl><FormMessage /></FormItem>} />
                      <FormField control={form.control} name="sortOrder" render={({ field }) => <FormItem><FormLabel>{t("editor.sortOrder")}</FormLabel><FormControl><Input type="number" min="0" inputMode="numeric" value={field.value ?? ""} onChange={(event) => field.onChange(event.target.valueAsNumber || 0)} placeholder="0" className="h-11" /></FormControl><FormMessage /></FormItem>} />
                    </div>
                    <FormField control={form.control} name="description" render={({ field }) => <FormItem><FormLabel>{t("editor.description")}</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} placeholder={t("editor.descriptionPlaceholder")} className="min-h-24 resize-y" /></FormControl><FormMessage /></FormItem>} />
                    <div className="grid gap-3 border-t border-border/70 pt-4 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,auto)] sm:items-center"><div><p className="text-sm font-medium">{t("editor.image")}</p><p className="mt-1 text-xs text-muted-foreground">{t("editor.imageHint")}</p></div><UploadImage files={imageFiles} onValueChange={setImageFiles} maxFiles={1} previewUrl={existingImageUrl} /></div>
                    <FormField control={form.control} name="isActive" render={({ field }) => <FormItem className="flex items-center justify-between border-t border-border/70 pt-4"><div><FormLabel>{t("editor.active")}</FormLabel><p className="mt-1 text-xs text-muted-foreground">{t("editor.activeHint")}</p></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>} />
                  </div>
                </section>

                <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6" aria-labelledby="service-options-heading">
                  <div className="flex items-start justify-between gap-4"><div><h2 id="service-options-heading" className="font-semibold">{t("editor.options")}</h2><p className="mt-1 text-sm text-muted-foreground">{t("editor.optionsDescription")}</p></div><span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">{fields.length}</span></div>
                  <div className="mt-5 space-y-5">{fields.map((field, index) => <div key={field.id} className="rounded-xl border border-border/70 bg-muted/20 p-4"><OptionItem control={form.control} index={index} /><div className="mt-2 flex justify-end"><Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-muted-foreground">{t("editor.remove")}</Button></div></div>)}</div>
                  <Button type="button" variant="outline" className="mt-5 min-h-11 w-full border-dashed" onClick={addOption}><Plus className="size-4" aria-hidden="true" />{t("editor.addOptionGroup")}</Button>
                </section>

                <div className="flex flex-col-reverse gap-2 border-t border-border/60 pt-5 sm:flex-row sm:justify-end"><Button type="button" variant="outline" className="min-h-11" disabled={isSubmitting} onClick={resetForm}><RotateCcw className="size-4" aria-hidden="true" />{t("editor.reset")}</Button><Button type="button" variant="ghost" className="min-h-11" disabled={isSubmitting} onClick={onCancel}>{t("editor.cancel")}</Button><Button type="submit" className="min-h-11 min-w-32" disabled={isSubmitting}>{isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}{isSubmitting ? (mode === "edit" ? t("editor.saving") : t("editor.creating")) : (mode === "edit" ? t("editor.save") : t("editor.create"))}</Button></div>
              </div>
              <aside className="xl:sticky xl:top-6"><div className="mb-3"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{t("editor.preview")}</p><p className="mt-1 text-sm text-muted-foreground">{t("editor.previewDescription")}</p></div><ServicePreviewPanel control={form.control} imagePreviewUrl={imagePreviewUrl ?? existingImageUrl ?? null} categoryLabel={selectedCategoryName || (selectedCategoryId ? undefined : t("editor.noCategory"))} /></aside>
            </div>
          </form>
        </Form>
      </div>
      <CreateServiceCategorySheet open={categorySheetOpen} onOpenChange={setCategorySheetOpen} onCreated={(category) => { form.setValue("categoryId", category.id, { shouldDirty: true, shouldValidate: true }); void refetchCategories(); }} />
    </main>
  );
}
