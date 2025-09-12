import { useState, useEffect } from 'react';
import { useGamification } from '../../contexts/GamificationContext';

const tutorialSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Your Productivity Dashboard! 🎯',
    content: 'This is your personal gamified productivity tracker. You\'ll earn XP, level up, and unlock badges as you complete tasks and build habits.',
    target: '.dashboard-title',
    position: 'bottom'
  },
  {
    id: 'roadmap',
    title: '🗺️ Roadmap - Your Learning Journey',
    content: 'Plan and track your learning phases. Each task you complete earns you XP and brings you closer to your goals.',
    target: '[data-tutorial="roadmap"]',
    position: 'bottom'
  },
  {
    id: 'timetable',
    title: '⏰ Daily Timetable - Build Consistent Habits',
    content: 'Schedule your daily activities and track completion. Consistency is key to building lasting habits.',
    target: '[data-tutorial="timetable"]',
    position: 'bottom'
  },
  {
    id: 'journal',
    title: '📝 Journal - Reflect and Track Mood',
    content: 'Write daily entries to reflect on your progress. Track your mood and earn XP for consistency.',
    target: '[data-tutorial="journal"]',
    position: 'bottom'
  },
  {
    id: 'xp-system',
    title: '💎 XP System - Level Up Your Productivity',
    content: 'Earn XP by completing tasks, activities, and journal entries. Level up every 500 XP!',
    target: '[data-tutorial="xp-system"]',
    position: 'left'
  },
  {
    id: 'dashboard',
    title: '📊 Dashboard - Track Your Progress',
    content: 'Monitor your overall progress, streaks, and achievements. See charts and analytics of your productivity journey.',
    target: '[data-tutorial="dashboard"]',
    position: 'bottom'
  }
];

function Tutorial({ isOpen, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { addXP } = useGamification();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Add a small delay to ensure smooth animation
      setTimeout(() => {
        highlightCurrentStep();
      }, 100);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, currentStep]);

  const highlightCurrentStep = () => {
    // Remove previous highlights
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });

    const target = document.querySelector(tutorialSteps[currentStep].target);
    if (target) {
      target.classList.add('tutorial-highlight');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTutorial = () => {
    // Award XP for completing tutorial
    addXP(50, 'tutorial-complete');
    onComplete();
    onClose();
  };

  const skipTutorial = () => {
    onClose();
  };

  if (!isOpen || !isVisible) return null;

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{currentTutorial.title}</h2>
            <button
              onClick={skipTutorial}
              className="text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="mt-2 text-sm text-white/90">
            Step {currentStep + 1} of {tutorialSteps.length}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed mb-6">
            {currentTutorial.content}
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={skipTutorial}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium"
              >
                {currentStep === tutorialSteps.length - 1 ? 'Complete (+50 XP)' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;


