import { Router } from "express";
import * as productController from "../controllers/product.controller";

const router = Router();

router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", productController.create);
router.put("/:id", productController.update);
router.delete("/:id", productController.remove);

// ✅ NUEVA RUTA PARA RESTAR STOCK
router.patch("/:id/decrement", productController.decrementStock);
router.patch("/:id/increment", productController.incrementStock);


export default router;
