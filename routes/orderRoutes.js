import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  getOrderByIdAndUser,
  deleteOrder
} from "../controllers/orderController.js";

const router = express.Router();

// POST /orders
router.post("/", createOrder);

// GET /orders
router.get("/", getAllOrders);

// GET /orders/user/:user_id
router.get("/user/:userId", getOrdersByUser);

// GET /orders/:id/user/:user_id
router.get("/:id/user/:userId", getOrderByIdAndUser);

// DELETE /orders/:id
router.delete("/:id", deleteOrder);

export default router;
