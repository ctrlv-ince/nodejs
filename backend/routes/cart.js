const express = require('express');
const router = express.Router();

// Import database connection and middleware
const db = require('../config/database');
const { validateToken } = require('../middleware/validation');

// Get user's cart
router.get('/', validateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [cartItems] = await db.execute(
            `SELECT c.id, c.quantity, p.id as product_id, p.name, p.description, 
                    p.price, p.image_url, p.stock_quantity
             FROM cart c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ? AND p.is_active = TRUE`,
            [userId]
        );

        // Calculate total
        const total = cartItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        res.json({
            success: true,
            cart: cartItems,
            total: total,
            item_count: cartItems.length
        });

    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get cart'
        });
    }
});

// Get cart count
router.get('/count', validateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [result] = await db.execute(
            'SELECT COUNT(*) as count FROM cart WHERE user_id = ?',
            [userId]
        );

        res.json({
            success: true,
            count: result[0].count
        });

    } catch (error) {
        console.error('Get cart count error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get cart count'
        });
    }
});

// Add item to cart
router.post('/add', validateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { product_id, quantity = 1 } = req.body;

        // Validate product exists and is active
        const [products] = await db.execute(
            'SELECT * FROM products WHERE id = ? AND is_active = TRUE',
            [product_id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const product = products[0];

        // Check if product is already in cart
        const [existingItems] = await db.execute(
            'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, product_id]
        );

        if (existingItems.length > 0) {
            // Update quantity
            const newQuantity = existingItems[0].quantity + quantity;
            
            if (newQuantity > product.stock_quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Not enough stock available'
                });
            }

            await db.execute(
                'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
                [newQuantity, userId, product_id]
            );
        } else {
            // Add new item to cart
            if (quantity > product.stock_quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Not enough stock available'
                });
            }

            await db.execute(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [userId, product_id, quantity]
            );
        }

        res.json({
            success: true,
            message: 'Item added to cart successfully'
        });

    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add item to cart'
        });
    }
});

// Update cart item quantity
router.put('/update/:productId', validateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const productId = req.params.productId;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }

        // Check product stock
        const [products] = await db.execute(
            'SELECT stock_quantity FROM products WHERE id = ? AND is_active = TRUE',
            [productId]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (quantity > products[0].stock_quantity) {
            return res.status(400).json({
                success: false,
                message: 'Not enough stock available'
            });
        }

        // Update quantity
        await db.execute(
            'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
            [quantity, userId, productId]
        );

        res.json({
            success: true,
            message: 'Cart updated successfully'
        });

    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update cart'
        });
    }
});

// Remove item from cart
router.delete('/remove/:productId', validateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const productId = req.params.productId;

        await db.execute(
            'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        res.json({
            success: true,
            message: 'Item removed from cart successfully'
        });

    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove item from cart'
        });
    }
});

// Clear cart
router.delete('/clear', validateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        await db.execute(
            'DELETE FROM cart WHERE user_id = ?',
            [userId]
        );

        res.json({
            success: true,
            message: 'Cart cleared successfully'
        });

    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clear cart'
        });
    }
});

module.exports = router; 