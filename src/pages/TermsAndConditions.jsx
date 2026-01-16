import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaFileContract, FaShieldAlt, FaUserFriends, FaHeart } from 'react-icons/fa';

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', title: 'Eligibility', icon: <FaFileContract /> },
    { id: 'userObligations', title: 'Account Responsibility', icon: <FaUserFriends /> },
    { id: 'conduct', title: 'User Conduct', icon: <FaHeart /> },
    { id: 'contentOwnership', title: 'Content Ownership', icon: <FaShieldAlt /> },
    { id: 'termination', title: 'Termination', icon: <FaFileContract /> },
    { id: 'liability', title: 'Liability', icon: <FaShieldAlt /> },
    { id: 'modifications', title: 'Modifications', icon: <FaFileContract /> },
    { id: 'governingLaw', title: 'Governing Law', icon: <FaShieldAlt /> },
    { id: 'subscription', title: 'Subscription Fees', icon: <FaHeart /> },
    { id: 'refunds', title: 'Refunds', icon: <FaUserFriends /> }
  ];

  const termsContent = {
    introduction: {
      title: "Terms and Conditions",
      content: `
        <h2 className="text-2xl font-bold mb-4">Last Updated: January 14, 2026</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">1. Eligibility</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Users must be at least 18 years old to register.</li>
          <li>By creating an account, you confirm that you are legally eligible to marry as per the laws of your country.</li>
        </ul>
      `
    },
    userObligations: {
      title: "Account Responsibility",
      content: `
        <h3 className="text-xl font-semibold mb-3">2. Account Responsibility</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
          <li>You agree not to impersonate another person or provide false information.</li>
        </ul>
      `
    },
    conduct: {
      title: "User Conduct",
      content: `
        <h3 className="text-xl font-semibold mb-3">3. User Conduct</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>You agree to use RM Matrimony for lawful purposes only.</li>
          <li>Harassment, abuse, or any form of offensive behaviour is strictly prohibited.</li>
          <li>You must not post or transmit any content that is defamatory, obscene, or violates third-party rights.</li>
        </ul>
      `
    },
    contentOwnership: {
      title: "Content Ownership",
      content: `
        <h3 className="text-xl font-semibold mb-3">4. Content Ownership</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>You retain ownership of the content you post but grant RM Matrimony a non-exclusive license to use it for platform operations.</li>
          <li>RM Matrimony reserves the right to remove any content that violates these terms.</li>
        </ul>
      `
    },
    termination: {
      title: "Termination",
      content: `
        <h3 className="text-xl font-semibold mb-3">5. Termination</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>RM Matrimony may suspend or terminate your account for violating these terms or engaging in fraudulent or harmful behaviour.</li>
        </ul>
      `
    },
    liability: {
      title: "Limitation of Liability",
      content: `
        <h3 className="text-xl font-semibold mb-3">6. Limitation of Liability</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>RM Matrimony is not responsible for the accuracy of user profiles or the outcome of any relationship formed through the platform.</li>
          <li>We do not guarantee marriage or compatibility.</li>
        </ul>
      `
    },
    modifications: {
      title: "Modifications",
      content: `
        <h3 className="text-xl font-semibold mb-3">7. Modifications</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>RM Matrimony reserves the right to modify these terms at any time. Continued use of the site constitutes acceptance of the updated terms.</li>
        </ul>
      `
    },
    governingLaw: {
      title: "Governing Law",
      content: `
        <h3 className="text-xl font-semibold mb-3">8. Governing Law</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>These terms shall be interpreted and controlled by the laws of the jurisdiction where RM Matrimony conducts service.</li>
        </ul>
      `
    },
    subscription: {
      title: "Subscription Fees",
      content: `
        <h3 className="text-xl font-semibold mb-3">9. Subscription Fees</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Certain services offered by RM Matrimony need an annual subscription fee. The subscription is valid only for one year. By subscribing, you agree to cover all applicable fees for the chosen services.</li>
        </ul>
      `
    },
    refunds: {
      title: "Refunds and Cancellations",
      content: `
        <h3 className="text-xl font-semibold mb-3">10. Refunds and Cancellations</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Once paid, the registration fees are non-refundable under any circumstances.</li>
        </ul>
      `
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 mb-6 transition-colors"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-red-100 p-3 rounded-full">
                <FaFileContract className="text-red-600 text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Terms & Conditions</h1>
                <p className="text-gray-600 mt-2">Please read our terms carefully before using our services</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/4"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Table of Contents</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                      activeSection === section.id
                        ? 'bg-red-50 text-red-600 border-l-4 border-red-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
              
              
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-3/4"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {termsContent[activeSection].title}
                  </h2>
                  <div className="w-20 h-1 bg-red-600 rounded-full"></div>
                </div>
                
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: termsContent[activeSection].content }}
                />
              </div>
              
              {/* Navigation Buttons */}
              <div className="border-t border-gray-200 px-6 md:px-8 py-6 bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <button
                    onClick={() => {
                      const currentIndex = sections.findIndex(s => s.id === activeSection);
                      if (currentIndex > 0) {
                        setActiveSection(sections[currentIndex - 1].id);
                      }
                    }}
                    disabled={sections.findIndex(s => s.id === activeSection) === 0}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
                  >
                    <FaArrowLeft />
                    Previous
                  </button>
                
                <button
                    onClick={() => {
                      const currentIndex = sections.findIndex(s => s.id === activeSection);
                      if (currentIndex < sections.length - 1) {
                        setActiveSection(sections[currentIndex + 1].id);
                      }
                    }}
                    disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
                  >
                    Next
                    <FaArrowLeft className="rotate-180" />
                  </button>
                </div>
              </div>
            </div>

            {/* Acceptance Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8"
            >
              {/* <div className="text-center">
                <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaHeart className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Agreement Confirmation</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  By continuing to use RM Matrimony services, you confirm that you have read, understood, and agree to abide by these Terms and Conditions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    I Agree & Continue
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    Return to Home
                  </button>
                </div>
              </div> */}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;