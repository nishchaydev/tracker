import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useGamification } from '../../contexts/GamificationContext';
import { useTheme } from '../../contexts/ThemeContext';
import Settings from '../Settings/Settings';
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
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const [showSettings, setShowSettings] = useState(false);
  
  const tabs = [
    { id: 'dashboard', name: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
    { id: 'roadmap', name: 'Roadmap', path: '/roadmap', icon: RoadmapIcon },
    { id: 'timetable', name: 'Timetable', path: '/timetable', icon: TimetableIcon },
    { id: 'journal', name: 'Journal', path: '/journal', icon: JournalIcon }
  ];

  return (
    <header className={`${isLandingPage ? 'bg-white/80 backdrop-blur-sm' : 'bg-white'} shadow-sm fixed top-0 left-0 right-0 z-10`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link 
              to="/"
              className="text-xl font-bold text-blue-600 flex items-center space-x-2"
              onClick={() => onTabChange('dashboard')}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">P</span>
              </div>
              <span>ProTracker</span>
            </Link>
            
            {/* Gamification stats - only show on app pages */}
            {!isLandingPage && (
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
            )}
          </div>

          {/* Navigation - only show on app pages */}
          {!isLandingPage && (
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
          )}

          {/* Theme toggle, Settings, and Landing page CTA */}
          <div className="flex items-center space-x-4">
            {!isLandingPage && (
              <>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {theme === 'light' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </button>
                
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  title="Settings"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </>
            )}
            
            {isLandingPage && (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Launch App
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Settings Modal */}
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </header>
  );
}

export default Header;