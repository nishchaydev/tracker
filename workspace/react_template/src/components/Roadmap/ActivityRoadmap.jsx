import { useContext } from 'react';
import { AppContext } from '../../App';
import { StudyIcon, FitnessIcon, SportsIcon, BreakIcon } from '../Icons/IconSystem';

function ActivityRoadmap() {
  const { timetableData } = useContext(AppContext);

  if (!timetableData || !timetableData.dailyActivities || timetableData.dailyActivities.length === 0) {
    return null;
  }

  const activityTypes = [
    { value: 'study', label: 'Study', icon: StudyIcon, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { value: 'fitness', label: 'Fitness', icon: FitnessIcon, color: 'text-green-500', bgColor: 'bg-green-50' },
    { value: 'sports', label: 'Sports', icon: SportsIcon, color: 'text-orange-500', bgColor: 'bg-orange-50' },
    { value: 'break', label: 'Break', icon: BreakIcon, color: 'text-gray-500', bgColor: 'bg-gray-50' }
  ];

  const getActivityType = (type) => {
    return activityTypes.find(t => t.value === type) || activityTypes[0];
  };

  const completedActivities = timetableData.dailyActivities.filter(activity => activity.isCompleted).length;
  const totalActivities = timetableData.dailyActivities.length;
  const completionPercentage = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Roadmap</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Stats */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{completionPercentage}%</div>
            <div className="text-sm text-gray-600">Activities Complete</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Completed</span>
              <span className="font-medium">{completedActivities}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Remaining</span>
              <span className="font-medium">{totalActivities - completedActivities}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Total Activities</span>
              <span>{totalActivities}</span>
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
              {completedActivities} of {totalActivities} activities completed
            </div>
          </div>
        </div>

        {/* Activity Types Breakdown */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Activity Types</h3>
          {activityTypes.map(type => {
            const count = timetableData.dailyActivities.filter(activity => activity.type === type.value).length;
            const completed = timetableData.dailyActivities.filter(activity => activity.type === type.value && activity.isCompleted).length;
            const percentage = count > 0 ? Math.round((completed / count) * 100) : 0;
            
            if (count === 0) return null;
            
            return (
              <div key={type.value} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <type.icon className={`w-4 h-4 ${type.color}`} />
                  <span className="text-gray-600">{type.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">{completed}/{count}</span>
                  <div className="w-12 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${type.bgColor.replace('bg-', 'bg-').replace('-50', '-500')}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {timetableData.dailyActivities.slice(0, 5).map((activity) => {
            const typeInfo = getActivityType(activity.type);
            return (
              <div key={activity.id} className={`flex items-center justify-between p-3 rounded-lg border ${typeInfo.bgColor}`}>
                <div className="flex items-center space-x-3">
                  <typeInfo.icon className={`w-5 h-5 ${typeInfo.color}`} />
                  <div>
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-blue-600 font-medium">
                    {activity.xpReward} XP
                  </span>
                  <div className={`w-3 h-3 rounded-full ${activity.isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ActivityRoadmap;
