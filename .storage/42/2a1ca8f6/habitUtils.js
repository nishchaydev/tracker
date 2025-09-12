/**
 * Calculate streak for a habit based on its completion history
 * @param {Object} habit - The habit object
 * @returns {number} - The current streak count
 */
export const calculateStreak = (habit) => {
  if (!habit.completions || habit.completions.length === 0) {
    return 0;
  }

  // Sort completions by date in descending order
  const sortedCompletions = [...habit.completions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  // Get today and yesterday dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if the most recent completion is from today or yesterday
  const mostRecentDate = new Date(sortedCompletions[0].date);
  mostRecentDate.setHours(0, 0, 0, 0);
  
  const isTodayOrYesterday = 
    mostRecentDate.getTime() === today.getTime() || 
    mostRecentDate.getTime() === yesterday.getTime();
  
  if (!isTodayOrYesterday) {
    return 0; // Streak broken
  }

  // Count consecutive days
  let streak = 1;
  let currentDate = mostRecentDate;
  
  for (let i = 1; i < sortedCompletions.length; i++) {
    const completionDate = new Date(sortedCompletions[i].date);
    completionDate.setHours(0, 0, 0, 0);
    
    // Check if this completion is the previous day
    const expectedPreviousDate = new Date(currentDate);
    expectedPreviousDate.setDate(expectedPreviousDate.getDate() - 1);
    
    if (completionDate.getTime() === expectedPreviousDate.getTime()) {
      streak++;
      currentDate = completionDate;
    } else {
      break;
    }
  }
  
  return streak;
};

/**
 * Determine which badges a habit has earned
 * @param {Object} habit - The habit object
 * @returns {Array} - Array of earned badge objects
 */
export const getEarnedBadges = (habit) => {
  const badges = [];
  const streak = calculateStreak(habit);
  
  // Streak badges
  if (streak >= 3) badges.push({ id: '3-day', name: '3-Day Streak', icon: '🔥' });
  if (streak >= 7) badges.push({ id: '7-day', name: '7-Day Consistency', icon: '⚡' });
  if (streak >= 14) badges.push({ id: '14-day', name: '2-Week Master', icon: '🌟' });
  if (streak >= 30) badges.push({ id: '30-day', name: 'Monthly Champion', icon: '🏆' });
  if (streak >= 100) badges.push({ id: '100-day', name: 'Centurion', icon: '👑' });

  // Completion count badges
  const completionCount = habit.completions?.length || 0;
  if (completionCount >= 10) badges.push({ id: '10-comp', name: '10 Completions', icon: '🎯' });
  if (completionCount >= 50) badges.push({ id: '50-comp', name: '50 Completions', icon: '🚀' });
  if (completionCount >= 100) badges.push({ id: '100-comp', name: '100 Completions', icon: '💎' });

  return badges;
};

/**
 * Get weekly completion data for charts
 * @param {Object} habit - The habit object
 * @param {number} weeks - Number of weeks of data to return
 * @returns {Object} - Data formatted for charts
 */
export const getWeeklyData = (habit, weeks = 4) => {
  if (!habit.completions || habit.completions.length === 0) {
    return { labels: [], data: [] };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Create week labels (going back from current week)
  const labels = [];
  const data = [];
  
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (today.getDay() + (7 * i)));
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    // Format date range as "Mon DD - Mon DD"
    const startStr = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    labels.push(`${startStr} - ${endStr}`);
    
    // Count completions for this week
    const weekCompletions = (habit.completions || []).filter(completion => {
      const completionDate = new Date(completion.date);
      return completionDate >= weekStart && completionDate <= weekEnd;
    });
    
    data.push(weekCompletions.length);
  }
  
  return { labels, data };
};

/**
 * Get completion rate for a habit
 * @param {Object} habit - The habit object
 * @param {number} days - Number of days to consider
 * @returns {number} - Completion rate as percentage
 */
export const getCompletionRate = (habit, days = 30) => {
  if (!habit.completions || habit.completions.length === 0) {
    return 0;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - days);
  
  // Count days with completions in the period
  const daysWithCompletions = new Set();
  
  habit.completions.forEach(completion => {
    const completionDate = new Date(completion.date);
    completionDate.setHours(0, 0, 0, 0);
    
    if (completionDate >= startDate && completionDate <= today) {
      daysWithCompletions.add(completionDate.toISOString().split('T')[0]);
    }
  });
  
  // Calculate days when habit should have been completed based on frequency
  let expectedDays = 0;
  
  if (habit.frequency === 'daily') {
    expectedDays = days;
  } else if (habit.frequency === 'weekly') {
    expectedDays = Math.ceil(days / 7);
  } else if (Array.isArray(habit.frequency)) {
    // For specific days of week frequency (e.g., ['monday', 'wednesday', 'friday'])
    let daysCounted = 0;
    let currentDate = new Date(startDate);
    
    while (currentDate <= today) {
      const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      if (habit.frequency.includes(dayOfWeek)) {
        expectedDays++;
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
      daysCounted++;
      
      if (daysCounted >= days) break;
    }
  }
  
  if (expectedDays === 0) return 0;
  
  return Math.round((daysWithCompletions.size / expectedDays) * 100);
};

/**
 * Generate motivational quotes for developers
 * @returns {Object} - A random quote object with text and author
 */
export const getRandomQuote = () => {
  const quotes = [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      text: "It's not about perfect. It's about effort.",
      author: "Jillian Michaels"
    },
    {
      text: "Small daily improvements are the key to staggering long-term results.",
      author: "Anonymous"
    },
    {
      text: "Consistency is the hallmark of the unimaginative.",
      author: "Oscar Wilde"
    },
    {
      text: "Success is the sum of small efforts, repeated day in and day out.",
      author: "Robert Collier"
    },
    {
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain"
    },
    {
      text: "Debugging is twice as hard as writing the code in the first place.",
      author: "Brian Kernighan"
    },
    {
      text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
      author: "Martin Fowler"
    },
    {
      text: "The best time to plant a tree was 20 years ago. The second best time is now.",
      author: "Chinese Proverb"
    },
    {
      text: "If you can write 'hello world', you can change the world.",
      author: "Anonymous"
    },
    {
      text: "Done is better than perfect.",
      author: "Sheryl Sandberg"
    },
    {
      text: "Make it work, make it right, make it fast.",
      author: "Kent Beck"
    }
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
};