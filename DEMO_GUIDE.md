# 🔐 Web Security Vulnerabilities Demo Guide

## 📋 Overview
This demo showcases two critical web security vulnerabilities:
1. **SQL Injection** - Authentication bypass
2. **Cross-Site Scripting (XSS)** - Stored XSS in comments

## 🚀 Setup Instructions

### 1. Start the Server
```bash
cd server
npm install
npm start
```
Server will run on: `http://localhost:5000`

### 2. Start the Client
```bash
cd client
npm install
npm start
```
Client will run on: `http://localhost:3000`

## 🎯 Demo Flow

### Part 1: SQL Injection Demo

#### Step 1: Test Normal Login
1. Go to **Login Demo** tab
2. Try legitimate credentials:
   - Username: `admin`
   - Password: `admin123`
3. ✅ Should login successfully

#### Step 2: Test SQL Injection Attack
1. Make sure "Vulnerable Mode" is **ON** (red toggle)
2. Try SQL injection payload:
   - Username: `admin' OR '1'='1' --`
   - Password: `anything` (can be any text)
3. 🚨 **Attack Success!** - You should see:
   - Login successful message
   - Security warning about SQL injection bypass
   - The vulnerable query shown in the response

#### Step 3: Enable Security Fix
1. Toggle "Secure Mode" **ON** (green toggle)
2. Try the same SQL injection:
   - Username: `admin' OR '1'='1' --`
   - Password: `anything`
3. ✅ **Attack Blocked!** - Should see "Invalid credentials"

#### Step 4: Test Legitimate Login in Secure Mode
1. Keep "Secure Mode" **ON**
2. Try legitimate credentials:
   - Username: `admin`
   - Password: `admin123`
3. ✅ Should login successfully with security confirmation

### Part 2: XSS (Cross-Site Scripting) Demo

#### Step 1: Test Normal Comment
1. Go to **Comments Demo** tab
2. Make sure "Vulnerable Mode" is **ON**
3. Add a normal comment:
   - Name: `Your Name`
   - Comment: `This is a normal comment`
4. ✅ Comment appears normally

#### Step 2: Test XSS Attack
1. Keep "Vulnerable Mode" **ON**
2. Try XSS payload in comment:
   - Name: `Hacker`
   - Comment: `<script>alert('XSS Attack!')</script>`
3. Click "Add Comment"
4. 🚨 **Attack Success!** - You should see:
   - JavaScript alert popup
   - Malicious script executed in browser
   - Security warning about XSS vulnerability

#### Step 3: Try More XSS Payloads
Try these additional XSS attacks:
```html
<img src="x" onerror="alert('XSS via img tag')">
<svg onload="alert('SVG XSS')">
<iframe src="javascript:alert('XSS in iframe')"></iframe>
```

#### Step 4: Enable Security Fix
1. Toggle "Secure Mode" **ON**
2. Try the same XSS payload:
   - Comment: `<script>alert('XSS Attack!')</script>`
3. ✅ **Attack Blocked!** - Script tags are sanitized
4. Check existing comments - previous XSS is now sanitized

#### Step 5: Reset Demo Data
1. Click "Reset Demo Data" button
2. All malicious comments are cleared
3. Fresh start for new demonstrations

## 🔍 Technical Details

### SQL Injection Vulnerability
**Vulnerable Code:**
```javascript
// BAD: String concatenation
const query = `SELECT * FROM users WHERE username = '${username}'`;
```

**Secure Code:**
```javascript
// GOOD: Parameterized query
const query = 'SELECT * FROM users WHERE username = ?';
db.get(query, [username], callback);
```

### XSS Vulnerability
**Vulnerable Code:**
```javascript
// BAD: Raw HTML rendering
dangerouslySetInnerHTML={{ __html: comment.content }}
```

**Secure Code:**
```javascript
// GOOD: Sanitized content
const sanitizedContent = DOMPurify.sanitize(comment.content);
```

## 🎭 Attack Payloads Cheat Sheet

### SQL Injection Payloads
```sql
admin' OR '1'='1' --
' OR 1=1 --
admin'/**/OR/**/1=1--
' UNION SELECT username, password FROM users --
'; DROP TABLE users; --
```

### XSS Payloads
```html
<script>alert('XSS Attack!')</script>
<img src="x" onerror="alert('XSS via img tag')">
<svg onload="alert('SVG XSS')">
<iframe src="javascript:alert('XSS in iframe')"></iframe>
<body onload="alert('XSS')">
```

## 🛡️ Security Best Practices Demonstrated

### 1. SQL Injection Prevention
- ✅ Use parameterized queries/prepared statements
- ✅ Input validation and sanitization
- ✅ Principle of least privilege for database users
- ✅ Regular security audits

### 2. XSS Prevention
- ✅ Input sanitization (DOMPurify)
- ✅ Output encoding
- ✅ Content Security Policy (CSP)
- ✅ Avoid `dangerouslySetInnerHTML`

## 🔧 Troubleshooting

### Common Issues
1. **Server not starting**: Check if port 5000 is available
2. **Client not connecting**: Ensure server is running first
3. **Database errors**: Delete `demo.db` and restart server
4. **XSS not working**: Check browser console for errors

### Reset Everything
```bash
# Stop servers
# Delete demo.db file
rm server/demo.db

# Restart server
cd server
npm start

# Restart client
cd client
npm start
```

## 📚 Learning Objectives

After completing this demo, you should understand:
- How SQL injection attacks work and how to prevent them
- How XSS attacks work and how to sanitize user input
- The importance of input validation and output encoding
- Security-first development practices
- How small code changes can have big security implications

## 🎯 Next Steps
1. Try creating your own attack payloads
2. Explore the source code to understand the fixes
3. Implement similar security measures in your own projects
4. Learn about other web vulnerabilities (CSRF, SSRF, etc.)

---
**⚠️ Important**: This demo is for educational purposes only. Never use these techniques on systems you don't own or without explicit permission.
