
import db from '../config/db.js';

const Order = {
  create: (user_id, subtotal_amount, total_amount, order_date, status, orderDetails, callback) => {
    db.getConnection((err, connection) => {
      if (err) return callback(err);

      connection.beginTransaction(err => {
        if (err) {
          connection.release();
          return callback(err);
        }

        const insertOrderQuery = `
          INSERT INTO Orders (user_id, subtotal_amount, total_amount, order_date, status)
          VALUES (?, ?, ?, ?, ?)
        `;

        connection.query(insertOrderQuery, [user_id, subtotal_amount, total_amount, order_date, status], (err, result) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              callback(err);
            });
          }

          const orderId = result.insertId;

          if (!orderDetails || orderDetails.length === 0) {
            connection.commit(err => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  callback(err);
                });
              }
              connection.release();
              callback(null, { id: orderId });
            });
            return;
          }

          const detailsQuery = `
            INSERT INTO OrderDetails (order_id, product_id, quantity, price)
            VALUES ?
          `;
          const values = orderDetails.map(({ product_id, quantity, price }) => [orderId, product_id, quantity, price]);

          connection.query(detailsQuery, [values], (err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                callback(err);
              });
            }

            connection.commit(err => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  callback(err);
                });
              }

              connection.release();
              callback(null, { id: orderId });
            });
          });
        });
      });
    });
  },

  findAll: (callback) => {
    const query = `SELECT * FROM Orders`;

    db.query(query, (err, orders) => {
      if (err) return callback(err);

      let completed = 0;
      const results = [];

      if (orders.length === 0) return callback(null, []);

      orders.forEach(order => {
        db.query(`SELECT * FROM OrderDetails WHERE order_id = ?`, [order.id], (err, details) => {
          if (err) return callback(err);

          results.push({ ...order, orderDetails: details });
          completed++;

          if (completed === orders.length) {
            callback(null, results);
          }
        });
      });
    });
  },

  findByUserId: (user_id, callback) => {
    const query = `SELECT * FROM Orders WHERE user_id = ?`;

    db.query(query, [user_id], (err, orders) => {
      if (err) return callback(err);

      let completed = 0;
      const results = [];

      if (orders.length === 0) return callback(null, []);

      orders.forEach(order => {
        db.query(`SELECT * FROM OrderDetails WHERE order_id = ?`, [order.id], (err, details) => {
          if (err) return callback(err);

          results.push({ ...order, orderDetails: details });
          completed++;

          if (completed === orders.length) {
            callback(null, results);
          }
        });
      });
    });
  },

  findByIdAndUser: (id, user_id, callback) => {
    const query = `SELECT * FROM Orders WHERE id = ? AND user_id = ?`;

    db.query(query, [id, user_id], (err, orders) => {
      if (err) return callback(err);
      if (orders.length === 0) return callback(null, null);

      db.query(`SELECT * FROM OrderDetails WHERE order_id = ?`, [id], (err, details) => {
        if (err) return callback(err);

        callback(null, { ...orders[0], orderDetails: details });
      });
    });
  },

  delete: (id, callback) => {
    db.getConnection((err, connection) => {
      if (err) return callback(err);

      connection.beginTransaction(err => {
        if (err) {
          connection.release();
          return callback(err);
        }

        connection.query(`DELETE FROM OrderDetails WHERE order_id = ?`, [id], (err) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              callback(err);
            });
          }

          connection.query(`DELETE FROM Orders WHERE id = ?`, [id], (err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                callback(err);
              });
            }

            connection.commit(err => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  callback(err);
                });
              }

              connection.release();
              callback(null, { message: 'Order deleted successfully' });
            });
          });
        });
      });
    });
  }
};

export default Order;
