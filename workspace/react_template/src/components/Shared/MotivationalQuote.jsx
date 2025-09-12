import { useState, useEffect } from 'react';
import { getRandomQuote } from '../../utils/habitUtils';

/**
 * Component to display a random motivational quote
 * @returns {JSX.Element} Motivational quote component
 */
function MotivationalQuote() {
  const [quote, setQuote] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Set initial quote
    setQuote(getRandomQuote());
    setFadeIn(true);
    
    // Change quote every 24 hours
    const storedDate = localStorage.getItem('quoteDate');
    const today = new Date().toDateString();
    
    if (storedDate !== today) {
      setQuote(getRandomQuote());
      localStorage.setItem('quoteDate', today);
    }
  }, []);
  
  // Refresh quote on demand
  const refreshQuote = () => {
    setFadeIn(false);
    setTimeout(() => {
      setQuote(getRandomQuote());
      setFadeIn(true);
    }, 300);
  };

  if (!quote) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-blue-100">
      <div className={`transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-gray-700 italic mb-2">"{quote.text}"</p>
        <p className="text-gray-500 text-right text-sm">— {quote.author}</p>
      </div>
      <button 
        onClick={refreshQuote}
        className="text-blue-500 text-xs mt-2 flex items-center hover:text-blue-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        New Quote
      </button>
    </div>
  );
}

export default MotivationalQuote;