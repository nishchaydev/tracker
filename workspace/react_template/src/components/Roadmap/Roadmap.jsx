import { useContext, useState } from 'react';
import { AppContext } from '../../App';
import { useGamification } from '../../contexts/GamificationContext';
import RoadmapPhase from './RoadmapPhase';
import RoadmapProgress from './RoadmapProgress';
import RoadmapCreator from './RoadmapCreator';
import ActivityRoadmap from './ActivityRoadmap';
import { PlusIcon } from '../Icons/IconSystem';

function Roadmap() {
  const { roadmapData, setRoadmapData } = useContext(AppContext);
  const { completeTask, addXP } = useGamification();
  const [showCreator, setShowCreator] = useState(false);

  if (!roadmapData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  const handleTaskComplete = (phaseId, taskId) => {
    const updatedRoadmap = { ...roadmapData };
    const phase = updatedRoadmap.phases.find(p => p.id === phaseId);
    const task = phase.tasks.find(t => t.id === taskId);
    
    if (task && task.status !== 'completed') {
      task.status = 'completed';
      task.completedDate = new Date().toISOString();
      
      // Award XP
      addXP(task.xpReward, 'roadmap-task');
      completeTask(task);
      
      // Check if phase is complete
      const allTasksCompleted = phase.tasks.every(t => t.status === 'completed');
      if (allTasksCompleted) {
        phase.status = 'completed';
        addXP(100, 'phase-complete'); // Bonus XP for completing a phase
      }
      
      setRoadmapData(updatedRoadmap);
    }
  };

  const totalTasks = roadmapData.phases.reduce((acc, phase) => acc + phase.tasks.length, 0);
  const completedTasks = roadmapData.phases.reduce((acc, phase) => 
    acc + phase.tasks.filter(task => task.status === 'completed').length, 0
  );
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Debug logging
  console.log('Roadmap data:', roadmapData);
  console.log('Total tasks:', totalTasks, 'Completed tasks:', completedTasks);

  return (
    <div className="max-w-6xl mx-auto" data-tutorial="roadmap">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Roadmap</h1>
        <p className="text-gray-600">Track your progress through structured learning phases</p>
      </div>

      {/* Activity Roadmap */}
      <ActivityRoadmap />

      {roadmapData.phases.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center border border-gray-100">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🗺️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Roadmap Yet</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Create your first learning phase to start tracking your progress. Each phase can contain multiple tasks with XP rewards!
          </p>
          <button 
            onClick={() => setShowCreator(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create Your First Phase</span>
          </button>
        </div>
      ) : (
        <>
          {/* Progress Overview */}
          <RoadmapProgress 
            totalTasks={totalTasks}
            completedTasks={completedTasks}
            progressPercentage={progressPercentage}
          />

          {/* Phases */}
          <div className="space-y-6">
            {roadmapData.phases.map((phase, index) => (
              <RoadmapPhase
                key={phase.id}
                phase={phase}
                phaseNumber={index + 1}
                onTaskComplete={handleTaskComplete}
              />
            ))}
          </div>
        </>
      )}

      {/* Creator Modal */}
      <RoadmapCreator
        isOpen={showCreator}
        onClose={() => setShowCreator(false)}
        onSave={(data) => {
          setRoadmapData(data);
          setShowCreator(false);
        }}
      />
    </div>
  );
}

export default Roadmap;
