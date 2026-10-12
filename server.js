const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

let restaurants = [
    { id: 201, name: 'Cơm Tấm Sa Bì Chưởng', address: '179 Ngô Tất Tố, P.22, Q. Bình Thạnh, TP.HCM' },
    { id: 202, name: 'Trà Sữa KOI Thé', address: '120 Phan Xích Long, P.7, Q. Phú Nhuận, TP.HCM' },
    { id: 203, name: 'Phở Bò Truyền Thống', address: '123 Nguyễn Huệ, P. Bến Nghé, Quận 1, TP.HCM' }
];

const sampleCustomers = [
    { name: 'Phan Gia Huy', phone: '0901.000.111' },
    { name: 'Phạm Thanh Danh', phone: '0901.111.222' },
    { name: 'Quách Đình Long', phone: '0902.333.444' },
    { name: 'Nguyễn Đức Việt', phone: '0903.555.666' }
];

let users = [
    { id: 1, username: 'customer1', password: hashPassword('123'), role: 'Customer', name: 'Phạm Thanh Danh', phone: '0901.111.222', isLocked: false, failedAttempts: 0, lockUntil: null },
    { id: 8, username: 'customer2', password: hashPassword('123'), role: 'Customer', name: 'Quách Đình Long', phone: '0902.333.444', isLocked: false, failedAttempts: 0, lockUntil: null },
    { id: 9, username: 'customer3', password: hashPassword('123'), role: 'Customer', name: 'Nguyễn Đức Việt', phone: '0903.555.666', isLocked: false, failedAttempts: 0, lockUntil: null },
    { id: 2, username: 'restaurant1', password: hashPassword('123'), role: 'Restaurant', name: 'Cơm Tấm Sa Bì Chưởng', restaurantId: 201, address: '179 Ngô Tất Tố, P.22, Q. Bình Thạnh, TP.HCM', isLocked: false, failedAttempts: 0, lockUntil: null },
    { id: 5, username: 'restaurant2', password: hashPassword('123'), role: 'Restaurant', name: 'Trà Sữa KOI Thé', restaurantId: 202, address: '120 Phan Xích Long, P.7, Q. Phú Nhuận, TP.HCM', isLocked: false, failedAttempts: 0, lockUntil: null },
    { id: 3, username: 'driver1', password: hashPassword('123'), role: 'Driver', name: 'Nguyễn Đức Việt (Tài xế)', phone: '0909.888.999', licensePlate: '59-S2 123.45', vehicle: 'Honda Wave Alpha', status: 'ONLINE', isOnline: true, lat: 10.7831, lng: 106.6957, currentAddress: 'ĐH UEF - Điện Biên Phủ', isLocked: false, failedAttempts: 0, lockUntil: null },
    { id: 6, username: 'driver2', password: hashPassword('123'), role: 'Driver', name: 'Trần Minh Tuấn', phone: '0912.333.444', licensePlate: '59-P1 678.90', vehicle: 'Yamaha Exciter', status: 'ONLINE', isOnline: true, lat: 10.7769, lng: 106.7009, currentAddress: 'Quận 1, TP.HCM', isLocked: false, failedAttempts: 0, lockUntil: null },
    { id: 4, username: 'admin1', password: hashPassword('123'), role: 'Admin', name: 'Quản Trị Viên UEF', isLocked: false, failedAttempts: 0, lockUntil: null }
];

let menu = [
    { id: 101, restaurantId: 201, name: 'Cơm Tấm Sườn Bì Chả', price: 55000, category: 'Món Chính', isAvailable: true },
    { id: 102, restaurantId: 201, name: 'Cơm Tấm Sườn Cây Nướng', price: 60000, category: 'Món Chính', isAvailable: true },
    { id: 103, restaurantId: 202, name: 'Trà Sữa Lục Trà Mắc Ca', price: 45000, category: 'Đồ Uống', isAvailable: true },
    { id: 104, restaurantId: 202, name: 'Lục Trà Sương Sáo', price: 38000, category: 'Đồ Uống', isAvailable: true },
    { id: 105, restaurantId: 203, name: 'Phở Bò Tái Lăn', price: 50000, category: 'Món Chính', isAvailable: true }
];

let vouchers = [
    { code: 'UEF2026', discountPercent: 20, description: 'Giảm 20% Đồ Án Sinh Viên UEF' },
    { code: 'FREESHIP', discountPercent: 10, description: 'Miễn Phí Vận Chuyển Toàn Thành Phố' }
];

let orders = [
    {
        id: 1001,
        customerName: 'Phạm Thanh Danh',
        customerPhone: '0901.111.222',
        deliveryAddress: '141 Điện Biên Phủ, P.15, Q. Bình Thạnh, TP.HCM',
        restaurantName: 'Cơm Tấm Sa Bì Chưởng',
        restaurantAddress: '179 Ngô Tất Tố, P.22, Q. Bình Thạnh, TP.HCM',
        items: [{ name: 'Cơm Tấm Sườn Bì Chả', price: 55000, topping: 'Nhiều mỡ hành' }],
        subtotal: 55000,
        discount: 11000,
        total: 44000,
        paymentMethod: 'VNPay',
        paymentStatus: 'PAID',
        status: 'PAID',
        driverInfo: null,
        estimatedDeliveryTime: '15 - 20 phút',
        driverLocation: { lat: 10.7831, lng: 106.6957, address: 'Đơn mới tạo, chờ Nhà hàng xác nhận đơn...' },
        createdAt: new Date().toLocaleTimeString()
    }
];

const locationsList = [
    { lat: 10.7885, lng: 106.7082, address: 'Tài xế đang ở Quán lấy hàng' },
    { lat: 10.7850, lng: 106.7020, address: 'Tài xế đang di chuyển trên đường' },
    { lat: 10.7831, lng: 106.6957, address: 'Đã tới địa chỉ giao hàng' }
];
let currentGpsStep = 0;

function calculateEstimatedDelivery(address) {
    const lowerAddr = address.toLowerCase();
    if (lowerAddr.includes('bình thạnh') || lowerAddr.includes('quận 1') || lowerAddr.includes('quận 3') || lowerAddr.includes('phú nhuận')) {
        return '15 - 20 phút (Khu vực Gần)';
    }
    return '30 - 45 phút (Khu vực Xa)';
}

