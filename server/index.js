const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

const app = express();
const PORT = 5000;

// Create DOMPurify instance for server-side sanitization
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./demo.db');

// Create tables and seed data
db.serialize(() => {
  // Users table for login demo
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT,
    role TEXT DEFAULT 'user'
  )`);

  // Comments table for XSS demo
  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Seed some users
  const saltRounds = 10;
  bcrypt.hash('admin123', saltRounds, (err, hash) => {
    if (!err) {
      db.run('INSERT OR IGNORE INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', 
        ['admin', hash, 'admin@demo.com', 'admin']);
    }
  });

  bcrypt.hash('user123', saltRounds, (err, hash) => {
    if (!err) {
      db.run('INSERT OR IGNORE INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', 
        ['user', hash, 'user@demo.com', 'user']);
    }
  });

  // Seed some comments
  db.run(`INSERT OR IGNORE INTO comments (name, content) VALUES 
    ('Alice', 'This is a normal comment.'),
    ('Bob', 'Great demo!'),
    ('Charlie', 'Very educational content.')`);
});

// Global variable to toggle security mode
let securityMode = false;

// ==================== AUTHENTICATION ENDPOINTS ====================

// VULNERABLE LOGIN ENDPOINT - SQL Injection vulnerability
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (securityMode) {
    // SECURE VERSION - Using parameterized queries
    console.log('🛡️ SECURE MODE: Using parameterized query');
    
    const query = 'SELECT * FROM users WHERE username = ?';
    db.get(query, [username], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (user && bcrypt.compareSync(password, user.password)) {
        res.json({
          success: true,
          message: 'Login successful!',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          },
          securityNote: '✅ Secure login using parameterized queries'
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials',
          securityNote: '✅ Authentication properly validated'
        });
      }
    });  } else {
    // VULNERABLE VERSION - Direct string concatenation (SQL Injection)
    console.log('⚠️ VULNERABLE MODE: Using string concatenation');
    
    // For demo purposes, let's use a simpler vulnerable query that only checks username
    // This makes SQL injection easier to demonstrate
    const vulnerableQuery = `SELECT * FROM users WHERE username = '${username}'`;
    console.log('⚠️ Vulnerable Query:', vulnerableQuery);
    
    db.get(vulnerableQuery, (err, user) => {
      if (err) {
        console.log('❌ SQL Error:', err.message);
        return res.status(500).json({ 
          error: 'Database error',
          sqlError: err.message,
          securityNote: '⚠️ SQL injection caused database error: ' + err.message,
          vulnerableQuery: vulnerableQuery
        });
      }      if (user) {
        // Check if this is a legitimate login or SQL injection bypass
        const isLegitimateLogin = user.username === username && bcrypt.compareSync(password, user.password);
        
        // In vulnerable mode, we still check password for legitimate users
        // But SQL injection can bypass this check entirely
        if (isLegitimateLogin || username.includes("'")) {
          res.json({
            success: true,
            message: 'Login successful!',
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role
            },
            securityNote: isLegitimateLogin 
              ? '✅ Legitimate login (but still vulnerable to SQL injection)'
              : '⚠️ VULNERABILITY: SQL injection bypassed authentication!',
            vulnerableQuery: vulnerableQuery,
            bypassedAuth: !isLegitimateLogin
          });
        } else {
          // Wrong password for legitimate username
          res.status(401).json({
            success: false,
            message: 'Invalid credentials',
            securityNote: '⚠️ In vulnerable mode - try SQL injection: admin\' OR \'1\'=\'1\' --',
            vulnerableQuery: vulnerableQuery
          });
        }
      } else {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials',
          securityNote: '⚠️ In vulnerable mode - try SQL injection: admin\' OR \'1\'=\'1\' --',
          vulnerableQuery: vulnerableQuery
        });
      }
    });
  }
});

// ==================== COMMENTS ENDPOINTS (XSS Demo) ====================

// Get all comments
app.get('/api/comments', (req, res) => {
  db.all('SELECT * FROM comments ORDER BY created_at DESC', (err, comments) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (securityMode) {
      // SECURE VERSION - Sanitize output
      console.log('🛡️ SECURE MODE: Sanitizing comment content');
      const sanitizedComments = comments.map(comment => ({
        ...comment,
        content: DOMPurify.sanitize(comment.content),
        securityNote: '✅ Content sanitized with DOMPurify'
      }));
      res.json({ comments: sanitizedComments, securityMode: true });
    } else {
      // VULNERABLE VERSION - Return raw content
      console.log('⚠️ VULNERABLE MODE: Returning raw content');
      const vulnerableComments = comments.map(comment => ({
        ...comment,
        securityNote: '⚠️ Raw content - vulnerable to XSS'
      }));
      res.json({ comments: vulnerableComments, securityMode: false });
    }
  });
});

// Add new comment
app.post('/api/comments', (req, res) => {
  const { name, content } = req.body;

  if (securityMode) {
    // SECURE VERSION - Sanitize input before storing
    console.log('🛡️ SECURE MODE: Sanitizing input before storage');
    const sanitizedContent = DOMPurify.sanitize(content);
    
    db.run('INSERT INTO comments (name, content) VALUES (?, ?)', [name, sanitizedContent], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({
        success: true,
        message: 'Comment added successfully!',
        comment: {
          id: this.lastID,
          name: name,
          content: sanitizedContent
        },
        securityNote: '✅ Input sanitized before storage'
      });
    });
  } else {
    // VULNERABLE VERSION - Store raw content
    console.log('⚠️ VULNERABLE MODE: Storing raw content');
    console.log('⚠️ Potentially malicious content:', content);
    
    db.run('INSERT INTO comments (name, content) VALUES (?, ?)', [name, content], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({
        success: true,
        message: 'Comment added successfully!',
        comment: {
          id: this.lastID,
          name: name,
          content: content
        },
        securityNote: '⚠️ VULNERABILITY: Raw content stored - XSS possible!'
      });
    });
  }
});

// ==================== SECURITY MODE TOGGLE ====================

// Toggle security mode
app.post('/api/toggle-security', (req, res) => {
  securityMode = !securityMode;
  console.log(`🔄 Security mode toggled: ${securityMode ? 'SECURE' : 'VULNERABLE'}`);
  
  res.json({
    securityMode: securityMode,
    message: `Security mode is now ${securityMode ? 'ENABLED' : 'DISABLED'}`,
    note: securityMode 
      ? '🛡️ Security fixes are now active'
      : '⚠️ Application is now vulnerable for demo purposes'
  });
});

// Get current security mode
app.get('/api/security-status', (req, res) => {
  res.json({
    securityMode: securityMode,
    message: `Security mode is ${securityMode ? 'ENABLED' : 'DISABLED'}`
  });
});

// ==================== DEMO DATA ENDPOINTS ====================

// Get sample attack payloads
app.get('/api/attack-samples', (req, res) => {
  res.json({
    xss: [
      '<script>alert("XSS Attack!")</script>',
      '<img src="x" onerror="alert(\'XSS via img tag\')">',
      '<svg onload="alert(\'SVG XSS\')">',
      'javascript:alert("JavaScript protocol")',
      '<iframe src="javascript:alert(\'XSS in iframe\')"></iframe>'
    ],
    sqlInjection: [
      "admin' OR '1'='1' --",
      "' OR 1=1 --",
      "admin'/**/OR/**/1=1--",
      "' UNION SELECT username, password FROM users --",
      "'; DROP TABLE users; --"
    ]
  });
});

// Reset demo data
app.post('/api/reset-data', (req, res) => {
  db.serialize(() => {
    // Clear comments
    db.run('DELETE FROM comments');
    
    // Re-seed with clean comments
    db.run(`INSERT INTO comments (name, content) VALUES 
      ('Alice', 'This is a normal comment.'),
      ('Bob', 'Great demo!'),
      ('Charlie', 'Very educational content.')`);
  });
  
  res.json({
    success: true,
    message: 'Demo data has been reset to clean state'
  });
});

// ==================== SERVER STARTUP ====================

app.listen(PORT, () => {
  console.log('🚀 Security Demo Server running on port', PORT);
  console.log('⚠️ Starting in VULNERABLE mode for demonstration');
  console.log('🛡️ Use /api/toggle-security to enable security fixes');
  console.log('📚 Visit the React frontend to start the demo');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n💾 Closing database connection...');
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
    } else {
      console.log('✅ Database connection closed.');
    }
    process.exit(0);
  });
});
