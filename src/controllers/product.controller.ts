import { Request, Response } from "express";
import * as ProductService from "../services/product.service";
import { prisma } from "../utils/prisma";
import ExcelJS from "exceljs";
import { exportProductsToExcel } from "../services/export.service";

export const getAll = async (req: Request, res: Response) => {
  const filters = {
    search: req.query.search as string,
    categoryId: req.query.categoryId as string,
    status: req.query.status as string,
    stockStatus: req.query.stockStatus as "normal" | "low" | "out",
    page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    order: req.query.order as "asc" | "desc",
  };

  const result = await ProductService.getAll(filters);
  res.json(result);
};

export const getLowStockProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        stock: {
          lt: 10,
        },
      },
    });

    return res.json(products);
  } catch (error) {
    console.error("Error al obtener productos con bajo stock:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await ProductService.getById(id);
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
};

export const create = async (req: Request, res: Response) => {
  try {
    const newProduct = await ProductService.create(req.body);
    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await ProductService.update(id, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await ProductService.remove(id);
  res.status(204).send();
};

export const decrementStock = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ error: "Cantidad inválida" });
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ error: "Stock insuficiente" });
  }

  const updated = await prisma.product.update({
    where: { id },
    data: { stock: { decrement: quantity } },
  });

  res.json({ message: "Stock actualizado", updated });
};

export const incrementStock = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ error: "Cantidad inválida" });
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const updated = await prisma.product.update({
    where: { id },
    data: { stock: { increment: quantity } },
  });

  res.json({ message: "Stock actualizado", updated });
};

export const exportLowStockToExcel = async (_req: Request, res: Response) => {
  const products = await ProductService.getLowStockProducts();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Stock Bajo");

  worksheet.columns = [
    { header: "ID", key: "id", width: 25 },
    { header: "Nombre", key: "name", width: 30 },
    { header: "Categoría", key: "category", width: 20 },
    { header: "Stock", key: "stock", width: 10 },
    { header: "Estado", key: "status", width: 15 },
  ];

  products.forEach((p) => {
    worksheet.addRow({
      id: p.id,
      name: p.name,
      category: p.category.name,
      stock: p.stock,
      status: p.status,
    });
  });

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=stock-bajo.xlsx");

  await workbook.xlsx.write(res);
  res.end();
};

export const getOutOfStockProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        stock: 0,
      },
      include: { category: true },
      orderBy: { name: "asc" },
    });

    return res.json(products);
  } catch (error) {
    console.error("Error al obtener productos sin stock:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

