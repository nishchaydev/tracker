import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function Charts({ habits }) {
  const habitCompletionChartRef = useRef(null);
  const streakChartRef = useRef(null);
  
  useEffect(() => {
    // Destroy previous charts if they exist
    let habitCompletionChart = habitCompletionChartRef.current?.chart;
    let streakChart = streakChartRef.current?.chart;
    
    if (habitCompletionChart) {
      habitCompletionChart.destroy();
    }
    
    if (streakChart) {
      streakChart.destroy();
    }
    
    if (habits.length === 0) return;
    
    // Prepare data for habit completion chart (last 7 days)
    const dates = [];
    const completionCounts = [];
    
    // Generate the last 7 days (including today)
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dates.push(formatDate(date));
      
      // Count completions for this date
      const count = habits.reduce((total, habit) => {
        const completed = habit.completions?.some(
          completion => completion.date.split('T')[0] === dateString
        );
        return total + (completed ? 1 : 0);
      }, 0);
      
      completionCounts.push(count);
    }
    
    // Create the habit completion chart
    if (habitCompletionChartRef.current) {
      habitCompletionChart = new Chart(habitCompletionChartRef.current, {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [{
            label: 'Habits Completed',
            data: completionCounts,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Habit Completions (Last 7 Days)'
            },
            legend: {
              display: false
            }
          }
        }
      });
      
      habitCompletionChartRef.current.chart = habitCompletionChart;
    }
    
    // Create the streak chart (top 5 habits by streak)
    if (streakChartRef.current) {
      // Sort habits by streak
      const sortedHabits = [...habits]
        .sort((a, b) => (b.streak || 0) - (a.streak || 0))
        .slice(0, 5); // Get top 5
      
      streakChart = new Chart(streakChartRef.current, {
        type: 'horizontalBar',
        data: {
          labels: sortedHabits.map(habit => habit.name),
          datasets: [{
            label: 'Current Streak',
            data: sortedHabits.map(habit => habit.streak || 0),
            backgroundColor: [
              'rgba(59, 130, 246, 0.7)', // blue
              'rgba(16, 185, 129, 0.7)', // green
              'rgba(245, 158, 11, 0.7)', // yellow
              'rgba(236, 72, 153, 0.7)', // pink
              'rgba(139, 92, 246, 0.7)'  // purple
            ],
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Top Habit Streaks'
            },
            legend: {
              display: false
            }
          }
        }
      });
      
      streakChartRef.current.chart = streakChart;
    }
    
    // Cleanup on component unmount
    return () => {
      if (habitCompletionChartRef.current?.chart) {
        habitCompletionChartRef.current.chart.destroy();
      }
      if (streakChartRef.current?.chart) {
        streakChartRef.current.chart.destroy();
      }
    };
  }, [habits]);

  // Format date to display as "Jan 1" format
  function formatDate(date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="h-80">
          <canvas ref={habitCompletionChartRef}></canvas>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="h-80">
          <canvas ref={streakChartRef}></canvas>
        </div>
      </div>
    </div>
  );
}

export default Charts;