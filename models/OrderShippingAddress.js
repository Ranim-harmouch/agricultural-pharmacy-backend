
import db from "../config/db.js";

export const createAddress = (data, callback) => {
  const query = `
    INSERT INTO Order_shipping_address 
      (full_address, street_address, department_floor, town_city, email, phone)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [
    data.full_address,
    data.street_address,
    data.department_floor,
    data.town_city,
    data.email,
    data.phone
  ], callback);
};

export const getAllAddresses = (callback) => {
  db.query("SELECT * FROM Order_shipping_address", callback);
};

export const getAddressById = (id, callback) => {
  db.query("SELECT * FROM Order_shipping_address WHERE id = ?", [id], callback);
};

export const updateAddress = (id, data, callback) => {
  const query = `
    UPDATE Order_shipping_address
    SET full_address = ?, street_address = ?, department_floor = ?, town_city = ?, email = ?, phone = ?
    WHERE id = ?
  `;
  db.query(query, [
    data.full_address,
    data.street_address,
    data.department_floor,
    data.town_city,
    data.email,
    data.phone,
    id
  ], callback);
};

export const deleteAddress = (id, callback) => {
  db.query("DELETE FROM Order_shipping_address WHERE id = ?", [id], callback);
};
