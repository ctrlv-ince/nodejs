// Validation middleware for authentication
const validateRegistration = (req, res, next) => {
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

    const errors = [];

    // Validate first name
    if (!first_name || first_name.trim().length < 2) {
        errors.push('First name must be at least 2 characters long');
    }

    // Validate last name
    if (!last_name || last_name.trim().length < 2) {
        errors.push('Last name must be at least 2 characters long');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
    }

    // Validate phone number
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phone_number || !phoneRegex.test(phone_number.replace(/\s/g, ''))) {
        errors.push('Please enter a valid phone number');
    }

    // Validate age
    if (!age || isNaN(age) || age < 13 || age > 120) {
        errors.push('Age must be between 13 and 120');
    }

    // Validate sex
    if (!sex || !['M', 'F', 'O'].includes(sex)) {
        errors.push('Please select a valid gender option');
    }

    // Validate username
    if (!username || username.length < 3 || username.length > 20) {
        errors.push('Username must be between 3 and 20 characters long');
    }

    // Validate password
    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }

    // Sanitize inputs
    req.body.first_name = first_name.trim();
    req.body.last_name = last_name.trim();
    req.body.email = email.toLowerCase().trim();
    req.body.phone_number = phone_number.trim();
    req.body.age = parseInt(age);
    req.body.username = username.trim().toLowerCase();

    next();
};

const validateLogin = (req, res, next) => {
    const { username, password } = req.body;

    const errors = [];

    // Validate username
    if (!username || username.trim().length === 0) {
        errors.push('Username is required');
    }

    // Validate password
    if (!password || password.length === 0) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }

    // Sanitize inputs
    req.body.username = username.trim();
    req.body.password = password;

    next();
};

// Middleware to validate JWT token
const validateToken = (req, res, next) => {
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

// Middleware to validate product data
const validateProduct = (req, res, next) => {
    const { name, price, stock_quantity, category } = req.body;

    const errors = [];

    // Validate name
    if (!name || name.trim().length < 3) {
        errors.push('Product name must be at least 3 characters long');
    }

    // Validate price
    if (!price || isNaN(price) || price <= 0) {
        errors.push('Price must be a positive number');
    }

    // Validate stock quantity
    if (!stock_quantity || isNaN(stock_quantity) || stock_quantity < 0) {
        errors.push('Stock quantity must be a non-negative number');
    }

    // Validate category
    if (!category || category.trim().length === 0) {
        errors.push('Category is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }

    // Sanitize inputs
    req.body.name = name.trim();
    req.body.price = parseFloat(price);
    req.body.stock_quantity = parseInt(stock_quantity);
    req.body.category = category.trim();

    next();
};

module.exports = {
    validateRegistration,
    validateLogin,
    validateToken,
    validateProduct
}; 