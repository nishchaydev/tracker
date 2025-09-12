/**
 * LocalStorage service for data persistence
 * This utility provides methods to interact with the browser's localStorage
 * with error handling and type safety
 */

/**
 * Get item from localStorage
 * @param {string} key - The key to retrieve
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} The stored value or defaultValue if not found
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Set item in localStorage
 * @param {string} key - The key to store
 * @param {any} value - Value to store
 * @returns {boolean} Success status
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
    return false;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - The key to remove
 * @returns {boolean} Success status
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

/**
 * Clear all items from localStorage
 * @returns {boolean} Success status
 */
export const clear = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Get all stored keys
 * @returns {string[]} Array of localStorage keys
 */
export const getAllKeys = () => {
  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
  }
};

export default {
  getItem,
  setItem,
  removeItem,
  clear,
  getAllKeys
};