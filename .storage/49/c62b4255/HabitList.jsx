import { useContext } from 'react';
import { AppContext } from '../../App';
import HabitCard from './HabitCard';
import ReactConfetti from 'react-confetti';

function HabitList({ habits, onToggleCompletion, onIncrementCount, onEdit, onDelete }) {
  // Check if any habit completion has been triggered recently
  const isRecentlyCompleted = habits.some(habit => 
    habit.recentlyCompleted
  );

  if (!habits || habits.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-500">No habits yet. Add your first habit to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      {/* Confetti celebration effect */}
      {isRecentlyCompleted && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
          tweenDuration={5000}
        />
      )}
      
      {habits.map(habit => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onComplete={onToggleCompletion}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default HabitList;