-- 1. Bảng Users (Quản lý người dùng cốt lõi & các vai trò: Customer, Admin, Driver)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- CUSTOMER, SYSTEM_ADMIN, DELIVERY_DRIVER
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, BLOCKED
    
    -- Thuộc tính mở rộng cho Customer
    delivery_address TEXT,
    loyalty_points INT DEFAULT 0,
    
    -- Thuộc tính mở rộng cho SystemAdmin
    role_level INT DEFAULT 1,
    
    -- Thuộc tính mở rộng cho DeliveryDriver
    vehicle_number VARCHAR(20),
    current_lat DOUBLE PRECISION,
    current_lng DOUBLE PRECISION,
    is_online BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Restaurants (Quản lý nhà hàng)
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    owner_id INT REFERENCES users(id),
    name VARCHAR(150) NOT NULL,
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
    description TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    category VARCHAR(50)
);

-- 4. Bảng Orders (Quản lý đơn hàng)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, PAID, PLACED, PREPARING, IN_TRANSIT, DELIVERED, CANCELLED
    payment_method VARCHAR(30) NOT NULL, -- CASH_ON_DELIVERY, VNPAY, MOMO
    customer_id INT REFERENCES users(id),
    restaurant_id INT REFERENCES restaurants(id),
    driver_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bảng OrderItems (Chi tiết món ăn trong đơn hàng)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INT REFERENCES menu_items(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    sub_total DECIMAL(10,2) NOT NULL
);

-- 6. Bảng DriverLocations (Quản lý vị trí tài xế thời gian thực)
CREATE TABLE driver_locations (
    driver_id INT PRIMARY KEY REFERENCES users(id),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Bảng Payments (Quản lý giao dịch thanh toán)
CREATE TABLE payments (
    transaction_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Bảng Reviews (Đánh giá dịch vụ và món ăn từ khách hàng)
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(id),
    order_id INT REFERENCES orders(id),
    restaurant_id INT REFERENCES restaurants(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);