app.post('/api/register', (req, res) => {
    let { username, password, name, role, restaurantAddress } = req.body;
    username = username ? username.trim() : '';
    password = password ? password.trim() : '';
    name = name ? name.trim() : '';

    if (!username || !password || !name) return res.status(400).json({ error: 'Vui lòng điền đủ thông tin!' });
    
    const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
        return res.status(400).json({ error: `Tài khoản "${username}" đã tồn tại! Vui lòng chọn Tên đăng nhập khác.` });
    }

    let restId = null;
    if (role === 'Restaurant') {
        restId = Date.now();
        restaurants.push({ id: restId, name, address: restaurantAddress || 'TP. Hồ Chí Minh' });
    }

    const newUser = {
        id: Date.now(),
        username,
        password: hashPassword(password),
        role: role || 'Customer',
        name,
        restaurantId: restId,
        address: restaurantAddress || 'TP. Hồ Chí Minh',
        phone: '0938' + Math.floor(100000 + Math.random() * 900000),
        licensePlate: role === 'Driver' ? '59-X1 ' + Math.floor(10000 + Math.random() * 90000) : null,
        vehicle: role === 'Driver' ? 'Honda Wave' : null,
        status: 'ONLINE',
        isOnline: true,
        lat: 10.7831, lng: 106.6957,
        currentAddress: 'TP. Hồ Chí Minh',
        isLocked: false, failedAttempts: 0, lockUntil: null
    };
    users.push(newUser);
    res.json({ message: 'Đăng ký tài khoản thành công!', user: newUser });
});

app.post('/api/login', (req, res) => {
    let { username, password } = req.body;
    username = username ? username.trim() : '';
    password = password ? password.trim() : '';

    const user = users.find(u => u.username === username);

    if (!user) return res.status(404).json({ error: 'Tài khoản không tồn tại!', requireRegister: true });
    if (user.isLocked) return res.status(403).json({ error: 'Tài khoản bị Admin khóa!' });

    const now = Date.now();
    if (user.lockUntil && now < user.lockUntil) {
        const remainingSeconds = Math.ceil((user.lockUntil - now) / 1000);
        return res.status(429).json({ error: `Tài khoản tạm khóa. Thử lại sau ${remainingSeconds} giây.` });
    }

    if (user.password !== hashPassword(password)) {
        user.failedAttempts = (user.failedAttempts || 0) + 1;
        if (user.failedAttempts >= 3) {
            user.lockUntil = now + 60 * 1000;
            user.failedAttempts = 0;
            return res.status(429).json({ error: 'Nhập sai 3 lần! Khóa tạm 1 phút.' });
        }
        return res.status(401).json({ error: `Sai mật khẩu! Còn ${3 - user.failedAttempts} lần thử.` });
    }

    user.failedAttempts = 0;
    user.lockUntil = null;
    res.json({ message: 'Đăng nhập thành công', user });
});

app.get('/api/restaurants', (req, res) => res.json(restaurants));

app.put('/api/restaurant/info', (req, res) => {
    const { userId, name, address } = req.body;
    const user = users.find(u => u.id === Number(userId));
    if (!user || user.role !== 'Restaurant') return res.status(400).json({ error: 'Không tìm thấy tài khoản Quán!' });

    user.name = name;
    user.address = address;

    let rest = restaurants.find(r => r.id === user.restaurantId);
    if (rest) {
        rest.name = name;
        rest.address = address;
    } else {
        const newRestId = Date.now();
        user.restaurantId = newRestId;
        restaurants.push({ id: newRestId, name, address });
    }

    res.json({ message: 'Cập nhật thông tin Quán thành công!', user });
});

app.get('/api/menu', (req, res) => {
    const restId = req.query.restaurantId;
    if (restId) {
        return res.json(menu.filter(m => m.restaurantId === Number(restId)));
    }
    res.json(menu);
});

app.post('/api/menu', (req, res) => {
    const { restaurantId, name, price, category } = req.body;
    const newItem = { id: Date.now(), restaurantId: Number(restaurantId), name, price: Number(price), category: category || 'Món Chính', isAvailable: true };
    menu.push(newItem);
    res.json({ message: 'Thêm món thành công', item: newItem });
});

app.put('/api/menu/:id', (req, res) => {
    const id = Number(req.params.id);
    const item = menu.find(m => m.id === id);
    if (item) {
        if (req.body.price !== undefined) item.price = Number(req.body.price);
        if (req.body.isAvailable !== undefined) item.isAvailable = req.body.isAvailable;
        res.json({ message: 'Cập nhật món thành công', item });
    } else res.status(404).json({ error: 'Không tìm thấy món' });
});

app.delete('/api/menu/:id', (req, res) => {
    menu = menu.filter(item => item.id !== Number(req.params.id));
    res.json({ message: 'Đã xóa món ăn' });
});

app.put('/api/driver/toggle-status', (req, res) => {
    const { userId } = req.body;
    const driver = users.find(u => u.id === Number(userId) && u.role === 'Driver') || users.find(u => u.role === 'Driver');
    if (!driver) return res.status(404).json({ error: 'Không tìm thấy tài xế' });

    driver.isOnline = !driver.isOnline;
    driver.status = driver.isOnline ? 'ONLINE (SẴN SÀNG)' : 'OFFLINE (TẮT NHẬN ĐƠN)';
    res.json({ message: 'Cập nhật trạng thái thành công', driver });
});

app.get('/api/driver/info', (req, res) => {
    res.json(users.filter(u => u.role === 'Driver'));
});

app.post('/api/vouchers/apply', (req, res) => {
    const { code, amount } = req.body;
    const v = vouchers.find(x => x.code === code.toUpperCase());
    if (!v) return res.status(404).json({ error: 'Mã giảm giá không hợp lệ' });
    const discount = (amount * v.discountPercent) / 100;
    res.json({ code: v.code, discount, finalAmount: amount - discount });
});

app.get('/api/orders', (req, res) => res.json(orders));

