import { useState } from 'react';
import { calculateStreak, getEarnedBadges } from '../../utils/habitUtils';

/**
 * Enhanced card component for displaying individual habits
 */
function HabitCard({ habit, onComplete, onDelete, onEdit }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate streak and badges
  const streak = calculateStreak(habit);
  const badges = getEarnedBadges(habit);
  
  // Check if habit is completed today
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions?.some(
    completion => completion.date.split('T')[0] === today
  );

  // Handle completion of habit
  const handleComplete = () => {
    if (!isCompletedToday) {
      onComplete(habit.id);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg p-4 mb-4 shadow-sm border-l-4 transition-all duration-300 
        ${isCompletedToday ? 'border-green-500' : 'border-blue-400'}
        ${isExpanded ? 'transform scale-[1.02]' : ''}
        hover:shadow-md`}
      style={{ borderLeftColor: habit.color || '#3B82F6' }}
    >
      {/* Main habit info */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-1 text-gray-800">{habit.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{habit.description}</p>
        </div>
        
        {/* Streak counter */}
        <div className="text-right">
          <div className="flex items-center">
            <span className={`text-sm font-medium ${streak > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
              {streak > 0 ? (
                <>
                  <span className="text-lg mr-1">{streak}</span>
                  <span className="mr-1">day{streak !== 1 ? 's' : ''}</span>
                </>
              ) : 'No streak'}
            </span>
            {streak > 0 && <span className="ml-1 text-lg">🔥</span>}
          </div>
        </div>
      </div>

      {/* Badge display */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 mb-3">
          {badges.map(badge => (
            <span 
              key={badge.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              title={badge.name}
            >
              <span className="mr-1">{badge.icon}</span>
              {badge.name}
            </span>
          ))}
        </div>
      )}

      {/* Toggle expanded view */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-blue-500 hover:text-blue-700 mt-1 mb-2"
      >
        {isExpanded ? 'Show less' : 'Show details'}
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded">
          <p>
            <span className="font-medium">Frequency:</span> {' '}
            {typeof habit.frequency === 'string' 
              ? habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1) 
              : habit.frequency.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}
          </p>
          {habit.target && (
            <p>
              <span className="font-medium">Target:</span> {habit.target} {habit.unit || 'times'}
            </p>
          )}
          <p>
            <span className="font-medium">Created:</span> {' '}
            {new Date(habit.createdAt).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">Completed:</span> {' '}
            {habit.completions?.length || 0} times
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-between mt-3 pt-2 border-t border-gray-100">
        <div>
          <button
            onClick={() => onEdit(habit)}
            className="mr-2 text-sm px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this habit?')) {
                onDelete(habit.id);
              }
            }}
            className="text-sm px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
        <button
          onClick={handleComplete}
          disabled={isCompletedToday}
          className={`px-4 py-1 rounded text-white font-medium transition-colors ${
            isCompletedToday
              ? 'bg-green-500 cursor-default'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isCompletedToday ? 'Completed' : 'Complete'}
        </button>
      </div>

      {/* Confetti effect would be rendered here when showConfetti is true */}
      {/* The actual confetti component will be implemented in the parent component */}
    </div>
  );
}

export default HabitCard;