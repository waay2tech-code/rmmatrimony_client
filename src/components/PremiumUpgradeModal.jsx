// PremiumUpgradeModal.js
import React, { useState, useEffect } from 'react';
import { FaCrown, FaTimes, FaWhatsapp, FaCheckCircle, FaCopy } from 'react-icons/fa';
import QRCode from 'qrcode';

const PremiumUpgradeModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState('');

  // Using your working UPI ID
  const UPI_ID = "rmmatrimony2024@okicici";
  const PREMIUM_AMOUNT = "3000";
  const MOBILE_NUMBER = "9842490100"; // Still showing this for reference
  const WhatsApp_NUMBER = "919842490100";
  
  // UPI payment string with amount included
  const upiString = `upi://pay?pa=${UPI_ID}&pn=RM%20Matrimony&am=${PREMIUM_AMOUNT}&cu=INR`;
  // QR content with amount for automatic filling
  const qrContent = upiString;

  // Generate QR Code when component mounts
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Generate a QR code with amount included
        const qrDataURL = await QRCode.toDataURL(qrContent, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M' // Medium error correction for better scanning
        });
        setQrCodeImage(qrDataURL);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    if (isOpen) {
      generateQRCode();
    }
  }, [isOpen, qrContent]);

  const generateGPayLink = () => {
    // For mobile devices, this will open GPay app
    window.open(upiString, '_blank');
  };

  const copyNumber = () => {
    navigator.clipboard.writeText(MOBILE_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openWhatsApp = () => {
    const message = `Hi, I want to upgrade to Premium. I have paid ₹${PREMIUM_AMOUNT} for Premium upgrade. Please find the payment screenshot attached.`;
    const whatsappUrl = `https://wa.me/${WhatsApp_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <FaCrown className="text-yellow-500 text-xl" />
            <h2 className="text-xl font-bold text-gray-800">Upgrade to Premium</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-bold">Premium Benefits</h3>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• See who liked your profile</li>
                    <li>• Unlimited profile views</li>
                    <li>• Priority customer support</li>
                    <li>• Advanced matching features</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
                  <p className="text-lg font-bold text-yellow-800">Premium Amount: ₹{PREMIUM_AMOUNT}</p>
                  <p className="text-sm text-yellow-700 mt-1">One-time payment</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Payment Process:</h4>
                  <ol className="text-sm text-blue-700 space-y-1 text-left">
                    <li>1. Click "Proceed to Payment" below</li>
                    <li>2. Scan QR code to pay ₹{PREMIUM_AMOUNT}</li>
                    <li>3. Amount will be pre-filled in UPI app</li>
                    <li>4. Confirm and complete payment</li>
                    <li>5. Send screenshot to WhatsApp number</li>
                  </ol>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all"
              >
                Proceed to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                
                {/* Generated QR Code */}
                <div className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-4">
                  <div className="text-center">
                    {qrCodeImage ? (
                      <img 
                        src={qrCodeImage} 
                        alt="UPI QR Code" 
                        className="w-48 h-48 mx-auto mb-4 border rounded-lg"
                      />
                    ) : (
                      <div className="w-48 h-48 bg-gray-100 mx-auto mb-4 flex items-center justify-center border rounded-lg">
                        <span className="text-sm text-gray-500">Generating QR Code...</span>
                      </div>
                    )}
                    <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-3">
                      <p className="font-bold text-lg text-green-800">₹{PREMIUM_AMOUNT}</p>
                      <p className="text-sm text-green-700">Amount will be pre-filled</p>
                    </div>
                    <p className="text-sm text-gray-600">Scan with Google Pay or other UPI app</p>
                    <p className="text-xs text-gray-500 mt-2">to {UPI_ID}</p>
                  </div>
                </div>

                {/* Alternative payment instructions */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Payment Options:</h4>
                  <ul className="text-sm text-orange-700 text-left space-y-2">
                    <li>• <strong>Scan QR Code</strong> - Amount pre-filled automatically</li>
                    <li>• <strong>Copy UPI ID</strong> and paste in your UPI app</li>
                    <li>• <strong>Manual Entry</strong>: Enter UPI ID in Google Pay</li>
                  </ul>
                  <div className="flex items-center justify-between bg-white p-2 rounded border mt-3">
                    <span className="font-mono text-sm">{UPI_ID}</span>
                    <button
                      onClick={copyUpiId}
                      className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                    >
                      <FaCopy size={14} />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-800 mb-2">After Payment:</h4>
                  <p className="text-sm text-green-700 mb-2">Send payment screenshot to:</p>
                  <div className="flex items-center justify-between bg-white p-2 rounded border">
                    <span className="font-mono text-lg">{MOBILE_NUMBER}</span>
                    <button
                      onClick={copyNumber}
                      className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                    >
                      <FaCopy size={14} />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <button
                  onClick={openWhatsApp}
                  className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <FaWhatsapp size={20} />
                  Open WhatsApp
                </button>

                <button
                  onClick={() => setStep(3)}
                  className="w-full bg-gray-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors mt-2"
                >
                  I've Sent the Screenshot
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <FaCheckCircle className="mx-auto text-green-500 text-4xl" />
              <h3 className="text-lg font-semibold text-green-800">Instructions Completed!</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700">
                  Please send your payment screenshot to <strong>{MOBILE_NUMBER}</strong> via WhatsApp
                </p>
                <p className="text-sm text-green-700 mt-2">
                  We'll verify your payment and activate Premium access within 24 hours.
                </p>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={openWhatsApp}
                  className="w-full bg-green-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <FaWhatsapp size={18} />
                  Send Screenshot Now
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full bg-blue-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumUpgradeModal;