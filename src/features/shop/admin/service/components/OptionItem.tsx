import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFieldArray, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { CreateServiceInput } from "@/validations/serviceSchema";

export function OptionItem({
  control,
  index,
}: {
  control: Control<CreateServiceInput>;
  index: number;
}) {
  const { t } = useTranslation("service");
  const {
    fields: valueFields,
    append: appendValue,
    remove: removeValue,
  } = useFieldArray({
    control,
    name: `options.${index}.values`,
  });

  const addValue = () => {
    appendValue({ name: "", price: 0, duration: 0 });
  };

  return (
    <div className="mb-5 pb-5 border-b border-border last:mb-0 last:pb-0 last:border-0">
      <FormField
        control={control}
        name={`options.${index}.name`}
        render={({ field }) => (
          <FormItem className="mb-3">
            <FormLabel>{t("editor.option")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder={t("editor.optionPlaceholder")}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {valueFields.map((value, valueIndex) => (
        <div
          key={value.id}
          className="rounded-lg border border-border bg-muted p-3.5 mb-3"
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <FormField
              control={control}
              name={`options.${index}.values.${valueIndex}.name`}
              render={({ field }) => (
                <FormItem className="flex-[1.6]">
                  <FormControl>
                    <Input
                      {...field}
                      className="rounded-lg border border-input bg-card px-2.5 py-1.5 text-[13px] outline-none focus:border-primary"
                      placeholder={t("editor.valuePlaceholder")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`options.${index}.values.${valueIndex}.price`}
              render={({ field }) => (
                <FormItem className="flex-[1.6]">
                  <FormControl>
                    <Input
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.valueAsNumber;
                        field.onChange(isNaN(val) ? 0 : val);
                      }}
                      type="number"
                      className="rounded-lg border border-input bg-card px-2.5 py-1.5 text-[13px] outline-none focus:border-primary"
                      placeholder={t("editor.pricePlaceholder")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`options.${index}.values.${valueIndex}.duration`}
              render={({ field }) => (
                <FormItem className="flex-[1.6]">
                  <FormControl>
                    <Input
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.valueAsNumber;
                        field.onChange(isNaN(val) ? 0 : val);
                      }}
                      type="number"
                      className="rounded-lg border border-input bg-card px-2.5 py-1.5 text-[13px] outline-none focus:border-primary"
                      placeholder={t("editor.minutesPlaceholder")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeValue(valueIndex)}
              className="shrink-0"
            >
              {t("editor.remove")}
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        onClick={addValue}
        className="text-[12.5px] font-medium text-foreground mb-3"
      >
        <span className="inline-flex items-center gap-2"><span aria-hidden="true">+</span>{t("editor.addValue")}</span>
      </Button>

      <FormField
        control={control}
        name={`options.${index}.isRequired`}
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <FormLabel className="text-[13px] font-medium mb-0">
              {t("editor.required")}
            </FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
