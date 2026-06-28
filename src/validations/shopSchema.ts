// schemas/shop.schema.ts
import { z } from 'zod';

export const shopTypeEnum = z.enum(['NAIL', 'SPA', 'HAIR', 'COMBO']);

const shopBaseSchema = z.object({
  name: z.string().min(1, 'Tên shop không được để trống').max(100),
  slug: z
    .string()
    .min(1, 'Slug không được để trống')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu -'),
  type: shopTypeEnum,
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  address: z.string().min(1, 'Địa chỉ không được để trống').max(200),
  city: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố').max(100),
  district: z.string().min(1, 'Vui lòng chọn quận/huyện').max(100),
  description: z.string().max(500).optional(),
  openTime: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):[0-5]\d$/, 'Giờ mở cửa không hợp lệ'),
  closeTime: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):[0-5]\d$/, 'Giờ đóng cửa không hợp lệ'),
  workDays: z
    .array(z.number().int().min(0).max(6))
    .min(1, 'Phải chọn ít nhất 1 ngày làm việc'),
});

// refine đặt sau cùng chỉ cho createShopSchema
export const createShopSchema = shopBaseSchema.refine(
  (data) => data.openTime < data.closeTime,
  { message: 'Giờ mở cửa phải trước giờ đóng cửa', path: ['closeTime'] }
);

// updateShopSchema dùng base (không có refine) rồi mới partial
export const updateShopSchema = shopBaseSchema.partial().omit({ slug: true });

export type CreateShopInput = z.output<typeof createShopSchema>;
export type UpdateShopInput = z.output<typeof updateShopSchema>;
