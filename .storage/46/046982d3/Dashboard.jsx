import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import Charts from './Charts';
import MotivationalQuote from '../Shared/MotivationalQuote';
import { calculateStreak, getEarnedBadges, getCompletionRate } from '../../utils/habitUtils';

/**
 * Dashboard component displaying stats and visualizations
 */
function Dashboard() {
  const { habits } = useContext(AppContext);
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    averageStreak: 0,
    totalCompletions: 0,
    topBadge: null
  });

  // Calculate dashboard statistics
  useEffect(() => {
    if (!habits || habits.length === 0) {
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Calculate stats from habits
    const completedToday = habits.filter(habit => 
      habit.completions?.some(completion => completion.date.split('T')[0] === today)
    ).length;
    
    const totalCompletions = habits.reduce(
      (sum, habit) => sum + (habit.completions?.length || 0), 
      0
    );
    
    const streaks = habits.map(habit => calculateStreak(habit));
    const averageStreak = streaks.length 
      ? Math.round(streaks.reduce((sum, streak) => sum + streak, 0) / streaks.length * 10) / 10
      : 0;
    
    // Find the highest badge across all habits
    const allBadges = habits.flatMap(habit => getEarnedBadges(habit));
    const badgePriority = {
      'centurion': 5,
      '30-day': 4,
      '14-day': 3,
      '7-day': 2,
      '3-day': 1
    };
    
    const topBadge = allBadges.length > 0
      ? allBadges.reduce((highest, current) => {
          const currentPriority = badgePriority[current.id] || 0;
          const highestPriority = badgePriority[highest?.id] || 0;
          return currentPriority > highestPriority ? current : highest;
        }, null)
      : null;
      
    setStats({
      totalHabits: habits.length,
      completedToday,
      averageStreak,
      totalCompletions,
      topBadge
    });
    
  }, [habits]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Motivational Quote */}
      <MotivationalQuote />
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard 
          title="Total Habits" 
          value={stats.totalHabits} 
          icon="📋"
          color="bg-blue-50 text-blue-700"
        />
        <SummaryCard 
          title="Completed Today" 
          value={stats.completedToday} 
          icon="✅"
          color="bg-green-50 text-green-700"
        />
        <SummaryCard 
          title="Avg. Streak" 
          value={stats.averageStreak} 
          icon="🔥"
          color="bg-orange-50 text-orange-700"
        />
        <SummaryCard 
          title="Total Completions" 
          value={stats.totalCompletions} 
          icon="🎯"
          color="bg-purple-50 text-purple-700"
        />
      </div>
      
      {/* Top Achievement */}
      {stats.topBadge && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-5 mb-8 shadow-md">
          <h2 className="text-lg font-semibold mb-2">Top Achievement</h2>
          <div className="flex items-center">
            <span className="text-3xl mr-3">{stats.topBadge.icon}</span>
            <div>
              <p className="font-bold text-xl">{stats.topBadge.name}</p>
              <p className="text-blue-100">Keep up the great work!</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Charts */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Progress Visualizations</h2>
        <Charts habits={habits} />
      </div>
    </div>
  );
}

/**
 * Card component for summary statistics
 */
function SummaryCard({ title, value, icon, color }) {
  return (
    <div className={`rounded-lg p-4 shadow-sm ${color || 'bg-gray-50'}`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium opacity-80">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}

export default Dashboard;