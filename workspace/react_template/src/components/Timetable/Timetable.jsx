import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import { useGamification } from '../../contexts/GamificationContext';
import TimetableSlot from './TimetableSlot';
import TimetableStats from './TimetableStats';
import TimetableCreator from './TimetableCreator';
import { PlusIcon } from '../Icons/IconSystem';

function Timetable() {
  const { timetableData, setTimetableData } = useContext(AppContext);
  const { completeTimetableSlot, addXP, updateStreak } = useGamification();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCreator, setShowCreator] = useState(false);

  if (!timetableData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading timetable...</p>
        </div>
      </div>
    );
  }

  const handleSlotComplete = (slotId) => {
    const updatedTimetable = { ...timetableData };
    const slot = updatedTimetable.dailyActivities.find(s => s.id === slotId);
    
    if (slot && !slot.isCompleted) {
      slot.isCompleted = true;
      slot.completedDate = new Date().toISOString();
      
      // Award XP
      addXP(slot.xpReward, 'timetable-slot');
      completeTimetableSlot(slot);
      
      setTimetableData(updatedTimetable);
    }
  };

  const handleResetDaily = () => {
    const updatedTimetable = { ...timetableData };
    updatedTimetable.dailyActivities = updatedTimetable.dailyActivities.map(slot => ({
      ...slot,
      isCompleted: false,
      completedDate: null
    }));
    setTimetableData(updatedTimetable);
  };

  const completedSlots = timetableData.dailyActivities.filter(slot => slot.isCompleted).length;
  const totalSlots = timetableData.dailyActivities.length;
  const completionPercentage = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

  // Check if it's a new day and reset if needed
  useEffect(() => {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('lastTimetableReset');
    
    if (lastReset !== today) {
      handleResetDaily();
      localStorage.setItem('lastTimetableReset', today);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto" data-tutorial="timetable">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Timetable</h1>
            <p className="text-gray-600">Track your daily activities and build consistent habits</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Today</div>
            <div className="text-lg font-semibold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <TimetableStats 
        completedSlots={completedSlots}
        totalSlots={totalSlots}
        completionPercentage={completionPercentage}
      />

      {/* Daily Activities */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Today's Activities</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowCreator(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Activity</span>
            </button>
            <button
              onClick={handleResetDaily}
              className="btn-secondary"
            >
              Reset Day
            </button>
          </div>
        </div>

        {timetableData.dailyActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⏰</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No Activities Scheduled</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Add your daily activities to start building consistent habits. Each completed activity earns you XP!
            </p>
            <button 
              onClick={() => setShowCreator(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Your First Activity</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timetableData.dailyActivities.map((slot) => (
              <TimetableSlot
                key={slot.id}
                slot={slot}
                onComplete={handleSlotComplete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Weekly Goals */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Goals</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(timetableData.weeklyGoals).map(([goal, target]) => (
            <div key={goal} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{target}</div>
              <div className="text-sm text-gray-600 capitalize">
                {goal.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creator Modal */}
      <TimetableCreator
        isOpen={showCreator}
        onClose={() => setShowCreator(false)}
        onSave={(data) => {
          setTimetableData(data);
          setShowCreator(false);
        }}
      />
    </div>
  );
}

export default Timetable;
