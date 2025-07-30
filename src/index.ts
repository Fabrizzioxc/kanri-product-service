import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);

app.listen(PORT, () => {
  console.log(`✅ Product Service listening on port ${PORT}`);
});
