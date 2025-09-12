import { Link } from 'react-router-dom';
import { useGamification } from '../../contexts/GamificationContext';
import { 
  TargetIcon, 
  DashboardIcon, 
  RoadmapIcon, 
  TimetableIcon, 
  JournalIcon, 
  XPIcon, 
  StreakIcon, 
  LevelIcon 
} from '../Icons/IconSystem';

function Header({ activeTab, onTabChange }) {
  const { level, totalXP, currentStreak } = useGamification();
  
  const tabs = [
    { id: 'dashboard', name: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
    { id: 'roadmap', name: 'Roadmap', path: '/roadmap', icon: RoadmapIcon },
    { id: 'timetable', name: 'Timetable', path: '/timetable', icon: TimetableIcon },
    { id: 'journal', name: 'Journal', path: '/journal', icon: JournalIcon }
  ];

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link 
              to="/"
              className="text-xl font-bold text-blue-600 flex items-center space-x-2"
              onClick={() => onTabChange('dashboard')}
            >
              <TargetIcon className="w-6 h-6" />
              <span>Productivity Dashboard</span>
            </Link>
            
            {/* Gamification stats */}
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <LevelIcon className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">Level {level}</span>
              </div>
              <div className="flex items-center space-x-1">
                <XPIcon className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{totalXP} XP</span>
              </div>
              <div className="flex items-center space-x-1">
                <StreakIcon className="w-4 h-4 text-orange-500" />
                <span className="font-medium">{currentStreak} day streak</span>
              </div>
            </div>
          </div>

          <nav className="flex space-x-1">
            {tabs.map(tab => (
              <Link
                key={tab.id}
                to={tab.path}
                data-tutorial={tab.id}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:shadow-sm'
                }`}
                onClick={() => onTabChange(tab.id)}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;