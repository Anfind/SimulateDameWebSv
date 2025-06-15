import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Shield, Database, Code, ExternalLink, RefreshCw } from 'lucide-react';

function Dashboard({ securityMode }) {
  const [attackSamples, setAttackSamples] = useState({ xss: [], sqlInjection: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttackSamples();
  }, []);

  const fetchAttackSamples = async () => {
    try {
      const response = await fetch('/api/attack-samples');
      const data = await response.json();
      setAttackSamples(data);
    } catch (error) {
      console.error('Failed to fetch attack samples:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetData = async () => {
    try {
      const response = await fetch('/api/reset-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Failed to reset data:', error);
      alert('Failed to reset demo data');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="demo-card">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Web Security Vulnerabilities Demo
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Learn about common web security vulnerabilities and their prevention techniques
          </p>
          
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className={`flex items-center px-4 py-2 rounded-lg ${
              securityMode ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'
            }`}>
              {securityMode ? <Shield className="w-5 h-5 mr-2" /> : <AlertTriangle className="w-5 h-5 mr-2" />}
              <span className="font-medium">
                {securityMode ? 'Security Fixes Enabled' : 'Vulnerable Mode Active'}
              </span>
            </div>
          </div>

          <button
            onClick={resetData}
            className="flex items-center mx-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* Demo Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* SQL Injection Demo */}
        <div className="demo-card">
          <div className="flex items-center mb-4">
            <Database className="w-6 h-6 text-red-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">SQL Injection Demo</h3>
          </div>
          
          <p className="text-gray-600 mb-4">
            Experience how SQL injection attacks can bypass authentication and access unauthorized data.
          </p>

          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Try these attack payloads:</h4>
            <div className="space-y-2">
              {attackSamples.sqlInjection.slice(0, 3).map((payload, index) => (
                <div key={index} className="attack-payload">
                  {payload}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className={`security-note ${securityMode ? 'success' : 'warning'}`}>
              {securityMode ? (
                <>
                  <strong>🛡️ Secure Mode:</strong> Parameterized queries prevent SQL injection attacks.
                </>
              ) : (
                <>
                  <strong>⚠️ Vulnerable Mode:</strong> Direct string concatenation allows SQL injection.
                </>
              )}
            </div>

            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try SQL Injection Demo
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>

        {/* XSS Demo */}
        <div className="demo-card">
          <div className="flex items-center mb-4">
            <Code className="w-6 h-6 text-orange-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Cross-Site Scripting (XSS) Demo</h3>
          </div>
          
          <p className="text-gray-600 mb-4">
            See how malicious scripts can be injected and executed in web applications.
          </p>

          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Try these XSS payloads:</h4>
            <div className="space-y-2">
              {attackSamples.xss.slice(0, 3).map((payload, index) => (
                <div key={index} className="attack-payload">
                  {payload}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className={`security-note ${securityMode ? 'success' : 'warning'}`}>
              {securityMode ? (
                <>
                  <strong>🛡️ Secure Mode:</strong> Input sanitization prevents XSS attacks.
                </>
              ) : (
                <>
                  <strong>⚠️ Vulnerable Mode:</strong> Raw content execution allows XSS.
                </>
              )}
            </div>

            <Link
              to="/comments"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try XSS Demo
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="demo-card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">How This Demo Works</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">🎯 Vulnerable Mode (Default)</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• SQL queries built with string concatenation</li>
              <li>• User input stored and displayed without sanitization</li>
              <li>• Demonstrates real security vulnerabilities</li>
              <li>• Shows impact of attacks on the application</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">🛡️ Secure Mode</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Parameterized queries prevent SQL injection</li>
              <li>• DOMPurify sanitizes user input</li>
              <li>• Implements security best practices</li>
              <li>• Shows how to properly fix vulnerabilities</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Educational Purpose Only:</strong> This application intentionally contains 
            security vulnerabilities for demonstration purposes. Never use vulnerable patterns in 
            production applications!
          </p>
        </div>
      </div>

      {/* Full Attack Payloads Reference */}
      <div className="demo-card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Attack Payloads Reference</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">SQL Injection Payloads</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {attackSamples.sqlInjection.map((payload, index) => (
                <div key={index} className="text-xs bg-red-50 border border-red-200 rounded px-2 py-1 font-mono">
                  {payload}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">XSS Payloads</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {attackSamples.xss.map((payload, index) => (
                <div key={index} className="text-xs bg-orange-50 border border-orange-200 rounded px-2 py-1 font-mono">
                  {payload}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
