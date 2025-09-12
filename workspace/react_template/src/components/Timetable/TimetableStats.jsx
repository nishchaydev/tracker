import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function TimetableStats({ completedSlots, totalSlots, completionPercentage }) {
  const data = [
    { name: 'Completed', value: completedSlots, color: '#10B981' },
    { name: 'Remaining', value: totalSlots - completedSlots, color: '#E5E7EB' }
  ];

  const getMotivationMessage = () => {
    if (completionPercentage === 100) {
      return { message: "🎉 Perfect day! You've completed all activities!", color: "text-green-600" };
    } else if (completionPercentage >= 75) {
      return { message: "🔥 Great job! You're almost there!", color: "text-orange-600" };
    } else if (completionPercentage >= 50) {
      return { message: "💪 Good progress! Keep it up!", color: "text-blue-600" };
    } else if (completionPercentage >= 25) {
      return { message: "📈 You're getting started! Every step counts!", color: "text-yellow-600" };
    } else {
      return { message: "🚀 Ready to start your productive day?", color: "text-gray-600" };
    }
  };

  const motivation = getMotivationMessage();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Progress</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Stats */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{completionPercentage}%</div>
            <div className="text-sm text-gray-600">Daily Complete</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Completed</span>
              <span className="font-medium">{completedSlots}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Remaining</span>
              <span className="font-medium">{totalSlots - completedSlots}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Total Activities</span>
              <span>{totalSlots}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center">
          <div className="w-full">
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <div className="text-center text-sm text-gray-600">
              {completedSlots} of {totalSlots} activities completed
            </div>
          </div>
        </div>

        {/* Chart and Motivation */}
        <div className="space-y-4">
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={15}
                  outerRadius={30}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className={`text-center text-sm font-medium ${motivation.color}`}>
            {motivation.message}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimetableStats;


