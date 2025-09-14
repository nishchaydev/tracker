import { useState } from 'react';
import { PlusIcon, AddIcon, CheckIcon, EditIcon, DeleteIcon } from '../Icons/IconSystem';

function RoadmapCreator({ isOpen, onClose, onSave }) {
  const [phases, setPhases] = useState([]);
  const [editingPhase, setEditingPhase] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const [phaseForm, setPhaseForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    xpReward: 50,
    deadline: ''
  });

  const addPhase = () => {
    if (phaseForm.title.trim()) {
      const newPhase = {
        id: `phase-${Date.now()}`,
        title: phaseForm.title,
        description: phaseForm.description,
        startDate: phaseForm.startDate,
        endDate: phaseForm.endDate,
        status: 'pending',
        tasks: []
      };
      setPhases([...phases, newPhase]);
      setPhaseForm({ title: '', description: '', startDate: '', endDate: '' });
    }
  };

  const addTask = (phaseId) => {
    if (taskForm.title.trim()) {
      const newTask = {
        id: `task-${Date.now()}`,
        title: taskForm.title,
        description: taskForm.description,
        xpReward: parseInt(taskForm.xpReward),
        status: 'pending',
        completedDate: null,
        deadline: taskForm.deadline
      };

      setPhases(phases.map(phase => 
        phase.id === phaseId 
          ? { ...phase, tasks: [...phase.tasks, newTask] }
          : phase
      ));
      setTaskForm({ title: '', description: '', xpReward: 50, deadline: '' });
    }
  };

  const deletePhase = (phaseId) => {
    setPhases(phases.filter(phase => phase.id !== phaseId));
  };

  const deleteTask = (phaseId, taskId) => {
    setPhases(phases.map(phase => 
      phase.id === phaseId 
        ? { ...phase, tasks: phase.tasks.filter(task => task.id !== taskId) }
        : phase
    ));
  };

  const handleSave = () => {
    console.log('Saving roadmap with phases:', phases);
    onSave({ phases });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Create Your Roadmap</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-white/90 mt-2">Plan your learning journey with phases and tasks</p>
        </div>

        <div className="p-6">
          {/* Phase Creation */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Learning Phase</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phase Title</label>
                <input
                  type="text"
                  value={phaseForm.title}
                  onChange={(e) => setPhaseForm({ ...phaseForm, title: e.target.value })}
                  placeholder="e.g., Foundation Phase"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={phaseForm.description}
                  onChange={(e) => setPhaseForm({ ...phaseForm, description: e.target.value })}
                  placeholder="e.g., Build core skills and establish daily routines"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={phaseForm.startDate}
                  onChange={(e) => setPhaseForm({ ...phaseForm, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={phaseForm.endDate}
                  onChange={(e) => setPhaseForm({ ...phaseForm, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={addPhase}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Phase</span>
            </button>
          </div>

          {/* Phases List */}
          <div className="space-y-6">
            {phases.map((phase, phaseIndex) => (
              <div key={phase.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{phase.title}</h4>
                    <p className="text-gray-600">{phase.description}</p>
                    <p className="text-sm text-gray-500">
                      {phase.startDate} - {phase.endDate}
                    </p>
                  </div>
                  <button
                    onClick={() => deletePhase(phase.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Task Creation for this Phase */}
                <div className="mb-4">
                  <h5 className="text-md font-medium text-gray-700 mb-2">Add Task to this Phase</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <input
                        type="text"
                        value={taskForm.title}
                        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                        placeholder="Task title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={taskForm.description}
                        onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                        placeholder="Task description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={taskForm.xpReward}
                        onChange={(e) => setTaskForm({ ...taskForm, xpReward: e.target.value })}
                        placeholder="XP Reward"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="date"
                        value={taskForm.deadline}
                        onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => addTask(phase.id)}
                    className="btn-secondary text-sm flex items-center space-x-1"
                  >
                    <AddIcon className="w-3 h-3" />
                    <span>Add Task</span>
                  </button>
                </div>

                {/* Tasks List */}
                <div className="space-y-2">
                  {phase.tasks.map((task, taskIndex) => (
                    <div key={task.id} className="bg-white rounded-md p-3 border border-gray-200 flex justify-between items-center">
                      <div className="flex-1">
                        <h6 className="font-medium text-gray-900">{task.title}</h6>
                        <p className="text-sm text-gray-600">{task.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-blue-600 font-medium">
                            {task.xpReward} XP
                          </span>
                          <span className="text-xs text-gray-500">
                            Due: {task.deadline}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTask(phase.id, task.id)}
                        className="text-red-500 hover:text-red-700 transition-colors ml-2"
                      >
                        <DeleteIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Debug Info */}
          <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
            <strong>Debug:</strong> Phases count: {phases.length} | 
            Button disabled: {phases.length === 0 ? 'Yes' : 'No'}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`btn-primary flex items-center space-x-2 ${
                phases.length === 0 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-lg transition-all duration-200'
              }`}
              disabled={phases.length === 0}
            >
              <span>Save Roadmap</span>
              {phases.length > 0 && <span className="text-xs">({phases.length} phase{phases.length !== 1 ? 's' : ''})</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoadmapCreator;


