import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "./CouponHunt.css"

export default function CouponHunt() {
  const [selectedRetailer, setSelectedRetailer] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');

  const handleRetailerSelect = async (retailer) => {
    setSelectedRetailer(retailer);
    setError('');
    setIsValidating(true);
    
    try {
      const response = await fetch('http://localhost:5000/generate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ retailer }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate coupon');
      }

      const data = await response.json();
      if (data.code) {
        setGeneratedCode(data.code);
      } else {
        throw new Error('No coupon code received');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate coupon. Please try again.');
      console.error('Error generating coupon:', err);
    } finally {
      setIsValidating(false);
    }
  };

  const [customRetailer, setCustomRetailer] = useState('');
  const retailers = ['Amazon', 'Walmart', 'Target'];

  return (
    <div className="container mx-auto p-6" style={{ maxWidth: '800px', animation: 'fadeIn 0.6s forwards' }}>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Coupon Hunt
      </motion.h1>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          AI Coupon Generator
        </h2>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter a retailer name..."
            value={customRetailer}
            onChange={(e) => setCustomRetailer(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          />
          <button
            onClick={() => handleRetailerSelect(customRetailer)}
            disabled={isValidating || !customRetailer.trim()}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg mb-6"
          >
            Generate Coupon for {customRetailer || 'Custom Retailer'}
          </button>
        </div>
        <p className="text-gray-600 mb-4">Or choose from popular retailers:</p>
        <div className="grid grid-cols-3 gap-6 mb-6">
          {retailers.map((retailer) => (
            <button
              key={retailer}
              onClick={() => handleRetailerSelect(retailer)}
              disabled={isValidating}
              className={`
                px-4 py-3 rounded-lg text-sm font-medium
                transition-all duration-200 ease-in-out
                ${selectedRetailer === retailer ? 'selected' : ''}
                ${isValidating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                border border-gray-200
                focus:outline-none
              `}
            >
              {retailer}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isValidating && (
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">Generating code...</span>
          </div>
        )}

        {generatedCode && (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Generated Coupon Code:</h3>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {generatedCode}
              </p>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generatedCode);
                  const btn = document.activeElement;
                  if (btn) {
                    btn.textContent = 'Copied!';
                    setTimeout(() => {
                      btn.textContent = 'Copy to Clipboard';
                    }, 2000);
                  }
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 
                  transition-colors duration-200 focus:outline-none focus:ring-2 
                  focus:ring-blue-500 focus:ring-opacity-50"
              >
                Copy to Clipboard
              </button>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold mb-2">Description:</h4>
              <p className="text-gray-600 mb-4">
                {selectedRetailer === 'Target' 
                  ? 'Up to 20% off on select items, plus free shipping on orders over $35.'
                  : `Special discount for ${selectedRetailer} purchases.`}
              </p>
              
              <h4 className="font-semibold mb-2">Details:</h4>
              <ul className="text-gray-600 list-disc pl-5 space-y-2">
                <li>Valid online and in stores (where applicable)</li>
                <li>Cannot be combined with other offers</li>
                <li>Some exclusions may apply</li>
                <li>Limited time offer</li>
              </ul>
              
              <p className="text-sm text-gray-500 mt-4 italic">
                * Exact savings may vary. Check retailer's website for full terms and conditions.
              </p>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2 text-center">1. Select Retailer</h3>
            <p className="text-gray-600 text-center">Choose from our supported retailers list</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2 text-center">2. Generate Code</h3>
            <p className="text-gray-600 text-center">Our AI predicts potential valid codes</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2 text-center">3. Validate & Save</h3>
            <p className="text-gray-600 text-center">We'll verify the code works instantly</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}