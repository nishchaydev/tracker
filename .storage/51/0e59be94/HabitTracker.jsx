import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../App';
import HabitForm from './HabitForm';
import HabitList from './HabitList';
import * as exportService from '../../utils/exportService';
import { calculateStreak } from '../../utils/habitUtils';

function HabitTracker() {
  const { habits, setHabits } = useContext(AppContext);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [exportType, setExportType] = useState('excel');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(null);

  // Generate today's date in ISO format (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  // Function to add a new habit
  const addHabit = (habit) => {
    const newHabit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completions: [],
      recentlyCompleted: false
    };
    setHabits([...habits, newHabit]);
    setIsFormVisible(false);
  };

  // Function to update existing habit
  const updateHabit = (updatedHabit) => {
    setHabits(habits.map(h => 
      h.id === updatedHabit.id 
        ? { ...updatedHabit, completions: h.completions || [] } 
        : h
    ));
    setEditingHabit(null);
    setIsFormVisible(false);
  };

  // Function to delete habit
  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  // Function to toggle habit completion for today
  const toggleHabitCompletion = (id) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const completions = habit.completions || [];
        const todayCompletion = completions.find(c => c.date.split('T')[0] === today);
        
        if (todayCompletion) {
          // If already completed today, remove today's completion
          const updatedCompletions = completions.filter(c => c.date.split('T')[0] !== today);
          return { 
            ...habit, 
            completions: updatedCompletions,
            recentlyCompleted: false
          };
        } else {
          // Mark as completed today
          return { 
            ...habit, 
            completions: [
              ...completions, 
              { 
                date: new Date().toISOString(),
                count: 1
              }
            ],
            recentlyCompleted: true
          };
        }
      }
      return habit;
    }));

    // Reset the recentlyCompleted flag after animation time
    setTimeout(() => {
      setHabits(habits => habits.map(habit => 
        habit.id === id ? { ...habit, recentlyCompleted: false } : habit
      ));
    }, 5000);
  };

  // Function to increment completion count for today
  const incrementCount = (id) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const completions = habit.completions || [];
        const todayCompletion = completions.find(c => c.date.split('T')[0] === today);
        
        if (todayCompletion) {
          // Increment count in existing completion
          const updatedCompletions = completions.map(c => 
            c.date.split('T')[0] === today 
              ? { ...c, count: (c.count || 0) + 1 } 
              : c
          );
          return { ...habit, completions: updatedCompletions };
        } else {
          // Add new completion for today
          return { 
            ...habit, 
            completions: [
              ...completions, 
              { 
                date: new Date().toISOString(),
                count: 1
              }
            ]
          };
        }
      }
      return habit;
    }));
  };

  // Function to start editing a habit
  const editHabit = (habit) => {
    setEditingHabit(habit);
    setIsFormVisible(true);
  };

  // Function to calculate streaks for each habit
  useEffect(() => {
    if (habits.length > 0) {
      const calculatedHabits = habits.map(habit => {
        // Use the utility function to calculate streak
        const streak = calculateStreak(habit);
        return { ...habit, streak };
      });
      
      setHabits(calculatedHabits);
    }
  }, []);

  // Function to export habit data
  const exportHabits = () => {
    const formattedData = exportService.formatHabitDataForExport(habits);
    let success = false;
    
    if (exportType === 'excel') {
      success = exportService.exportToExcel(formattedData, 'habit-tracker-data');
    } else if (exportType === 'csv') {
      success = exportService.exportToCSV(formattedData, 'habit-tracker-data');
    }
    
    setExportSuccess(success);
    
    // Reset message after 3 seconds
    setTimeout(() => {
      setExportSuccess(null);
      setShowExportOptions(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Habit Tracker</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditingHabit(null);
              setIsFormVisible(!isFormVisible);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {isFormVisible ? 'Cancel' : 'Add New Habit'}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Export Data
            </button>
            
            {showExportOptions && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border border-gray-200 p-3 z-10 w-64">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="exportType"
                        value="excel"
                        checked={exportType === 'excel'}
                        onChange={() => setExportType('excel')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm">Excel</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="exportType"
                        value="csv"
                        checked={exportType === 'csv'}
                        onChange={() => setExportType('csv')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm">CSV</span>
                    </label>
                  </div>
                </div>
                
                <button
                  onClick={exportHabits}
                  className="w-full px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  Download
                </button>
                
                {exportSuccess !== null && (
                  <p className={`mt-2 text-sm ${exportSuccess ? 'text-green-600' : 'text-red-600'}`}>
                    {exportSuccess ? 'Export successful!' : 'Export failed.'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isFormVisible && (
        <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
          <HabitForm 
            onSubmit={editingHabit ? updateHabit : addHabit}
            initialData={editingHabit}
            isEditing={!!editingHabit}
          />
        </div>
      )}
      
      <HabitList 
        habits={habits} 
        onToggleCompletion={toggleHabitCompletion}
        onIncrementCount={incrementCount}
        onEdit={editHabit}
        onDelete={deleteHabit}
      />
    </div>
  );
}

export default HabitTracker;