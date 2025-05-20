# 📄 README B*

## 🧠 Project Purpose

This app is designed to help the business owner manage:

- 📝 Orders  
- 👥 Clients  
- 👤 Users  
- 📊 Data  
- 💰 Sales and Stock  
- 📌 Payment Tracking (paid or not)

---

## 🚦 Orders Workflow

1. A client creates a new order.  
2. They upload the order items (files).  
3. Files are saved to **Google Drive** using the Google Drive API (**handled by the backend**).  
4. The **admin and staff** receive a notification on the frontend (a new order has been placed).  
5. An **email or WhatsApp message** is sent to the admin or staff so they don't miss the order.  
6. The **admin or staff** processes the order (updating the status: *in progress*, *cancelled*, etc.).  
7. When the order is completed, it is marked as **completed**.  
8. The **client is notified** via email (WhatsApp will be added later).

---

## 📁 Project Structure

```
src/
├── Components     # Project-specific components; UI components (from shadcn) are in the 'ui' folder.
├── config         # apiConfig.js and axiosConfig.js – axios setup with production URLs.
├── contexts       # AuthContext.jsx – handles authentication context.
├── hooks          # shadcn-related hooks.
├── lib            # shadcn-related utils.
├── Pages          # A bit messy but logically named — feel free to refactor.
├── Services       # Business logic (e.g., OrdersService.js, UsersService.js, CompanyService.js).
│                 # Each service handles API requests for its respective domain.
```



### Core Files

- `App.jsx`  
- `Layout.jsx`  
- `main.jsx`  
- `PrivateRoute.jsx`

### Environment Config

- `.env.local` and `.env.prod` contain URLs for development and production.  
- **You don't need to worry about them — just make sure `apiConfig.js` uses the correct one.**

---

## 👤 User Types

- **ADMIN** – The owner of the print shop  
- **STAFF** – Designers or workers at the print shop  
- **CLIENT** – An employee from a company

---

## 🧾 Data Models You Should Know
User(admin , staff , client)
```js
{
  username: STRING,
  role: ENUM('admin', 'operator', 'client'),
  email: STRING,
  phone_number: STRING,
  password: STRING,
  password2: STRING
}


Company : 

{
  company_name: STRING,
  company_email: EMAIL,
  company_phone: STRING, // Format: +213xxxxxxxxxx
  address: STRING,
  date_joined: DATETIME
}

Order : 

{
  user: INT,            // User ID
  company: INT,         // Company ID
  status: ENUM('pending', 'approved', 'printing', 'completed', 'cancelled'),
  created_at: DATETIME,
  order_number: INT
}

Order Item : 

{
  order: INT,                   // Order ID
  item_name: STRING,
  status: ENUM,                 // e.g. 'uploaded', 'in_progress', etc.
  google_drive_file_id: STRING // ID returned from Google Drive API
}
```

## ps : an order may have multiple orderItems , 



## 📡 API REFERENCE

This section describes how to interact with the backend API for orders, users, companies, and authentication.

All routes are prefixed with:  
`https://domain.com/api/v1/`

Use `AXIOS_CONFIG.get("uri")` or `AXIOS_CONFIG.post("uri", data)`.

---

### 📦 ORDERS

#### ▶️ `GET orders/ordersList/`

- **Description**: Fetch all orders.
- **Response:**
```json
[
  {
    "id": 12,
    "order_number": 3012,
    "status": "pending",
    "user": 4,
    "company": 2,
    "created_at": "2024-12-31T14:22:11Z"
  }
]
```

---

#### ▶️ `GET orders/orderDetails/<order_id>`

- **Description**: Get a single order with full details.
- **Response:**
```json
{
  "id": 12,
  "order_number": 3012,
  "status": "printing",
  "user": 4,
  "company": 2,
  "created_at": "2024-12-31T14:22:11Z",
  "items": [
    {
      "id": 99,
      "item_name": "Flyer Design.pdf",
      "status": "done",
      "google_drive_file_id": "1aBcDxyz"
    }
  ]
}
```

---

#### ▶️ `GET orders/orderItems/`

- **Description**: Get all order items.
- **Response:**
```json
[
  {
    "id": 99,
    "item_name": "Flyer Design.pdf",
    "status": "done",
    "google_drive_file_id": "1aBcDxyz",
    "order": 12
  }
]
```

---

#### ▶️ `GET orders/orderItem/orderItemDetails/<item_id>`

- **Description**: Get details of a single order item.
- **Response:**
```json
{
  "id": 99,
  "item_name": "Flyer Design.pdf",
  "status": "done",
  "google_drive_file_id": "1aBcDxyz",
  "order": 12
}
```

---

#### ▶️ `GET orders/ordersStats/`

- **Description**: Get statistics about orders.
- **Response:**
```json
{
  "pending": 3,
  "approved": 5,
  "printing": 2,
  "completed": 10,
  "cancelled": 1
}
```

---

#### ▶️ `GET orders/download/<file_id>/`

- **Description**: Downloads a file directly from Google Drive.

---

### 🏢 COMPANIES

#### ▶️ `GET companies/companiesList/`

- **Description**: List all companies.
- **Response:**
```json
[
  {
    "id": 2,
    "company_name": "ABC Corp",
    "company_email": "contact@abccorp.com",
    "company_phone": "+213661234567",
    "address": "Algiers, Algeria",
    "date_joined": "2024-12-01T10:12:00Z"
  }
]
```

---

#### ▶️ `GET companies/companyDetails/<company_id>`

- **Description**: Get details of a specific company.
- **Response:**
```json
{
  "id": 2,
  "company_name": "ABC Corp",
  "company_email": "contact@abccorp.com",
  "company_phone": "+213661234567",
  "address": "Algiers, Algeria",
  "date_joined": "2024-12-01T10:12:00Z"
}
```

---

### 👥 USERS

#### ▶️ `GET users/usersList/`

- **Description**: List all users.
- **Response:**
```json
[
  {
    "id": 4,
    "username": "mohamed",
    "email": "mohamed@example.com",
    "phone_number": "+213665554433",
    "role": "client"
  }
]
```

---

#### ▶️ `POST createUser/`

- **Description**: Register a new user.
- **Request:**
```json
{
  "username": "amina",
  "email": "amina@example.com",
  "phone_number": "+213661234567",
  "password": "securepassword",
  "password2": "securepassword",
  "role": "staff"
}
```
- **Response:**
```json
{
  "id": 7,
  "username": "amina",
  "email": "amina@example.com",
  "phone_number": "+213661234567",
  "role": "staff"
}
```

---

### 🔐 AUTHENTICATION

#### ▶️ `POST login/`

- **Request:**
```json
{
  "email": "admin@printshop.com",
  "password": "adminpass"
}
```
- **Response:**
```json
{
  "access": "jwt_token_here",
  "refresh": "refresh_token_here"
}
```

---

#### ▶️ `POST verify/`

- **Description**: Verifies a token.
- **Request:**
```json
{
  "token": "jwt_token_here"
}
```
- **Response:**
```json
{
  "valid": true
}
```

---

#### ▶️ `POST logout/`

- **Description**: Logs the user out by invalidating the refresh token.

---

#### ▶️ `GET role/`

- **Description**: Returns the role of the currently authenticated user.
- **Response:**
```json
{
  "role": "admin"
}
```

