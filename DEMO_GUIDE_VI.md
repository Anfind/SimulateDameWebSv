# 🔐 Hướng Dẫn Demo Lỗ Hổng Bảo Mật Web

## 📋 Tổng Quan
Demo này trình diễn hai lỗ hổng bảo mật web quan trọng:
1. **SQL Injection** - Bypass xác thực
2. **Cross-Site Scripting (XSS)** - XSS được lưu trữ trong bình luận

## 🚀 Hướng Dẫn Cài Đặt

### 1. Khởi Động Server
```bash
cd server
npm install
npm start
```
Server chạy tại: `http://localhost:5000`

### 2. Khởi Động Client
```bash
cd client
npm install
npm start
```
Client chạy tại: `http://localhost:3000`

## 🎯 Quy Trình Demo

### Phần 1: Demo SQL Injection

#### Bước 1: Thử Đăng Nhập Bình Thường
1. Vào tab **Login Demo**
2. Thử tài khoản hợp lệ:
   - Username: `admin`
   - Password: `admin123`
3. ✅ Đăng nhập thành công

#### Bước 2: Thử Tấn Công SQL Injection
1. Đảm bảo "Vulnerable Mode" đang **BẬT** (màu đỏ)
2. Thử payload SQL injection:
   - Username: `admin' OR '1'='1' --`
   - Password: `anything` (có thể là bất kỳ text nào)
3. 🚨 **Tấn Công Thành Công!** - Bạn sẽ thấy:
   - Thông báo đăng nhập thành công
   - Cảnh báo bảo mật về SQL injection bypass
   - Query lỗ hổng được hiển thị trong response

#### Bước 3: Bật Chế Độ Bảo Mật
1. Chuyển "Secure Mode" thành **BẬT** (màu xanh)
2. Thử lại SQL injection:
   - Username: `admin' OR '1'='1' --`
   - Password: `anything`
3. ✅ **Tấn Công Bị Chặn!** - Sẽ hiện "Invalid credentials"

### Phần 2: Demo XSS (Cross-Site Scripting)

#### Bước 1: Thử Bình Luận Bình Thường
1. Vào tab **Comments Demo**
2. Đảm bảo "Vulnerable Mode" đang **BẬT**
3. Thêm bình luận bình thường:
   - Name: `Tên của bạn`
   - Comment: `Đây là bình luận bình thường`
4. ✅ Bình luận hiển thị bình thường

#### Bước 2: Thử Tấn Công XSS
1. Giữ "Vulnerable Mode" **BẬT**
2. Thử payload XSS trong bình luận:
   - Name: `Hacker`
   - Comment: `<script>alert('XSS Attack!')</script>`
3. Click "Add Comment"
4. 🚨 **Tấn Công Thành Công!** - Bạn sẽ thấy:
   - Popup alert JavaScript
   - Script độc hại được thực thi trong browser
   - Cảnh báo bảo mật về XSS

#### Bước 3: Thử Thêm Payload XSS
Thử các payload XSS khác:
```html
<img src="x" onerror="alert('XSS via img tag')">
<svg onload="alert('SVG XSS')">
<iframe src="javascript:alert('XSS in iframe')"></iframe>
```

#### Bước 4: Bật Chế Độ Bảo Mật
1. Chuyển "Secure Mode" thành **BẬT**
2. Thử lại payload XSS:
   - Comment: `<script>alert('XSS Attack!')</script>`
3. ✅ **Tấn Công Bị Chặn!** - Script tags bị sanitize
4. Kiểm tra bình luận cũ - XSS trước đó đã được sanitize

## 🔍 Chi Tiết Kỹ Thuật

### Lỗ Hổng SQL Injection
**Code Lỗ Hổng:**
```javascript
// SAI: Nối chuỗi trực tiếp
const query = `SELECT * FROM users WHERE username = '${username}'`;
```

**Code Bảo Mật:**
```javascript
// ĐÚNG: Parameterized query
const query = 'SELECT * FROM users WHERE username = ?';
db.get(query, [username], callback);
```

### Lỗ Hổng XSS
**Code Lỗ Hổng:**
```javascript
// SAI: Render HTML thô
dangerouslySetInnerHTML={{ __html: comment.content }}
```

**Code Bảo Mật:**
```javascript
// ĐÚNG: Sanitize content
const sanitizedContent = DOMPurify.sanitize(comment.content);
```

## 🎭 Cheat Sheet Payload Tấn Công

### SQL Injection Payloads
```sql
admin' OR '1'='1' --
' OR 1=1 --
admin'/**/OR/**/1=1--
```

### XSS Payloads
```html
<script>alert('XSS Attack!')</script>
<img src="x" onerror="alert('XSS via img tag')">
<svg onload="alert('SVG XSS')">
```

## 🛡️ Các Phương Pháp Bảo Mật Được Demo

### 1. Ngăn Chặn SQL Injection
- ✅ Sử dụng parameterized queries
- ✅ Validate và sanitize input
- ✅ Nguyên tắc quyền hạn tối thiểu cho database

### 2. Ngăn Chặn XSS
- ✅ Sanitize input (DOMPurify)
- ✅ Encode output
- ✅ Tránh `dangerouslySetInnerHTML`

## 🎯 Mục Tiêu Học Tập

Sau khi hoàn thành demo, bạn sẽ hiểu:
- Cách SQL injection hoạt động và cách ngăn chặn
- Cách XSS hoạt động và cách sanitize user input
- Tầm quan trọng của input validation và output encoding
- Các thực hành phát triển an toàn
- Những thay đổi code nhỏ có thể có tác động bảo mật lớn

---
**⚠️ Lưu ý**: Demo này chỉ dành cho mục đích giáo dục. Không sử dụng các kỹ thuật này trên hệ thống không thuộc quyền sở hữu của bạn.