app.post('/api/orders', (req, res) => {
    const { customerName, deliveryAddress, restaurantId, customRestaurantName, items, subtotal, discount, total, paymentMethod } = req.body;
    
    if (!deliveryAddress) return res.status(400).json({ error: 'Vui lòng nhập địa chỉ giao hàng!' });

    let finalCustomer = customerName;
    let finalPhone = '0901.111.222';
    
    if (!finalCustomer || finalCustomer === 'GUEST') {
        const randCust = sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)];
        finalCustomer = randCust.name;
        finalPhone = randCust.phone;
    }

    let restName = 'Quán Ăn';
    let restAddr = 'Địa chỉ Quán';

    if (customRestaurantName) {
        restName = customRestaurantName;
        restAddr = 'Địa chỉ do khách hàng yêu cầu';
    } else {
        const rest = restaurants.find(r => r.id === Number(restaurantId));
        if (rest) {
            restName = rest.name;
            restAddr = rest.address;
        }
    }

    const estimatedTime = calculateEstimatedDelivery(deliveryAddress);

    const newOrder = {
        id: Math.floor(1000 + Math.random() * 9000),
        customerName: finalCustomer,
        customerPhone: finalPhone,
        deliveryAddress,
        restaurantId: customRestaurantName ? null : Number(restaurantId),
        restaurantName: restName,
        restaurantAddress: restAddr,
        items,
        subtotal,
        discount,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'UNPAID' : 'PAID',
        status: 'PAID',
        driverInfo: null,
        estimatedDeliveryTime: estimatedTime,
        driverLocation: { lat: 10.7769, lng: 106.7009, address: 'Đơn mới tạo. Dự kiến giao trong ' + estimatedTime },
        createdAt: new Date().toLocaleTimeString()
    };
    orders.push(newOrder);
    res.json({ message: 'Đặt hàng thành công!', order: newOrder });
});

app.put('/api/orders/:id/status', (req, res) => {
    const id = Number(req.params.id);
    const { status, role } = req.body;
    const order = orders.find(o => o.id === id);

    if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });

    if (status === 'CANCELLED') {
        if (order.status === 'IN_PREPARATION') return res.status(400).json({ error: 'Nhà hàng đang chế biến, không thể hủy đơn!' });
        order.status = 'CANCELLED';
        if (order.paymentStatus === 'PAID') order.paymentStatus = 'REFUNDED';
        order.driverLocation.address = 'Đơn hàng đã bị hủy';
        return res.json({ message: 'Hủy đơn thành công.', order });
    }

    if (role === 'Restaurant' || role === 'Admin') {
        if (status === 'IN_PREPARATION') {
            order.status = 'IN_PREPARATION';
            order.driverLocation.address = 'Bếp đã nhận đơn & đang chế biến món...';
            return res.json({ message: 'Nhà hàng đã nhận đơn!', order });
        }
        if (status === 'READY') {
            order.status = 'READY';
            const availableDrivers = users.filter(u => u.role === 'Driver' && !u.isLocked);
            if (availableDrivers.length > 0) {
                const randomDriver = availableDrivers[Math.floor(Math.random() * availableDrivers.length)];
                order.driverInfo = {
                    id: randomDriver.id,
                    name: randomDriver.name,
                    phone: randomDriver.phone,
                    licensePlate: randomDriver.licensePlate,
                    vehicle: randomDriver.vehicle
                };
                order.driverLocation.address = 'Bếp xong. Đã phân công tài xế ' + randomDriver.name + ' đến quán lấy món.';
            } else {
                order.driverLocation.address = 'Bếp xong. Đang tìm tài xế gần nhất...';
            }
            return res.json({ message: 'Bếp đã chuẩn bị xong món!', order });
        }
    }

    if (role === 'Driver' || role === 'Admin') {
        if (status === 'IN_DELIVERY') {
            order.status = 'IN_DELIVERY';
            order.driverLocation.address = 'Tài xế đã nhận món & đang di chuyển tới khách hàng...';
            return res.json({ message: 'Tài xế đã nhận đơn & bắt đầu giao!', order });
        }
        if (status === 'COMPLETED') {
            order.status = 'COMPLETED';
            order.driverLocation.address = 'Đã giao hàng thành công tới khách hàng!';
            return res.json({ message: 'Xác nhận giao hàng thành công!', order });
        }
    }

    res.status(400).json({ error: 'Thao tác không hợp lệ với vai trò của bạn!' });
});

app.put('/api/orders/:id/gps', (req, res) => {
    const id = Number(req.params.id);
    const order = orders.find(o => o.id === id);

    if (order) {
        currentGpsStep = (currentGpsStep + 1) % locationsList.length;
        const nextLoc = locationsList[currentGpsStep];
        
        order.driverLocation = { lat: nextLoc.lat, lng: nextLoc.lng, address: nextLoc.address };
        if (order.driverInfo) {
            const driver = users.find(u => u.id === order.driverInfo.id);
            if (driver) driver.currentAddress = nextLoc.address;
        }

        res.json({ message: 'Cập nhật GPS thành công', location: order.driverLocation });
    } else res.status(404).json({ error: 'Đơn hàng không tồn tại' });
});

app.get('/api/admin/users', (req, res) => res.json(users));

