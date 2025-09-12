import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

function XPProgress({ level, totalXP, currentStreak }) {
  const xpToNextLevel = 500 - (totalXP % 500);
  const currentLevelXP = totalXP % 500;
  const progressPercentage = (currentLevelXP / 500) * 100;

  const levelData = [
    { level: level - 1, xp: 0, label: `L${level - 1}` },
    { level: level, xp: currentLevelXP, label: `L${level}` },
    { level: level + 1, xp: 0, label: `L${level + 1}` }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Level Progress</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-medium">Level {level}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-blue-500">💎</span>
            <span className="font-medium">{totalXP} XP</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-orange-500">🔥</span>
            <span className="font-medium">{currentStreak} day streak</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XP Progress Bar */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress to Level {level + 1}</span>
              <span>{currentLevelXP}/500 XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-center text-sm text-gray-500 mt-1">
              {xpToNextLevel} XP to next level
            </div>
          </div>

          {/* Level Chart */}
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Bar dataKey="xp" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* XP Sources */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">XP Sources</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🗺️</span>
                <span className="text-sm font-medium">Roadmap Tasks</span>
              </div>
              <span className="text-sm font-bold text-blue-600">+50-200 XP</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-lg">⏰</span>
                <span className="text-sm font-medium">Daily Activities</span>
              </div>
              <span className="text-sm font-bold text-green-600">+10-25 XP</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-lg">📝</span>
                <span className="text-sm font-medium">Journal Entries</span>
              </div>
              <span className="text-sm font-bold text-purple-600">+20 XP</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🔥</span>
                <span className="text-sm font-medium">Streak Bonuses</span>
              </div>
              <span className="text-sm font-bold text-orange-600">+5-50 XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default XPProgress;


