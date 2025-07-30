import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
});

export const CategoryUpdateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").optional(),
});
