import db from '../config/db.js';

export const getAllShipments = (callback) => {
  db.query('SELECT * FROM Shipments', callback);
};

export const getShipmentById = (id, callback) => {
  db.query('SELECT * FROM Shipments WHERE id = ?', [id], (err, results) => {
    callback(err, results[0]);
  });
};

export const createShipment = (shipment, callback) => {
  const { order_id, shipment_date, shipment_amount, order_shipment_id } = shipment;
  db.query(
    'INSERT INTO Shipments (order_id, shipment_date, shipment_amount, order_shipment_id) VALUES (?, ?, ?, ?)',
    [order_id, shipment_date, shipment_amount, order_shipment_id],
    (err, result) => {
      if (err) return callback(err);
      callback(null, { id: result.insertId, ...shipment });
    }
  );
};

export const updateShipment = (id, shipment, callback) => {
  const { order_id, shipment_date, shipment_amount, order_shipment_id } = shipment;
  db.query(
    'UPDATE Shipments SET order_id = ?, shipment_date = ?, shipment_amount = ?, order_shipment_id = ? WHERE id = ?',
    [order_id, shipment_date, shipment_amount, order_shipment_id, id],
    (err) => {
      if (err) return callback(err);
      callback(null, { id, ...shipment });
    }
  );
};

export const deleteShipment = (id, callback) => {
  db.query('DELETE FROM Shipments WHERE id = ?', [id], callback);
};
