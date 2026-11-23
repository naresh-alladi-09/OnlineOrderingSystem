# 🍕 EasyDine — Full-Stack MERN Online Food Ordering System

EasyDine is a modern, responsive, multi-restaurant food delivery platform for Bhimavaram engineered with the **MERN Stack** (MongoDB, Express.js, React, Node.js) and styled with **Tailwind CSS**.

---

## 🌟 Key Features

### 🛒 1. Customer Food Discovery & Ordering
- **Multi-Restaurant Marketplace**: Browse multiple partner kitchens (Italian Pizza, Gourmet Burgers, Asian Wok & Dim Sum, Dum Biryanis, Japanese Sushi & Ramen, Organic Bowls).
- **Menu Filtering & Search**: Instant search by dish or restaurant, filter by cuisine, and one-click **Vegetarian Only** toggle.
- **Restaurant-Aware Cart**: Real-time quantity adjustment, customizable cooking notes, and restaurant conflict protection.
- **Promo Discount Engine**: Built-in coupons (`FEAST20` for 20% off, `FREESHIP` for free delivery, `SAVE5` for $5 off).
- **Flexible Checkout**: Multiple payment options (Cash on Delivery, Credit/Debit card simulation, UPI/QR code).

### 🚀 2. Live Order Tracking & Simulator
- **Visual 5-Stage Status Pipeline**:
  1. `Placed` (Order Received)
  2. `Confirmed` (Restaurant Accepted)
  3. `Preparing` (Chef Cooking in Kitchen)
  4. `Out for Delivery` (Rider on the Way)
  5. `Delivered` (Doorstep Arrival)
- **Interactive Delivery Simulator**: Click **"Advance to Next Stage"** on the tracking screen to watch the order progress live through every stage without waiting!
- **Delivery Partner Info**: Shows rider's name, scooter/bike number, and call button.
- **Live Auto-Sync**: Order status updates automatically every few seconds.

### 🛡️ 3. Admin & Restaurant Operations Dashboard
- **Analytics KPIs**: Live revenue, total orders placed, active restaurants, and menu dishes.
- **Live Dispatch Center**: Change any order's status (`Placed` ➔ `Confirmed` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered`) with immediate sync to the customer tracking page.
- **Menu & Dish Management**: Add new restaurants, create food items with images, pricing, and category tags, and delete items.

### 💾 4. Resilient Dual-Mode Data Layer
- **Seamless MongoDB Atlas & Local MongoDB Support**: Connect your MongoDB Atlas connection URI in `backend/.env`.
- **Automatic In-Memory Fallback**: If MongoDB is not yet running or configured, the backend automatically runs with a robust in-memory persistence layer with pre-seeded restaurants, dishes, and demo users. **Zero setup friction!**

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher, tested on Node v24)
- **npm** (v9 or higher)

### 2. Start the Backend API Server
Open a terminal in the project directory:
```bash
cd backend
npm start
```
The backend server runs at: `http://localhost:5000`

### 3. Start the Frontend React Client
Open a second terminal in the project directory:
```bash
cd frontend
npm run dev
```
Open your browser and navigate to: `http://localhost:5173`

---

## 🔑 Demo Accounts (Quick Fill Available in Login Modal)

You can click the **"Customer"** or **"Admin"** quick-fill buttons inside the Sign In modal:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@feastify.com` | `admin123` | Full access to Admin Dashboard, Dispatch Queue, Menu Management & Customer Ordering |
| **Customer** | `user@feastify.com` | `user123` | Browse, Cart, Checkout, Order Tracking, and Order History |

---

## 🏷️ Test Coupons Available at Checkout

- **`FEAST20`** — 20% discount on entire food subtotal.
- **`FREESHIP`** — 100% Free doorstep delivery.
- **`SAVE5`** — Flat $5 discount on orders over $20.

---

## 🍃 MongoDB Atlas Configuration (Optional)

To connect your MongoDB Atlas cloud database:

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Obtain your connection URI: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/feastify?retryWrites=true&w=majority`
3. Open `backend/.env` and update `MONGODB_URI`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/feastify?retryWrites=true&w=majority
   JWT_SECRET=feastify_super_secure_jwt_secret_key_2026
   ```
4. Restart the backend server. The app will automatically connect to MongoDB Atlas!
5. To populate MongoDB Atlas with initial restaurants and menu items, send a POST request to:
   ```bash
   curl -X POST http://localhost:5000/api/seed
   ```

---

## 📂 Project Architecture

```
online-food-ordering-system/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection & fallback detection
│   │   ├── controllers/     # Auth, Restaurants, Dishes, Orders, Admin
│   │   ├── middleware/      # JWT auth verification & role gates
│   │   ├── models/          # User, Restaurant, Dish, Order schemas
│   │   ├── data/            # Realistic seed datasets & mock store
│   │   ├── routes/          # Express REST API routes
│   │   └── server.js        # Main Express application entrypoint
│   ├── .env
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Footer, RestaurantCard, DishCard, CartDrawer, LoginModal
│   │   ├── context/         # AuthContext (JWT) & CartContext (Cart state & coupons)
│   │   ├── pages/           # Home, RestaurantDetail, Checkout, OrderTracking, OrderHistory, AdminDashboard
│   │   ├── services/        # Centralized API service
│   │   ├── App.jsx          # Top-level view router & state management
│   │   ├── index.css        # Tailwind CSS styles & typography
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js       # Vite dev server with proxy to backend
│   └── package.json
├── package.json             # Root scripts
└── README.md
```

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new customer or admin.
- `POST /api/auth/login` — Authenticate and return JWT token.
- `GET /api/auth/profile` — Get authenticated user details.

### Restaurants (`/api/restaurants`)
- `GET /api/restaurants` — List all restaurants with search (`?search=...`), cuisine filter (`?cuisine=...`), and sorting (`?sort=rating|deliveryTime|deliveryFee`).
- `GET /api/restaurants/:id` — Get single restaurant by ID or slug.
- `POST /api/restaurants` — Create a new kitchen (Admin only).
- `PUT /api/restaurants/:id` — Update kitchen details (Admin only).
- `DELETE /api/restaurants/:id` — Remove restaurant (Admin only).

### Dishes (`/api/dishes`)
- `GET /api/dishes` — List menu dishes by `restaurantId`, `category`, `isVeg`, `search`.
- `POST /api/dishes` — Add dish to restaurant menu (Admin only).
- `DELETE /api/dishes/:id` — Delete dish from menu (Admin only).

### Orders (`/api/orders`)
- `POST /api/orders` — Place new food order with delivery address, coupon, and payment method.
- `GET /api/orders/my-orders` — Customer past orders history.
- `GET /api/orders/:id` — Order tracking details and live timeline.
- `GET /api/orders` — All orders list (Admin only).
- `PATCH /api/orders/:id/status` — Advance order status (Admin only).

### Admin (`/api/admin`)
- `GET /api/admin/stats` — High-level platform metrics (revenue, order counts, restaurant and dish totals).

