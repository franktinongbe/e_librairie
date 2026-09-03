import { z } from 'zod';

export const documentCreateSchema = z.object({
  title: z.string().min(1),
  author: z.string().optional(),
  reference: z.string().optional(),
  image: z.string().optional(),
  price: z.preprocess((v) => Number(v), z.number()),
  stock: z.preprocess((v) => (v == null ? 0 : Number(v)), z.number()),
  categoryId: z.number().optional()
});

export const documentUpdateSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  reference: z.string().optional(),
  image: z.string().optional(),
  price: z.preprocess((v) => (v == null ? undefined : Number(v)), z.number().optional()),
  stock: z.preprocess((v) => (v == null ? undefined : Number(v)), z.number().optional()),
  categoryId: z.preprocess((v) => (v == null ? undefined : Number(v)), z.number().optional())
});

export const categorySchema = z.object({ name: z.string().min(1) });
