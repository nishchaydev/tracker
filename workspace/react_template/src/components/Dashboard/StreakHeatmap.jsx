import { useState } from 'react';

function StreakHeatmap({ journalData }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Create a heatmap for the selected year
  const createYearHeatmap = () => {
    const year = selectedYear;
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // Get all dates with journal entries
    const entryDates = new Set(
      journalData?.entries?.map(entry => entry.date) || []
    );
    
    // Create calendar grid
    const calendar = [];
    const currentDate = new Date(startDate);
    
    // Start from the first Sunday of the year
    const firstSunday = new Date(startDate);
    firstSunday.setDate(startDate.getDate() - startDate.getDay());
    
    for (let week = 0; week < 53; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const hasEntry = entryDates.has(dateStr);
        const isCurrentYear = currentDate.getFullYear() === year;
        const isToday = dateStr === new Date().toISOString().split('T')[0];
        
        weekDays.push({
          date: new Date(currentDate),
          dateStr,
          hasEntry,
          isCurrentYear,
          isToday
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      calendar.push(weekDays);
    }
    
    return calendar;
  };

  const calendar = createYearHeatmap();
  const totalEntries = journalData?.entries?.length || 0;
  const yearEntries = journalData?.entries?.filter(entry => 
    new Date(entry.date).getFullYear() === selectedYear
  ).length || 0;

  const getIntensity = (hasEntry, isToday) => {
    if (isToday) return 'bg-blue-500';
    if (hasEntry) return 'bg-green-500';
    return 'bg-gray-100';
  };

  const getTooltipText = (day) => {
    if (!day.isCurrentYear) return '';
    if (day.isToday) return `Today: ${day.hasEntry ? 'Journal entry ✓' : 'No entry yet'}`;
    if (day.hasEntry) return `${day.dateStr}: Journal entry ✓`;
    return `${day.dateStr}: No entry`;
  };

  const getIntensityLevel = (hasEntry, isToday) => {
    if (isToday) return 5;
    if (hasEntry) return 4;
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Year Selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Journal Activity</h3>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {[2023, 2024, 2025].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Heatmap */}
      <div className="space-y-2">
        {/* Month labels */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>Jan</span>
          <span>Mar</span>
          <span>May</span>
          <span>Jul</span>
          <span>Sep</span>
          <span>Nov</span>
        </div>

        {/* Calendar grid */}
        <div className="space-y-1">
          {calendar.map((week, weekIndex) => (
            <div key={weekIndex} className="flex space-x-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`w-4 h-4 rounded-md transition-all duration-200 hover:scale-125 cursor-pointer ${
                    day.isCurrentYear
                      ? getIntensity(day.hasEntry, day.isToday)
                      : 'bg-gray-50'
                  } ${day.isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                  title={getTooltipText(day)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Less</span>
          <div className="flex space-x-2">
            <div className="w-4 h-4 bg-gray-100 rounded-md" title="No entry"></div>
            <div className="w-4 h-4 bg-green-200 rounded-md" title="1 entry"></div>
            <div className="w-4 h-4 bg-green-300 rounded-md" title="2 entries"></div>
            <div className="w-4 h-4 bg-green-400 rounded-md" title="3 entries"></div>
            <div className="w-4 h-4 bg-green-500 rounded-md" title="4+ entries"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-md ring-1 ring-blue-300" title="Today"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{yearEntries}</div>
          <div className="text-xs text-gray-600">Entries this year</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalEntries}</div>
          <div className="text-xs text-gray-600">Total entries</div>
        </div>
      </div>
    </div>
  );
}

export default StreakHeatmap;


