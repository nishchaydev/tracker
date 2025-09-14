import { useState, useEffect, createContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Layout/Header';
import LandingPage from './components/Landing/LandingPage';
import Dashboard from './components/Dashboard/Dashboard';
import Roadmap from './components/Roadmap/Roadmap';
import Timetable from './components/Timetable/Timetable';
import Journal from './components/Journal/Journal';
import Tutorial from './components/Tutorial/Tutorial';
import TutorialPrompt from './components/Tutorial/TutorialPrompt';
import * as LocalStorage from './utils/localStorage';
import { GamificationProvider } from './contexts/GamificationContext';
import { TutorialProvider, useTutorial } from './contexts/TutorialContext';
import { ThemeProvider } from './contexts/ThemeContext';
import XPConfetti from './components/Shared/XPConfetti';
// Default data imports for static hosting compatibility
// Note: Do not load demo data in production UX. Initialize empty structures
// and let users create content to avoid pre-filled clutter.

// Create context for global state
export const AppContext = createContext();

function App() {
  // Initialize state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [roadmapData, setRoadmapData] = useState(null);
  const [timetableData, setTimetableData] = useState(null);
  const [journalData, setJournalData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load data on initial render using static defaults to support GitHub Pages
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Initialize roadmap empty by default
        const savedRoadmap = await LocalStorage.getItem('roadmapData');
        if (savedRoadmap) {
          setRoadmapData(JSON.parse(savedRoadmap));
        } else {
          const emptyRoadmap = { phases: [] };
          setRoadmapData(emptyRoadmap);
          await LocalStorage.setItem('roadmapData', JSON.stringify(emptyRoadmap));
        }

        // Load timetable data
        const savedTimetable = await LocalStorage.getItem('timetableData');
        if (savedTimetable) {
          setTimetableData(JSON.parse(savedTimetable));
        } else {
          const emptyTimetable = {
            dailyActivities: [],
            weeklyGoals: { studyHours: 0, workouts: 0, breaks: 0, deepWork: 0 }
          };
          setTimetableData(emptyTimetable);
          await LocalStorage.setItem('timetableData', JSON.stringify(emptyTimetable));
        }

        // Load journal data
        const savedJournal = await LocalStorage.getItem('journalData');
        if (savedJournal) {
          setJournalData(JSON.parse(savedJournal));
        } else {
          const emptyJournal = { entries: [], moodOptions: ['🙂','😐','😔'], commonTags: ['focus','health','learning'] };
          setJournalData(emptyJournal);
          await LocalStorage.setItem('journalData', JSON.stringify(emptyJournal));
        }

        // Load user data
        const savedUser = await LocalStorage.getItem('userData');
        if (savedUser) {
          setUserData(JSON.parse(savedUser));
        } else {
          const user = {
            profile: { name: 'You', joinDate: '', lastActive: '' },
            settings: { theme: 'light', notifications: true }
          };
          // Set current date as join date and last active
          user.profile.joinDate = new Date().toISOString().split('T')[0];
          user.profile.lastActive = new Date().toISOString().split('T')[0];
          setUserData(user);
          await LocalStorage.setItem('userData', JSON.stringify(user));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (roadmapData) {
      LocalStorage.setItem('roadmapData', JSON.stringify(roadmapData));
    }
  }, [roadmapData]);

  useEffect(() => {
    if (timetableData) {
      LocalStorage.setItem('timetableData', JSON.stringify(timetableData));
    }
  }, [timetableData]);

  useEffect(() => {
    if (journalData) {
      LocalStorage.setItem('journalData', JSON.stringify(journalData));
    }
  }, [journalData]);

  useEffect(() => {
    if (userData) {
      LocalStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [userData]);

  // Context value for sharing state across components
  const contextValue = {
    activeTab,
    setActiveTab,
    roadmapData,
    setRoadmapData,
    timetableData,
    setTimetableData,
    journalData,
    setJournalData,
    userData,
    setUserData,
    isLoading
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your productivity dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <TutorialProvider>
        <GamificationProvider>
          <AppContext.Provider value={contextValue}>
            <AppContent 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              contextValue={contextValue}
            />
            <XPConfetti />
          </AppContext.Provider>
        </GamificationProvider>
      </TutorialProvider>
    </ThemeProvider>
  );
}

function AppContent({ activeTab, setActiveTab, contextValue }) {
  const { isTutorialOpen, showTutorialPrompt, startTutorial, completeTutorial, skipTutorial } = useTutorial();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="container mx-auto py-6 px-4 mt-16">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/journal" element={<Journal />} />
          </Routes>
        </main>

        {/* Tutorial Components */}
        {showTutorialPrompt && (
          <TutorialPrompt onStart={startTutorial} onSkip={skipTutorial} />
        )}
        
        {isTutorialOpen && (
          <Tutorial 
            isOpen={isTutorialOpen}
            onClose={skipTutorial}
            onComplete={completeTutorial}
          />
        )}
      </div>
    </Router>
  );
}

export default App;