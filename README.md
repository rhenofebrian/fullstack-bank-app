### CBank API Documentation

This document provides a comprehensive guide to the CBank API, detailing all available endpoints, request methods, required parameters, and response formats.

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Transfers](#transfers)
4. [Admin Operations](#admin-operations)
5. [Chatbot](#chatbot)

## Base URL

All API endpoints are relative to the base URL: `http://localhost:5000/api`

## Authentication

### Register a New User

Creates a new user account with an initial balance of 1,000,000 IDR.

- **URL**: `/auth/register`
- **Method**: `POST`
- **Authentication**: None

**Request Body**:

```json
{
  "fullName": "User Name",
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Success Response (201 Created)**:

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullName": "User Name",
    "email": "user@example.com",
    "balance": 1000000
  }
}
```

**Error Response (400 Bad Request)**:

```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### Login User

Authenticates a user and returns a JWT token.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Authentication**: None

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Success Response (200 OK)**:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullName": "User Name",
    "email": "user@example.com",
    "balance": 1000000
  }
}
```

**Error Response (401 Unauthorized)**:

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Get Current User

Retrieves the profile of the currently authenticated user.

- **URL**: `/auth/me`
- **Method**: `GET`
- **Authentication**: JWT Token (Bearer)

**Success Response (200 OK)**:

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "fullName": "User Name",
    "email": "user@example.com",
    "balance": 1000000
  }
}
```

**Error Response (401 Unauthorized)**:

```json
{
  "success": false,
  "message": "Access denied. No token provided"
}
```

### Update User Profile

Updates the profile information of the authenticated user.

- **URL**: `/auth/profile`
- **Method**: `PUT`
- **Authentication**: JWT Token (Bearer)

**Request Body**:

```json
{
  "fullName": "Updated Name"
}
```

**Success Response (200 OK)**:

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "fullName": "Updated Name",
    "email": "user@example.com",
    "balance": 1000000
  }
}
```

**Error Response (404 Not Found)**:

```json
{
  "success": false,
  "message": "User not found"
}
```

## Transfers

### Transfer Funds

Transfers funds from the authenticated user to another user.

- **URL**: `/transfers`
- **Method**: `POST`
- **Authentication**: JWT Token (Bearer)

**Request Body**:

```json
{
  "recipientEmail": "recipient@example.com",
  "amount": 50000,
  "description": "Payment for services"
}
```

**Success Response (200 OK)**:

```json
{
  "success": true,
  "message": "Transfer completed successfully",
  "transaction": {
    "userId": "sender_id",
    "amount": 50000,
    "type": "withdrawal",
    "description": "Transfer to recipient@example.com",
    "status": "completed",
    "relatedUserId": "recipient_id",
    "_id": "transaction_id",
    "createdAt": "2023-08-24T12:34:56.789Z",
    "updatedAt": "2023-08-24T12:34:56.789Z"
  },
  "newBalance": 950000
}
```

**Error Response (400 Bad Request)**:

```json
{
  "success": false,
  "message": "Insufficient balance"
}
```

**Error Response (404 Not Found)**:

```json
{
  "success": false,
  "message": "Recipient not found"
}
```

### Get Transfer History

Retrieves the transfer history for the authenticated user.

- **URL**: `/transfers/history`
- **Method**: `GET`
- **Authentication**: JWT Token (Bearer)

**Success Response (200 OK)**:

```json
{
  "success": true,
  "count": 2,
  "transactions": [
    {
      "_id": "transaction_id_1",
      "userId": "user_id",
      "amount": 50000,
      "type": "withdrawal",
      "description": "Transfer to recipient@example.com",
      "status": "completed",
      "relatedUserId": {
        "_id": "recipient_id",
        "fullName": "Recipient Name",
        "email": "recipient@example.com"
      },
      "createdAt": "2023-08-24T12:34:56.789Z",
      "updatedAt": "2023-08-24T12:34:56.789Z"
    },
    {
      "_id": "transaction_id_2",
      "userId": "user_id",
      "amount": 25000,
      "type": "deposit",
      "description": "Transfer from sender@example.com",
      "status": "completed",
      "relatedUserId": {
        "_id": "sender_id",
        "fullName": "Sender Name",
        "email": "sender@example.com"
      },
      "createdAt": "2023-08-23T10:11:12.789Z",
      "updatedAt": "2023-08-23T10:11:12.789Z"
    }
  ]
}
```

## Admin Operations

### Admin Login

Authenticates an admin user.

- **URL**: `/admin/login`
- **Method**: `POST`
- **Authentication**: None

**Request Body**:

```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

**Success Response (200 OK)**:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "admin": {
    "id": "admin_id",
    "fullName": "Admin Name",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Error Response (401 Unauthorized)**:

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Get All Users

Retrieves a list of all users (admin only).

- **URL**: `/admin/users`
- **Method**: `GET`
- **Authentication**: Admin JWT Token (Bearer)

**Success Response (200 OK)**:

```json
{
  "success": true,
  "count": 2,
  "users": [
    {
      "_id": "user_id_1",
      "fullName": "User One",
      "email": "user1@example.com",
      "balance": 950000,
      "createdAt": "2023-08-20T10:00:00.000Z",
      "updatedAt": "2023-08-24T12:34:56.789Z"
    },
    {
      "_id": "user_id_2",
      "fullName": "User Two",
      "email": "user2@example.com",
      "balance": 1050000,
      "createdAt": "2023-08-21T11:00:00.000Z",
      "updatedAt": "2023-08-24T12:34:56.789Z"
    }
  ]
}
```

**Error Response (401 Unauthorized)**:

```json
{
  "success": false,
  "message": "Access denied. Not an admin"
}
```

### Get User by ID

Retrieves a specific user by ID (admin only).

- **URL**: `/admin/users/:id`
- **Method**: `GET`
- **Authentication**: Admin JWT Token (Bearer)

**Success Response (200 OK)**:

```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "fullName": "User Name",
    "email": "user@example.com",
    "balance": 950000,
    "createdAt": "2023-08-20T10:00:00.000Z",
    "updatedAt": "2023-08-24T12:34:56.789Z"
  }
}
```

**Error Response (404 Not Found)**:

```json
{
  "success": false,
  "message": "User not found"
}
```

### Add Balance to User

Adds balance to a user's account (admin only).

- **URL**: `/admin/users/add-balance`
- **Method**: `POST`
- **Authentication**: Admin JWT Token (Bearer)

**Request Body**:

```json
{
  "userId": "user_id",
  "amount": 100000,
  "description": "Bonus credit"
}
```

**Success Response (200 OK)**:

```json
{
  "success": true,
  "message": "Balance added successfully",
  "transaction": {
    "userId": "user_id",
    "adminId": "admin_id",
    "amount": 100000,
    "type": "deposit",
    "description": "Bonus credit",
    "status": "completed",
    "_id": "transaction_id",
    "createdAt": "2023-08-24T14:00:00.000Z",
    "updatedAt": "2023-08-24T14:00:00.000Z"
  },
  "newBalance": 1050000
}
```

**Error Response (404 Not Found)**:

```json
{
  "success": false,
  "message": "User not found"
}
```

### Update User

Updates a user's information (admin only).

- **URL**: `/admin/users/:id`
- **Method**: `PUT`
- **Authentication**: Admin JWT Token (Bearer)

**Request Body**:

```json
{
  "fullName": "Updated User Name",
  "email": "updated@example.com"
}
```

**Success Response (200 OK)**:

```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "_id": "user_id",
    "fullName": "Updated User Name",
    "email": "updated@example.com",
    "balance": 950000,
    "createdAt": "2023-08-20T10:00:00.000Z",
    "updatedAt": "2023-08-24T15:00:00.000Z"
  }
}
```

**Error Response (404 Not Found)**:

```json
{
  "success": false,
  "message": "User not found"
}
```

**Error Response (400 Bad Request)**:

```json
{
  "success": false,
  "message": "Email is already in use"
}
```

### Delete User

Deletes a user and all associated data (admin only).

- **URL**: `/admin/users/:id`
- **Method**: `DELETE`
- **Authentication**: Admin JWT Token (Bearer)

**Success Response (200 OK)**:

```json
{
  "success": true,
  "message": "User and associated data deleted successfully"
}
```

**Error Response (404 Not Found)**:

```json
{
  "success": false,
  "message": "User not found"
}
```

### Get Transactions

Retrieves transaction history, optionally filtered by user (admin only).

- **URL**: `/admin/transactions`
- **Method**: `GET`
- **Authentication**: Admin JWT Token (Bearer)
- **Query Parameters**: `userId` (optional)

**Success Response (200 OK)**:

```json
{
  "success": true,
  "count": 3,
  "transactions": [
    {
      "_id": "transaction_id_1",
      "userId": {
        "_id": "user_id_1",
        "fullName": "User One",
        "email": "user1@example.com"
      },
      "adminId": {
        "_id": "admin_id",
        "fullName": "Admin Name",
        "email": "admin@example.com"
      },
      "amount": 100000,
      "type": "deposit",
      "description": "Bonus credit",
      "status": "completed",
      "createdAt": "2023-08-24T14:00:00.000Z",
      "updatedAt": "2023-08-24T14:00:00.000Z"
    },
    {
      "_id": "transaction_id_2",
      "userId": {
        "_id": "user_id_1",
        "fullName": "User One",
        "email": "user1@example.com"
      },
      "amount": 50000,
      "type": "withdrawal",
      "description": "Transfer to user2@example.com",
      "status": "completed",
      "relatedUserId": {
        "_id": "user_id_2",
        "fullName": "User Two",
        "email": "user2@example.com"
      },
      "createdAt": "2023-08-24T12:34:56.789Z",
      "updatedAt": "2023-08-24T12:34:56.789Z"
    },
    {
      "_id": "transaction_id_3",
      "userId": {
        "_id": "user_id_2",
        "fullName": "User Two",
        "email": "user2@example.com"
      },
      "amount": 50000,
      "type": "deposit",
      "description": "Transfer from user1@example.com",
      "status": "completed",
      "relatedUserId": {
        "_id": "user_id_1",
        "fullName": "User One",
        "email": "user1@example.com"
      },
      "createdAt": "2023-08-24T12:34:56.789Z",
      "updatedAt": "2023-08-24T12:34:56.789Z"
    }
  ]
}
```

### Create Admin

Creates a new admin user (super admin only).

- **URL**: `/admin/create`
- **Method**: `POST`
- **Authentication**: Super Admin JWT Token (Bearer)

**Request Body**:

```json
{
  "fullName": "New Admin",
  "email": "newadmin@example.com",
  "password": "adminpassword",
  "role": "admin"
}
```

**Success Response (201 Created)**:

```json
{
  "success": true,
  "message": "Admin created successfully",
  "admin": {
    "id": "new_admin_id",
    "fullName": "New Admin",
    "email": "newadmin@example.com",
    "role": "admin"
  }
}
```

**Error Response (400 Bad Request)**:

```json
{
  "success": false,
  "message": "Admin with this email already exists"
}
```

**Error Response (403 Forbidden)**:

```json
{
  "success": false,
  "message": "Access denied. Super admin required"
}
```

### Setup First Admin (Initial Setup)

Creates the first admin user (only for initial setup).

- **URL**: `/admin/setup-first-admin`
- **Method**: `POST`
- **Authentication**: None (should be disabled in production)

**Request Body**:

```json
{
  "fullName": "Super Admin",
  "email": "superadmin@example.com",
  "password": "superadminpassword",
  "role": "super_admin"
}
```

**Success Response (201 Created)**:

```json
{
  "success": true,
  "message": "Admin created successfully",
  "admin": {
    "id": "admin_id",
    "fullName": "Super Admin",
    "email": "superadmin@example.com",
    "role": "super_admin"
  }
}
```

## Chatbot

### Send Chat Message

Sends a message to the chatbot and receives a response.

- **URL**: `/chat`
- **Method**: `POST`
- **Authentication**: None (but requires userId)

**Request Body**:

```json
{
  "userId": "user_id",
  "message": "What are your interest rates?",
  "useNLP": true
}
```

**Success Response (200 OK)**:

```json
{
  "response": "Suku bunga di Cbank bervariasi tergantung produk:\n\n• Tabungan reguler: 2.5% per tahun\n• Deposito: 3.5% - 5.5% tergantung tenor\n• KPR: mulai dari 7.5% per tahun\n• KTA: mulai dari 9.5% per tahun\n• Kartu Kredit: 2.25% per bulan\n\nSilakan kunjungi website resmi kami atau hubungi customer service untuk informasi terbaru dan penawaran khusus.",
  "chatId": "chat_id"
}
```

**Error Response (400 Bad Request)**:

```json
{
  "errors": [
    {
      "msg": "userId is required",
      "param": "userId",
      "location": "body"
    }
  ]
}
```

### Submit Feedback

Submits feedback for a chat interaction.

- **URL**: `/feedback`
- **Method**: `POST`
- **Authentication**: None (but requires userId)

**Request Body**:

```json
{
  "userId": "user_id",
  "chatId": "chat_id",
  "rating": 4,
  "comment": "Very helpful response about interest rates!"
}
```

**Success Response (200 OK)**:

```json
{
  "success": true
}
```

### Request Support

Sends a support request to customer service.

- **URL**: `/support`
- **Method**: `POST`
- **Authentication**: None (but requires userId)

**Request Body**:

```json
{
  "userId": "user_id",
  "message": "I need help with my account",
  "phoneNumber": "6281234567890"
}
```

**Success Response (200 OK)**:

```json
{
  "success": true,
  "requestId": "support_request_id"
}
```

## Authentication Headers

For protected endpoints, include the JWT token in the Authorization header:

```plaintext
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Error Handling

All API endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "requestId": "unique_request_id",
  "stack": "Stack trace (only in development mode)"
}
```

Common HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

## Rate Limiting

The API implements rate limiting to prevent abuse:

- General API endpoints: 100 requests per 15 minutes per IP
- Chat endpoints: 20 requests per minute per IP

When rate limit is exceeded, the API returns:

```json
{
  "error": "Terlalu banyak permintaan, coba lagi nanti"
}
```
