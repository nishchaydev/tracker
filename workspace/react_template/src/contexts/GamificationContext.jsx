import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import * as LocalStorage from '../utils/localStorage';

const GamificationContext = createContext();

// XP and level calculation constants
const XP_PER_LEVEL = 500;
const XP_MULTIPLIER = 1.2;

// Action types
const GAMIFICATION_ACTIONS = {
  ADD_XP: 'ADD_XP',
  COMPLETE_TASK: 'COMPLETE_TASK',
  COMPLETE_TIMETABLE_SLOT: 'COMPLETE_TIMETABLE_SLOT',
  WRITE_JOURNAL: 'WRITE_JOURNAL',
  UPDATE_STREAK: 'UPDATE_STREAK',
  EARN_BADGE: 'EARN_BADGE',
  LEVEL_UP: 'LEVEL_UP',
  RESET_DAILY: 'RESET_DAILY'
};

// Initial state
const initialState = {
  level: 1,
  totalXP: 0,
  currentLevelXP: 0,
  xpToNextLevel: XP_PER_LEVEL,
  currentStreak: 0,
  longestStreak: 0,
  badges: [],
  achievements: {
    firstTask: false,
    firstJournal: false,
    firstStreak: false,
    weekStreak: false,
    monthStreak: false,
    levelUp: false,
    roadmapPhaseComplete: false,
    perfectWeek: false
  },
  lastActiveDate: new Date().toDateString()
};

// Gamification reducer
function gamificationReducer(state, action) {
  switch (action.type) {
    case GAMIFICATION_ACTIONS.ADD_XP:
      const newTotalXP = state.totalXP + action.payload.amount;
      const newLevel = Math.floor(newTotalXP / XP_PER_LEVEL) + 1;
      const newCurrentLevelXP = newTotalXP % XP_PER_LEVEL;
      const newXpToNextLevel = XP_PER_LEVEL - newCurrentLevelXP;
      
      const newState = {
        ...state,
        totalXP: newTotalXP,
        level: newLevel,
        currentLevelXP: newCurrentLevelXP,
        xpToNextLevel: newXpToNextLevel
      };

      // Check for level up
      if (newLevel > state.level) {
        newState.achievements = {
          ...newState.achievements,
          levelUp: true
        };
      }

      return newState;

    case GAMIFICATION_ACTIONS.COMPLETE_TASK:
      return {
        ...state,
        ...gamificationReducer(state, {
          type: GAMIFICATION_ACTIONS.ADD_XP,
          payload: { amount: action.payload.xpReward }
        })
      };

    case GAMIFICATION_ACTIONS.COMPLETE_TIMETABLE_SLOT:
      return {
        ...state,
        ...gamificationReducer(state, {
          type: GAMIFICATION_ACTIONS.ADD_XP,
          payload: { amount: action.payload.xpReward }
        })
      };

    case GAMIFICATION_ACTIONS.WRITE_JOURNAL:
      return {
        ...state,
        ...gamificationReducer(state, {
          type: GAMIFICATION_ACTIONS.ADD_XP,
          payload: { amount: action.payload.xpReward }
        })
      };

    case GAMIFICATION_ACTIONS.UPDATE_STREAK:
      const newStreak = action.payload.streak;
      return {
        ...state,
        currentStreak: newStreak,
        longestStreak: Math.max(state.longestStreak, newStreak),
        achievements: {
          ...state.achievements,
          firstStreak: newStreak >= 1,
          weekStreak: newStreak >= 7,
          monthStreak: newStreak >= 30
        }
      };

    case GAMIFICATION_ACTIONS.EARN_BADGE:
      const newBadges = [...state.badges];
      if (!newBadges.find(badge => badge.id === action.payload.badgeId)) {
        newBadges.push({
          id: action.payload.badgeId,
          name: action.payload.badgeName,
          description: action.payload.badgeDescription,
          earnedDate: new Date().toISOString(),
          icon: action.payload.badgeIcon
        });
      }
      return {
        ...state,
        badges: newBadges
      };

    case GAMIFICATION_ACTIONS.RESET_DAILY:
      return {
        ...state,
        lastActiveDate: new Date().toDateString()
      };

    default:
      return state;
  }
}

// Gamification provider component
export function GamificationProvider({ children }) {
  const [state, dispatch] = useReducer(gamificationReducer, initialState);
  const [xpEvent, setXpEvent] = useState(null);

  // Load gamification data from localStorage on mount
  useEffect(() => {
    const loadGamificationData = async () => {
      try {
        const savedData = await LocalStorage.getItem('gamificationData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          // Only load if the data is from today or later
          if (parsedData.lastActiveDate === new Date().toDateString()) {
            Object.keys(parsedData).forEach(key => {
              if (parsedData[key] !== undefined) {
                dispatch({
                  type: 'LOAD_DATA',
                  payload: { key, value: parsedData[key] }
                });
              }
            });
          }
        }
      } catch (error) {
        console.error('Error loading gamification data:', error);
      }
    };

    loadGamificationData();
  }, []);

  // Save gamification data to localStorage whenever it changes
  useEffect(() => {
    LocalStorage.setItem('gamificationData', JSON.stringify(state));
  }, [state]);

  // Gamification actions
  const addXP = (amount, source = 'general') => {
    dispatch({
      type: GAMIFICATION_ACTIONS.ADD_XP,
      payload: { amount, source }
    });
    // Fire ephemeral XP event for UI feedback
    setXpEvent({ id: Date.now(), amount, source });
  };

  const completeTask = (taskData) => {
    dispatch({
      type: GAMIFICATION_ACTIONS.COMPLETE_TASK,
      payload: taskData
    });
    if (taskData && typeof taskData.xpReward === 'number') {
      setXpEvent({ id: Date.now(), amount: taskData.xpReward, source: 'task' });
    }
  };

  const completeTimetableSlot = (slotData) => {
    dispatch({
      type: GAMIFICATION_ACTIONS.COMPLETE_TIMETABLE_SLOT,
      payload: slotData
    });
    const amount = (slotData && typeof slotData.xpReward === 'number') ? slotData.xpReward : 10;
    setXpEvent({ id: Date.now(), amount, source: 'timetable-slot' });
  };

  const writeJournal = (journalData) => {
    dispatch({
      type: GAMIFICATION_ACTIONS.WRITE_JOURNAL,
      payload: journalData
    });
    const amount = (journalData && typeof journalData.xpReward === 'number') ? journalData.xpReward : 20;
    setXpEvent({ id: Date.now(), amount, source: 'journal' });
  };

  const updateStreak = (streak) => {
    dispatch({
      type: GAMIFICATION_ACTIONS.UPDATE_STREAK,
      payload: { streak }
    });
    if (typeof streak === 'number' && streak > 0 && streak % 7 === 0) {
      // Celebrate weekly streaks
      setXpEvent({ id: Date.now(), amount: 50, source: 'streak' });
    }
  };

  const earnBadge = (badgeData) => {
    dispatch({
      type: GAMIFICATION_ACTIONS.EARN_BADGE,
      payload: badgeData
    });
  };

  const resetDaily = () => {
    dispatch({
      type: GAMIFICATION_ACTIONS.RESET_DAILY
    });
  };

  const value = {
    ...state,
    addXP,
    completeTask,
    completeTimetableSlot,
    writeJournal,
    updateStreak,
    earnBadge,
    resetDaily,
    xpEvent
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

// Custom hook to use gamification context
export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}


