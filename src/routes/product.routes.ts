import { Router } from "express";
import * as ProductController from "../controllers/product.controller";

const router = Router();

router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);
router.post("/", ProductController.create);
router.put("/:id", ProductController.update);
router.delete("/:id", ProductController.remove);

export default router;
