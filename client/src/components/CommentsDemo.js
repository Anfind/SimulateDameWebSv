import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertTriangle, CheckCircle, Copy, RefreshCw } from 'lucide-react';

function CommentsDemo({ securityMode }) {
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [securityMode]);

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/comments');
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setSubmitResult(data);
      
      if (data.success) {
        // Clear form
        setFormData({ name: '', content: '' });
        // Refresh comments
        fetchComments();
      }
    } catch (error) {
      setSubmitResult({
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
      name: 'Attacker',
      content: payload
    });
    setSubmitResult(null);
  };

  const xssPayloads = [
    '<script>alert("XSS Attack!")</script>',
    '<img src="x" onerror="alert(\'XSS via img tag\')">',
    '<svg onload="alert(\'SVG XSS\')">',
    '<iframe src="javascript:alert(\'XSS in iframe\')"></iframe>',
    '<div onclick="alert(\'Click XSS\')" style="cursor:pointer">Click me!</div>'
  ];

  // Function to render content based on security mode
  const renderContent = (content) => {
    if (securityMode) {
      // In secure mode, content is already sanitized on the server
      return <div>{content}</div>;
    } else {
      // In vulnerable mode, render raw HTML (dangerous!)
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="demo-card">
        <div className="flex items-center mb-4">
          <MessageSquare className="w-6 h-6 text-orange-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Cross-Site Scripting (XSS) Demo</h2>
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
          This comment system demonstrates XSS vulnerabilities. Try posting malicious scripts 
          to see how they can execute in vulnerable applications.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Comment Form */}
        <div className="demo-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Comment</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write your comment here..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                'Posting...'
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Post Comment
                </>
              )}
            </button>
          </form>

          {/* Quick Fill Buttons */}
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Quick Fill Attack Payloads:</h4>
            <div className="grid grid-cols-1 gap-2">
              {xssPayloads.slice(0, 3).map((payload, index) => (
                <button
                  key={index}
                  onClick={() => fillAttackPayload(payload)}
                  className="text-xs p-2 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors text-left font-mono"
                >
                  {payload}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Result */}
          {submitResult && (
            <div className={`mt-4 p-3 rounded-md border-l-4 ${
              submitResult.success 
                ? 'bg-green-50 border-green-400 text-green-700'
                : 'bg-red-50 border-red-400 text-red-700'
            }`}>
              <div className="flex items-center mb-1">
                {submitResult.success ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                  <AlertTriangle className="w-4 h-4 mr-2" />
                )}
                <span className="font-medium">{submitResult.message}</span>
              </div>
              {submitResult.securityNote && (
                <div className="text-sm mt-2">
                  <strong>Security Note:</strong> {submitResult.securityNote}
                </div>
              )}
            </div>
          )}
        </div>

        {/* XSS Payloads Reference */}
        <div className="demo-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">XSS Attack Payloads</h3>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Common XSS Payloads:</h4>
              <div className="space-y-2">
                {xssPayloads.map((payload, index) => (
                  <div key={index} className="bg-orange-50 border border-orange-200 rounded p-3">
                    <div className="flex items-start justify-between">
                      <div className="font-mono text-xs text-orange-700 flex-1 break-all">
                        {payload}
                      </div>
                      <button
                        onClick={() => fillAttackPayload(payload)}
                        className="ml-2 p-1 text-orange-600 hover:text-orange-800 flex-shrink-0"
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
                <strong>🛡️ Security Fix Active:</strong> Input sanitization removes malicious scripts. 
                XSS payloads will be rendered as plain text.
              </>
            ) : (
              <>
                <strong>⚠️ Vulnerability Active:</strong> Raw HTML execution allows XSS attacks. 
                Scripts will execute when comments are displayed!
              </>
            )}
          </div>

          <div className="mt-4">
            <button
              onClick={fetchComments}
              className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Comments
            </button>
          </div>
        </div>
      </div>

      {/* Comments Display */}
      <div className="demo-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
          <div className={`text-sm px-2 py-1 rounded ${
            securityMode ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {securityMode ? '🛡️ Sanitized Output' : '⚠️ Raw HTML Output'}
          </div>
        </div>
        
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Add one above!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900">{comment.name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </div>
                </div>
                
                <div className="text-gray-700 mb-2">
                  {renderContent(comment.content)}
                </div>

                {comment.securityNote && (
                  <div className="text-xs text-gray-500 border-t pt-2">
                    {comment.securityNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="demo-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How XSS Works</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-red-600 mb-2">❌ Vulnerable Code (Raw HTML)</h4>
            <pre className="bg-red-50 p-3 rounded text-sm overflow-x-auto">
{`// Dangerous: renders raw HTML
<div dangerouslySetInnerHTML={{
  __html: userContent
}} />`}
            </pre>
            <p className="text-sm text-gray-600 mt-2">
              Directly rendering user input as HTML allows script execution.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-green-600 mb-2">✅ Secure Code (Sanitized)</h4>
            <pre className="bg-green-50 p-3 rounded text-sm overflow-x-auto">
{`// Safe: sanitize before storage/display
const clean = DOMPurify.sanitize(userContent);
<div>{clean}</div>`}
            </pre>
            <p className="text-sm text-gray-600 mt-2">
              Sanitizing input removes malicious scripts while preserving safe content.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-medium text-blue-800 mb-2">💡 Prevention Tips:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Sanitize all user input before storing or displaying</li>
            <li>• Use Content Security Policy (CSP) headers</li>
            <li>• Validate input on both client and server side</li>
            <li>• Escape output based on context (HTML, JavaScript, CSS)</li>
            <li>• Use frameworks that auto-escape by default</li>
            <li>• Regular security scanning and penetration testing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CommentsDemo;
