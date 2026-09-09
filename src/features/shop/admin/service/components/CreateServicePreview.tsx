import { useWatch, type Control } from "react-hook-form";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { CreateServiceInput } from "@/validations/serviceSchema";
export function ServicePreviewPanel({
  control,
  imagePreviewUrl,
  categoryLabel,
}: {
  control: Control<CreateServiceInput>;
  imagePreviewUrl: string | null;
  categoryLabel?: string;
}) {
  const { t, i18n } = useTranslation("service");
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const [optionSelect, setOptionSelect] = useState<string>("");
  const name = useWatch({ control, name: "name" });
  const priceRaw = useWatch({ control, name: "basePrice" });
  const durationRaw = useWatch({ control, name: "durationMin" });
  const options = useWatch({ control, name: "options" });

  const price = Number(priceRaw) || 0;
  const duration = Number(durationRaw) || 0;
  const selectedOptionValue = optionSelect
    ? (() => {
        const [optionIndex, valueIndex] = optionSelect.split("-").map(Number);
        return options?.[optionIndex]?.values?.[valueIndex];
      })()
    : null;

  const totalPrice = price + (Number(selectedOptionValue?.price) || 0);
  const totalDuration = duration + (Number(selectedOptionValue?.duration) || 0);
  return (
    <div className="w-full max-w-sm rounded-2xl bg-muted p-3.5">
      <div className="overflow-hidden rounded-2xl border border-input bg-card">
        <div className="flex h-28 items-center justify-center bg-muted text-xs text-muted-foreground">
          {imagePreviewUrl ? (
            <img
              src={imagePreviewUrl}
              alt={t("editor.imagePreview")}
              className="h-full w-full object-cover"
            />
          ) : (
            t("editor.previewImage")
          )}
        </div>

        <div className="p-3.5 text-foreground">
          <span className="inline-block rounded-full bg-secondary/20 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
            {categoryLabel || t("editor.previewCategory")}
          </span>

          <p className={`mt-2 text-[15px] font-semibold ${name?.trim() ? "" : "text-muted-foreground"}`}>{name?.trim() || t("editor.namePlaceholder")}</p>
          <p className="text-[12.5px] text-muted-foreground">
            {t("editor.previewFrom")} {new Intl.NumberFormat(locale, { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(price)} · {duration} {t("units.minutes")}
          </p>

          {options && options.length > 0 && (
            <div className="mt-3 border-t border-input pt-3 space-y-3">
              {options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <p className="mb-2 text-[12.5px] font-semibold">
                    {option.name || `${t("editor.option")} ${optionIndex + 1}`}
                    {option.isRequired && (
                      <span className="ml-1 text-destructive">*</span>
                    )}
                  </p>

                  <div className="flex flex-col gap-1.5">
                    {option.values?.map((value, valueIndex) => {
                      const valueId = `${optionIndex}-${valueIndex}`;
                      const isSelected = optionSelect === valueId;
                      return (
                        <button
                          key={valueIndex}
                          type="button"
                          onClick={() => setOptionSelect(valueId)}
                          className={`flex min-h-10 items-center justify-between rounded-lg border px-2.5 py-1.5 text-left text-[12.5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            isSelected
                              ? "border-secondary bg-secondary/10"
                              : "border-input bg-card hover:bg-muted"
                          }`}
                        >
                          <span className="font-medium">
                            {value.name || `${t("editor.valuePlaceholder")} ${valueIndex + 1}`}
                          </span>
                          <span className="text-muted-foreground">
                            +
                            {new Intl.NumberFormat(locale, { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(Number(value.price) || 0)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-baseline justify-between border-t border-input pt-3 text-[12.5px]">
            <span className="text-muted-foreground">{t("editor.previewTotal")}</span>
            <span className="font-semibold">
              {new Intl.NumberFormat(locale, { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(totalPrice)} · {totalDuration} {t("units.minutes")}
            </span>
          </div>

          <Button
            type="button"
            className="mt-3 h-10 w-full rounded-lg text-[13.5px] font-medium"
          >
            {t("editor.previewBook")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ServicePreviewPanel;
