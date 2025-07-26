const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Import database connection and middleware
const db = require('../config/database');
const { validateToken } = require('../middleware/validation');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatars/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Update user profile
router.post('/update-profile', validateToken, upload.single('avatar'), async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            first_name,
            last_name,
            email,
            phone_number,
            age,
            sex
        } = req.body;

        // Update user information
        await db.execute(
            `UPDATE users SET 
                first_name = ?, 
                last_name = ?, 
                email = ?, 
                phone_number = ?, 
                age = ?, 
                sex = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [first_name, last_name, email, phone_number, age, sex, userId]
        );

        // If avatar was uploaded, update the avatar field
        if (req.file) {
            const avatarUrl = `/uploads/avatars/${req.file.filename}`;
            // You might want to store this in a separate user_profiles table
            // For now, we'll just return the file path
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            avatar: req.file ? `/uploads/avatars/${req.file.filename}` : null
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile. Please try again.'
        });
    }
});

// Deactivate user account
router.delete('/deactivate', validateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Deactivate the account
        await db.execute(
            'UPDATE accounts SET is_active = FALSE WHERE user_id = ?',
            [userId]
        );

        res.json({
            success: true,
            message: 'Account deactivated successfully'
        });

    } catch (error) {
        console.error('Account deactivation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to deactivate account. Please try again.'
        });
    }
});

// Get user profile
router.get('/profile', validateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [users] = await db.execute(
            `SELECT u.id, u.first_name, u.last_name, u.email, u.phone_number, u.age, u.sex,
                    a.username, a.is_active
             FROM users u 
             JOIN accounts a ON u.id = a.user_id 
             WHERE u.id = ?`,
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile'
        });
    }
});

// Get user orders
router.get('/orders', validateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [orders] = await db.execute(
            `SELECT o.id, o.total_amount, o.status, o.shipping_address, 
                    o.payment_method, o.created_at, o.updated_at
             FROM orders o 
             WHERE o.user_id = ? 
             ORDER BY o.created_at DESC`,
            [userId]
        );

        res.json({
            success: true,
            orders: orders
        });

    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get orders'
        });
    }
});

// Get user order details
router.get('/orders/:orderId', validateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const orderId = req.params.orderId;

        // Get order details
        const [orders] = await db.execute(
            `SELECT o.id, o.total_amount, o.status, o.shipping_address, 
                    o.payment_method, o.created_at, o.updated_at
             FROM orders o 
             WHERE o.id = ? AND o.user_id = ?`,
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

module.exports = router; 