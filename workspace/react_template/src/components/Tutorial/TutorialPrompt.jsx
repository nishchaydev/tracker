import { useEffect, useState } from 'react';

function TutorialPrompt({ onStart, onSkip }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show with a slight delay for smooth animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">Welcome to Your Productivity Dashboard!</h2>
              <p className="text-white/90 text-sm">Let's get you started with a quick tour</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to Level Up Your Productivity?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Take a quick 2-minute tour to learn how to use your new gamified productivity dashboard. 
              You'll earn <span className="font-semibold text-blue-600">50 XP</span> for completing the tutorial!
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <span className="text-lg">🗺️</span>
              <span className="text-sm font-medium text-gray-700">Roadmap</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <span className="text-lg">⏰</span>
              <span className="text-sm font-medium text-gray-700">Timetable</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
              <span className="text-lg">📝</span>
              <span className="text-sm font-medium text-gray-700">Journal</span>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
              <span className="text-lg">💎</span>
              <span className="text-sm font-medium text-gray-700">XP System</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onSkip}
              className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Skip Tour
            </button>
            <button
              onClick={onStart}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
            >
              <span>Start Tour</span>
              <span className="text-sm">(+50 XP)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorialPrompt;


