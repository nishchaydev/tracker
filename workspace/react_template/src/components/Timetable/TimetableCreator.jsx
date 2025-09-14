import { useState, useEffect } from 'react';
import { PlusIcon, AddIcon, CheckIcon, EditIcon, DeleteIcon, StudyIcon, FitnessIcon, SportsIcon, BreakIcon } from '../Icons/IconSystem';

function TimetableCreator({ isOpen, onClose, onSave, timetableData }) {
  const [activities, setActivities] = useState([]);
  const [weeklyGoals, setWeeklyGoals] = useState({
    studyHours: 0,
    workouts: 0,
    breaks: 0,
    deepWork: 0
  });

  const [customGoals, setCustomGoals] = useState([]);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalValue, setNewGoalValue] = useState(0);

  const [activityForm, setActivityForm] = useState({
    title: '',
    description: '',
    type: 'study',
    startTime: '09:00',
    endTime: '10:00',
    xpReward: 10,
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  });

  // Load existing data when component opens
  useEffect(() => {
    if (isOpen && timetableData) {
      setActivities(timetableData.dailyActivities || []);
      setWeeklyGoals(timetableData.weeklyGoals || {
        studyHours: 0,
        workouts: 0,
        breaks: 0,
        deepWork: 0
      });
      setCustomGoals(timetableData.customGoals || []);
    }
  }, [isOpen, timetableData]);

  const activityTypes = [
    { value: 'study', label: 'Study', icon: StudyIcon, color: 'text-blue-500' },
    { value: 'fitness', label: 'Fitness', icon: FitnessIcon, color: 'text-green-500' },
    { value: 'sports', label: 'Sports', icon: SportsIcon, color: 'text-orange-500' },
    { value: 'break', label: 'Break', icon: BreakIcon, color: 'text-gray-500' }
  ];

  const days = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const addActivity = () => {
    if (activityForm.title.trim()) {
      const newActivity = {
        id: `activity-${Date.now()}`,
        title: activityForm.title,
        description: activityForm.description,
        type: activityForm.type,
        startTime: activityForm.startTime,
        endTime: activityForm.endTime,
        xpReward: parseInt(activityForm.xpReward),
        days: activityForm.days,
        status: 'pending',
        isCompleted: false,
        completedDate: null
      };
      setActivities([...activities, newActivity]);
      setActivityForm({
        title: '',
        description: '',
        type: 'study',
        startTime: '09:00',
        endTime: '10:00',
        xpReward: 10,
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      });
    }
  };

  const deleteActivity = (activityId) => {
    setActivities(activities.filter(activity => activity.id !== activityId));
  };

  const handleDayToggle = (day) => {
    setActivityForm(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const addCustomGoal = () => {
    if (newGoalName.trim()) {
      const newGoal = {
        id: `goal-${Date.now()}`,
        name: newGoalName.trim(),
        value: parseInt(newGoalValue) || 0
      };
      setCustomGoals([...customGoals, newGoal]);
      setNewGoalName('');
      setNewGoalValue(0);
    }
  };

  const removeCustomGoal = (goalId) => {
    setCustomGoals(customGoals.filter(goal => goal.id !== goalId));
  };

  const updateCustomGoal = (goalId, field, value) => {
    setCustomGoals(customGoals.map(goal => 
      goal.id === goalId ? { ...goal, [field]: value } : goal
    ));
  };

  const handleSave = () => {
    onSave({ 
      dailyActivities: activities,
      weeklyGoals,
      customGoals
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Create Your Timetable</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-white/90 mt-2">Plan your daily activities and set weekly goals</p>
        </div>

        <div className="p-6">
          {/* Weekly Goals */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Goals</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Study Hours</label>
                <input
                  type="number"
                  value={weeklyGoals.studyHours}
                  onChange={(e) => setWeeklyGoals({ ...weeklyGoals, studyHours: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Workouts</label>
                <input
                  type="number"
                  value={weeklyGoals.workouts}
                  onChange={(e) => setWeeklyGoals({ ...weeklyGoals, workouts: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Breaks</label>
                <input
                  type="number"
                  value={weeklyGoals.breaks}
                  onChange={(e) => setWeeklyGoals({ ...weeklyGoals, breaks: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deep Work</label>
                <input
                  type="number"
                  value={weeklyGoals.deepWork}
                  onChange={(e) => setWeeklyGoals({ ...weeklyGoals, deepWork: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Custom Goals */}
            <div className="border-t pt-6">
              <h4 className="text-md font-semibold text-gray-800 mb-4">Custom Goals</h4>
              
              {/* Add Custom Goal */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  placeholder="e.g., Reading, Meditation, Coding"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={newGoalValue}
                  onChange={(e) => setNewGoalValue(e.target.value)}
                  placeholder="Target"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addCustomGoal}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Custom Goals List */}
              {customGoals.map((goal) => (
                <div key={goal.id} className="flex items-center gap-2 mb-2 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={goal.name}
                    onChange={(e) => updateCustomGoal(goal.id, 'name', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={goal.value}
                    onChange={(e) => updateCustomGoal(goal.id, 'value', parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeCustomGoal(goal.id)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Creation */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Daily Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity Title</label>
                <input
                  type="text"
                  value={activityForm.title}
                  onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                  placeholder="e.g., Morning Study Session"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={activityForm.description}
                  onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                  placeholder="e.g., Focus on coding and learning"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                <select
                  value={activityForm.type}
                  onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">XP Reward</label>
                <input
                  type="number"
                  value={activityForm.xpReward}
                  onChange={(e) => setActivityForm({ ...activityForm, xpReward: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={activityForm.startTime}
                  onChange={(e) => setActivityForm({ ...activityForm, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={activityForm.endTime}
                  onChange={(e) => setActivityForm({ ...activityForm, endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Days Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Repeat on Days</label>
              <div className="flex flex-wrap gap-2">
                {days.map(day => (
                  <button
                    key={day.value}
                    onClick={() => handleDayToggle(day.value)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      activityForm.days.includes(day.value)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={addActivity}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Activity</span>
            </button>
          </div>

          {/* Activities List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Activities</h3>
            {activities.map((activity) => {
              const ActivityIcon = activityTypes.find(t => t.value === activity.type)?.icon || StudyIcon;
              return (
                <div key={activity.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <ActivityIcon className="w-5 h-5 text-gray-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                        <p className="text-gray-600 text-sm">{activity.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-blue-600 font-medium">
                            {activity.xpReward} XP
                          </span>
                          <span className="text-sm text-gray-500">
                            {activity.startTime} - {activity.endTime}
                          </span>
                          <span className="text-sm text-gray-500">
                            {activity.days.length} days/week
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteActivity(activity.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <DeleteIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary"
            >
              Save Timetable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimetableCreator;


