import React from 'react';
import { FaTimes } from 'react-icons/fa';

const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Terms and Conditions</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="prose max-w-none">
            <p className="text-sm text-gray-500 mb-4">Last Updated: October 1, 2025</p>
            
            <h3 className="font-bold text-lg mt-6 mb-3">1. Eligibility</h3>
            <p className="mb-4">
                    •	Users must be at least 18 years old to register.
                    •	By creating an account, you confirm that you are legally eligible to marry as per the laws of your country.
            </p>
            
            <h3 className="font-bold text-lg mt-6 mb-3">2. Account Responsibility</h3>
            <p className="mb-4">
                    •	You are responsible for maintaining the confidentiality of your login credentials.
                    •	You agree not to impersonate another person or provide false information.
            </p>
            
            <h3 className="font-bold text-lg mt-6 mb-3">3. User Conduct</h3>
            <p className="mb-4">
                    •	You agree to use RM Matrimony for lawful purposes only.
                    •	Harassment, abuse, or any form of offensive behaviour is strictly prohibited.
                    •	You must not post or transmit any content that is defamatory, obscene, or violates third-party rights.
            </p>
            
            <h3 className="font-bold text-lg mt-6 mb-3">4. Content Ownership</h3>
            <p className='mb-4'>
                •	You retain ownership of the content you post but grant RM Matrimony a non-exclusive license to use it for platform operations.
                •	RM Matrimony reserves the right to remove any content that violates these terms.
            </p>           
            <h3 className="font-bold text-lg mt-6 mb-3">5. Termination</h3>
            <p className="mb-4">
              •	RM Matrimony may suspend or terminate your account for violating these terms or engaging in fraudulent or harmful behaviour.
            </p>
            
            <h3 className="font-bold text-lg mt-6 mb-3">6. Limitation of Liability</h3>
            <p className="mb-4">
              •	RM Matrimony is not responsible for the accuracy of user profiles or the outcome of any relationship formed through the platform.
              •	We do not guarantee marriage or compatibility.
            </p>
            
            <h3 className="font-bold text-lg mt-6 mb-3">7. Modifications</h3>
            <p className="mb-4">
             • RM Matrimony reserves the right to modify these terms at any time. Continued use of the site constitutes acceptance of the updated terms.            </p>
            
            <h3 className="font-bold text-lg mt-6 mb-3">8. Governing Law </h3>
            <p className="mb-4">
            • These terms shall be interpreted and controlled by the laws of the jurisdiction where RM Matrimony conducts service.            </p>
            
            <h3 className="font-bold text-lg mt-6 mb-3">9. Subscription Fees</h3>
            <p className="mb-4">
              •	Certain services offered by RM Matrimony need an annual subscription fee.  The subscription is valid only for one year.  By subscribing, you agree to cover all applicable fees for the chosen services.</p>
            
            <h3 className="font-bold text-lg mt-6 mb-3">10. Refunds and Cancellations</h3>
            <p className="mb-4">
              •	Once paid, the registration fees are non-refundable under any circumstances.
            </p>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="bg-red-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;