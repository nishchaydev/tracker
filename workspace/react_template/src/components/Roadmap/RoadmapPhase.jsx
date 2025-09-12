import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function RoadmapPhase({ phase, phaseNumber, onTaskComplete }) {
  const completedTasks = phase.tasks.filter(task => task.status === 'completed').length;
  const totalTasks = phase.tasks.length;
  const phaseProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const chartData = [
    { name: 'Completed', value: completedTasks, color: '#10B981' },
    { name: 'Remaining', value: totalTasks - completedTasks, color: '#E5E7EB' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'pending': return '⏳';
      default: return '⏳';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Phase {phaseNumber}: {phase.title}
          </h2>
          <p className="text-gray-600 mt-1">{phase.description}</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(phase.status)}`}>
              {getStatusIcon(phase.status)} {phase.status.replace('-', ' ').toUpperCase()}
            </span>
            <span className="text-sm text-gray-500">
              {phase.startDate} - {phase.endDate}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{phaseProgress}%</div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
          <div className="w-20 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={35}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{completedTasks}/{totalTasks} tasks completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${phaseProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900 mb-3">Tasks</h3>
        {phase.tasks.map((task) => (
          <div 
            key={task.id}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              task.status === 'completed' 
                ? 'border-green-200 bg-green-50' 
                : 'border-gray-200 bg-white hover:border-blue-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onTaskComplete(phase.id, task.id)}
                    disabled={task.status === 'completed'}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.status === 'completed'
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    {task.status === 'completed' && '✓'}
                  </button>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      task.status === 'completed' ? 'text-green-800 line-through' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-blue-600 font-medium">
                        💎 {task.xpReward} XP
                      </span>
                      <span className="text-xs text-gray-500">
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                      {task.completedDate && (
                        <span className="text-xs text-green-600">
                          Completed: {new Date(task.completedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoadmapPhase;


