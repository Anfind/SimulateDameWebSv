import React, { useState } from 'react';
import { Database, Lock, User, AlertTriangle, CheckCircle, Copy } from 'lucide-react';

function LoginDemo({ securityMode }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult({
        ...data,
        status: response.status
      });
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error occurred',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const fillAttackPayload = (payload) => {
    setFormData({
      username: payload,
      password: 'anything'
    });
    setResult(null);
  };

  const fillLegitimate = () => {
    setFormData({
      username: 'admin',
      password: 'admin123'
    });
    setResult(null);
  };

  const attackPayloads = [
    "admin' OR '1'='1' --",
    "' OR 1=1 --",
    "admin'/**/OR/**/1=1--",
    "' UNION SELECT username, password FROM users --"
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="demo-card">
        <div className="flex items-center mb-4">
          <Database className="w-6 h-6 text-red-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">SQL Injection Demo</h2>
          <div className={`ml-auto vulnerability-indicator ${securityMode ? 'secure' : 'vulnerable'}`}>
            {securityMode ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                Secure Mode
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 mr-1" />
                Vulnerable Mode
              </>
            )}
          </div>
        </div>
        
        <p className="text-gray-600">
          This login form demonstrates SQL injection vulnerabilities. Try the attack payloads below 
          to see how an attacker can bypass authentication.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Login Form */}
        <div className="demo-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Form</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 mr-2" />
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                'Logging in...'
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Quick Fill Buttons */}
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Quick Fill:</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={fillLegitimate}
                className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
              >
                Legitimate Login
              </button>
              {attackPayloads.map((payload, index) => (
                <button
                  key={index}
                  onClick={() => fillAttackPayload(payload)}
                  className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Attack {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Attack Payloads */}
        <div className="demo-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SQL Injection Payloads</h3>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Legitimate Credentials:</h4>
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm">
                    <div>Username: admin</div>
                    <div>Password: admin123</div>
                  </div>
                  <button
                    onClick={fillLegitimate}
                    className="p-1 text-green-600 hover:text-green-800"
                    title="Copy to form"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Attack Payloads:</h4>
              <div className="space-y-2">
                {attackPayloads.map((payload, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-sm text-red-700">{payload}</div>
                      <button
                        onClick={() => fillAttackPayload(payload)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Copy to form"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`mt-4 security-note ${securityMode ? 'success' : 'warning'}`}>
            {securityMode ? (
              <>
                <strong>🛡️ Security Fix Active:</strong> Using parameterized queries prevents SQL injection. 
                Attack payloads will be treated as literal strings, not executable code.
              </>
            ) : (
              <>
                <strong>⚠️ Vulnerability Active:</strong> String concatenation allows SQL injection. 
                Try the attack payloads to bypass authentication!
              </>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="demo-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Result</h3>
          
          <div className={`p-4 rounded-md border-l-4 ${
            result.success 
              ? 'bg-green-50 border-green-400 text-green-700'
              : 'bg-red-50 border-red-400 text-red-700'
          }`}>
            <div className="flex items-center mb-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertTriangle className="w-5 h-5 mr-2" />
              )}
              <span className="font-medium">{result.message}</span>
            </div>

            {result.user && (
              <div className="mt-3 bg-white p-3 rounded border">
                <h4 className="font-medium mb-2">User Information:</h4>
                <div className="text-sm space-y-1">
                  <div><strong>ID:</strong> {result.user.id}</div>
                  <div><strong>Username:</strong> {result.user.username}</div>
                  <div><strong>Email:</strong> {result.user.email}</div>
                  <div><strong>Role:</strong> {result.user.role}</div>
                </div>
              </div>
            )}

            {result.vulnerableQuery && (
              <div className="mt-3 bg-gray-100 p-3 rounded border">
                <h4 className="font-medium mb-2">SQL Query Executed:</h4>
                <code className="text-sm text-gray-800">{result.vulnerableQuery}</code>
              </div>
            )}

            {result.securityNote && (
              <div className="mt-3 text-sm">
                <strong>Security Note:</strong> {result.securityNote}
              </div>
            )}
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="demo-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How SQL Injection Works</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-red-600 mb-2">❌ Vulnerable Code (String Concatenation)</h4>
            <pre className="bg-red-50 p-3 rounded text-sm overflow-x-auto">
{`const query = \`SELECT * FROM users 
WHERE username = '\${username}' 
AND password = '\${password}'\`;`}
            </pre>
            <p className="text-sm text-gray-600 mt-2">
              Direct string interpolation allows attackers to inject malicious SQL code.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-green-600 mb-2">✅ Secure Code (Parameterized Queries)</h4>
            <pre className="bg-green-50 p-3 rounded text-sm overflow-x-auto">
{`const query = 'SELECT * FROM users WHERE username = ?';
db.get(query, [username], callback);`}
            </pre>
            <p className="text-sm text-gray-600 mt-2">
              Parameterized queries treat user input as data, not executable code.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-medium text-blue-800 mb-2">💡 Prevention Tips:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Always use parameterized queries or prepared statements</li>
            <li>• Validate and sanitize all user inputs</li>
            <li>• Use stored procedures when possible</li>
            <li>• Implement least privilege database access</li>
            <li>• Regular security testing and code reviews</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LoginDemo;
