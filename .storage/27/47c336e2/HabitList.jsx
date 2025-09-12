import { useContext } from 'react';
import { AppContext } from '../../App';

function HabitList({ habits, onToggleCompletion, onIncrementCount, onEdit, onDelete }) {
  // Generate today's date in ISO format (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  // Check if a habit has been completed today
  const isCompletedToday = (habit) => {
    return habit.completionLog?.some(log => 
      log.date.startsWith(today) && log.isComplete
    );
  };

  // Get today's completion count for a habit
  const getTodayCount = (habit) => {
    const todayLog = habit.completionLog?.find(log => log.date.startsWith(today));
    return todayLog ? todayLog.count || 0 : 0;
  };

  // Check if a habit has reached its target for today
  const isTargetReached = (habit) => {
    const count = getTodayCount(habit);
    return count >= (habit.target || 1);
  };
  
  // Format streak display
  const formatStreak = (streak) => {
    if (!streak || streak === 0) return '0';
    return `🔥 ${streak}`;
  };

  if (!habits || habits.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No habits yet. Add your first habit to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map(habit => (
        <div 
          key={habit.id} 
          className="bg-white rounded-lg shadow overflow-hidden"
          style={{ borderLeft: `4px solid ${habit.color || '#3b82f6'}` }}
        >
          <div className="p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => onToggleCompletion(habit.id)}
                  className={`flex-shrink-0 w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center ${
                    isCompletedToday(habit)
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                  aria-label={isCompletedToday(habit) ? "Mark incomplete" : "Mark complete"}
                >
                  {isCompletedToday(habit) && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800">{habit.name}</h3>
                  {habit.description && (
                    <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                {habit.target > 1 && (
                  <div className="flex items-center space-x-1">
                    <span className={`text-sm ${isTargetReached(habit) ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                      {getTodayCount(habit)}/{habit.target}
                    </span>
                    
                    <button
                      onClick={() => onIncrementCount(habit.id)}
                      className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Increment count"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                )}
                
                <div className="flex items-center justify-center min-w-[40px] h-6 bg-blue-100 text-blue-800 text-xs font-medium px-2 rounded-full">
                  {formatStreak(habit.streak)}
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEdit(habit)}
                    className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit habit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => onDelete(habit.id)}
                    className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete habit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {habit.frequency && (
              <div className="mt-2">
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HabitList;