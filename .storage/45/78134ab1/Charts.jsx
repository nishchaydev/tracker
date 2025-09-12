import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement,
  LineElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { getWeeklyData, getCompletionRate } from '../../utils/habitUtils';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

/**
 * Component for visualizing habit data with charts
 */
function Charts({ habits }) {
  // Skip rendering if no habits
  if (!habits || habits.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No habit data to display. Add some habits to see your progress charts.
      </div>
    );
  }

  // Get weekly completion data for all habits
  const weeklyCompletionData = {
    labels: habits.length > 0 ? getWeeklyData(habits[0], 4).labels : [],
    datasets: habits.map((habit, index) => {
      const { data } = getWeeklyData(habit, 4);
      
      // Generate a color based on habit color or fallback
      const habitColor = habit.color || `hsl(${(index * 55) % 360}, 70%, 60%)`;
      
      return {
        label: habit.name,
        data,
        backgroundColor: habitColor + '80', // Add transparency
        borderColor: habitColor,
        borderWidth: 1,
      };
    }),
  };

  // Weekly completion options
  const weeklyCompletionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Habit Completions',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  // Prepare data for completion rate pie chart
  const completionRates = habits.map(habit => getCompletionRate(habit, 30));
  const avgCompletionRate = completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length;

  const completionRateData = {
    labels: ['Completed', 'Missed'],
    datasets: [
      {
        data: [avgCompletionRate, 100 - avgCompletionRate],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Completion rate options
  const completionRateOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '30-Day Completion Rate',
      },
    },
  };

  // Prepare streak data for line chart
  const streakData = {
    labels: habits.map(habit => habit.name),
    datasets: [
      {
        label: 'Current Streak (days)',
        data: habits.map(habit => {
          const completions = habit.completions || [];
          
          if (completions.length === 0) return 0;
          
          // Calculate days since earliest completion
          const earliestDate = new Date(Math.min(
            ...completions.map(c => new Date(c.date).getTime())
          ));
          
          const today = new Date();
          const diffTime = Math.abs(today - earliestDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return Math.min(diffDays, completions.length);
        }),
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgb(255, 159, 64)',
        borderWidth: 2,
        tension: 0.1,
      },
    ],
  };

  // Streak chart options
  const streakOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Current Habit Streaks',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <Bar data={weeklyCompletionData} options={weeklyCompletionOptions} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="max-w-[240px] mx-auto">
            <Pie data={completionRateData} options={completionRateOptions} />
          </div>
          <div className="text-center mt-4">
            <span className="text-2xl font-bold text-blue-600">{Math.round(avgCompletionRate)}%</span>
            <p className="text-sm text-gray-500">Average completion rate</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <Line data={streakData} options={streakOptions} />
        </div>
      </div>
    </div>
  );
}

export default Charts;