/**
 * Export Service
 * Utility for exporting data to Excel or CSV formats
 * Using SheetJS (xlsx) for file generation
 */

import * as XLSX from 'xlsx';

/**
 * Export data to Excel format
 * @param {Array} data - The data to export
 * @param {string} fileName - Name for the exported file (without extension)
 * @param {string} sheetName - Name of the worksheet
 */
export const exportToExcel = (data, fileName = 'export', sheetName = 'Sheet1') => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Generate the file and trigger download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

/**
 * Export data to CSV format
 * @param {Array} data - The data to export
 * @param {string} fileName - Name for the exported file (without extension)
 */
export const exportToCSV = (data, fileName = 'export') => {
  try {
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Generate CSV content
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    
    // Create a Blob containing the data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link
    const link = document.createElement('a');
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Set link properties
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    
    // Add link to document, trigger click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return false;
  }
};

/**
 * Format habit data for export
 * Transforms habit data into a flat structure suitable for export
 * 
 * @param {Array} habits - Array of habit objects
 * @returns {Array} Flat array of habit completion records
 */
export const formatHabitDataForExport = (habits) => {
  if (!habits || habits.length === 0) {
    return [];
  }
  
  // Create a flat array of habit completion records
  const exportData = [];
  
  habits.forEach(habit => {
    if (habit.completionLog && habit.completionLog.length > 0) {
      habit.completionLog.forEach(log => {
        exportData.push({
          'Habit Name': habit.name,
          'Habit Description': habit.description,
          'Date': new Date(log.date).toLocaleDateString(),
          'Completed': log.isComplete ? 'Yes' : 'No',
          'Count': log.count || 0,
          'Target': habit.target || 1,
          'Streak': habit.calculateStreak ? habit.calculateStreak() : 0
        });
      });
    } else {
      // Include habits with no completion logs
      exportData.push({
        'Habit Name': habit.name,
        'Habit Description': habit.description,
        'Date': 'No data',
        'Completed': 'No data',
        'Count': 0,
        'Target': habit.target || 1,
        'Streak': 0
      });
    }
  });
  
  return exportData;
};

export default {
  exportToExcel,
  exportToCSV,
  formatHabitDataForExport
};