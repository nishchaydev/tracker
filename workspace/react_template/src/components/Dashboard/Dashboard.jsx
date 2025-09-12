import { useContext } from 'react';
import { AppContext } from '../../App';
import { useGamification } from '../../contexts/GamificationContext';
import Charts from './Charts';
import MotivationalQuote from '../Shared/MotivationalQuote';
import XPProgress from './XPProgress';
import StreakHeatmap from './StreakHeatmap';

function Dashboard() {
  const { roadmapData, timetableData, journalData } = useContext(AppContext);
  const { level, totalXP, currentStreak, longestStreak, badges } = useGamification();

  // Calculate roadmap statistics
  const totalRoadmapTasks = roadmapData?.phases?.reduce((acc, phase) => acc + phase.tasks.length, 0) || 0;
  const completedRoadmapTasks = roadmapData?.phases?.reduce((acc, phase) => 
    acc + phase.tasks.filter(task => task.status === 'completed').length, 0) || 0;
  const roadmapProgress = totalRoadmapTasks > 0 ? Math.round((completedRoadmapTasks / totalRoadmapTasks) * 100) : 0;

  // Calculate timetable statistics
  const completedTimetableSlots = timetableData?.dailyActivities?.filter(slot => slot.isCompleted).length || 0;
  const totalTimetableSlots = timetableData?.dailyActivities?.length || 0;
  const timetableProgress = totalTimetableSlots > 0 ? Math.round((completedTimetableSlots / totalTimetableSlots) * 100) : 0;

  // Calculate journal statistics
  const totalJournalEntries = journalData?.entries?.length || 0;
  const today = new Date().toISOString().split('T')[0];
  const todayJournalEntry = journalData?.entries?.find(entry => entry.date === today);
  const hasTodayEntry = !!todayJournalEntry;

  // Calculate weekly stats
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weekJournalEntries = journalData?.entries?.filter(entry => 
    new Date(entry.date) >= oneWeekAgo
  ).length || 0;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div className="dashboard-title">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Productivity Dashboard</h1>
          <p className="text-gray-600">Track your progress and stay motivated on your journey</p>
        </div>
        
        {/* Motivational quote card */}
        <div className="mt-4 md:mt-0 w-full md:w-auto md:min-w-[300px] bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-4">
          <MotivationalQuote />
        </div>
      </div>

      {/* XP Progress and Level */}
      <div className="mb-8" data-tutorial="xp-system">
        <XPProgress level={level} totalXP={totalXP} currentStreak={currentStreak} />
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Roadmap Progress" 
          value={`${roadmapProgress}%`} 
          description={`${completedRoadmapTasks}/${totalRoadmapTasks} tasks completed`}
          icon={<RoadmapIcon />}
          color="bg-blue-500"
        />
        <StatCard 
          title="Daily Activities" 
          value={`${timetableProgress}%`} 
          description={`${completedTimetableSlots}/${totalTimetableSlots} completed today`}
          icon={<TimetableIcon />}
          color="bg-green-500"
        />
        <StatCard 
          title="Current Streak" 
          value={currentStreak} 
          description={`${longestStreak} day record`}
          icon={<FireIcon />}
          color="bg-orange-500"
        />
        <StatCard 
          title="Journal Entries" 
          value={totalJournalEntries} 
          description={hasTodayEntry ? "Today's entry ✓" : "No entry today"}
          icon={<JournalIcon />}
          color="bg-purple-500"
        />
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🏆 Your Badges</h2>
          <div className="flex flex-wrap gap-3">
            {badges.map((badge, index) => (
              <div key={index} className="flex items-center space-x-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                <span className="text-lg">{badge.icon}</span>
                <div>
                  <div className="font-medium text-yellow-800">{badge.name}</div>
                  <div className="text-xs text-yellow-600">{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" data-tutorial="dashboard">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Progress Analytics</h2>
          <Charts 
            roadmapData={roadmapData}
            timetableData={timetableData}
            journalData={journalData}
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Streak Heatmap</h2>
          <StreakHeatmap journalData={journalData} />
        </div>
      </div>
    </div>
  );
}

// Stat card component
function StatCard({ title, value, description, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} text-white shadow-lg`}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {description && <p className="ml-2 text-xs text-gray-600">{description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons for stat cards
const RoadmapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const TimetableIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FireIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

const JournalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

export default Dashboard;