import z from 'zod';
export const createServiceSchema = z.object({
  name: z.string().min(1, 'Tên dịch vụ không được để trống'),
  description: z.string().optional(),
  basePrice: z.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
  durationMin: z.number().min(1, 'Thời gian phải lớn hơn 0'),
  isActive: z.boolean(),
  sortOrder: z.number(),
  options: z
    .array(
      z.object({
        name: z.string().min(1, 'Tên tùy chọn không được để trống'),
        isRequired: z.boolean(),
        sortOrder: z.number(),
        values: z
          .array(
            z.object({
              name: z.string().min(1, 'Tên giá trị không được để trống'),
              price: z.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
              duration: z.number().min(0, 'Thời gian phải lớn hơn hoặc bằng 0'),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
