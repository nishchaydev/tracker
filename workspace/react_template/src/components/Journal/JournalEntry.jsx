import { useState } from 'react';

function JournalEntry({ entry, onEdit, onDelete, isToday = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: entry.title,
    content: entry.content,
    mood: entry.mood,
    tags: entry.tags || []
  });

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'excited': return 'text-yellow-500';
      case 'happy': return 'text-green-500';
      case 'focused': return 'text-blue-500';
      case 'calm': return 'text-purple-500';
      case 'tired': return 'text-gray-500';
      case 'frustrated': return 'text-red-500';
      case 'motivated': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'excited': return '🤩';
      case 'happy': return '😊';
      case 'focused': return '🎯';
      case 'calm': return '😌';
      case 'tired': return '😴';
      case 'frustrated': return '😤';
      case 'motivated': return '💪';
      default: return '😐';
    }
  };

  const handleSave = () => {
    onEdit(entry.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags || []
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
            <select
              value={editData.mood}
              onChange={(e) => setEditData({ ...editData, mood: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="excited">🤩 Excited</option>
              <option value="happy">😊 Happy</option>
              <option value="focused">🎯 Focused</option>
              <option value="calm">😌 Calm</option>
              <option value="tired">😴 Tired</option>
              <option value="frustrated">😤 Frustrated</option>
              <option value="motivated">💪 Motivated</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={editData.content}
              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border ${
      isToday ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getMoodIcon(entry.mood)}</span>
          <span className={`font-medium ${getMoodColor(entry.mood)}`}>
            {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
          </span>
          {isToday && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Today
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-blue-600 font-medium">
            💎 {entry.xpReward} XP
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit entry"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete entry"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <h3 className="font-semibold text-gray-900 mb-1">{entry.title}</h3>
        <p className="text-gray-700 text-sm leading-relaxed">{entry.content}</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-1">
          {entry.tags && entry.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="text-xs text-gray-500">
          {new Date(entry.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
}

export default JournalEntry;


