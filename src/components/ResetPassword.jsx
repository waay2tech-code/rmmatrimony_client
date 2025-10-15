// src/components/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiCheck, FiX, FiShield } from 'react-icons/fi';
import { authService } from '../services/authService';
import { validatePasswordForm } from '../utils/passwordValidation';

const ResetPassword = () => {
  console.log('🔥 ResetPassword component is rendering!');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  console.log('🎫 Token extracted:', token);

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    strength: { level: 'very-weak', color: '#ef4444', percentage: 0 },
    isValid: false,
    requirements: [],
    passwordMatch: null,
    canSubmit: false
  });

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('Invalid or missing reset token. Please request a new password reset.');
    }
  }, [token]);

  // Validate passwords in real-time
  useEffect(() => {
    if (formData.newPassword || formData.confirmPassword) {
      const validation = validatePasswordForm(formData.newPassword, formData.confirmPassword);
      setPasswordValidation(validation);
    }
  }, [formData.newPassword, formData.confirmPassword]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!tokenValid) {
      setError('Invalid reset token. Please request a new password reset.');
      return;
    }

    if (!passwordValidation.canSubmit) {
      setError('Please ensure your password meets all requirements and both passwords match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await authService.resetPassword(token, formData.newPassword, formData.confirmPassword);
      
      if (result.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Password reset successful! Please log in with your new password.' 
            }
          });
        }, 3000);
      } else {
        setError(result.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message || 'An error occurred while resetting your password');
      
      // If token is invalid/expired, mark as such
      if (err.message?.includes('token') || err.message?.includes('expired')) {
        setTokenValid(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = (level) => {
    const colors = {
      'very-weak': '#ef4444',
      'weak': '#f97316',
      'medium': '#eab308',
      'strong': '#84cc16',
      'very-strong': '#22c55e'
    };
    return colors[level] || '#ef4444';
  };

  const getStrengthText = (level) => {
    const texts = {
      'very-weak': 'Very Weak',
      'weak': 'Weak',
      'medium': 'Medium',
      'strong': 'Strong',
      'very-strong': 'Very Strong'
    };
    return texts[level] || 'Very Weak';
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-[#fff5f5] to-[#fdf1f1] p-4">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <FiCheck className="text-green-600 text-4xl" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Password Reset Successful!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Your password has been successfully updated. You can now log in with your new password.
          </p>
          
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 text-left">
            <div className="text-sm text-green-700">
              <h4 className="font-medium mb-2">Security Notice:</h4>
              <ul className="space-y-1">
                <li className="text-xs sm:text-sm">• Your password has been securely updated</li>
                <li className="text-xs sm:text-sm">• All active sessions have been logged out</li>
                <li className="text-xs sm:text-sm">• You'll be redirected to login shortly</li>
              </ul>
            </div>
          </div>
          
          <div className="animate-pulse text-sm text-gray-500">
            Redirecting to login page...
          </div>
        </div>
      </div>
    );
  }

  // Invalid token screen
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-[#fff5f5] to-[#fdf1f1] p-4">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-4">
              <FiX className="text-red-600 text-4xl" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Invalid Reset Link
          </h2>
          
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired. Please request a new password reset.
          </p>
          
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-200 font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-[#fff5f5] to-[#fdf1f1] p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-red-600 rounded-full p-3">
              <FiShield className="text-white text-2xl" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create New Password
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Please enter a strong password that meets our security requirements.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="flex items-center border rounded-lg px-3 py-3 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500">
                <FiLock className="text-gray-400 mr-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  placeholder="Enter your new password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full outline-none"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Password Strength:</span>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: passwordValidation.strength.color }}
                  >
                    {getStrengthText(passwordValidation.strength.level)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: passwordValidation.strength.color,
                      width: `${passwordValidation.strength.percentage}%`
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Password Requirements */}
            {formData.newPassword && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Password Requirements:</h4>
                <div className="space-y-1">
                  {passwordValidation.requirements.map((req) => (
                    <div key={req.id} className="flex items-center text-sm">
                      {req.met ? (
                        <FiCheck className="text-green-500 mr-2 flex-shrink-0" />
                      ) : (
                        <FiX className="text-red-500 mr-2 flex-shrink-0" />
                      )}
                      <span className={req.met ? 'text-green-700 text-xs sm:text-sm' : 'text-red-700 text-xs sm:text-sm'}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="flex items-center border rounded-lg px-3 py-3 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500">
                <FiLock className="text-gray-400 mr-3" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full outline-none"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className="mt-2 flex items-center text-sm">
                {passwordValidation.passwordMatch?.matches ? (
                  <div className="flex items-center text-green-600">
                    <FiCheck className="mr-1" />
                    Passwords match
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <FiX className="mr-1" />
                    Passwords do not match
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
            disabled={loading || !passwordValidation.canSubmit}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-200 disabled:bg-red-400 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating Password...
              </span>
            ) : (
              'Update Password'
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <h4 className="font-medium mb-2 text-gray-700">Security Information:</h4>
          <ul className="space-y-1 text-xs">
            <li className="text-xs">• Your new password will be encrypted and stored securely</li>
            <li className="text-xs">• All existing sessions will be logged out for security</li>
            <li className="text-xs">• This reset link can only be used once</li>
            <li className="text-xs">• You'll need to log in again after the password is updated</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;