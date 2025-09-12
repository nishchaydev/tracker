import { useState, useEffect } from 'react';
import { createContext } from 'react';
import HabitTracker from './components/HabitTracker/HabitTracker';
import JobBoard from './components/JobBoard/JobBoard';
import Header from './components/Layout/Header';

// Create app context
export const AppContext = createContext();

function App() {
  // App state
  const [currentView, setCurrentView] = useState('habits'); // 'habits' or 'jobs'
  const [habits, setHabits] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load habits from localStorage on mount
  useEffect(() => {
    const loadHabits = () => {
      try {
        const storedHabits = localStorage.getItem('habits');
        if (storedHabits) {
          setHabits(JSON.parse(storedHabits));
        }
      } catch (error) {
        console.error('Error loading habits from localStorage:', error);
        setError('Failed to load habit data. Please try refreshing the app.');
      }
    };

    loadHabits();
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);

  // Mock function to fetch jobs (will be replaced with actual API call)
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      // For MVP, using mock data
      // In production, this would be an API call to the backend
      setTimeout(() => {
        const mockJobs = [
          {
            id: '1',
            title: 'Frontend Developer',
            company: 'Tech Corp',
            location: 'Remote',
            description: 'Developing user interfaces with React',
            url: 'https://example.com/job1',
            source: 'Indeed',
            postedDate: new Date('2023-06-15'),
            scrapedDate: new Date(),
            keywords: ['react', 'javascript', 'css']
          },
          {
            id: '2',
            title: 'Backend Engineer',
            company: 'Software Inc',
            location: 'New York, NY',
            description: 'Building APIs with Node.js and Express',
            url: 'https://example.com/job2',
            source: 'LinkedIn',
            postedDate: new Date('2023-06-10'),
            scrapedDate: new Date(),
            keywords: ['node.js', 'express', 'api']
          },
          {
            id: '3',
            title: 'Full Stack Developer',
            company: 'Startup Co',
            location: 'San Francisco, CA',
            description: 'Working on all aspects of our web application',
            url: 'https://example.com/job3',
            source: 'AngelList',
            postedDate: new Date('2023-06-12'),
            scrapedDate: new Date(),
            keywords: ['react', 'node.js', 'mongodb']
          }
        ];
        setJobs(mockJobs);
        setIsLoading(false);
      }, 1000); // Simulate network delay
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load job listings. Please try again later.');
      setIsLoading(false);
    }
  };

  // Load jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Context value
  const contextValue = {
    habits,
    setHabits,
    jobs,
    setJobs,
    currentView,
    setCurrentView,
    isLoading,
    error
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="mb-6 flex space-x-4">
            <button
              onClick={() => setCurrentView('habits')}
              className={`px-4 py-2 rounded-md ${
                currentView === 'habits' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Habit Tracker
            </button>
            <button
              onClick={() => setCurrentView('jobs')}
              className={`px-4 py-2 rounded-md ${
                currentView === 'jobs' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Job Board
            </button>
          </div>
          
          {currentView === 'habits' ? <HabitTracker /> : <JobBoard />}
        </main>
        
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} Habit & Career Tracker
          </div>
        </footer>
      </div>
    </AppContext.Provider>
  );
}

export default App;