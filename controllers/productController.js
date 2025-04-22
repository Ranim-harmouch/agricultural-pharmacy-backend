import axios from "axios";
import multer from "multer";
import Product from "../models/Product.js";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });
export const uploadMiddleware = upload.single("image");

// Upload to ImgBB
const uploadImageToImgBB = (file, callback) => {
    const apiKey = process.env.IMGBB_API_KEY;
    const formData = new FormData();
    formData.append("image", file.buffer.toString("base64"));

    axios
        .post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData, {
            headers: formData.getHeaders(),
        })
        .then((response) => {
            callback(null, response.data.data.url);
        })
        .catch((error) => {
            callback(new Error("Image upload failed"), null);
        });
};

// Get all products
export const getAllProducts = (req, res) => {
    Product.getAll((error, products) => {
        if (error) {
            return res.status(500).json({ data: null, message: "Failed to retrieve products", error: error.message });
        }
        res.status(200).json({ data: products, message: "Products retrieved successfully", error: null });
    });
};

// Get product by ID
export const getProductById = (req, res) => {
    const productId = parseInt(req.params.id, 10);
    Product.getById(productId, (error, product) => {
        if (error) {
            return res.status(500).json({ data: null, message: "Error fetching product", error: error.message });
        }
        if (!product) {
            return res.status(404).json({ data: null, message: "Product not found", error: null });
        }
        res.status(200).json({ data: product, message: "Product retrieved successfully", error: null });
    });
};

// Add product
export const addProduct = (req, res) => {
    const { name, description, price, category_id } = req.body;

    if (!name || !price || !category_id) {
        return res.status(400).json({ data: null, message: "Missing required fields", error: null });
    }

    const handleCreate = (imageUrl) => {
        Product.create(name, description, price, category_id, imageUrl, (error, newProduct) => {
            if (error) {
                return res.status(500).json({ data: null, message: "Error adding product", error: error.message });
            }
            res.status(201).json({ data: newProduct, message: "Product added successfully", error: null });
        });
    };

    if (req.file) {
        uploadImageToImgBB(req.file, (uploadError, imageUrl) => {
            if (uploadError) {
                return res.status(500).json({ data: null, message: "Image upload failed", error: uploadError.message });
            }
            handleCreate(imageUrl);
        });
    } else {
        handleCreate(null); // No image
    }
};

// Update product
export const updateProduct = (req, res) => {
    const { name, description, price, category_id } = req.body;
    const productId = parseInt(req.params.id, 10);

    const handleUpdate = (imageUrl) => {
        Product.update(productId, name, description, price, category_id, imageUrl, (error, success) => {
            if (error) {
                return res.status(500).json({ data: null, message: "Error updating product", error: error.message });
            }
            if (!success) {
                return res.status(404).json({ data: null, message: "Product not found or not updated", error: null });
            }
            res.status(200).json({ data: null, message: "Product updated successfully", error: null });
        });
    };

    if (req.file) {
        uploadImageToImgBB(req.file, (uploadError, imageUrl) => {
            if (uploadError) {
                return res.status(500).json({ data: null, message: "Image upload failed", error: uploadError.message });
            }
            handleUpdate(imageUrl);
        });
    } else {
        // keep previous image (null means no change)
        handleUpdate(null);
    }
};

// Delete product
export const deleteProduct = (req, res) => {
    const productId = parseInt(req.params.id, 10);

    Product.delete(productId, (error, success) => {
        if (error) {
            return res.status(500).json({ data: null, message: "Error deleting product", error: error.message });
        }
        if (!success) {
            return res.status(404).json({ data: null, message: "Product not found", error: null });
        }
        res.status(200).json({ data: null, message: "Product deleted successfully", error: null });
    });
};
