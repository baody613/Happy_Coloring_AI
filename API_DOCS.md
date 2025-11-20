# API Documentation

## Base URL
```
Development: http://localhost:5000
Production: https://your-api-domain.com
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <firebase_id_token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "uid": "abc123",
    "email": "user@example.com",
    "displayName": "John Doe"
  }
}
```

#### Get User Profile
```http
GET /api/auth/profile/:uid
Authorization: Bearer <token>
```

---

### Products

#### Get All Products
```http
GET /api/products?category=animals&limit=20&page=1
```

**Query Parameters:**
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `limit` (optional): Items per page (default: 20)
- `page` (optional): Page number (default: 1)

**Response (200):**
```json
{
  "products": [
    {
      "id": "prod123",
      "title": "Cute Cat Painting",
      "description": "Beautiful cat paint by numbers",
      "category": "animals",
      "price": 299000,
      "imageUrl": "https://...",
      "thumbnailUrl": "https://...",
      "difficulty": "medium",
      "dimensions": "40x50cm",
      "colors": 24,
      "status": "active",
      "sales": 150,
      "rating": 4.5,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1
}
```

#### Get Single Product
```http
GET /api/products/:id
```

#### Create Product (Protected)
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Mountain Landscape",
  "description": "Beautiful mountain scenery",
  "category": "landscapes",
  "price": 349000,
  "imageUrl": "https://...",
  "thumbnailUrl": "https://...",
  "difficulty": "hard",
  "dimensions": "50x60cm",
  "colors": 36
}
```

#### Update Product (Protected)
```http
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 399000,
  "status": "active"
}
```

#### Delete Product (Protected)
```http
DELETE /api/products/:id
Authorization: Bearer <token>
```

---

### AI Generation

#### Generate Paint-by-Numbers (Protected)
```http
POST /api/generate/paint-by-numbers
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "A cute cat sitting on a window",
  "style": "realistic",
  "complexity": "medium"
}
```

**Parameters:**
- `prompt` (required): Description of the image
- `style` (optional): "realistic" | "anime" | "cartoon" | "abstract" (default: "realistic")
- `complexity` (optional): "easy" | "medium" | "hard" (default: "medium")

**Response (202):**
```json
{
  "message": "Generation started",
  "generationId": "gen123",
  "status": "processing"
}
```

#### Check Generation Status (Protected)
```http
GET /api/generate/status/:generationId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "gen123",
  "userId": "user123",
  "prompt": "A cute cat sitting on a window",
  "style": "realistic",
  "complexity": "medium",
  "status": "completed",
  "imageUrl": "https://storage.googleapis.com/...",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "completedAt": "2025-01-01T00:05:00.000Z"
}
```

**Status Values:**
- `processing`: Generation in progress
- `completed`: Generation successful
- `failed`: Generation failed

---

### Orders

#### Create Order (Protected)
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "product": {
        "id": "prod123",
        "title": "Cute Cat",
        "price": 299000
      },
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "0123456789",
    "address": "123 Street",
    "city": "Ho Chi Minh",
    "district": "District 1",
    "ward": "Ward 1"
  },
  "totalAmount": 598000,
  "paymentMethod": "cod"
}
```

**Response (201):**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "order123",
    "userId": "user123",
    "items": [...],
    "shippingAddress": {...},
    "totalAmount": 598000,
    "paymentMethod": "cod",
    "status": "pending",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### Get User Orders (Protected)
```http
GET /api/orders/user/:userId
Authorization: Bearer <token>
```

#### Get Single Order (Protected)
```http
GET /api/orders/:orderId
Authorization: Bearer <token>
```

#### Update Order Status (Protected)
```http
PUT /api/orders/:orderId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shipped"
}
```

**Status Values:**
- `pending`: Order placed
- `processing`: Order being prepared
- `shipped`: Order shipped
- `delivered`: Order delivered
- `cancelled`: Order cancelled

---

### Users

#### Get User Profile (Protected)
```http
GET /api/users/:userId
Authorization: Bearer <token>
```

#### Update User Profile (Protected)
```http
PUT /api/users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "John Smith",
  "phoneNumber": "0987654321",
  "address": {
    "street": "456 Avenue",
    "city": "Hanoi"
  }
}
```

#### Add to Favorites (Protected)
```http
POST /api/users/:userId/favorites/:productId
Authorization: Bearer <token>
```

#### Remove from Favorites (Protected)
```http
DELETE /api/users/:userId/favorites/:productId
Authorization: Bearer <token>
```

---

## Error Responses

All endpoints may return these error formats:

**400 Bad Request:**
```json
{
  "error": "Email and password are required"
}
```

**401 Unauthorized:**
```json
{
  "error": "No token provided"
}
```

**403 Forbidden:**
```json
{
  "error": "Unauthorized"
}
```

**404 Not Found:**
```json
{
  "error": "Product not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- AI Generation: Limited by Replicate API quota

## CORS

Allowed origins:
- Development: `http://localhost:3000`
- Production: Your frontend domain
