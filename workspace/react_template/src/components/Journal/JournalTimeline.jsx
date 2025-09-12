import { useState } from 'react';

function JournalTimeline({ entries }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  // Group entries by month
  const entriesByMonth = entries.reduce((acc, entry) => {
    const date = new Date(entry.date);
    const month = date.getMonth();
    const year = date.getFullYear();
    const key = `${year}-${month}`;
    
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(entry);
    return acc;
  }, {});

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'excited': return 'bg-yellow-100 border-yellow-300';
      case 'happy': return 'bg-green-100 border-green-300';
      case 'focused': return 'bg-blue-100 border-blue-300';
      case 'calm': return 'bg-purple-100 border-purple-300';
      case 'tired': return 'bg-gray-100 border-gray-300';
      case 'frustrated': return 'bg-red-100 border-red-300';
      case 'motivated': return 'bg-orange-100 border-orange-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'excited': return '🤩';
      case 'happy': return '😊';
      case 'focused': return '🎯';
      case 'calm': return '😌';
      case 'tired': return '😴';
      case 'frustrated': return '😤';
      case 'motivated': return '💪';
      default: return '😐';
    }
  };

  // Create calendar grid for selected month
  const createCalendarGrid = () => {
    const today = new Date();
    const year = today.getFullYear();
    const firstDay = new Date(year, selectedMonth, 1);
    const lastDay = new Date(year, selectedMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendar = [];
    const currentDate = new Date(startDate);
    
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const entry = entries.find(e => e.date === dateStr);
        const isCurrentMonth = currentDate.getMonth() === selectedMonth;
        const isToday = dateStr === today.toISOString().split('T')[0];
        
        weekDays.push({
          date: new Date(currentDate),
          dateStr,
          entry,
          isCurrentMonth,
          isToday
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      calendar.push(weekDays);
    }
    
    return calendar;
  };

  const calendar = createCalendarGrid();
  const monthEntries = Object.values(entriesByMonth).flat().filter(entry => {
    const entryMonth = new Date(entry.date).getMonth();
    return entryMonth === selectedMonth;
  });

  return (
    <div className="space-y-4">
      {/* Month Selector */}
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-900">Mood Calendar</h3>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month} {new Date().getFullYear()}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 font-medium">{day}</div>
          ))}
        </div>

        {/* Calendar days */}
        {calendar.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`relative p-1 text-xs rounded-md transition-colors ${
                  day.isToday
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : day.isCurrentMonth
                    ? 'hover:bg-gray-50'
                    : 'text-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className={`font-medium ${
                    day.isToday ? 'text-blue-700' : day.isCurrentMonth ? 'text-gray-900' : 'text-gray-300'
                  }`}>
                    {day.date.getDate()}
                  </div>
                  {day.entry && (
                    <div className={`mt-1 text-lg ${getMoodColor(day.entry.mood).split(' ')[0]}`}>
                      {getMoodIcon(day.entry.mood)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Month Summary */}
      {monthEntries.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">This Month's Entries</h4>
          <div className="space-y-2">
            {monthEntries.slice(0, 3).map((entry) => (
              <div key={entry.id} className="flex items-center space-x-2 text-sm">
                <span className="text-lg">{getMoodIcon(entry.mood)}</span>
                <span className="text-gray-600">
                  {new Date(entry.date).getDate()}
                </span>
                <span className="text-gray-900 truncate">{entry.title}</span>
              </div>
            ))}
            {monthEntries.length > 3 && (
              <div className="text-xs text-gray-500">
                +{monthEntries.length - 3} more entries
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default JournalTimeline;


