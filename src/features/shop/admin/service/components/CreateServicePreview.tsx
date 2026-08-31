import { useWatch, type Control } from "react-hook-form";
import { useState } from "react";
import type { CreateServiceInput } from "@/validations/serviceSchema";
export function ServicePreviewPanel({
  control,
  imagePreviewUrl,
}: {
  control: Control<CreateServiceInput>;
  imagePreviewUrl: string | null;
}) {
  const [optionSelect, setOptionSelect] = useState<string>("");
  const name = useWatch({ control, name: "name" });
  const category = useWatch({ control, name: "category" });
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
    <div className="max-w-xs rounded-2xl bg-muted p-3.5">
      <div className="overflow-hidden rounded-2xl border border-input bg-card">
        <div className="flex h-28 items-center justify-center bg-muted text-xs text-muted-foreground">
          {imagePreviewUrl ? (
            <img
              src={imagePreviewUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            "Ảnh dịch vụ"
          )}
        </div>

        <div className="p-3.5 text-foreground">
          <span className="inline-block rounded-full bg-secondary/20 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
            {category || "Danh mục"}
          </span>

          <p className="mt-2 text-[15px] font-semibold">{name}</p>
          <p className="text-[12.5px] text-muted-foreground">
            từ {price.toLocaleString("vi-VN")}đ · {duration} phút
          </p>

          {options && options.length > 0 && (
            <div className="mt-3 border-t border-input pt-3 space-y-3">
              {options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <p className="mb-2 text-[12.5px] font-semibold">
                    {option.name || `Tuỳ chọn ${optionIndex + 1}`}
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
                          className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-left text-[12.5px] transition-colors ${
                            isSelected
                              ? "border-secondary bg-secondary/10"
                              : "border-input bg-card hover:bg-muted"
                          }`}
                        >
                          <span className="font-medium">
                            {value.name || `Lựa chọn ${valueIndex + 1}`}
                          </span>
                          <span className="text-muted-foreground">
                            +
                            {(Number(value.price) || 0).toLocaleString("vi-VN")}
                            đ
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
            <span className="text-muted-foreground">Tổng cộng</span>
            <span className="font-semibold">
              {totalPrice.toLocaleString("vi-VN")}đ · {totalDuration} phút
            </span>
          </div>

          <button
            type="button"
            className="mt-3 w-full rounded-lg bg-primary py-2.5 text-[13.5px] font-medium text-primary-foreground"
          >
            Đặt lịch
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServicePreviewPanel;