app.put('/api/admin/users/:id/lock', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);
    if (user) {
        user.isLocked = !user.isLocked;
        res.json({ message: `Đã ${user.isLocked ? 'khóa' : 'mở khóa'} tài khoản`, user });
    } else res.status(404).json({ error: 'Không tìm thấy user' });
});

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Online Food Delivery System - OFDS</title>
        <style>
            * { box-sizing: border-box; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; }
            body { background-color: #f0f2f5; padding: 15px; color: #333; }
            .container { max-width: 1050px; margin: 0 auto; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 2px solid #eef2f7; margin-bottom: 20px; gap: 15px; }
            .header-title-box { flex: 1; min-width: 0; }
            .header-title-box h2 { color: #2c3e50; font-size: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .header-title-box small { color: #64748b; font-size: 12px; display: block; margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .header-user-box { text-align: right; white-space: nowrap; font-size: 13px; }
            .auth-bar { background: #e8f4fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .auth-form { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
            input, select, button { padding: 9px 12px; border: 1px solid #cccccc; border-radius: 6px; font-size: 13px; }
            button { background: #27ae60; color: white; border: none; cursor: pointer; font-weight: bold; transition: 0.2s; }
            button:hover { opacity: 0.9; }
            button.danger { background: #e74c3c; }
            button.warning { background: #f39c12; }
            button.info { background: #2980b9; }
            .card { border: 1px solid #e1e8ed; padding: 20px; border-radius: 10px; background: #fafafa; margin-bottom: 20px; }
            .card h3 { margin-bottom: 15px; font-size: 16px; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 6px; }
            .badge { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; color: white; display: inline-block; }
            .PAID { background: #e67e22; }
            .IN_PREPARATION { background: #f39c12; }
            .READY { background: #9b59b6; }
            .IN_DELIVERY { background: #2980b9; }
            .COMPLETED { background: #2ecc71; }
            .CANCELLED, .REFUNDED { background: #e74c3c; }
            .item-box { background: white; border: 1px solid #e0e0e0; padding: 12px; border-radius: 6px; margin-bottom: 8px; font-size: 13px; }
            .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); justify-content: center; align-items: center; z-index: 1000; }
            .modal-content { background: white; padding: 25px; border-radius: 10px; width: 340px; text-align: center; }
            .address-box { background: #fff8e7; border: 1px solid #ffe0b2; padding: 10px; border-radius: 5px; margin-bottom: 12px; font-size: 12px; }
            .guest-notice { text-align: center; padding: 25px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; color: #334155; font-size: 16px; margin-bottom: 20px; }
            .promo-container { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; margin-bottom: 12px; }
            .promo-card { display: flex; justify-content: space-between; align-items: center; background: #fff0f6; border: 1px dashed #ff85c0; padding: 8px 12px; border-radius: 6px; font-size: 12px; }
            .promo-card b { color: #eb2f96; }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <div class="header-title-box">
                    <h2>Online Food Delivery System (OFDS)</h2>
                    <small>Đồ Án Công Nghệ Phần Mềm UEF | Nhóm: Phan Gia Huy - Phạm Thanh Danh - Quách Đình Long - Nguyễn Đức Việt</small>
                </div>
                <div class="header-user-box">
                    <strong>User:</strong> <span id="current-user-name">Chưa đăng nhập</span> | 
                    <strong>Vai trò:</strong> <span id="current-user-role" class="badge" style="background:#7f8c8d;">GUEST</span>
                    <button id="btn-logout" class="danger" style="display:none; margin-left:8px; padding:4px 8px; font-size:11px;" onclick="logout()">Đăng Xuất</button>
                </div>
            </header>

            <div class="auth-bar" id="auth-section">
                <div class="auth-form">
                    <strong>Đăng Nhập Hệ Thống:</strong>
                    <input type="text" id="login-username" placeholder="Tên đăng nhập" style="width:180px;" onkeydown="handleEnterKey(event)">
                    <input type="password" id="login-password" placeholder="Mật khẩu" style="width:140px;" onkeydown="handleEnterKey(event)">
                    <button onclick="login()">Đăng Nhập</button>
                    <button class="info" onclick="openRegisterModal()">Đăng Ký Tài Khoản Mới</button>
                </div>
            </div>

            <div id="guest-panel" class="guest-notice">
                <h3>Chào mừng bạn đến với Hệ thống Đặt Món OFDS!</h3>
            </div>

            <div id="panel-customer" class="card" style="display:none;">
                <h3>Màn Hình Đặt Món Khách Hàng (Customer Dashboard)</h3>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                    <div>
                        <label><b>1. Chọn Nhà hàng / Quán nước:</b></label>
                        <select id="cust-restaurant-select" style="width:100%; margin: 5px 0 3px 0; font-weight:bold; color:#2c3e50;" onchange="handleRestaurantChange()"></select>
                        <div id="selected-rest-address" style="font-size:11px; color:#e67e22; margin-bottom:8px; font-style:italic;"></div>

                        <div id="custom-restaurant-box" style="display:none; margin-bottom:10px;">
                            <input type="text" id="custom-restaurant-input" placeholder="Tự nhập Tên Quán bạn muốn đặt..." style="width:100%; border:2px solid #3498db; font-weight:bold;">
                        </div>

                        <label><b>2. Chọn món & Topping:</b></label>
                        <select id="cust-food-select" style="width:100%; margin: 5px 0 10px 0;"></select>
                        <input type="text" id="cust-topping" placeholder="Ghi chú Topping (VD: Ít đường, thêm chả)" style="width:100%; margin-bottom:10px;">
                    </div>
                    <div>
                        <label><b>Địa chỉ giao hàng của bạn:</b></label>
                        <input type="text" id="cust-address" value="141 Điện Biên Phủ, P.15, Q. Bình Thạnh, TP.HCM" placeholder="Nhập địa chỉ nhận hàng" style="width:100%; margin: 5px 0 10px 0; font-weight:bold;">

                        <label><b>Mã Giảm Giá:</b></label>
                        <div style="display:flex; gap:5px; margin: 5px 0;">
                            <input type="text" id="voucher-code" placeholder="Nhập mã ưu đãi" style="flex:1;">
                            <button class="info" onclick="applyVoucher()">Áp dụng</button>
                        </div>
                        <div id="voucher-msg" style="font-size:11px; color:#27ae60; margin-bottom:5px;"></div>

                        <div style="font-size:12px; font-weight:bold; color:#d35400; margin-top:5px;">Ưu Đãi HOT Đang Có:</div>
                        <div class="promo-container">
                            <div class="promo-card">
                                <span><b>UEF2026</b> - Giảm 20% Đồ án UEF</span>
                                <button style="padding:2px 8px; font-size:10px;" onclick="usePromo('UEF2026')">Dùng ngay</button>
                            </div>
                            <div class="promo-card">
                                <span><b>FREESHIP</b> - Giảm 10% Phí ship</span>
                                <button style="padding:2px 8px; font-size:10px;" onclick="usePromo('FREESHIP')">Dùng ngay</button>
                            </div>
                        </div>

                        <label><b>Phương thức thanh toán:</b></label>
                        <select id="payment-method" style="width:100%; margin: 5px 0 12px 0;">
                            <option value="VNPay">Cổng VNPay (Online)</option>
                            <option value="MoMo">Ví MoMo (Online)</option>
                            <option value="COD">Tiền mặt (COD)</option>
                        </select>
                        <button style="width:100%; padding:12px; font-size:14px;" onclick="placeOrder()">XÁC NHẬN ĐẶT HÀNG</button>
                    </div>
                </div>
            </div>

            <div id="panel-restaurant" class="card" style="display:none;">
                <h3>Màn Hình Quản Lý Bếp Nhà Hàng (POS Dashboard)</h3>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                    <div>
                        <div class="address-box">
                            <b>Thông Tin Quán Đang Quản Lý:</b><br>
                            <input type="text" id="rest-manage-name" placeholder="Tên Nhà hàng / Quán nước" style="width:100%; margin:5px 0; font-weight:bold;">
                            <input type="text" id="rest-manage-addr" placeholder="Địa chỉ Quán" style="width:100%; margin-bottom:8px;">
                            <button class="info" style="width:100%; font-size:12px;" onclick="updateRestaurantInfo()">Lưu Cập Nhật Quán</button>
                        </div>
                        <div style="background:#fff; padding:12px; border:1px solid #ddd; border-radius:6px;">
                            <b>Thêm Món Mới Vào Menu Quán:</b>
                            <input type="text" id="new-food-name" placeholder="Tên món ăn / đồ uống" style="width:100%; margin:5px 0;">
                            <input type="number" id="new-food-price" placeholder="Giá (VNĐ)" style="width:100%; margin-bottom:8px;">
                            <button style="width:100%;" onclick="addMenuItem()">Thêm Vào Menu</button>
                        </div>
                    </div>
                    <div>
                        <b>Thực Đơn Món Hiện Tại Của Quán:</b>
                        <div id="menu-list-manage" style="max-height:220px; overflow-y:auto; margin-top:8px;"></div>
                    </div>
                </div>
            </div>

            <div id="panel-driver" class="card" style="display:none;">
                <h3>Màn Hình Tài Xế & Điều Phối Giao Hàng (Driver App)</h3>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                    <div>
                        <div style="font-size:13px; background:#fff; padding:12px; border:1px solid #ddd; border-radius:6px; margin-bottom:12px;">
                            <b>Tài xế trực:</b> <span id="driver-name-tag">Nguyễn Đức Việt</span><br>
                            <b>SĐT:</b> <span id="driver-phone-tag">0909.888.999</span> | <b>Biển số:</b> <span id="driver-plate-tag">59-S2 123.45</span>
                        </div>
                        <div style="display:flex; gap:8px;">
                            <button class="warning" style="flex:1;" onclick="simulateGPSMove()">Chạy 1 Trạm GPS</button>
                            <button id="btn-auto-gps" class="info" style="flex:1;" onclick="toggleAutoGPS()">Bật GPS Tự Động</button>
                        </div>
                    </div>
                    <div>
                        <b>Danh Sách Đơn Hàng Cần Giao:</b>
                        <div id="driver-order-list" style="max-height:200px; overflow-y:auto; margin-top:8px;"></div>
                    </div>
                </div>
            </div>

            <div id="panel-admin" class="card" style="display:none;">
                <h3>Trang Quản Trị Hệ Thống (Admin Dashboard)</h3>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                    <div>
                        <b>Quản Lý Khóa / Mở Khóa Người Dùng:</b>
                        <div id="admin-user-list" style="max-height:200px; overflow-y:auto; margin-top:8px;"></div>
                    </div>
                    <div>
                        <b>Thống Kê Doanh Thu Toàn Hệ Thống:</b>
                        <div style="font-size:13px; background:#fff; padding:15px; border-radius:6px; border:1px solid #ccc; margin-top:8px;">
                            Tổng số đơn đã tạo: <b id="stat-total-orders">0</b><br><br>
                            Tổng doanh thu hoàn tất: <b id="stat-revenue" style="color:#27ae60; font-size:16px;">0 VNĐ</b>
                        </div>
                    </div>
                </div>
            </div>

            <div id="global-order-section" style="display:none; margin-top:20px; border-top:2px solid #eef2f7; padding-top:15px;">
                <h3>Lịch Sử & Tiến Độ Đơn Hàng Theo Thời Gian Thực</h3>
                <div id="global-order-feed" style="margin-top:10px;"></div>
            </div>
        </div>

        <div id="register-modal" class="modal">
            <div class="modal-content">
                <h3 style="margin-bottom:15px;">Đăng Ký Tài Khoản Mới</h3>
                <input type="text" id="reg-username" placeholder="Tên đăng nhập" style="width:100%; margin-bottom:10px;">
                <input type="password" id="reg-password" placeholder="Mật khẩu" style="width:100%; margin-bottom:10px;">
                <input type="text" id="reg-fullname" placeholder="Họ tên / Tên Quán" style="width:100%; margin-bottom:10px;">
                <select id="reg-role" style="width:100%; margin-bottom:10px;" onchange="toggleRegRestAddr()">
                    <option value="Customer">Khách Hàng (Customer)</option>
                    <option value="Restaurant">Nhà Hàng / Quán Nước (Restaurant)</option>
                    <option value="Driver">Tài Xế (Driver)</option>
                </select>
                <input type="text" id="reg-rest-addr" placeholder="Địa chỉ Quán (nếu là Nhà hàng)" style="width:100%; margin-bottom:15px; display:none;">
                <button style="width:100%; margin-bottom:8px;" onclick="register()">Xác Nhận Đăng Ký</button>
                <button class="danger" style="width:100%;" onclick="closeRegisterModal()">Hủy</button>
            </div>
        </div>

        <script>
            let currentUser = null;
            let currentDiscount = 0;
            let autoGpsTimer = null;
            let allRestaurants = [];

            function handleEnterKey(event) {
                if (event.key === 'Enter') { login(); }
            }

            function toggleRegRestAddr() {
                const role = document.getElementById('reg-role').value;
                document.getElementById('reg-rest-addr').style.display = role === 'Restaurant' ? 'block' : 'none';
            }

            async function login() {
                const usernameElem = document.getElementById('login-username');
                const passwordElem = document.getElementById('login-password');
                const u = usernameElem.value.trim();
                const p = passwordElem.value.trim();
                usernameElem.value = u;
                passwordElem.value = p;

                if (!u || !p) return alert('Vui lòng điền Tên đăng nhập và Mật khẩu!');

                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: u, password: p })
                });
                const data = await res.json();

                if (res.ok) {
                    currentUser = data.user;
                    document.getElementById('current-user-name').innerText = currentUser.name;
                    document.getElementById('current-user-role').innerText = currentUser.role;
                    document.getElementById('login-password').value = '';
                    document.getElementById('btn-logout').style.display = 'inline-block';

                    if (currentUser.role === 'Restaurant') {
                        document.getElementById('rest-manage-name').value = currentUser.name;
                        document.getElementById('rest-manage-addr').value = currentUser.address || '';
                    }

                    alert('Đăng nhập thành công với vai trò: ' + currentUser.role);
                    renderRolePanels();
                    refreshAll();
                } else {
                    alert(data.error);
                    if (data.requireRegister) {
                        if (confirm('Tài khoản không tồn tại. Chuyển sang Đăng ký ngay?')) {
                            openRegisterModal(u);
                        }
                    }
                }
            }

            function logout() {
                currentUser = null;
                document.getElementById('current-user-name').innerText = 'Chưa đăng nhập';
                document.getElementById('current-user-role').innerText = 'GUEST';
                document.getElementById('btn-logout').style.display = 'none';
                renderRolePanels();
                refreshAll();
            }

            function renderRolePanels() {
                document.getElementById('guest-panel').style.display = 'none';
                document.getElementById('panel-customer').style.display = 'none';
                document.getElementById('panel-restaurant').style.display = 'none';
                document.getElementById('panel-driver').style.display = 'none';
                document.getElementById('panel-admin').style.display = 'none';
                document.getElementById('global-order-section').style.display = 'none';

                if (!currentUser) {
                    document.getElementById('guest-panel').style.display = 'block';
                    return;
                }

                document.getElementById('global-order-section').style.display = 'block';

                if (currentUser.role === 'Customer') {
                    document.getElementById('panel-customer').style.display = 'block';
                } else if (currentUser.role === 'Restaurant') {
                    document.getElementById('panel-restaurant').style.display = 'block';
                } else if (currentUser.role === 'Driver') {
                    document.getElementById('panel-driver').style.display = 'block';
                } else if (currentUser.role === 'Admin') {
                    document.getElementById('panel-admin').style.display = 'block';
                    document.getElementById('panel-customer').style.display = 'block';
                    document.getElementById('panel-restaurant').style.display = 'block';
                    document.getElementById('panel-driver').style.display = 'block';
                }
            }

            function openRegisterModal(fillUsername) {
                document.getElementById('reg-username').value = fillUsername || '';
                document.getElementById('register-modal').style.display = 'flex';
            }

            function closeRegisterModal() {
                document.getElementById('register-modal').style.display = 'none';
            }

            async function register() {
                const u = document.getElementById('reg-username').value.trim();
                const p = document.getElementById('reg-password').value.trim();
                const name = document.getElementById('reg-fullname').value.trim();
                const role = document.getElementById('reg-role').value;
                const restaurantAddress = document.getElementById('reg-rest-addr').value.trim();

                if (!u || !p || !name) return alert('Vui lòng điền đầy đủ thông tin!');

                const res = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: u, password: p, name, role, restaurantAddress })
                });

                const data = await res.json();
                if (res.ok) {
                    alert(data.message);
                    closeRegisterModal();
                    document.getElementById('login-username').value = u;
                    document.getElementById('login-password').value = p;
                    refreshAll();
                } else {
                    alert(data.error);
                    document.getElementById('reg-username').focus();
                    document.getElementById('reg-username').select();
                }
            }

            async function loadRestaurants() {
                const res = await fetch('/api/restaurants');
                allRestaurants = await res.json();
                let html = '';
                allRestaurants.forEach(r => {
                    html += '<option value="' + r.id + '">' + r.name + '</option>';
                });
                html += '<option value="custom">+ Tự nhập Tên Quán mới...</option>';

                const selectElem = document.getElementById('cust-restaurant-select');
                const prevVal = selectElem.value;
                selectElem.innerHTML = html;
                if (prevVal) selectElem.value = prevVal;
                handleRestaurantChange();
            }

            function handleRestaurantChange() {
                const selectVal = document.getElementById('cust-restaurant-select').value;
                const customBox = document.getElementById('custom-restaurant-box');
                
                if (selectVal === 'custom') {
                    customBox.style.display = 'block';
                    document.getElementById('selected-rest-address').innerText = 'Vui lòng nhập tên quán mong muốn ở ô bên dưới';
                    document.getElementById('cust-food-select').innerHTML = '<option value="Món Tự Chọn">Món ăn / Đồ uống tự chọn (55,000 VNĐ)</option>';
                } else {
                    customBox.style.display = 'none';
                    loadMenuBySelectedRestaurant();
                }
            }

            async function loadMenuBySelectedRestaurant() {
                const restId = document.getElementById('cust-restaurant-select').value;
                if (restId === 'custom') return;

                const rest = allRestaurants.find(r => r.id === Number(restId));
                if (rest) {
                    document.getElementById('selected-rest-address').innerText = '' + rest.address;
                }

                const res = await fetch('/api/menu?restaurantId=' + restId);
                const menu = await res.json();
                
                let selectHtml = '';
                menu.forEach(item => {
                    if(item.isAvailable) {
                        selectHtml += '<option value="' + item.id + '">' + item.name + ' - ' + item.price.toLocaleString() + ' VNĐ</option>';
                    }
                });
                document.getElementById('cust-food-select').innerHTML = selectHtml || '<option>Quán chưa đăng món</option>';
            }

            function usePromo(code) {
                document.getElementById('voucher-code').value = code;
                applyVoucher();
            }

            async function applyVoucher() {
                const code = document.getElementById('voucher-code').value;
                const res = await fetch('/api/vouchers/apply', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code, amount: 55000 })
                });
                const data = await res.json();
                if(res.ok) {
                    currentDiscount = data.discount;
                    document.getElementById('voucher-msg').innerText = 'Đã áp dụng ' + data.code + ' (-' + data.discount.toLocaleString() + ' VNĐ)';
                } else alert(data.error);
            }

            async function placeOrder() {
                const restSelectVal = document.getElementById('cust-restaurant-select').value;
                const foodSelect = document.getElementById('cust-food-select');
                let customRestaurantName = null;

                if (restSelectVal === 'custom') {
                    customRestaurantName = document.getElementById('custom-restaurant-input').value.trim();
                    if (!customRestaurantName) return alert('Vui lòng gõ Tên Quán bạn muốn đặt!');
                }

                if(!foodSelect.options.length || foodSelect.value.includes('chưa đăng')) return alert('Vui lòng chọn món ăn hợp lệ!');

                const foodName = foodSelect.options[foodSelect.selectedIndex].text;
                const topping = document.getElementById('cust-topping').value;
                const deliveryAddress = document.getElementById('cust-address').value;
                const paymentMethod = document.getElementById('payment-method').value;

                if (!deliveryAddress) return alert('Vui lòng điền địa chỉ giao hàng!');

                const cName = currentUser ? currentUser.name : '';

                await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customerName: cName,
                        deliveryAddress,
                        restaurantId: restSelectVal === 'custom' ? null : restSelectVal,
                        customRestaurantName,
                        items: [{ name: foodName, topping }],
                        subtotal: 55000,
                        discount: currentDiscount,
                        total: Math.max(0, 55000 - currentDiscount),
                        paymentMethod
                    })
                });
                alert('Đặt hàng thành công!');
                refreshAll();
            }

            function updateStatus(orderId, status) {
                updateOrderStatus(orderId, status);
            }

            async function updateOrderStatus(orderId, status) {
                if (!currentUser) return alert('Vui lòng đăng nhập!');

                const res = await fetch('/api/orders/' + orderId + '/status', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status, role: currentUser.role })
                });
                const data = await res.json();
                if(!res.ok) alert(data.error);
                refreshAll();
            }

            async function loadOrders() {
                const res = await fetch('/api/orders');
                const orders = await res.json();
                
                let feedHtml = '';
                let driverHtml = '';
                let totalRev = 0;
                const role = currentUser ? currentUser.role : 'GUEST';

                orders.forEach(o => {
                    if(o.status === 'COMPLETED') totalRev += o.total;

                    let statusLabel = o.status;
                    if (o.status === 'PAID') statusLabel = 'ĐÃ ĐẶT HÀNG (CHỜ BẾP XÁC NHẬN)';
                    else if (o.status === 'IN_PREPARATION') statusLabel = 'BẾP ĐANG CHUẨN BỊ MÓN';
                    else if (o.status === 'READY') statusLabel = 'BẾP XONG - ĐÃ GÁN TÀI XẾ';
                    else if (o.status === 'IN_DELIVERY') statusLabel = 'TÀI XẾ ĐANG GIAO HÀNG';
                    else if (o.status === 'COMPLETED') statusLabel = 'ĐÃ GIAO HÀNG THÀNH CÔNG';
                    else if (o.status === 'CANCELLED') statusLabel = 'ĐÃ HỦY ĐƠN';

                    let actionButtonsHtml = '';

                    if (role === 'Restaurant' || role === 'Admin') {
                        if (o.status === 'PAID') {
                            actionButtonsHtml += '<button onclick="updateStatus(' + o.id + ', &quot;IN_PREPARATION&quot;)">1. Nhà Hàng Xác Nhận Đơn</button>';
                        } else if (o.status === 'IN_PREPARATION') {
                            actionButtonsHtml += '<button class="info" onclick="updateStatus(' + o.id + ', &quot;READY&quot;)">2. Bếp Làm Xong (Gán Tài Xế)</button>';
                        }
                    }

                    if (role === 'Driver' || role === 'Admin') {
                        if (o.status === 'READY') {
                            actionButtonsHtml += '<button class="warning" onclick="updateStatus(' + o.id + ', &quot;IN_DELIVERY&quot;)">1. Tài Xế Nhận Đơn</button>';
                        } else if (o.status === 'IN_DELIVERY') {
                            actionButtonsHtml += '<button style="background:#2ecc71;" onclick="updateStatus(' + o.id + ', &quot;COMPLETED&quot;)">2. Xác Nhận Đã Giao Khách</button>';
                        }
                    }

                    if ((role === 'Customer' || role === 'Admin') && o.status === 'PAID') {
                        actionButtonsHtml += '<button class="danger" style="margin-left:5px;" onclick="updateStatus(' + o.id + ', &quot;CANCELLED&quot;)">Hủy Đơn</button>';
                    }

                    feedHtml += '<div class="item-box" style="display:flex; justify-content:space-between; align-items:center;">' +
                        '<div>' +
                        '<b>Mã Đơn #' + o.id + '</b> | Khách: <b style="color:#27ae60;">' + o.customerName + '</b> (' + o.customerPhone + ') | TT: <b>' + o.paymentMethod + ' (' + o.paymentStatus + ')</b><br>' +
                        '<b>Nhà hàng:</b> ' + o.restaurantName + ' (<span style="color:#d35400;">' + o.restaurantAddress + '</span>)<br>' +
                        '<b>Giao đến:</b> <span style="color:#c0392b; font-weight:bold;">' + o.deliveryAddress + '</span><br>' +
                        '<b>Dự kiến nhận hàng:</b> <span style="color:#e67e22; font-weight:bold;">' + (o.estimatedDeliveryTime || '15 - 20 phút') + '</span><br>' +
                        'Món: ' + o.items.map(i => i.name + (i.topping ? ' ('+i.topping+')' : '')).join(', ') + ' - <b>' + o.total.toLocaleString() + ' VNĐ</b><br>' +
                        (o.driverInfo ? '<small style="color:#27ae60;"><b>Tài xế giao hàng:</b> ' + o.driverInfo.name + ' - ' + o.driverInfo.phone + ' (' + o.driverInfo.licensePlate + ')</small><br>' : '') +
                        '<small style="color:#2980b9;"> Tiến độ: ' + (o.driverLocation.address || 'Đang cập nhật') + '</small>' +
                        '</div>' +
                        '<div style="text-align:right;">' +
                        '<span class="badge ' + o.status + '">' + statusLabel + '</span><br>' +
                        '<div style="margin-top:8px;">' + (actionButtonsHtml || '<small style="color:#7f8c8d; font-style:italic;">(Không có thao tác nào dành cho bạn)</small>') + '</div>' +
                        '</div>' +
                        '</div>';

                    if((o.status === 'READY' || o.status === 'IN_DELIVERY') && (role === 'Driver' || role === 'Admin')) {
                        driverHtml += '<div class="item-box">' +
                            '<b>Đơn #' + o.id + '</b> - ' + o.total.toLocaleString() + 'đ<br>' +
                            '<small>Khách nhận: <b>' + o.customerName + '</b></small><br>' +
                            '<small>Lấy tại: <b>' + o.restaurantName + '</b></small><br>' +
                            '<small>Giao đến: ' + o.deliveryAddress + '</small><br>' +
                            (o.driverInfo ? '<small style="color:#27ae60;">Driver: <b>' + o.driverInfo.name + '</b> (' + o.driverInfo.phone + ')</small><br>' : '') +
                            (o.status === 'READY' ? '<button class="warning" style="width:100%; margin-top:5px;" onclick="updateStatus(' + o.id + ', &quot;IN_DELIVERY&quot;)">Nhận Đơn & Bắt Đầu Giao</button>' : '<b style="color:#2980b9;">Đang trên đường giao hàng...</b>') +
                            '</div>';
                    }
                });

                document.getElementById('global-order-feed').innerHTML = feedHtml || 'Chưa có đơn hàng nào.';
                document.getElementById('driver-order-list').innerHTML = driverHtml || 'Không có đơn đang xử lý.';
                document.getElementById('stat-total-orders').innerText = orders.length;
                document.getElementById('stat-revenue').innerText = totalRev.toLocaleString() + ' VNĐ';
            }

            async function updateRestaurantInfo() {
                if (!currentUser || currentUser.role !== 'Restaurant') return alert('Vui lòng đăng nhập tài khoản Nhà hàng!');
                const name = document.getElementById('rest-manage-name').value.trim();
                const address = document.getElementById('rest-manage-addr').value.trim();

                if (!name || !address) return alert('Vui lòng điền Tên Quán và Địa chỉ!');

                const res = await fetch('/api/restaurant/info', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: currentUser.id, name, address })
                });
                const data = await res.json();
                if (res.ok) {
                    alert('Đã cập nhật thông tin Quán!');
                    currentUser.name = name;
                    currentUser.address = address;
                    refreshAll();
                } else alert(data.error);
            }

            async function loadRestaurantOwnMenu() {
                let restId = currentUser && currentUser.restaurantId ? currentUser.restaurantId : 201;
                const res = await fetch('/api/menu?restaurantId=' + restId);
                const menu = await res.json();
                
                let manageHtml = '';
                menu.forEach(item => {
                    manageHtml += '<div class="item-box">' +
                        '<b>' + item.name + '</b> (' + item.price.toLocaleString() + 'đ)<br>' +
                        '<button class="warning" onclick="toggleItemAvailable(' + item.id + ', ' + !item.isAvailable + ')">' + (item.isAvailable ? 'Tắt Món' : 'Mở Bán') + '</button>' +
                        '<button class="danger" onclick="deleteMenuItem(' + item.id + ')">Xóa</button>' +
                        '</div>';
                });
                document.getElementById('menu-list-manage').innerHTML = manageHtml || '<small style="color:#999;">Chưa có món ăn.</small>';
            }

            async function addMenuItem() {
                if(!checkRole(['Restaurant', 'Admin'])) return;
                const name = document.getElementById('new-food-name').value;
                const price = document.getElementById('new-food-price').value;
                const restId = currentUser && currentUser.restaurantId ? currentUser.restaurantId : 201;

                if(!name || !price) return alert('Vui lòng điền tên và giá món');
                await fetch('/api/menu', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ restaurantId: restId, name, price, category: 'Món Chính' })
                });
                document.getElementById('new-food-name').value = '';
                document.getElementById('new-food-price').value = '';
                refreshAll();
            }

            async function toggleItemAvailable(id, isAvailable) {
                if(!checkRole(['Restaurant', 'Admin'])) return;
                await fetch('/api/menu/' + id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isAvailable })
                });
                refreshAll();
            }

            async function deleteMenuItem(id) {
                if(!checkRole(['Restaurant', 'Admin'])) return;
                await fetch('/api/menu/' + id, { method: 'DELETE' });
                refreshAll();
            }

            async function toggleAutoGPS() {
                const btn = document.getElementById('btn-auto-gps');
                if (autoGpsTimer) {
                    clearInterval(autoGpsTimer);
                    autoGpsTimer = null;
                    btn.innerText = 'Bật GPS Tự Động';
                    btn.className = 'info';
                } else {
                    autoGpsTimer = setInterval(() => { simulateGPSMove(); }, 3000);
                    btn.innerText = 'Tắt GPS Tự Động';
                    btn.className = 'danger';
                }
            }

            async function simulateGPSMove() {
                const res = await fetch('/api/orders/1001/gps', { method: 'PUT' });
                const data = await res.json();
                if(res.ok) refreshAll();
            }

            async function loadAdminUsers() {
                const res = await fetch('/api/admin/users');
                const usersList = await res.json();
                let html = '';
                if (Array.isArray(usersList)) {
                    usersList.forEach(u => {
                        html += '<div class="item-box" style="display:flex; justify-content:space-between; align-items:center;">' +
                            '<span>' + u.name + ' (<b>' + u.role + '</b>)</span>' +
                            '<button class="' + (u.isLocked ? '' : 'danger') + '" onclick="toggleLockUser(' + u.id + ')">' + (u.isLocked ? 'Mở Khóa' : 'Khóa') + '</button>' +
                            '</div>';
                    });
                }
                document.getElementById('admin-user-list').innerHTML = html || '<small style="color:#999;">Không có người dùng.</small>';
            }

            async function toggleLockUser(id) {
                if(!checkRole(['Admin'])) return;
                await fetch('/api/admin/users/' + id + '/lock', { method: 'PUT' });
                loadAdminUsers();
            }

            function checkRole(roles) {
                if(!currentUser || !roles.includes(currentUser.role)) {
                    alert('Bạn không có quyền thao tác! Yêu cầu quyền: ' + roles.join(' hoặc '));
                    return false;
                }
                return true;
            }

            function refreshAll() {
                loadRestaurants();
                loadRestaurantOwnMenu();
                loadOrders();
                loadAdminUsers();
            }

            renderRolePanels();
            refreshAll();
        </script>
    </body>
    </html>
    `);
});

app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(`OFDS SERVER RUNNING AT: http://localhost:${PORT}`);
    console.log(`================================================================`);
});