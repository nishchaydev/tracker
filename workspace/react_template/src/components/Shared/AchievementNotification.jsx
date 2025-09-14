import { useState, useEffect } from 'react';

function AchievementNotification({ achievement, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!achievement) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-2xl max-w-sm">
        <div className="flex items-center space-x-3">
          <div className="text-3xl animate-bounce">🏆</div>
          <div>
            <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
            <p className="text-sm opacity-90">{achievement.name}</p>
            <p className="text-xs opacity-75">{achievement.description}</p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default AchievementNotification;
