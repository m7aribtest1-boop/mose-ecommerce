import { z } from 'zod';

export const orderSchema = z.object({
  customerName: z.string().trim().min(3, 'الاسم الكامل مطلوب (3 أحرف على الأقل)'),
  phone: z.string().trim().regex(/^(\+212|0)([ \-]?\d){9}$/, 'رقم هاتف غير صالح'),
  email: z.string().trim().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  city: z.string().trim().min(2, 'المدينة مطلوبة'),
  address: z.string().trim().optional().or(z.literal('')),
  notes: z.string().trim().max(500).optional().or(z.literal('')),
  paymentMethod: z.enum(['COD', 'CMI', 'CASH_PLUS', 'BANK_TRANSFER']).default('COD'),
  couponCode: z.string().trim().optional().or(z.literal('')),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(50),
        size: z.string().optional(),
        color: z.string().optional(),
      })
    )
    .min(1, 'السلة فارغة'),
});

export type OrderInput = z.infer<typeof orderSchema>;