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

  // Check if user is new (no data)
  const isNewUser = totalRoadmapTasks === 0 && totalTimetableSlots === 0 && totalJournalEntries === 0;
  const hasAnyProgress = roadmapProgress > 0 || timetableProgress > 0 || currentStreak > 0;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div className="dashboard-title">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Productivity Dashboard</h1>
          <p className="text-gray-600 text-lg">Track your progress and stay motivated on your journey</p>
        </div>
        
        {/* Motivational quote card */}
        <div className="mt-4 md:mt-0 w-full md:w-auto md:min-w-[300px] bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-4">
          <MotivationalQuote />
        </div>
      </div>

      {/* New User Onboarding */}
      {isNewUser && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🎉</div>
            <div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Welcome to your productivity journey!</h3>
              <p className="text-green-700 mb-4">Get started by adding your first activity, creating a roadmap, or writing a journal entry.</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">✨ Add activities</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">🗺️ Create roadmap</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">📝 Start journaling</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Roadmap Progress" 
          value={`${roadmapProgress}%`} 
          description={totalRoadmapTasks > 0 ? `${completedRoadmapTasks}/${totalRoadmapTasks} tasks completed` : "No roadmap yet"}
          icon={<RoadmapIcon />}
          color={roadmapProgress > 0 ? "bg-blue-500" : "bg-gray-400"}
          progress={roadmapProgress}
          isEmpty={totalRoadmapTasks === 0}
        />
        <StatCard 
          title="Daily Activities" 
          value={`${timetableProgress}%`} 
          description={totalTimetableSlots > 0 ? `${completedTimetableSlots}/${totalTimetableSlots} completed today` : "No activities yet"}
          icon={<TimetableIcon />}
          color={timetableProgress > 0 ? "bg-green-500" : "bg-gray-400"}
          progress={timetableProgress}
          isEmpty={totalTimetableSlots === 0}
        />
        <StatCard 
          title="Current Streak" 
          value={currentStreak} 
          description={currentStreak > 0 ? `${longestStreak} day record` : "Start your first streak!"}
          icon={<FireIcon />}
          color={currentStreak > 0 ? "bg-orange-500" : "bg-gray-400"}
          progress={Math.min((currentStreak / Math.max(longestStreak, 1)) * 100, 100)}
          isEmpty={currentStreak === 0}
        />
        <StatCard 
          title="Journal Entries" 
          value={totalJournalEntries} 
          description={hasTodayEntry ? "Today's entry ✓" : totalJournalEntries > 0 ? "No entry today" : "Start journaling!"}
          icon={<JournalIcon />}
          color={hasTodayEntry ? "bg-green-500" : totalJournalEntries > 0 ? "bg-yellow-500" : "bg-gray-400"}
          progress={hasTodayEntry ? 100 : 0}
          isEmpty={totalJournalEntries === 0}
        />
      </div>

      {/* Hero Section - XP Progress and Level */}
      <div className="mb-8" data-tutorial="xp-system">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-white">
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">Level {level}</div>
            <div className="text-2xl mb-4">{totalXP} XP</div>
            <div className="text-lg opacity-90">
              {currentStreak > 0 ? `🔥 ${currentStreak} day streak` : 'Start your streak today!'}
            </div>
          </div>
          <XPProgress level={level} totalXP={totalXP} currentStreak={currentStreak} />
        </div>
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

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8" data-tutorial="dashboard">
        
        {/* Left Column: Progress & Analytics */}
        <div className="space-y-6">
          {/* 📊 Analytics Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-2xl">📊</span>
              <h2 className="text-xl font-bold text-gray-800">Analytics</h2>
            </div>
            <Charts 
              roadmapData={roadmapData}
              timetableData={timetableData}
              journalData={journalData}
            />
          </div>

          {/* 🗓️ Roadmap Progress Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-2xl">🗓️</span>
              <h2 className="text-xl font-bold text-gray-800">Roadmap Progress</h2>
            </div>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Track Your Learning Journey</h3>
              <p className="text-gray-500 text-sm mb-4">Create phases and tasks to visualize your progress</p>
              <div className="text-3xl font-bold text-blue-600">{roadmapProgress}%</div>
              <div className="text-sm text-gray-500">{completedRoadmapTasks} of {totalRoadmapTasks} tasks completed</div>
            </div>
          </div>
        </div>

        {/* Right Column: Journal & Activity */}
        <div className="space-y-6">
          {/* ✍️ Journal Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-2xl">✍️</span>
              <h2 className="text-xl font-bold text-gray-800">Journal</h2>
            </div>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Reflect & Grow</h3>
              <p className="text-gray-500 text-sm mb-4">Document your thoughts and track your mood</p>
              <div className="text-3xl font-bold text-green-600">{totalJournalEntries}</div>
              <div className="text-sm text-gray-500">Total entries</div>
            </div>
          </div>

          {/* 🔥 Streaks Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-2xl">🔥</span>
              <h2 className="text-xl font-bold text-gray-800">Streaks</h2>
            </div>
            <StreakHeatmap journalData={journalData} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat card component
function StatCard({ title, value, description, icon, color, progress, isEmpty }) {
  const getMotivationalMessage = () => {
    if (isEmpty) {
      switch (title) {
        case 'Roadmap Progress': return 'Create your first roadmap!';
        case 'Daily Activities': return 'Add your first activity!';
        case 'Current Streak': return 'Complete an activity to start!';
        case 'Journal Entries': return 'Write your first entry!';
        default: return 'Get started!';
      }
    }
    if (progress === 100) return '🎉 Perfect!';
    if (progress >= 75) return '🔥 Almost there!';
    if (progress >= 50) return '💪 Great progress!';
    if (progress > 0) return '🚀 Keep going!';
    return 'Ready to start!';
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      isEmpty ? 'border-gray-200' : progress === 100 ? 'border-green-300' : 'border-gray-100'
    }`}>
      <div className="flex items-center">
        <div className={`p-4 rounded-full ${color} text-white shadow-lg ${
          isEmpty ? 'opacity-60' : ''
        }`}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <div className="flex items-baseline mb-2">
            <p className={`text-3xl font-bold ${isEmpty ? 'text-gray-400' : 'text-gray-900'}`}>
              {value}
            </p>
            {description && (
              <p className={`ml-2 text-xs ${isEmpty ? 'text-gray-400' : 'text-gray-600'}`}>
                {description}
              </p>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                progress === 100 ? 'bg-green-500' : 
                progress >= 75 ? 'bg-blue-500' : 
                progress >= 50 ? 'bg-yellow-500' : 
                progress > 0 ? 'bg-orange-500' : 'bg-gray-300'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Motivational message */}
          <p className={`text-xs font-medium ${
            isEmpty ? 'text-gray-400' : 
            progress === 100 ? 'text-green-600' : 
            progress >= 50 ? 'text-blue-600' : 'text-orange-600'
          }`}>
            {getMotivationalMessage()}
          </p>
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