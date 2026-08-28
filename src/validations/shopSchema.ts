// schemas/shop.schema.ts
import { z } from "zod";

export const shopTypeEnum = z.enum(["NAIL", "SPA", "HAIR", "COMBO"]);

const shopBaseSchema = z.object({
  name: z.string().min(1, "Tên shop không được để trống").max(100),
  slug: z
    .string()
    .min(1, "Slug không được để trống")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug chỉ được chứa chữ thường, số và dấu -"),
  type: shopTypeEnum,
  phone: z.string().regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  address: z.string().min(1, "Địa chỉ không được để trống").max(200),
  city: z.string().min(1, "Vui lòng chọn tỉnh/thành phố").max(100),
  district: z.string().min(1, "Vui lòng chọn quận/huyện").max(100),
  description: z.string().max(500).optional(),
  openTime: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):[0-5]\d$/, "Giờ mở cửa không hợp lệ"),
  closeTime: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):[0-5]\d$/, "Giờ đóng cửa không hợp lệ"),
  workDays: z
    .array(z.number().int().min(0).max(6))
    .min(1, "Phải chọn ít nhất 1 ngày làm việc"),
});

// refine đặt sau cùng chỉ cho createShopSchema
export const createShopSchema = shopBaseSchema.refine(
  (data) => data.openTime < data.closeTime,
  { message: "Giờ mở cửa phải trước giờ đóng cửa", path: ["closeTime"] },
);

// updateShopSchema dùng base (không có refine) rồi mới partial
// Các trường liên hệ là tùy chọn khi cập nhật. Form HTML trả về chuỗi rỗng
// cho field chưa có dữ liệu, vì vậy cần chấp nhận trạng thái này để việc lưu
// logo, banner hoặc giờ làm việc không bị resolver chặn âm thầm.
export const updateShopSchema = shopBaseSchema
  .partial()
  .omit({ slug: true })
  .extend({
    phone: z
      .union([
        z
          .string()
          .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ"),
        z.literal(""),
      ])
      .optional(),
    email: z
      .union([z.string().email("Email không hợp lệ"), z.literal("")])
      .optional(),
    address: z
      .string()
      .trim()
      .min(1, "Địa chỉ không được để trống")
      .max(200, "Địa chỉ không được vượt quá 200 ký tự"),
    city: z.string().max(100).optional(),
    district: z.string().max(100).optional(),
  });

// Lịch làm việc theo từng ngày trong tuần (0 = Chủ nhật ... 6 = Thứ 7)
export const businessHourItemSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  openTime: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):[0-5]\d$/, "Giờ mở cửa không hợp lệ"),
  closeTime: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):[0-5]\d$/, "Giờ đóng cửa không hợp lệ"),
  isClosed: z.boolean(),
});

export const businessHoursSchema = z.array(businessHourItemSchema).length(7);

export type CreateShopInput = z.output<typeof createShopSchema>;
export type UpdateShopInput = z.output<typeof updateShopSchema>;
export type BusinessHourItem = z.output<typeof businessHourItemSchema>;
export type BusinessHoursInput = z.output<typeof businessHoursSchema>;
