import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateService } from '@/hooks/shops/services/useCreateService';
export function CreateServiceForm() {
  const { form, onSubmit, isSubmitting, apiError } = useCreateService();
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
                  <div className="rounded-lg border border-dashed border-input bg-muted p-5 text-center text-[13px] text-muted-foreground">
                    Nhấn để tải ảnh lên (JPG, PNG, tối đa 5MB)
                  </div>
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
                          <select className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary">
                            <option>Dịch vụ làm móng tay</option>
                            <option>Dịch vụ chăm sóc móng</option>
                            <option>Dịch vụ móng chân</option>
                            <option>Dịch vụ khác</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[12.5px] font-medium mb-1.5">
                            Giá cơ bản (đ)
                          </label>
                          <input
                            type="number"
                            placeholder="250000"
                            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                          />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-[12.5px] font-medium mb-1.5">
                      Thời lượng (phút)
                    </label>
                    <input
                      type="number"
                      placeholder="45"
                      className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-medium mb-1.5">
                      Thứ tự hiển thị
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-[12.5px] font-medium mb-1.5">
                    Mô tả
                  </label>
                  <textarea
                    placeholder="Mô tả ngắn về dịch vụ..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-[13.5px] font-medium">
                    Đang hoạt động
                  </span>
                  <div className="relative w-[38px] h-[22px] rounded-full bg-primary">
                    <div className="absolute top-0.5 right-0.5 w-[18px] h-[18px] rounded-full bg-card" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-input bg-card p-6">
                <h2 className="text-[15px] font-semibold mb-4">
                  Tuỳ chọn dịch vụ
                </h2>

                <div className="rounded-lg border border-border bg-muted p-3.5 mb-3">
                  <div className="flex items-center gap-2 mb-2.5">
                    <input
                      type="text"
                      defaultValue="Chọn kiểu dáng"
                      className="flex-1 rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    <span className="text-[11.5px] text-muted-foreground whitespace-nowrap">
                      Bắt buộc
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1.5">
                    <input
                      type="text"
                      defaultValue="Kiểu đơn giản"
                      className="flex-[1.6] rounded-lg border border-input bg-card px-2.5 py-1.5 text-[13px] outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      defaultValue="+0đ"
                      className="flex-1 rounded-lg border border-input bg-card px-2.5 py-1.5 text-[13px] outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      defaultValue="+0p"
                      className="flex-[0.8] rounded-lg border border-input bg-card px-2.5 py-1.5 text-[13px] outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 mb-2">
                    <input
                      type="text"
                      defaultValue="Kiểu 3D đính đá"
                      className="flex-[1.6] rounded-lg border border-input bg-card px-2.5 py-1.5 text-[13px] outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      defaultValue="+80.000đ"
                      className="flex-1 rounded-lg border border-input bg-card px-2.5 py-1.5 text-[13px] outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      defaultValue="+20p"
                      className="flex-[0.8] rounded-lg border border-input bg-card px-2.5 py-1.5 text-[13px] outline-none focus:border-primary"
                    />
                  </div>

                  <button
                    type="button"
                    className="text-[12.5px] font-medium text-foreground"
                  >
                    + Thêm lựa chọn
                  </button>
                </div>

                <button
                  type="button"
                  className="w-full rounded-lg border border-dashed border-input py-2.5 text-[13.5px] text-muted-foreground"
                >
                  + Thêm nhóm tuỳ chọn
                </button>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-input bg-card px-4.5 py-2.5 text-[13.5px] font-medium"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-primary px-4.5 py-2.5 text-[13.5px] font-medium text-primary-foreground"
                >
                  Lưu dịch vụ
                </button>
              </div>
            </div>

            {/* PREVIEW */}
            <div>
              <p className="text-xs text-muted-foreground mb-2 pl-0.5">
                Xem trước (khách hàng)
              </p>
              <div className="rounded-2xl bg-muted p-3.5 sticky top-6">
                <div className="overflow-hidden rounded-2xl border border-input bg-card">
                  <div className="flex h-28 items-center justify-center bg-muted text-xs text-muted-foreground">
                    Ảnh dịch vụ
                  </div>

                  <div className="p-3.5 text-foreground">
                    <span className="inline-block rounded-full bg-secondary/20 px-2.5 py-0.5 text-[11px] font-medium">
                      Dịch vụ làm móng tay
                    </span>

                    <p className="mt-2 text-[15px] font-semibold">
                      Gel Nail Art thiết kế
                    </p>
                    <p className="text-[12.5px] text-muted-foreground">
                      từ 250.000đ · 45 phút
                    </p>

                    <div className="mt-3 border-t border-input pt-3">
                      <p className="mb-2 text-[12.5px] font-semibold">
                        Chọn kiểu dáng{' '}
                        <span className="text-destructive">*</span>
                      </p>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between rounded-lg border border-secondary bg-secondary/10 px-2.5 py-1.5 text-[12.5px]">
                          <span>Kiểu đơn giản</span>
                          <span className="text-muted-foreground">+0đ</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-input bg-card px-2.5 py-1.5 text-[12.5px]">
                          <span>Kiểu 3D đính đá</span>
                          <span className="text-muted-foreground">
                            +80.000đ · +20p
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between border-t border-input pt-3 text-[12.5px]">
                      <span className="text-muted-foreground">Tổng cộng</span>
                      <span className="font-semibold">250.000đ · 45 phút</span>
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
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
