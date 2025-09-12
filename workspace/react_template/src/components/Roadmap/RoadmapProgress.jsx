import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function RoadmapProgress({ totalTasks, completedTasks, progressPercentage }) {
  const data = [
    { name: 'Completed', value: completedTasks, color: '#10B981' },
    { name: 'Remaining', value: totalTasks - completedTasks, color: '#E5E7EB' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Progress</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Stats */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{progressPercentage}%</div>
            <div className="text-sm text-gray-600">Overall Complete</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Completed</span>
              <span className="font-medium">{completedTasks}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Remaining</span>
              <span className="font-medium">{totalTasks - completedTasks}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Total Tasks</span>
              <span>{totalTasks}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center">
          <div className="w-full">
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-center text-sm text-gray-600">
              {completedTasks} of {totalTasks} tasks completed
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default RoadmapProgress;


