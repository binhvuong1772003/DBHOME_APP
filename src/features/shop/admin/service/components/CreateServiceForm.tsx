import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateService } from "@/features/shop/admin/service/hooks/useCreateService";
import { useFieldArray, type Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { CreateServiceInput } from "@/validations/serviceSchema";
import { ServicePreviewPanel } from "./CreateServicePreview";
import { OptionItem } from "./OptionItem";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UploadImage from "@/components/common/UploadImage";
import { useEffect, useMemo } from "react";
export function CreateServiceForm() {
  const {
    form,
    onSubmit,
    isSubmitting,
    apiError,
    imageFiles,
    setImageFiles,
    onCancel,
  } = useCreateService();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const addOption = () => {
    append({
      name: "",
      isRequired: false,
      sortOrder: 0,
      values: [
        {
          name: "",
          price: 0,
          duration: 0,
        },
      ],
    });
  };
  const imagePreviewUrl = useMemo(() => {
    if (!imageFiles[0]) return null;
    return URL.createObjectURL(imageFiles[0]);
  }, [imageFiles]);
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);
  return (
    <div className="max-w-[1080px] mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Thêm dịch vụ</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Tạo dịch vụ mới cho salon và các tuỳ chọn biến thể
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-[1.5fr_1fr] gap-5 items-start min-w-[900px]">
            {/* FORM */}
            <div className="space-y-5">
              <div className="rounded-2xl border border-input bg-card p-6">
                <h2 className="text-[15px] font-semibold mb-4">
                  Thông tin cơ bản
                </h2>

                <div className="mb-4">
                  <label className="block text-[12.5px] font-medium mb-1.5">
                    Ảnh dịch vụ
                  </label>
                  <UploadImage
                    files={imageFiles}
                    onValueChange={setImageFiles}
                    maxFiles={1}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Tên dịch vụ</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                          placeholder="Gel Nail Art thiết kế"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Danh mục <span className="text-destructive">*</span>
                        </FormLabel>
                        <div>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Dịch vụ làm móng tay">
                                Dịch vụ làm móng tay
                              </SelectItem>
                              <SelectItem value="Dịch vụ chăm sóc móng">
                                Dịch vụ chăm sóc móng
                              </SelectItem>
                              <SelectItem value="Dịch vụ móng chân">
                                Dịch vụ móng chân
                              </SelectItem>
                              <SelectItem value="Dịch vụ khác">
                                Dịch vụ khác
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="basePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                            placeholder="60"
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || 0)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <FormField
                    control={form.control}
                    name="durationMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thời gian (phút)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                            placeholder="60"
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || 0)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sortOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thứ tự hiển thị </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                            placeholder="0"
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || 0)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                            placeholder="Mô tả ngắn về dịch vụ..."
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex w-full items-center justify-between">
                        <FormLabel>Đang hoạt động</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-input bg-card p-6">
                {fields.map((field, index) => (
                  <div key={index}>
                    <OptionItem
                      key={field.id}
                      control={form.control}
                      index={index}
                      onRemove={() => remove(index)}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="flex-shrink-0"
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-lg border-dashed hover:bg-muted/50 text-[13.5px] font-medium"
                  onClick={addOption}
                >
                  + Thêm nhóm tuỳ chọn
                </Button>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  className="rounded-lg border border-input bg-card px-4.5 py-2.5 text-[13.5px] font-medium"
                  disabled={isSubmitting}
                  onClick={() => onCancel()}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  className="rounded-lg border border-input bg-card px-4.5 py-2.5 text-[13.5px] font-medium"
                  disabled={isSubmitting}
                  onClick={() => {
                    setImageFiles([]);
                    form.reset();
                  }}
                >
                  Đặt lại
                </Button>
                <Button
                  type="button"
                  className="rounded-lg bg-primary px-4.5 py-2.5 text-[13.5px] font-medium text-primary-foreground"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  Lưu dịch vụ
                </Button>
              </div>
            </div>

            {/* PREVIEW */}
            <div>
              <ServicePreviewPanel
                control={form.control}
                imagePreviewUrl={imagePreviewUrl}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
