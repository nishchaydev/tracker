import { Link } from 'react-router-dom';

function Header({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'habits', name: 'Habit Tracker', path: '/habits' },
    { id: 'jobs', name: 'Job Board', path: '/jobs' }
  ];

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link 
              to="/"
              className="text-xl font-bold text-blue-600"
              onClick={() => onTabChange('habits')}
            >
              Dev Progress Hub
            </Link>
          </div>

          <nav className="flex space-x-1">
            {tabs.map(tab => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;