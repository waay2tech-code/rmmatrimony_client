// src/components/AuthChoice.jsx
import { useNavigate, useLocation } from 'react-router-dom';

const AuthChoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/profile';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-orange-50">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-600 rounded-full p-4">
            <span className="text-white text-3xl font-bold">❤</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Authentication Required</h2>
        <p className="text-gray-600 mb-8">
          Please sign in to access this page or create a new account to get started
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/login', { state: { from } })}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Sign In to Existing Account
          </button>
          
          <button
            onClick={() => navigate('/register', { state: { from } })}
            className="w-full bg-white text-red-600 border-2 border-red-600 py-3 rounded-lg hover:bg-red-50 transition font-semibold"
          >
            Create New Account
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          You'll be redirected back to your intended page after authentication
        </p>
      </div>
    </div>
  );
};

export default AuthChoice;
