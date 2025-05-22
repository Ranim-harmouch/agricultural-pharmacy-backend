
import db from '../config/db.js';
import { updateOrder } from '../controllers/orderController.js';

const Order = {
  
create: (user_id, subtotal_amount, total_amount, order_date, status, orderDetails, shippingAddress, shipmentData, callback) => {
  db.getConnection((err, connection) => {
    if (err) return callback(err);

    connection.beginTransaction(err => {
      if (err) {
        connection.release();
        return callback(err);
      }

      // Step 1: Insert the order
      const insertOrderQuery = `
        INSERT INTO Orders (user_id, subtotal_amount, total_amount, order_date, status)
        VALUES (?, ?, ?, ?, ?)
      `;

      connection.query(insertOrderQuery, [user_id, subtotal_amount, total_amount, order_date, status], (err, result) => {
        if (err) return rollbackWithError(err);

        const orderId = result.insertId;

        // Step 2: Insert the shipping address
        const insertAddressQuery = `
          INSERT INTO Order_shipping_address (full_address, street_address, department_floor, town_city, email, phone)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        // if (!shippingAddress) {
        // return res.status(400).json({ message: "Shipping address is required", error: "Missing shippingAddress" });
        // }
        if (!shippingAddress) {
          return callback({ message: "Shipping address is required", error: "Missing shippingAddress" });
        }



        const { full_address, street_address, department_floor, town_city, email, phone } = shippingAddress;

        connection.query(insertAddressQuery, [full_address, street_address, department_floor, town_city, email, phone], (err, result) => {
          if (err) return rollbackWithError(err);

          const addressId = result.insertId;

          // Step 3: Insert into Shipments (ensure shipment_date is not null)
          const insertShipmentQuery = `
            INSERT INTO Shipments (order_id, order_shipment_id, shipment_date, shipment_amount)
            VALUES (?, ?, ?, ?)
          `;

          // const { shipment_date = new Date().toISOString().split('T')[0], shipment_amount = 0 } = shipmentData || {};
          const defaultShipment = shipmentData || {};
          const shipment_date = defaultShipment.shipment_date || new Date().toISOString().split('T')[0];
          const shipment_amount = defaultShipment.shipment_amount || 0;



          // If shipment_date is missing, set it to the current date
          const validShipmentDate = shipment_date || new Date().toISOString().split('T')[0]; // Default to today if missing

          connection.query(insertShipmentQuery, [orderId, addressId, validShipmentDate, shipment_amount], (err) => {
            if (err) return rollbackWithError(err);

            // Step 4: Insert order details
            if (!orderDetails || orderDetails.length === 0) {
              return commitAndRelease({ id: orderId });
            }

            const detailsQuery = `
              INSERT INTO OrderDetails (order_id, product_id, quantity, price)
              VALUES ?
            `;
            const values = orderDetails.map(({ product_id, quantity, price }) => [orderId, product_id, quantity, price]);

            connection.query(detailsQuery, [values], (err) => {
              if (err) return rollbackWithError(err);

              commitAndRelease({ id: orderId });
            });
          });
        });
      });

      function rollbackWithError(err) {
        connection.rollback(() => {
          connection.release();
          callback(err);
        });
      }

      function commitAndRelease(data) {
        connection.commit(err => {
          if (err) return rollbackWithError(err);
          connection.release();
          callback(null, data);
        });
      }
    });
  });
},




  findAll: (callback) => {
    const query = `SELECT * FROM Orders`;

    db.query(query, (err, orders) => {
      if (err) return callback(err);
      if (orders.length === 0) return callback(null, []);

      let completed = 0;
      const results = [];

      orders.forEach(order => {
        db.query(`SELECT * FROM OrderDetails WHERE order_id = ?`, [order.id], (err, details) => {
          if (err) return handleError(err);

          db.query(`SELECT * FROM Shipments WHERE order_id = ?`, [order.id], (err, shipments) => {
            if (err) return handleError(err);

            const shipment = shipments[0];

            if (shipment && shipment.order_shipment_id) {
              db.query(`SELECT * FROM Order_shipping_address WHERE id = ?`, [shipment.order_shipment_id], (err, addresses) => {
                if (err) return handleError(err);

                results.push({
                  ...order,
                  orderDetails: details,
                  shipment,
                  shippingAddress: addresses[0] || null
                });
                checkDone();
              });
            } else {
              results.push({
                ...order,
                orderDetails: details,
                shipment: shipment || null,
                shippingAddress: null
              });
              checkDone();
            }
          });
        });
      });

      function handleError(err) {
        callback(err);
        callback = () => {};
      }

      function checkDone() {
        completed++;
        if (completed === orders.length) {
          callback(null, results);
        }
      }
    });
  },

  findByUserId: (user_id, callback) => {
    const query = `SELECT * FROM Orders WHERE user_id = ?`;

    db.query(query, [user_id], (err, orders) => {
      if (err) return callback(err);
      if (orders.length === 0) return callback(null, []);

      let completed = 0;
      const results = [];

      orders.forEach(order => {
        db.query(`SELECT * FROM OrderDetails WHERE order_id = ?`, [order.id], (err, details) => {
          if (err) return handleError(err);

          db.query(`SELECT * FROM Shipments WHERE order_id = ?`, [order.id], (err, shipments) => {
            if (err) return handleError(err);

            const shipment = shipments[0];

            if (shipment && shipment.order_shipment_id) {
              db.query(`SELECT * FROM Order_shipping_address WHERE id = ?`, [shipment.order_shipment_id], (err, addresses) => {
                if (err) return handleError(err);

                results.push({
                  ...order,
                  orderDetails: details,
                  shipment,
                  shippingAddress: addresses[0] || null
                });
                checkDone();
              });
            } else {
              results.push({
                ...order,
                orderDetails: details,
                shipment: shipment || null,
                shippingAddress: null
              });
              checkDone();
            }
          });
        });
      });

      function handleError(err) {
        callback(err);
        callback = () => {};
      }

      function checkDone() {
        completed++;
        if (completed === orders.length) {
          callback(null, results);
        }
      }
    });
  },

  findByIdAndUser: (id, user_id, callback) => {
    const query = `SELECT * FROM Orders WHERE id = ? AND user_id = ?`;

    db.query(query, [id, user_id], (err, orders) => {
      if (err) return callback(err);
      if (orders.length === 0) return callback(null, null);

      const order = orders[0];

      db.query(`SELECT * FROM OrderDetails WHERE order_id = ?`, [id], (err, details) => {
        if (err) return callback(err);

        db.query(`SELECT * FROM Shipments WHERE order_id = ?`, [id], (err, shipments) => {
          if (err) return callback(err);

          const shipment = shipments[0];

          if (shipment && shipment.order_shipment_id) {
            db.query(`SELECT * FROM Order_shipping_address WHERE id = ?`, [shipment.order_shipment_id], (err, addresses) => {
              if (err) return callback(err);

              callback(null, {
                ...order,
                orderDetails: details,
                shipment: shipment || null,
                shippingAddress: addresses[0] || null
              });
            });
          } else {
            callback(null, {
              ...order,
              orderDetails: details,
              shipment: shipment || null,
              shippingAddress: null
            });
          }
        });
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

update: (id, data, callback) => {
  const { subtotal_amount, total_amount, status } = data;

  db.getConnection((err, connection) => {
    if (err) return callback(err);

    const sql = `
      UPDATE Orders 
      SET subtotal_amount = ?, total_amount = ?, status = ?
      WHERE id = ?
    `;

    connection.query(sql, [subtotal_amount, total_amount, status, id], (err, result) => {
      connection.release();

      if (err) return callback(err);
      if (result.affectedRows === 0) return callback(null, null); // No order updated

      callback(null, { id, subtotal_amount, total_amount, status });
    });
  });
}


export default Order;


