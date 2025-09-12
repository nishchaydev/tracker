import { useState, useEffect } from 'react';

function HabitForm({ onSubmit, initialData, isEditing }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    target: 1,
    color: '#3b82f6', // Default blue
    reminderTime: '',
  });

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        reminderTime: initialData.reminderTime || '',
        target: initialData.target || 1,
        color: initialData.color || '#3b82f6',
      });
    }
  }, [initialData]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      alert('Please enter a habit name');
      return;
    }
    
    onSubmit(formData);
    
    // Reset form if not editing
    if (!isEditing) {
      setFormData({
        name: '',
        description: '',
        frequency: 'daily',
        target: 1,
        color: '#3b82f6',
        reminderTime: '',
      });
    }
  };

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'workdays', label: 'Weekdays (Mon-Fri)' },
    { value: 'weekends', label: 'Weekends (Sat-Sun)' },
    { value: 'custom', label: 'Custom' },
  ];

  const colorOptions = [
    { value: '#3b82f6', name: 'Blue' },
    { value: '#10b981', name: 'Green' },
    { value: '#f59e0b', name: 'Yellow' },
    { value: '#ef4444', name: 'Red' },
    { value: '#8b5cf6', name: 'Purple' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? 'Edit Habit' : 'Add New Habit'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Habit Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Morning Exercise"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
            Frequency
          </label>
          <select
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {frequencyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add details about your habit..."
          rows="2"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">
            Daily Target
          </label>
          <input
            type="number"
            id="target"
            name="target"
            value={formData.target}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-1">
            Reminder Time
          </label>
          <input
            type="time"
            id="reminderTime"
            name="reminderTime"
            value={formData.reminderTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <div className="flex space-x-2">
            {colorOptions.map(color => (
              <button
                key={color.value}
                type="button"
                className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => setFormData({ ...formData, color: color.value })}
                title={color.name}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {isEditing ? 'Update Habit' : 'Create Habit'}
        </button>
      </div>
    </form>
  );
}

export default HabitForm;