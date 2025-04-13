
import Order from '../models/Order.js';

export function createOrder(req, res) {
  const { user_id, subtotal_amount, total_amount, order_date, status, orderDetails } = req.body;

  Order.create(user_id, subtotal_amount, total_amount, order_date, status, orderDetails, (err, order) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating order', error: err });
    }

    res.status(201).json({ message: 'Order created', data: order });
  });
}

export function getAllOrders(req, res) {
  Order.findAll((err, orders) => {
    if (err) return res.status(500).json({ message: 'Error fetching orders', error: err });

    res.json({ message: 'Orders fetched', data: orders });
  });
}

export function getOrdersByUser(req, res) {
  const { userId } = req.params;

  Order.findByUserId(userId, (err, orders) => {
    if (err) return res.status(500).json({ message: 'Error fetching user orders', error: err });

    res.json({ message: 'User orders fetched', data: orders });
  });
}

export function getOrderByIdAndUser(req, res) {
  const { id, userId } = req.params;

  Order.findByIdAndUser(id, userId, (err, order) => {
    if (err) return res.status(500).json({ message: 'Error fetching order', error: err });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Order fetched', data: order });
  });
}

export function deleteOrder(req, res) {
  const { id } = req.params;

  Order.delete(id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting order', error: err });

    res.json({ message: 'Order deleted', data: result });
  });
}
