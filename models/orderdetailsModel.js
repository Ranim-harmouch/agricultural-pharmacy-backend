import db from '../config/db.js';

const OrderDetails = {
  getAll: (callback) => {
    const sql = `SELECT * FROM OrderDetails`;
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = `SELECT * FROM OrderDetails WHERE id = ?`;
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = `INSERT INTO OrderDetails (product_id, order_id, quantity, price) VALUES (?, ?, ?, ?)`;
    db.query(sql, [data.product_id, data.order_id, data.quantity, data.price], callback);
  },

  update: (id, data, callback) => {
    const sql = `UPDATE OrderDetails SET product_id = ?, order_id = ?, quantity = ?, price = ? WHERE id = ?`;
    db.query(sql, [data.product_id, data.order_id, data.quantity, data.price, id], callback);
  },

  delete: (id, callback) => {
    const sql = `DELETE FROM OrderDetails WHERE id = ?`;
    db.query(sql, [id], callback);
  }
};

export default OrderDetails;
