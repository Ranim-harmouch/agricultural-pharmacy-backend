import {
    getAllShipments,
    getShipmentById,
    createShipment,
    updateShipment,
    deleteShipment
  } from '../models/ShipmentsModel.js';
  
  export const getAll = (req, res) => {
    getAllShipments((err, data) => {
      if (err) return res.status(500).json({ data: null, message: 'Failed to get shipments', error: err.message });
      res.json({ data, message: 'Shipments retrieved successfully', error: null });
    });
  };
  
  export const getById = (req, res) => {
    getShipmentById(req.params.id, (err, shipment) => {
      if (err) return res.status(500).json({ data: null, message: 'Failed to get shipment', error: err.message });
      if (!shipment) return res.status(404).json({ data: null, message: 'Shipment not found', error: 'Not Found' });
      res.json({ data: shipment, message: 'Shipment retrieved successfully', error: null });
    });
  };
  
  export const create = (req, res) => {
    createShipment(req.body, (err, newShipment) => {
      if (err) return res.status(500).json({ data: null, message: 'Failed to create shipment', error: err.message });
      res.status(201).json({ data: newShipment, message: 'Shipment created successfully', error: null });
    });
  };
  
  export const update = (req, res) => {
    getShipmentById(req.params.id, (err, shipment) => {
      if (err) return res.status(500).json({ data: null, message: 'Failed to fetch shipment', error: err.message });
      if (!shipment) return res.status(404).json({ data: null, message: 'Shipment not found', error: 'Not Found' });
  
      updateShipment(req.params.id, req.body, (err, updated) => {
        if (err) return res.status(500).json({ data: null, message: 'Failed to update shipment', error: err.message });
        res.json({ data: updated, message: 'Shipment updated successfully', error: null });
      });
    });
  };
  
  export const remove = (req, res) => {
    getShipmentById(req.params.id, (err, shipment) => {
      if (err) return res.status(500).json({ data: null, message: 'Failed to fetch shipment', error: err.message });
      if (!shipment) return res.status(404).json({ data: null, message: 'Shipment not found', error: 'Not Found' });
  
      deleteShipment(req.params.id, (err) => {
        if (err) return res.status(500).json({ data: null, message: 'Failed to delete shipment', error: err.message });
        res.json({ data: null, message: 'Shipment deleted successfully', error: null });
      });
    });
  };
  