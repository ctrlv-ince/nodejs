# Bit & Board Backend API

A complete Express.js backend API for the Bit & Board electronics shop.

## 🚀 Features

- **Authentication System** - JWT-based login/register with bcrypt password hashing
- **User Management** - Profile updates, account deactivation
- **Product Management** - CRUD operations for electronics products
- **Shopping Cart** - Add, update, remove items with stock validation
- **Order System** - Complete order processing with transaction support
- **File Uploads** - Avatar and product image uploads with multer
- **Database** - MySQL with connection pooling and automatic table creation

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MySQL connection and table initialization
├── middleware/
│   └── validation.js        # Input validation and JWT verification
├── routes/
│   ├── auth.js             # Authentication routes (login, register, logout)
│   ├── users.js            # User profile and account management
│   ├── products.js         # Product CRUD operations
│   ├── cart.js             # Shopping cart functionality
│   └── orders.js           # Order processing and management
├── uploads/                 # File upload directory
├── server.js               # Main Express server
├── package.json            # Dependencies and scripts
├── env.example             # Environment variables template
└── README.md              # This file
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   PORT=4000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=nodejs_project
   JWT_SECRET=your_secret_key_here
   ```

4. **Set up MySQL database**
   - Create a MySQL database named `nodejs_project`
   - The server will automatically create tables on startup

5. **Create uploads directory**
   ```bash
   mkdir uploads
   mkdir uploads/avatars
   ```

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:4000`

## 📊 API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh-token` - Refresh JWT token
- `GET /profile` - Get current user profile

### Users (`/api/v1/users`)
- `GET /profile` - Get user profile
- `POST /update-profile` - Update user profile
- `DELETE /deactivate` - Deactivate account
- `GET /orders` - Get user orders
- `GET /orders/:orderId` - Get order details

### Products (`/api/v1/products`)
- `GET /` - Get all products (with pagination, search, filters)
- `GET /:id` - Get product by ID
- `GET /categories/list` - Get product categories
- `GET /featured/list` - Get featured products
- `POST /` - Create new product (admin)
- `PUT /:id` - Update product (admin)
- `DELETE /:id` - Delete product (admin)

### Cart (`/api/v1/cart`)
- `GET /` - Get user's cart
- `GET /count` - Get cart item count
- `POST /add` - Add item to cart
- `PUT /update/:productId` - Update cart item quantity
- `DELETE /remove/:productId` - Remove item from cart
- `DELETE /clear` - Clear cart

### Orders (`/api/v1/orders`)
- `POST /create` - Create new order
- `GET /` - Get user's orders
- `GET /:orderId` - Get order details
- `PUT /:orderId/cancel` - Cancel order
- `PUT /:orderId/status` - Update order status (admin)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login** - Returns JWT token
2. **Protected Routes** - Include `Authorization: Bearer <token>` header
3. **Token Expiry** - Configurable via `JWT_EXPIRES_IN` environment variable

## 🗄️ Database Schema

The server automatically creates these tables:

- **users** - User personal information
- **accounts** - User authentication data
- **products** - Product catalog
- **cart** - Shopping cart items
- **orders** - Order information
- **order_items** - Order line items

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 4000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | MySQL host | localhost |
| `DB_USER` | MySQL username | root |
| `DB_PASSWORD` | MySQL password | (empty) |
| `DB_NAME` | Database name | nodejs_project |
| `DB_PORT` | MySQL port | 3306 |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRES_IN` | Token expiry | 24h |

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["validation errors"]
}
```

## 🧪 Testing

Test the API endpoints using tools like:
- **Postman**
- **Insomnia**
- **cURL**

### Example: Login Request
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Comprehensive request validation
- **SQL Injection Protection** - Parameterized queries
- **CORS Configuration** - Cross-origin request handling
- **File Upload Security** - File type and size validation

## 🚀 Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set strong `JWT_SECRET`
4. Use PM2 or similar process manager
5. Set up reverse proxy (nginx)

## 📞 Support

For issues or questions, please check the logs or create an issue in the repository. 