-- 1. Bảng Users (Quản lý người dùng, khách hàng, tài xế, admin)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- CUSTOMER, RESTAURANT, DRIVER, ADMIN
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Restaurants (Quản lý nhà hàng)
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    owner_id INT REFERENCES users(id),
    title VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0.0,
    is_open BOOLEAN DEFAULT TRUE
);

-- 3. Bảng MenuItems (Quản lý món ăn của nhà hàng)
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    restaurant_id INT REFERENCES restaurants(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    category VARCHAR(50)
);

-- 4. Bảng Orders (Quản lý đơn hàng)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(id),
    restaurant_id INT REFERENCES restaurants(id),
    driver_id INT REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, PAID, PLACED, PREPARING, IN_TRANSIT, DELIVERED, CANCELLED
    payment_method VARCHAR(30) NOT NULL, -- CASH_ON_DELIVERY, VNPAY, MOMO
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bảng OrderItems (Chi tiết món ăn trong đơn hàng)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    item_id INT REFERENCES menu_items(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);

-- 6. Bảng DriverLocations (Quản lý vị trí tài xế thời gian thực)
CREATE TABLE driver_locations (
    driver_id INT PRIMARY KEY REFERENCES users(id),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);