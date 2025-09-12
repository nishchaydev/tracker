import { useState } from 'react';

function HabitCard({ habit, onComplete, onEdit, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Generate today's date in ISO format (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  
  // Check if a habit has been completed today
  const isCompletedToday = () => {
    return habit.completions?.some(completion => 
      completion.date.split('T')[0] === today
    );
  };
  
  // Get today's completion count for a habit
  const getTodayCount = () => {
    const todayCompletion = habit.completions?.find(completion => 
      completion.date.split('T')[0] === today
    );
    return todayCompletion ? todayCompletion.count || 0 : 0;
  };
  
  // Check if a habit has reached its target for today
  const isTargetReached = () => {
    const count = getTodayCount();
    return count >= (habit.target || 1);
  };
  
  // Format streak display
  const formatStreak = (streak) => {
    if (!streak || streak === 0) return '0';
    return `🔥 ${streak}`;
  };

  // Determine the level and points based on streak
  const getLevel = () => {
    const streak = habit.streak || 0;
    if (streak >= 30) return { level: "Master", points: 500 };
    if (streak >= 21) return { level: "Expert", points: 300 };
    if (streak >= 14) return { level: "Advanced", points: 200 };
    if (streak >= 7) return { level: "Intermediate", points: 100 };
    if (streak >= 3) return { level: "Beginner", points: 50 };
    return { level: "Novice", points: 10 };
  };

  const { level, points } = getLevel();

  return (
    <div 
      className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
      style={{ 
        borderLeft: `4px solid ${habit.color || '#3b82f6'}`,
      }}
    >
      <div className="p-4">
        <div className="flex justify-between">
          <div className="flex items-start space-x-3">
            <button
              onClick={() => onComplete(habit.id)}
              className={`flex-shrink-0 w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center ${
                isCompletedToday()
                  ? 'bg-blue-500 border-blue-500 transform scale-110 transition-transform'
                  : 'border-gray-300 hover:border-blue-500'
              }`}
              aria-label={isCompletedToday() ? "Mark incomplete" : "Mark complete"}
            >
              {isCompletedToday() && (
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
          
          <div className="flex items-center space-x-2">
            {habit.target > 1 && (
              <div className="flex items-center space-x-1">
                <span className={`text-sm ${isTargetReached() ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                  {getTodayCount()}/{habit.target}
                </span>
              </div>
            )}
            
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-6 px-2 rounded-full 
                ${isCompletedToday() ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'} 
                text-xs font-medium`}>
                {formatStreak(habit.streak)}
              </div>
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
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                title={showDetails ? "Hide details" : "Show details"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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

        {/* Habit Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700">Progress</h4>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (habit.streak || 0) * 3.3)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Novice</span>
                    <span>Master</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700">Achievements</h4>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Current Level:</span>
                    <span className="font-medium text-blue-600">{level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Points Earned:</span>
                    <span className="font-medium">{points}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HabitCard;