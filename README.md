# Tugas Besar PBP 2026 - McDonald's Kiosk App

Aplikasi Kiosk Restoran McDonald's berbasis Full-Stack (ReactTS & ExpressTS).

## Struktur Database
Database menggunakan PostgreSQL dengan tabel-tabel berikut:
- **users**: Menyimpan data Admin dan Kasir (username, password hashed, role).
- **categories**: Kategori menu (misal: Burger, Drinks).
- **products**: Detail menu (nama, harga, kategori_id, image_url).
- **orders**: Header transaksi (total_price, status: pending/completed/cancelled).
- **order_items**: Detail transaksi (order_id, product_id, quantity, price).

## API Endpoints

### Auth
- `POST /api/auth/login`: Login admin/kasir.
- `POST /api/auth/forgot-password`: Mock kirim email reset password.
- `POST /api/auth/reset-password`: Update password baru.

### Categories
- `GET /api/categories`: List semua kategori (Public).
- `POST /api/categories`: Buat kategori baru (Admin only).
- `PUT /api/categories/:id`: Update kategori (Admin only).
- `DELETE /api/categories/:id`: Hapus kategori (Admin only).

### Products
- `GET /api/products`: List semua produk (Public).
- `POST /api/products`: Buat produk baru (Admin only).
- `PUT /api/products/:id`: Update produk (Admin only).
- `DELETE /api/products/:id`: Hapus produk (Admin only).

### Orders
- `POST /api/orders`: Membuat pesanan baru (Customer Kiosk).
- `GET /api/orders`: List semua pesanan (Admin & Kasir).
- `PATCH /api/orders/:id/status`: Update status pesanan (Admin & Kasir).

### Users
- `GET /api/users`: List semua admin/kasir (Admin only).
- `POST /api/users`: Buat user baru (Admin only).
- `PUT /api/users/:id`: Update user (Admin only).
- `DELETE /api/users/:id`: Hapus user (Admin only).

## Analisis Middleware

### 1. authMiddleware
Digunakan untuk memproteksi endpoint yang membutuhkan otentikasi. Middleware ini mengecek header `Authorization` (Bearer Token), memverifikasi JWT, dan menyematkan data user ke dalam objek request (`req.user`). Jika token tidak valid atau tidak ada, akan mengembalikan error 401.

### 2. roleMiddleware
Digunakan untuk otorisasi berbasis role. Middleware ini menerima parameter berupa array roles (misal: `['admin']`). Ia mengecek apakah `req.user.role` yang disematkan oleh `authMiddleware` termasuk dalam role yang diizinkan. Jika tidak, akan mengembalikan error 403 Forbidden.

## Cara Menjalankan

### Backend
1. Masuk ke folder `backend`.
2. Pastikan PostgreSQL berjalan dan database `mcdonalds_db` sudah dibuat.
3. Sesuaikan konfigurasi di `.env`.
4. Jalankan `npm install`.
5. Jalankan `npm run dev`.

### Frontend
1. Masuk ke folder `frontend`.
2. Jalankan `npm install`.
3. Jalankan `npm run dev`.
