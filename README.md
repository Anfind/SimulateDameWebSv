# Web Security Vulnerabilities Demo

This project demonstrates common web security vulnerabilities (XSS and SQL Injection) and their fixes.

## Project Structure
- `/client` - React frontend with Tailwind CSS
- `/server` - Node.js Express backend with SQLite database

## Vulnerabilities Demonstrated
1. **Cross-Site Scripting (XSS)** - Stored XSS in comments
2. **SQL Injection** - Authentication bypass in login

## Demo Flow
1. Visit vulnerable endpoints and try attack payloads
2. See the security issues in action
3. Switch to secure mode to see fixes applied

## Setup Instructions

### Server Setup
```bash
cd server
npm install
npm start
```

### Client Setup
```bash
cd client
npm install
npm start
```

## Attack Payloads to Try

### XSS Attack
In the comment form, try:
```html
<script>alert('XSS Attack!')</script>
<img src="x" onerror="alert('XSS via img tag')">
```

### SQL Injection Attack
In the login form, try:
- Username: `admin' OR '1'='1' --`
- Password: `anything`

## Security Fixes Implemented
1. **XSS Prevention**: Input sanitization using DOMPurify
2. **SQL Injection Prevention**: Parameterized queries with prepared statements
