
import * as Address from "../models/OrderShippingAddress.js";

export const create = (req, res) => {
  Address.createAddress(req.body, (err, result) => {
    if (err) return res.status(500).json({ data: null, message: "Failed to create address", error: err });
    res.json({ data: { id: result.insertId }, message: "Address created successfully", error: null });
  });
};

export const findAll = (req, res) => {
  Address.getAllAddresses((err, results) => {
    if (err) return res.status(500).json({ data: null, message: "Failed to fetch addresses", error: err });
    res.json({ data: results, message: "Addresses retrieved successfully", error: null });
  });
};

export const findOne = (req, res) => {
  Address.getAddressById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ data: null, message: "Failed to fetch address", error: err });
    if (results.length === 0) return res.status(404).json({ data: null, message: "Address not found", error: "Not Found" });
    res.json({ data: results[0], message: "Address retrieved successfully", error: null });
  });
};

export const update = (req, res) => {
  Address.updateAddress(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ data: null, message: "Failed to update address", error: err });
    res.json({ data: null, message: "Address updated successfully", error: null });
  });
};

export const remove = (req, res) => {
  Address.deleteAddress(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ data: null, message: "Failed to delete address", error: err });
    res.json({ data: null, message: "Address deleted successfully", error: null });
  });
};
