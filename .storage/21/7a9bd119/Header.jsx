import { useContext } from 'react';
import { AppContext } from '../../App';

function Header() {
  const { currentView, setCurrentView } = useContext(AppContext);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dev Progress Hub
          </h1>
          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
            MVP
          </span>
        </div>
        
        <nav className="flex space-x-2">
          <button
            onClick={() => setCurrentView('habits')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              currentView === 'habits'
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Habit Tracker
          </button>
          <button
            onClick={() => setCurrentView('jobs')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              currentView === 'jobs'
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Job Board
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;