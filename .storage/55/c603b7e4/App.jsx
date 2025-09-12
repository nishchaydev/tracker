import { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Layout/Header';
import HabitTracker from './components/HabitTracker/HabitTracker';
import JobBoard from './components/JobBoard/JobBoard';
import Dashboard from './components/Dashboard/Dashboard';
import * as LocalStorage from './utils/localStorage';

// Create context for global state
export const AppContext = createContext();

// Sample job data
const sampleJobs = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'Tech Innovations',
    location: 'Remote',
    description: 'We are looking for a skilled Frontend Developer with experience in React and TypeScript to join our team. You will be responsible for developing user interfaces and implementing new features.',
    postedDate: '2025-09-04T00:00:00.000Z',
    scrapedDate: '2025-09-05T00:00:00.000Z',
    url: 'https://example.com/job/1',
    source: 'LinkedIn',
    keywords: ['React', 'TypeScript', 'Frontend', 'Remote'],
    remote: true
  },
  {
    id: '2',
    title: 'Backend Engineer',
    company: 'DataFlow Systems',
    location: 'San Francisco, CA',
    description: 'Join our backend team to work on high-performance APIs and data processing systems. Experience with Node.js and database design required.',
    postedDate: '2025-09-02T00:00:00.000Z',
    scrapedDate: '2025-09-03T00:00:00.000Z',
    url: 'https://example.com/job/2',
    source: 'Indeed',
    keywords: ['Node.js', 'MongoDB', 'API Development'],
    remote: false
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'WebSolutions Inc',
    location: 'New York, NY',
    description: 'Looking for a versatile Full Stack Developer to work on client and server-side applications. Must be comfortable with modern JavaScript frameworks and backend technologies.',
    postedDate: '2025-08-30T00:00:00.000Z',
    scrapedDate: '2025-08-31T00:00:00.000Z',
    url: 'https://example.com/job/3',
    source: 'Glassdoor',
    keywords: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    remote: false
  },
  {
    id: '4',
    title: 'React Native Developer',
    company: 'MobileFirst Apps',
    location: 'Remote',
    description: 'Build cross-platform mobile applications using React Native. Strong knowledge of mobile app development and JavaScript required.',
    postedDate: '2025-09-06T00:00:00.000Z',
    scrapedDate: '2025-09-06T00:00:00.000Z',
    url: 'https://example.com/job/4',
    source: 'LinkedIn',
    keywords: ['React Native', 'Mobile', 'JavaScript', 'Remote'],
    remote: true
  },
  {
    id: '5',
    title: 'UI/UX Designer',
    company: 'Creative Solutions',
    location: 'Austin, TX',
    description: 'Design beautiful and intuitive user interfaces for web and mobile applications. Experience with Figma and Adobe Creative Suite required.',
    postedDate: '2025-09-01T00:00:00.000Z',
    scrapedDate: '2025-09-02T00:00:00.000Z',
    url: 'https://example.com/job/5',
    source: 'Indeed',
    keywords: ['UI', 'UX', 'Figma', 'Design'],
    remote: false
  }
];

function App() {
  // Initialize state
  const [activeTab, setActiveTab] = useState('dashboard'); // Change default to dashboard
  const [habits, setHabits] = useState([]);
  const [jobs, setJobs] = useState(sampleJobs);
  const [isLoading, setIsLoading] = useState(false);

  // Load habits data from localStorage on initial render
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load habits data
        const savedHabits = await LocalStorage.getItem('habits');
        if (savedHabits) {
          setHabits(JSON.parse(savedHabits));
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    };

    loadData();
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (habits.length > 0) {
      LocalStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);

  // Context value for sharing state across components
  const contextValue = {
    activeTab,
    setActiveTab,
    habits,
    setHabits,
    jobs,
    setJobs,
    isLoading
  };

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main className="container mx-auto py-6 px-4 mt-16">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/habits" element={<HabitTracker />} />
              <Route path="/jobs" element={<JobBoard />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;