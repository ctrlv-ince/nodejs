const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Import database connection and models
const db = require('../config/database');
const { validateRegistration, validateLogin } = require('./validation');

// Register new user
router.post('/register', validateRegistration, async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            phone_number,
            age,
            sex,
            username,
            password
        } = req.body;

        // Check if username already exists
        const [existingUser] = await db.execute(
            'SELECT id FROM accounts WHERE username = ?',
            [username]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }

        // Check if email already exists
        const [existingEmail] = await db.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingEmail.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert into users table first
        const [userResult] = await db.execute(
            'INSERT INTO users (first_name, last_name, email, phone_number, age, sex) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, phone_number, age, sex]
        );

        const userId = userResult.insertId;

        // Insert into accounts table
        await db.execute(
            'INSERT INTO accounts (user_id, username, password) VALUES (?, ?, ?)',
            [userId, username, hashedPassword]
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful! Welcome to Bit & Board',
            user: {
                id: userId,
                username: username,
                email: email,
                first_name: first_name,
                last_name: last_name
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
});

// Login user
router.post('/login', validateLogin, async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const [users] = await db.execute(
            `SELECT a.id, a.username, a.password, a.user_id, 
                    u.first_name, u.last_name, u.email, u.phone_number, u.age, u.sex
             FROM accounts a 
             JOIN users u ON a.user_id = u.id 
             WHERE a.username = ?`,
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        const user = users[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.user_id,
                username: user.username,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        // Remove password from response
        delete user.password;

        res.json({
            success: true,
            message: 'Login successful!',
            token: token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone_number: user.phone_number,
                age: user.age,
                sex: user.sex
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
        });
    }
});

// Logout user
router.post('/logout', async (req, res) => {
    try {
        // In a real application, you might want to blacklist the token
        // For now, we'll just return success as the client will clear the token
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
});

// Refresh token
router.post('/refresh-token', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify current token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Generate new token
        const newToken = jwt.sign(
            {
                userId: decoded.userId,
                username: decoded.username,
                email: decoded.email
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            success: true,
            token: newToken
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

// Get current user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const [users] = await db.execute(
            `SELECT u.id, u.first_name, u.last_name, u.email, u.phone_number, u.age, u.sex,
                    a.username
             FROM users u 
             JOIN accounts a ON u.id = a.user_id 
             WHERE u.id = ?`,
            [req.user.userId]
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

module.exports = router; 