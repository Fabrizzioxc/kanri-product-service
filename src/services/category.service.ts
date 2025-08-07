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

// En category.service.ts
export const getPaginated = async (
  search: string = '',
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    prisma.category.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    }),
  ])

  return {
    data,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  }
}
