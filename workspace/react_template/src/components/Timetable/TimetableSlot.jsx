function TimetableSlot({ slot, onComplete }) {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'study': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fitness': return 'bg-green-100 text-green-800 border-green-200';
      case 'sports': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'break': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'planning': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'study': return '📚';
      case 'fitness': return '💪';
      case 'sports': return '🏀';
      case 'break': return '☕';
      case 'planning': return '📋';
      default: return '⏰';
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
      slot.isCompleted 
        ? 'border-green-200 bg-green-50' 
        : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-md'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getCategoryIcon(slot.category)}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(slot.category)}`}>
            {slot.category}
          </span>
        </div>
        
        <button
          onClick={() => onComplete(slot.id)}
          disabled={slot.isCompleted}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
            slot.isCompleted
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
          }`}
        >
          {slot.isCompleted && '✓'}
        </button>
      </div>

      <div className="mb-3">
        <h3 className={`font-semibold ${
          slot.isCompleted ? 'text-green-800 line-through' : 'text-gray-900'
        }`}>
          {slot.title}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{slot.description}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <span className="font-medium">{slot.timeSlot}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-blue-600 font-medium">
            💎 {slot.xpReward} XP
          </span>
          {slot.isCompleted && (
            <span className="text-xs text-green-600">
              ✓ Done
            </span>
          )}
        </div>
      </div>

      {slot.completedDate && (
        <div className="mt-2 text-xs text-green-600">
          Completed: {new Date(slot.completedDate).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}

export default TimetableSlot;


