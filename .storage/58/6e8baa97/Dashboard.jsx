import { useContext } from 'react';
import { AppContext } from '../../App';
import Charts from './Charts';
import MotivationalQuote from '../Shared/MotivationalQuote';

function Dashboard() {
  const { habits, jobs } = useContext(AppContext);

  // Calculate statistics
  const totalHabits = habits.length;
  const activeHabits = habits.filter(habit => habit.completions && habit.completions.length > 0).length;
  const totalCompletions = habits.reduce((total, habit) => 
    total + (habit.completions?.length || 0), 0);
  
  const totalJobs = jobs.length;
  const remoteJobs = jobs.filter(job => job.remote).length;
  const recentJobs = jobs.filter(job => {
    const postDate = new Date(job.postedDate);
    const now = new Date();
    const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
    return postDate >= oneWeekAgo;
  }).length;

  // Get highest streak
  const highestStreak = habits.reduce(
    (max, habit) => Math.max(max, habit.streak || 0), 
    0
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your progress and stay motivated</p>
        </div>
        
        {/* Motivational quote card */}
        <div className="mt-4 md:mt-0 w-full md:w-auto md:min-w-[300px] bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md p-4">
          <MotivationalQuote />
        </div>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Habits" 
          value={totalHabits} 
          description="Habits being tracked"
          icon={<HabitIcon />}
          color="bg-blue-500"
        />
        <StatCard 
          title="Active Habits" 
          value={activeHabits} 
          description={`${Math.round((activeHabits/totalHabits || 0) * 100)}% active rate`}
          icon={<ActiveIcon />}
          color="bg-green-500"
        />
        <StatCard 
          title="Highest Streak" 
          value={highestStreak} 
          description="Consecutive days"
          icon={<FireIcon />}
          color="bg-orange-500"
        />
        <StatCard 
          title="Job Listings" 
          value={totalJobs} 
          description={`${remoteJobs} remote, ${recentJobs} recent`}
          icon={<JobIcon />}
          color="bg-purple-500"
        />
      </div>

      {/* Charts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Progress Analytics</h2>
        <Charts habits={habits} />
      </div>
    </div>
  );
}

// Stat card component
function StatCard({ title, value, description, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-transparent hover:border-t-4 hover:border-blue-500 transition-all">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} text-white`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {description && <p className="ml-2 text-xs text-gray-600">{description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons for stat cards
const HabitIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const ActiveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FireIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

const JobIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default Dashboard;