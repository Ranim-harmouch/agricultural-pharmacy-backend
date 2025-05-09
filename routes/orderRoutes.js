
import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  getOrderByIdAndUser,
  deleteOrder, 
  updateOrder
} from "../controllers/orderController.js";

const router = express.Router();

// POST /orders
router.post("/", createOrder);

// GET /orders
router.get("/", getAllOrders);

// GET /orders/user/:userId
router.get("/user/:userId", getOrdersByUser);

// GET /orders/:id/user/:userId
router.get("/:id/user/:userId", getOrderByIdAndUser);

// DELETE /orders/:id
router.delete("/:id", deleteOrder);

// PUT /api/orders/:id
router.put('/:id', updateOrder); 


export default router;
