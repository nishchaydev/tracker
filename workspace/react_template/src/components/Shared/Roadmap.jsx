import { useState, useContext } from 'react';
import { AppContext } from '../../App';

function Roadmap() {
  const { setRoadmapPlan } = useContext(AppContext);
  const [goal, setGoal] = useState('');
  const [tasksInput, setTasksInput] = useState('');
  const [timePerDay, setTimePerDay] = useState(60);
  const [deadline, setDeadline] = useState('');
  const [plan, setPlan] = useState([]);

  // Parse tasks input into structured tasks with estimated minutes per task if provided
  function parseTasks(input) {
    return input
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map((line, idx) => {
        // Optional format: "Task title | minutes"
        const [title, minutesStr] = line.split('|').map(s => s?.trim());
        const minutes = Math.max(5, Number(minutesStr) || 60);
        return { id: String(idx + 1), title, minutesRemaining: minutes };
      });
  }

  // Generate day-by-day plan splitting tasks across days
  function generatePlan(e) {
    e.preventDefault();
    if (!goal || !tasksInput || !timePerDay || !deadline) return;

    const tasks = parseTasks(tasksInput);
    const dailyMinutes = Math.max(15, Number(timePerDay));
    const endDate = new Date(deadline + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    let currentDate = new Date(today);
    let queue = [...tasks];

    while (currentDate <= endDate && queue.length > 0) {
      let remaining = dailyMinutes;
      const items = [];
      queue = queue.map(t => ({ ...t }));

      for (const task of queue) {
        if (remaining <= 0) break;
        const chunk = Math.min(remaining, task.minutesRemaining);
        if (chunk > 0) {
          items.push({ taskId: task.id, title: task.title, minutes: chunk });
          task.minutesRemaining -= chunk;
          remaining -= chunk;
        }
      }

      // Remove completed tasks
      queue = queue.filter(t => t.minutesRemaining > 0);

      const dayStr = currentDate.toISOString().split('T')[0];
      const daysLeft = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));
      const overdue = currentDate > endDate;

      days.push({ date: dayStr, items, daysLeft, overdue });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setPlan(days);
    setRoadmapPlan(days);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Roadmap to Timetable</h2>
      <form onSubmit={generatePlan} className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
            <input
              type="text"
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="e.g., DSA 100 problems"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Time (minutes)</label>
            <input
              type="number"
              value={timePerDay}
              onChange={e => setTimePerDay(e.target.value)}
              min="15"
              step="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tasks (one per line, optional: | minutes)</label>
            <textarea
              rows="5"
              value={tasksInput}
              onChange={e => setTasksInput(e.target.value)}
              placeholder={"Example:\nArrays | 120\nLinked List | 90\nStacks & Queues | 60"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Generate</button>
        </div>
      </form>

      {plan.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Daily Timetable</h3>
            <span className="text-sm text-gray-500">Goal: {goal}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Left</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {plan.map(day => (
                  <tr key={day.date} className={day.overdue ? 'bg-red-50' : ''}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{day.date}</td>
                    <td className="px-4 py-2 text-sm">
                      {day.items.length > 0 ? (
                        <ul className="list-disc ml-5 space-y-1">
                          {day.items.map((it, idx) => (
                            <li key={idx}>
                              {it.title} — {it.minutes}m
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400">Rest/Buffer</span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <span className={`px-2 py-0.5 rounded-full ${day.overdue ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {day.overdue ? 'Overdue' : `${day.daysLeft} day${day.daysLeft === 1 ? '' : 's'} left`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Roadmap;


