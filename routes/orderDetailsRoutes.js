import express from 'express';
import {
  getAllOrderDetails,
  getOrderDetailById,
  createOrderDetail,
  updateOrderDetail,
  deleteOrderDetail
} from '../controllers/orderdetailsController.js';

const router = express.Router();

router.get('/', getAllOrderDetails);
router.get('/:id', getOrderDetailById);
router.post('/', createOrderDetail);
router.put('/:id', updateOrderDetail);
router.delete('/:id', deleteOrderDetail);

export default router;
