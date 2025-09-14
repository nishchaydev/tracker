import { useState } from 'react';
import { useGamification } from '../../contexts/GamificationContext';
import { useTheme } from '../../contexts/ThemeContext';
import * as LocalStorage from '../../utils/localStorage';

function Settings({ isOpen, onClose }) {
  const { clearAllData } = useGamification();
  const { theme, toggleTheme } = useTheme();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetData = async () => {
    try {
      // Clear all localStorage data
      await LocalStorage.removeItem('roadmapData');
      await LocalStorage.removeItem('timetableData');
      await LocalStorage.removeItem('journalData');
      await LocalStorage.removeItem('userData');
      await LocalStorage.removeItem('gamificationData');
      
      // Clear gamification context
      clearAllData();
      
      // Reload the page to reset all state
      window.location.reload();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Theme</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred theme</p>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
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
            </div>

            {/* Data Management */}
            <div className="border-t dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Data Management</h3>
              
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Reset All Data
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h4 className="text-red-800 dark:text-red-200 font-medium mb-2">⚠️ Warning</h4>
                    <p className="text-red-700 dark:text-red-300 text-sm">
                      This will permanently delete all your data including:
                    </p>
                    <ul className="text-red-700 dark:text-red-300 text-sm mt-2 list-disc list-inside">
                      <li>Roadmap progress</li>
                      <li>Daily activities</li>
                      <li>Journal entries</li>
                      <li>XP and achievements</li>
                      <li>All settings</li>
                    </ul>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleResetData}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      Yes, Delete Everything
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* App Info */}
            <div className="border-t dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">App Information</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><strong>Version:</strong> 1.0.0</p>
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Built by:</strong> <a href="https://github.com/nishchaydev" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">Nishchay Gupta</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
