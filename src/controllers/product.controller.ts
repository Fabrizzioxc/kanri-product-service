import { Request, Response } from "express";
import * as ProductService from "../services/product.service";
import { prisma } from "../utils/prisma";

export const getAll = async (_req: Request, res: Response) => {
  const products = await ProductService.getAll();
  res.json(products);
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

// ✅ NUEVO: PATCH /products/:id/decrement
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
