import { useContext, useState } from 'react';
import { AppContext } from '../../App';
import { useGamification } from '../../contexts/GamificationContext';
import JournalEntry from './JournalEntry';
import JournalForm from './JournalForm';
import JournalTimeline from './JournalTimeline';

function Journal() {
  const { journalData, setJournalData } = useContext(AppContext);
  const { writeJournal, addXP } = useGamification();
  const [showForm, setShowForm] = useState(false);

  if (!journalData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading journal...</p>
        </div>
      </div>
    );
  }

  const handleAddEntry = (newEntry) => {
    const updatedJournal = { ...journalData };
    const entry = {
      id: `entry-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...newEntry,
      xpReward: 20,
      isCompleted: true
    };
    
    updatedJournal.entries.unshift(entry);
    
    // Award XP
    addXP(entry.xpReward, 'journal-entry');
    writeJournal(entry);
    
    setJournalData(updatedJournal);
    setShowForm(false);
  };

  const handleEditEntry = (entryId, updatedEntry) => {
    const updatedJournal = { ...journalData };
    const entryIndex = updatedJournal.entries.findIndex(e => e.id === entryId);
    
    if (entryIndex !== -1) {
      updatedJournal.entries[entryIndex] = {
        ...updatedJournal.entries[entryIndex],
        ...updatedEntry
      };
      setJournalData(updatedJournal);
    }
  };

  const handleDeleteEntry = (entryId) => {
    const updatedJournal = { ...journalData };
    updatedJournal.entries = updatedJournal.entries.filter(e => e.id !== entryId);
    setJournalData(updatedJournal);
  };

  const today = new Date().toISOString().split('T')[0];
  const todayEntry = journalData.entries.find(entry => entry.date === today);
  const recentEntries = journalData.entries.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto" data-tutorial="journal">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Journal</h1>
            <p className="text-gray-600">Reflect on your day and track your mood</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <span>✍️</span>
            <span>New Entry</span>
          </button>
        </div>
      </div>

      {/* Today's Entry or Quick Add */}
      <div className="mb-8">
        {todayEntry ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Entry</h2>
            <JournalEntry 
              entry={todayEntry} 
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
              isToday={true}
            />
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-200 p-8 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No entry for today yet</h3>
            <p className="text-gray-600 mb-4">Start your day with reflection and earn 20 XP!</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Write Today's Entry
            </button>
          </div>
        )}
      </div>

      {/* Recent Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Entries</h2>
          <div className="space-y-4">
            {recentEntries.map((entry) => (
              <JournalEntry 
                key={entry.id}
                entry={entry} 
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
                isToday={entry.date === today}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Journal Timeline</h2>
          <JournalTimeline entries={journalData.entries} />
        </div>
      </div>

      {/* Journal Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <JournalForm
              onSubmit={handleAddEntry}
              onCancel={() => setShowForm(false)}
              moodOptions={journalData.moodOptions}
              commonTags={journalData.commonTags}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Journal;
