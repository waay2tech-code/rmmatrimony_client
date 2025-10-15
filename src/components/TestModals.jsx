import React, { useState } from 'react';
import TermsModal from './TermsModal';
import PrivacyPolicyModal from './PrivacyPolicyModal';

const TestModals = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Modal Test Page</h1>
      <div className="space-x-4">
        <button 
          onClick={() => setShowTerms(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Show Terms
        </button>
        <button 
          onClick={() => setShowPrivacy(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Show Privacy Policy
        </button>
      </div>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyPolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
};

export default TestModals;