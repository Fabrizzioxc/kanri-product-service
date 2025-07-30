import { prisma } from "../utils/prisma";
import { CategorySchema, CategoryUpdateSchema } from "../schemas/category.schema";

export const getAll = () => {
  return prisma.category.findMany();
};

export const getById = (id: string) => {
  return prisma.category.findUnique({ where: { id } });
};

export const create = async (data: unknown) => {
  const validated = CategorySchema.parse(data);
  return prisma.category.create({ data: validated });
};

export const update = async (id: string, data: unknown) => {
  const validated = CategoryUpdateSchema.parse(data);
  return prisma.category.update({ where: { id }, data: validated });
};

export const remove = async (id: string) => {
  await prisma.category.delete({ where: { id } });
};
