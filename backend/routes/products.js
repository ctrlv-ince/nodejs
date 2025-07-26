const express = require('express');
const router = express.Router();

// Import database connection and middleware
const db = require('../config/database');
const { validateToken } = require('../middleware/validation');

// Get all products
router.get('/', async (req, res) => {
    try {
        const { category, search, page = 1, limit = 12 } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM products WHERE is_active = TRUE';
        let params = [];

        // Add category filter
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        // Add search filter
        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm);
        }

        // Add pagination
        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [products] = await db.execute(query, params);

        // Get total count for pagination
        let countQuery = 'SELECT COUNT(*) as total FROM products WHERE is_active = TRUE';
        let countParams = [];

        if (category) {
            countQuery += ' AND category = ?';
            countParams.push(category);
        }

        if (search) {
            countQuery += ' AND (name LIKE ? OR description LIKE ?)';
            const searchTerm = `%${search}%`;
            countParams.push(searchTerm, searchTerm);
        }

        const [countResult] = await db.execute(countQuery, countParams);
        const total = countResult[0].total;

        res.json({
            success: true,
            products: products,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(total / limit),
                total_items: total,
                items_per_page: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get products'
        });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        const [products] = await db.execute(
            'SELECT * FROM products WHERE id = ? AND is_active = TRUE',
            [productId]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            product: products[0]
        });

    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get product'
        });
    }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
    try {
        const [categories] = await db.execute(
            'SELECT DISTINCT category FROM products WHERE is_active = TRUE ORDER BY category'
        );

        res.json({
            success: true,
            categories: categories.map(cat => cat.category)
        });

    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get categories'
        });
    }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
    try {
        const [products] = await db.execute(
            'SELECT * FROM products WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 8'
        );

        res.json({
            success: true,
            products: products
        });

    } catch (error) {
        console.error('Get featured products error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get featured products'
        });
    }
});

// Admin: Create new product (requires authentication)
router.post('/', validateToken, async (req, res) => {
    try {
        const { name, description, price, stock_quantity, category, image_url } = req.body;

        const [result] = await db.execute(
            'INSERT INTO products (name, description, price, stock_quantity, category, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, stock_quantity, category, image_url]
        );

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product_id: result.insertId
        });

    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create product'
        });
    }
});

// Admin: Update product (requires authentication)
router.put('/:id', validateToken, async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, stock_quantity, category, image_url } = req.body;

        await db.execute(
            'UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ?, category = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [name, description, price, stock_quantity, category, image_url, productId]
        );

        res.json({
            success: true,
            message: 'Product updated successfully'
        });

    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update product'
        });
    }
});

// Admin: Delete product (requires authentication)
router.delete('/:id', validateToken, async (req, res) => {
    try {
        const productId = req.params.id;

        await db.execute(
            'UPDATE products SET is_active = FALSE WHERE id = ?',
            [productId]
        );

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product'
        });
    }
});

module.exports = router; 