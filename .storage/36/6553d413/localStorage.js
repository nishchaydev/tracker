/**
 * Get an item from localStorage with error handling
 * @param {string} key - The key to retrieve
 * @returns {Promise<string|null>} - The stored value or null if not found
 */
export const getItem = async (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return null;
  }
};

/**
 * Set an item in localStorage with error handling
 * @param {string} key - The key to set
 * @param {string} value - The value to store
 * @returns {Promise<boolean>} - Success status
 */
export const setItem = async (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error storing ${key} to localStorage:`, error);
    return false;
  }
};

/**
 * Remove an item from localStorage with error handling
 * @param {string} key - The key to remove
 * @returns {Promise<boolean>} - Success status
 */
export const removeItem = async (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

/**
 * Clear all items from localStorage with error handling
 * @returns {Promise<boolean>} - Success status
 */
export const clear = async () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Check if localStorage is available in the current environment
 * @returns {boolean} - True if localStorage is available
 */
export const isAvailable = () => {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};