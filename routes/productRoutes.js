import express from "express";
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadMiddleware,
} from "../controllers/productController.js";

const router = express.Router();

// GET all products
router.get("/", getAllProducts);

// GET a specific product by ID
router.get("/:id", getProductById);

// POST a new product with optional image upload
router.post("/", uploadMiddleware, addProduct);

// PUT update a product (with optional image upload)
router.put("/:id", uploadMiddleware, updateProduct);

// DELETE a product by ID
router.delete("/:id", deleteProduct);

export default router;
