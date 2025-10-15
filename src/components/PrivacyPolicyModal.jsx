import React from 'react';
import { FaTimes } from 'react-icons/fa';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Privacy Policy</h2>
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
            
            <h3 className="font-bold text-lg mt-6 mb-3">1. Information We Collect</h3>
            <p className="mb-4">
              We collect information you provide directly to us when you register for an account, create or modify your profile, or communicate with other users. This includes:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Personal information such as name, email address, phone number, date of birth, gender</li>
              <li>Profile information including photos, education, occupation, and family details</li>
              <li>Communications with other users through our messaging system</li>
              <li>Information you provide when contacting our support team</li>
            </ul>
            
            <h3 className="font-bold text-lg mt-6 mb-3">2. How We Use Information</h3>
            <p className="mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide, maintain, and improve our Service</li>
              <li>Create and manage your account</li>
              <li>Enable you to connect with other users</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
            </ul>
            
            <h3 className="font-bold text-lg mt-6 mb-3">3. Information Sharing</h3>
            <p className="mb-4">
              We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners and trusted affiliates.
            </p>
            
            <h3 className="font-bold text-lg mt-6 mb-3">4. Data Security</h3>
            <p className="mb-4">
              We implement appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Site.
            </p>
            
            <h3 className="font-bold text-lg mt-6 mb-3">5. Cookies</h3>
            <p className="mb-4">
              Our Site may use "cookies" to enhance User experience. Your web browser places cookies on your hard drive for record-keeping purposes and sometimes to track information about them. User may choose to set their web browser to refuse cookies or to alert you when cookies are being sent.
            </p>
            
            <h3 className="font-bold text-lg mt-6 mb-3">6. Third-Party Services</h3>
            <p className="mb-4">
              We may employ third-party companies and individuals to facilitate our Service, to provide the Service on our behalf, to perform Service-related services, or to assist us in analyzing how our Service is used. These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
            
            <h3 className="font-bold text-lg mt-6 mb-3">7. Data Retention</h3>
            <p className="mb-4">
              We will retain your information for as long as your account is active or as needed to provide you services. If you wish to cancel your account or request that we no longer use your information to provide you services, contact us at support@rmmatrimony.com. We will retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
            </p>
            
            <h3 className="font-bold text-lg mt-6 mb-3">8. Your Rights</h3>
            <p className="mb-4">
              You have the right to access, update, or delete your personal information at any time. You can do this by logging into your account settings or by contacting us directly.
            </p>
            
            <h3 className="font-bold text-lg mt-6 mb-3">9. Children's Privacy</h3>
            <p className="mb-4">
              Our Service does not address anyone under the age of 18. We do not knowingly collect personally identifiable information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
            </p>
            
            <h3 className="font-bold text-lg mt-6 mb-3">10. Changes to This Privacy Policy</h3>
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            
            <h3 className="font-bold text-lg mt-6 mb-3">11. Contact Us</h3>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mb-4">
              Email: rmmatrimony2024@gmail.com<br />
              Phone: +91-98944 08100 
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

export default PrivacyPolicyModal;