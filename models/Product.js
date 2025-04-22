import connection from "../config/db.js";

const Product = {
    // Create a new product
    create: (name, description, price, category_id, imageUrl, callback) => {
        const query = `
            INSERT INTO Products (name, description, price, category_id, image_url)
            VALUES (?, ?, ?, ?, ?)
        `;
        connection.query(query, [name, description, price, category_id, imageUrl], (error, result) => {
            if (error) return callback(error, null);
            callback(null, { id: result.insertId, name, description, price, category_id, image_url: imageUrl });
        });
    },

    // Update product (optionally update image)
    update: (id, name, description, price, category_id, imageUrl, callback) => {
        let query = `
            UPDATE Products 
            SET name = ?, description = ?, price = ?, category_id = ?
        `;
        const values = [name, description, price, category_id];

        if (imageUrl !== null) {
            query += `, image_url = ?`;
            values.push(imageUrl);
        }

        query += ` WHERE id = ?`;
        values.push(id);

        connection.query(query, values, (error, result) => {
            if (error) return callback(error, null);
            callback(null, result.affectedRows > 0);
        });
    },

    // Get all products
    getAll: (callback) => {
        const query = `SELECT * FROM Products`;
        connection.query(query, (error, rows) => {
            if (error) return callback(error, null);
            callback(null, rows);
        });
    },

    // Get product by ID
    getById: (id, callback) => {
        const query = `SELECT * FROM Products WHERE id = ?`;
        connection.query(query, [id], (error, rows) => {
            if (error) return callback(error, null);
            callback(null, rows.length > 0 ? rows[0] : null);
        });
    },

    // Delete product
    delete: (id, callback) => {
        const query = `DELETE FROM Products WHERE id = ?`;
        connection.query(query, [id], (error, result) => {
            if (error) return callback(error, null);
            callback(null, result.affectedRows > 0);
        });
    }
};

export default Product;
