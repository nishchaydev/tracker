import { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import Roadmap from './components/Roadmap/Roadmap';
import Timetable from './components/Timetable/Timetable';
import Journal from './components/Journal/Journal';
import Tutorial from './components/Tutorial/Tutorial';
import TutorialPrompt from './components/Tutorial/TutorialPrompt';
import * as LocalStorage from './utils/localStorage';
import { GamificationProvider } from './contexts/GamificationContext';
import { TutorialProvider, useTutorial } from './contexts/TutorialContext';

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

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Clear any existing roadmap data and start fresh
        const response = await fetch('/src/data/roadmap.json');
        const data = await response.json();
        setRoadmapData(data);
        await LocalStorage.setItem('roadmapData', JSON.stringify(data));

        // Load timetable data
        const savedTimetable = await LocalStorage.getItem('timetableData');
        if (savedTimetable) {
          setTimetableData(JSON.parse(savedTimetable));
        } else {
          const response = await fetch('/src/data/timetable.json');
          const data = await response.json();
          setTimetableData(data);
          await LocalStorage.setItem('timetableData', JSON.stringify(data));
        }

        // Load journal data
        const savedJournal = await LocalStorage.getItem('journalData');
        if (savedJournal) {
          setJournalData(JSON.parse(savedJournal));
        } else {
          const response = await fetch('/src/data/journal.json');
          const data = await response.json();
          setJournalData(data);
          await LocalStorage.setItem('journalData', JSON.stringify(data));
        }

        // Load user data
        const savedUser = await LocalStorage.getItem('userData');
        if (savedUser) {
          setUserData(JSON.parse(savedUser));
        } else {
          const response = await fetch('/src/data/user.json');
          const data = await response.json();
          // Set current date as join date and last active
          data.profile.joinDate = new Date().toISOString().split('T')[0];
          data.profile.lastActive = new Date().toISOString().split('T')[0];
          setUserData(data);
          await LocalStorage.setItem('userData', JSON.stringify(data));
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
    <TutorialProvider>
      <GamificationProvider>
        <AppContext.Provider value={contextValue}>
          <AppContent 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            contextValue={contextValue}
          />
        </AppContext.Provider>
      </GamificationProvider>
    </TutorialProvider>
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
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