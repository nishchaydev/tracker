import * as XLSX from 'xlsx';

/**
 * Format habit data for export
 * @param {Array} habits - The array of habit objects
 * @returns {Array} - Formatted array ready for export
 */
export const formatHabitDataForExport = (habits) => {
  return habits.map(habit => {
    // Get completion data
    const completionDates = habit.completionLog?.map(log => log.date) || [];
    const completionStatus = habit.completionLog?.map(log => log.isComplete ? 'Yes' : 'No') || [];
    const completionCounts = habit.completionLog?.map(log => log.count || 0) || [];
    
    // Format basic habit data
    return {
      'Habit Name': habit.name,
      'Description': habit.description || '',
      'Frequency': habit.frequency || 'daily',
      'Target': habit.target || 1,
      'Current Streak': habit.streak || 0,
      'Created Date': new Date(habit.createdAt).toLocaleDateString(),
      'Completion History': completionDates.join(', '),
      'Completion Status': completionStatus.join(', '),
      'Completion Counts': completionCounts.join(', ')
    };
  });
};

/**
 * Export data to Excel format
 * @param {Array} data - The data array to export
 * @param {String} fileName - Name of the file (without extension)
 * @returns {Boolean} - Success status
 */
export const exportToExcel = (data, fileName) => {
  try {
    if (!data || data.length === 0) return false;
    
    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    
    // Generate an Excel file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

/**
 * Export data to CSV format
 * @param {Array} data - The data array to export
 * @param {String} fileName - Name of the file (without extension)
 * @returns {Boolean} - Success status
 */
export const exportToCSV = (data, fileName) => {
  try {
    if (!data || data.length === 0) return false;
    
    // Convert JSON to CSV
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    
    // Create a blob and download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    
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
 * Format job data for export (for future implementation)
 * @param {Array} jobs - The array of job objects
 * @returns {Array} - Formatted array ready for export
 */
export const formatJobDataForExport = (jobs) => {
  return jobs.map(job => {
    return {
      'Job Title': job.title,
      'Company': job.company,
      'Location': job.location,
      'Source': job.source,
      'Posted Date': new Date(job.postedDate).toLocaleDateString(),
      'Description': job.description,
      'Keywords': job.keywords ? job.keywords.join(', ') : '',
      'URL': job.url,
      'Scraped Date': new Date(job.scrapedDate).toLocaleDateString()
    };
  });
};