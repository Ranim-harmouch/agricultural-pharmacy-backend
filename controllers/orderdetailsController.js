import OrderDetails from '../models/orderdetailsModel.js';

export const getAllOrderDetails = (req, res) => {
  OrderDetails.getAll((err, results) => {
    if (err) return res.status(500).json({ data: null, message: 'Failed to get order details', error: err });
    res.json({ data: results, message: 'Order details retrieved successfully', error: null });
  });
};

export const getOrderDetailById = (req, res) => {
  const { id } = req.params;
  OrderDetails.getById(id, (err, result) => {
    if (err) return res.status(500).json({ data: null, message: 'Failed to get order detail', error: err });
    res.json({ data: result[0], message: 'Order detail retrieved successfully', error: null });
  });
};

export const createOrderDetail = (req, res) => {
  const newOrderDetail = req.body;
  OrderDetails.create(newOrderDetail, (err, result) => {
    if (err) return res.status(500).json({ data: null, message: 'Failed to create order detail', error: err });
    res.json({ data: { id: result.insertId, ...newOrderDetail }, message: 'Order detail created successfully', error: null });
  });
};

export const updateOrderDetail = (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  OrderDetails.update(id, updatedData, (err) => {
    if (err) return res.status(500).json({ data: null, message: 'Failed to update order detail', error: err });
    res.json({ data: { id, ...updatedData }, message: 'Order detail updated successfully', error: null });
  });
};

export const deleteOrderDetail = (req, res) => {
  const { id } = req.params;
  OrderDetails.delete(id, (err) => {
    if (err) return res.status(500).json({ data: null, message: 'Failed to delete order detail', error: err });
    res.json({ data: null, message: 'Order detail deleted successfully', error: null });
  });
};
