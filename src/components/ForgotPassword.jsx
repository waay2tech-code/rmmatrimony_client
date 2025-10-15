// src/components/ForgotPassword.jsx
import { useState } from 'react';
import { FiMail, FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';
import { authService } from '../services/authService';

const ForgotPassword = ({ onClose, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email format
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Rate limiting - prevent spam requests
    if (attemptCount >= 3) {
      setError('Too many attempts. Please wait before trying again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await authService.forgotPassword(email.toLowerCase().trim());
      
      if (result.success) {
        setSuccess(true);
        setAttemptCount(prev => prev + 1);
        
        // Show development mode message if applicable
        if (result.devMode) {
          console.log('🔧 Development Mode: Check server console for reset link');
        }
      } else {
        setError(result.message || 'Failed to send reset email');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message || 'An error occurred. Please try again.');
      setAttemptCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setEmail('');
    setError('');
    setSuccess(false);
    if (onBackToLogin) {
      onBackToLogin();
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <FiCheck className="text-green-600 text-3xl" />
          </div>
        </div>

        {/* Success Message */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-4">
            If an account with <strong>{email}</strong> exists, we've sent password reset instructions to your email address.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 text-left">
            <div className="text-sm text-blue-700">
              <h4 className="font-medium mb-2">What to do next:</h4>
              <ul className="space-y-1">
                <li className="text-xs sm:text-sm">• Check your email inbox (including spam folder)</li>
                <li className="text-xs sm:text-sm">• <strong>For development:</strong> Check the server console for the reset link</li>
                <li className="text-xs sm:text-sm">• Click the reset link within 30 minutes</li>
                <li className="text-xs sm:text-sm">• Follow the instructions to create a new password</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleBackToLogin}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-200 font-medium"
          >
            Back to Login
          </button>
          
          <button
            onClick={() => {
              setSuccess(false);
              setEmail('');
            }}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition duration-200"
          >
            Send Another Email
          </button>
        </div>

        {/* Security Notice */}
        <div className="text-xs text-gray-500 mt-4">
          <p>Didn't receive the email? Check your spam folder or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-600 rounded-full p-3">
            <FiMail className="text-white text-2xl" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Forgot Password?
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          No worries! Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="flex items-center border rounded-lg px-3 py-3 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500">
            <FiMail className="text-gray-400 mr-3" />
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={handleEmailChange}
              className="w-full outline-none"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>
          
          {/* Email validation indicator */}
          {email && (
            <div className="mt-1 flex items-center text-sm">
              {validateEmail(email) ? (
                <div className="flex items-center text-green-600">
                  <FiCheck className="mr-1" />
                  Valid email format
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <FiX className="mr-1" />
                  Invalid email format
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !email || !validateEmail(email)}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-200 disabled:bg-red-400 disabled:cursor-not-allowed font-medium"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending Reset Link...
            </span>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      {/* Back to Login */}
      <button
        onClick={handleBackToLogin}
        disabled={loading}
        className="w-full flex items-center justify-center text-gray-600 hover:text-red-600 transition duration-200 disabled:text-gray-400"
      >
        <FiArrowLeft className="mr-2" />
        Back to Login
      </button>

      {/* Security Information */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <h4 className="font-medium mb-2 text-gray-700">Security Information:</h4>
        <ul className="space-y-1 text-xs">
          <li className="text-xs">• Reset links expire after 30 minutes for security</li>
          <li className="text-xs">• You can only request 3 reset emails per session</li>
          <li className="text-xs">• We never reveal if an email exists in our system</li>
          <li className="text-xs">• Always check your spam folder for the reset email</li>
        </ul>
      </div>

      {/* Rate Limiting Warning */}
      {attemptCount >= 2 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-yellow-700 text-sm">
          <p>You have made {attemptCount} attempts. Maximum 3 attempts allowed per session.</p>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;