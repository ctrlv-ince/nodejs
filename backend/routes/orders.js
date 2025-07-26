const express = require('express');
const router = express.Router();

// Import database connection and middleware
const db = require('../config/database');
const { validateToken } = require('../middleware/validation');

// Create new order
router.post('/create', validateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { shipping_address, payment_method } = req.body;

        // Get user's cart
        const [cartItems] = await db.execute(
            `SELECT c.quantity, p.id as product_id, p.name, p.price, p.stock_quantity
             FROM cart c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ? AND p.is_active = TRUE`,
            [userId]
        );

        if (cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Calculate total
        const total = cartItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Check stock availability
        for (const item of cartItems) {
            if (item.quantity > item.stock_quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.name}`
                });
            }
        }

        // Start transaction
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Create order
            const [orderResult] = await connection.execute(
                'INSERT INTO orders (user_id, total_amount, shipping_address, payment_method) VALUES (?, ?, ?, ?)',
                [userId, total, shipping_address, payment_method]
            );

            const orderId = orderResult.insertId;

            // Create order items and update stock
            for (const item of cartItems) {
                // Insert order item
                await connection.execute(
                    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.product_id, item.quantity, item.price]
                );

                // Update product stock
                await connection.execute(
                    'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                    [item.quantity, item.product_id]
                );
            }

            // Clear cart
            await connection.execute(
                'DELETE FROM cart WHERE user_id = ?',
                [userId]
            );

            // Commit transaction
            await connection.commit();

            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                order_id: orderId,
                total: total
            });

        } catch (error) {
            // Rollback transaction
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order'
        });
    }
});

// Get user's orders
router.get('/', validateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const [orders] = await db.execute(
            `SELECT id, total_amount, status, shipping_address, payment_method, 
                    created_at, updated_at
             FROM orders 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [userId, parseInt(limit), offset]
        );

        // Get total count
        const [countResult] = await db.execute(
            'SELECT COUNT(*) as total FROM orders WHERE user_id = ?',
            [userId]
        );

        res.json({
            success: true,
            orders: orders,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(countResult[0].total / limit),
                total_items: countResult[0].total,
                items_per_page: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get orders'
        });
    }
});

// Get order details
router.get('/:orderId', validateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const orderId = req.params.orderId;

        // Get order details
        const [orders] = await db.execute(
            `SELECT id, total_amount, status, shipping_address, payment_method, 
                    created_at, updated_at
             FROM orders 
             WHERE id = ? AND user_id = ?`,
            [orderId, userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Get order items
        const [orderItems] = await db.execute(
            `SELECT oi.quantity, oi.price, p.name, p.description, p.image_url
             FROM order_items oi 
             JOIN products p ON oi.product_id = p.id 
             WHERE oi.order_id = ?`,
            [orderId]
        );

        const order = orders[0];
        order.items = orderItems;

        res.json({
            success: true,
            order: order
        });

    } catch (error) {
        console.error('Get order details error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get order details'
        });
    }
});

// Cancel order
router.put('/:orderId/cancel', validateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const orderId = req.params.orderId;

        // Check if order exists and belongs to user
        const [orders] = await db.execute(
            'SELECT status FROM orders WHERE id = ? AND user_id = ?',
            [orderId, userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (orders[0].status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled at this stage'
            });
        }

        // Start transaction
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Update order status
            await connection.execute(
                'UPDATE orders SET status = "cancelled" WHERE id = ?',
                [orderId]
            );

            // Get order items to restore stock
            const [orderItems] = await connection.execute(
                'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
                [orderId]
            );

            // Restore product stock
            for (const item of orderItems) {
                await connection.execute(
                    'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
                    [item.quantity, item.product_id]
                );
            }

            // Commit transaction
            await connection.commit();

            res.json({
                success: true,
                message: 'Order cancelled successfully'
            });

        } catch (error) {
            // Rollback transaction
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel order'
        });
    }
});

// Admin: Update order status
router.put('/:orderId/status', validateToken, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { status } = req.body;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        await db.execute(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, orderId]
        );

        res.json({
            success: true,
            message: 'Order status updated successfully'
        });

    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status'
        });
    }
});

module.exports = router; 