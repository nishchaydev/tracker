import { createContext, useContext, useState, useEffect } from 'react';
import * as LocalStorage from '../utils/localStorage';

const TutorialContext = createContext();

export function TutorialProvider({ children }) {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);
  const [showTutorialPrompt, setShowTutorialPrompt] = useState(false);

  // Check if user has completed tutorial
  useEffect(() => {
    const checkTutorialStatus = async () => {
      try {
        const completed = await LocalStorage.getItem('tutorialCompleted');
        if (completed) {
          setHasCompletedTutorial(JSON.parse(completed));
        } else {
          // Show tutorial prompt for new users
          setShowTutorialPrompt(true);
        }
      } catch (error) {
        console.error('Error checking tutorial status:', error);
        setShowTutorialPrompt(true);
      }
    };

    checkTutorialStatus();
  }, []);

  const startTutorial = () => {
    setIsTutorialOpen(true);
    setShowTutorialPrompt(false);
  };

  const completeTutorial = async () => {
    setHasCompletedTutorial(true);
    setIsTutorialOpen(false);
    setShowTutorialPrompt(false);
    
    try {
      await LocalStorage.setItem('tutorialCompleted', JSON.stringify(true));
    } catch (error) {
      console.error('Error saving tutorial status:', error);
    }
  };

  const skipTutorial = () => {
    setIsTutorialOpen(false);
    setShowTutorialPrompt(false);
  };

  const resetTutorial = async () => {
    setHasCompletedTutorial(false);
    setIsTutorialOpen(false);
    setShowTutorialPrompt(false);
    
    try {
      await LocalStorage.removeItem('tutorialCompleted');
    } catch (error) {
      console.error('Error resetting tutorial status:', error);
    }
  };

  const value = {
    isTutorialOpen,
    hasCompletedTutorial,
    showTutorialPrompt,
    startTutorial,
    completeTutorial,
    skipTutorial,
    resetTutorial
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}


