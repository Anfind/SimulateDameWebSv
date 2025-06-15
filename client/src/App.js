import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, ShieldOff, AlertTriangle, CheckCircle, Home, LogIn, MessageSquare } from 'lucide-react';
import LoginDemo from './components/LoginDemo';
import CommentsDemo from './components/CommentsDemo';
import Dashboard from './components/Dashboard';

function App() {
  const [securityMode, setSecurityMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch initial security status
  useEffect(() => {
    fetchSecurityStatus();
  }, []);

  const fetchSecurityStatus = async () => {
    try {
      const response = await fetch('/api/security-status');
      const data = await response.json();
      setSecurityMode(data.securityMode);
    } catch (error) {
      console.error('Failed to fetch security status:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSecurity = async () => {
    try {
      const response = await fetch('/api/toggle-security', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setSecurityMode(data.securityMode);
      
      // Show alert about the toggle
      alert(data.message + '\n\n' + data.note);
    } catch (error) {
      console.error('Failed to toggle security:', error);
      alert('Failed to toggle security mode');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  🔒 Web Security Demo
                </h1>
                <SecurityIndicator securityMode={securityMode} />
              </div>
              
              <div className="flex items-center space-x-4">
                <Navigation />
                <SecurityToggle 
                  securityMode={securityMode} 
                  onToggle={toggleSecurity} 
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard securityMode={securityMode} />} />
            <Route path="/login" element={<LoginDemo securityMode={securityMode} />} />
            <Route path="/comments" element={<CommentsDemo securityMode={securityMode} />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-500">
              <p className="mb-2">
                🎯 <strong>Educational Demo:</strong> This application intentionally contains vulnerabilities for learning purposes.
              </p>
              <p>
                Toggle security mode to see fixes in action. Never use vulnerable code in production!
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

// Security mode indicator component
function SecurityIndicator({ securityMode }) {
  return (
    <div className={`vulnerability-indicator ${securityMode ? 'secure' : 'vulnerable'}`}>
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
  );
}

// Navigation component
function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/login', label: 'SQL Injection Demo', icon: LogIn },
    { path: '/comments', label: 'XSS Demo', icon: MessageSquare },
  ];

  return (
    <nav className="flex space-x-1">
      {navItems.map(({ path, label, icon: Icon }) => (
        <Link
          key={path}
          to={path}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            location.pathname === path
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

// Security toggle button
function SecurityToggle({ securityMode, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        securityMode
          ? 'bg-success-100 text-success-700 hover:bg-success-200'
          : 'bg-danger-100 text-danger-700 hover:bg-danger-200'
      }`}
    >
      {securityMode ? (
        <>
          <Shield className="w-4 h-4 mr-2" />
          Disable Security
        </>
      ) : (
        <>
          <ShieldOff className="w-4 h-4 mr-2" />
          Enable Security
        </>
      )}
    </button>
  );
}

export default App;
