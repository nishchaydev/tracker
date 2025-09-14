import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function Charts({ roadmapData, timetableData, journalData }) {
  const progressChartRef = useRef(null);
  const activityChartRef = useRef(null);
  
  useEffect(() => {
    // Destroy previous charts if they exist
    let progressChart = progressChartRef.current?.chart;
    let activityChart = activityChartRef.current?.chart;
    
    if (progressChart) {
      progressChart.destroy();
    }
    
    if (activityChart) {
      activityChart.destroy();
    }
    
    // Prepare roadmap progress data
    const roadmapPhases = roadmapData?.phases || [];
    const phaseNames = roadmapPhases.map(phase => phase.title);
    const phaseProgress = roadmapPhases.map(phase => {
      const totalTasks = phase.tasks.length;
      const completedTasks = phase.tasks.filter(task => task.status === 'completed').length;
      return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    });
    
    // Create the roadmap progress chart
    if (progressChartRef.current) {
      progressChart = new Chart(progressChartRef.current, {
        type: 'bar',
        data: {
          labels: phaseNames,
          datasets: [{
            label: 'Progress %',
            data: phaseProgress,
            backgroundColor: [
              'rgba(59, 130, 246, 0.7)',   // blue
              'rgba(16, 185, 129, 0.7)',   // green
              'rgba(245, 158, 11, 0.7)',   // yellow
              'rgba(236, 72, 153, 0.7)',   // pink
              'rgba(139, 92, 246, 0.7)'    // purple
            ],
            borderColor: [
              'rgb(59, 130, 246)',
              'rgb(16, 185, 129)',
              'rgb(245, 158, 11)',
              'rgb(236, 72, 153)',
              'rgb(139, 92, 246)'
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Roadmap Phase Progress'
            },
            legend: {
              display: false
            }
          }
        }
      });
      
      progressChartRef.current.chart = progressChart;
    }
    
    // Prepare daily activity data (last 7 days)
    const dates = [];
    const activityCounts = [];
    
    // Generate the last 7 days (including today)
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dates.push(formatDate(date));
      
      // Count activities completed on this date
      const completedActivities = timetableData?.dailyActivities?.filter(activity => 
        activity.completedDate && activity.completedDate.split('T')[0] === dateString
      ).length || 0;
      
      activityCounts.push(completedActivities);
    }
    
    // Create the daily activity chart
    if (activityChartRef.current) {
      activityChart = new Chart(activityChartRef.current, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'Activities Completed',
            data: activityCounts,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
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
              text: 'Daily Activity Completion (Last 7 Days)'
            },
            legend: {
              display: false
            }
          }
        }
      });
      
      activityChartRef.current.chart = activityChart;
    }
    
    // Cleanup on component unmount
    return () => {
      if (progressChartRef.current?.chart) {
        progressChartRef.current.chart.destroy();
      }
      if (activityChartRef.current?.chart) {
        activityChartRef.current.chart.destroy();
      }
    };
  }, [roadmapData, timetableData, journalData]);

  // Format date to display as "Jan 1" format
  function formatDate(date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Roadmap Progress Chart */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Roadmap Phase Progress</h3>
          <p className="text-sm text-gray-600">Track your learning phases completion</p>
        </div>
        <div className="h-96">
          <canvas ref={progressChartRef}></canvas>
        </div>
      </div>
      
      {/* Daily Activity Chart */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Daily Activity Completion</h3>
          <p className="text-sm text-gray-600">Last 7 days activity trends</p>
        </div>
        <div className="h-96">
          <canvas ref={activityChartRef}></canvas>
        </div>
      </div>
    </div>
  );
}

export default Charts;