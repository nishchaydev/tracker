import ExcelJS from 'exceljs';

/**
 * Format roadmap data for export
 * @param {Object} roadmapData - The roadmap data object
 * @returns {Array} - Formatted array ready for export
 */
export const formatRoadmapDataForExport = (roadmapData) => {
  const exportData = [];
  
  roadmapData?.phases?.forEach(phase => {
    phase.tasks.forEach(task => {
      exportData.push({
        'Phase': phase.title,
        'Task Title': task.title,
        'Description': task.description,
        'Status': task.status,
        'XP Reward': task.xpReward,
        'Deadline': task.deadline,
        'Completed Date': task.completedDate || 'Not completed'
      });
    });
  });
  
  return exportData;
};

/**
 * Format timetable data for export
 * @param {Object} timetableData - The timetable data object
 * @returns {Array} - Formatted array ready for export
 */
export const formatTimetableDataForExport = (timetableData) => {
  return timetableData?.dailyActivities?.map(activity => ({
    'Activity': activity.title,
    'Description': activity.description,
    'Time Slot': activity.timeSlot,
    'Category': activity.category,
    'XP Reward': activity.xpReward,
    'Completed': activity.isCompleted ? 'Yes' : 'No',
    'Completed Date': activity.completedDate || 'Not completed'
  })) || [];
};

/**
 * Format journal data for export
 * @param {Object} journalData - The journal data object
 * @returns {Array} - Formatted array ready for export
 */
export const formatJournalDataForExport = (journalData) => {
  return journalData?.entries?.map(entry => ({
    'Date': entry.date,
    'Mood': entry.mood,
    'Title': entry.title,
    'Content': entry.content,
    'Tags': entry.tags?.join(', ') || '',
    'XP Reward': entry.xpReward
  })) || [];
};

/**
 * Export data to Excel format using ExcelJS
 * @param {Array} data - The data array to export
 * @param {String} fileName - Name of the file (without extension)
 * @returns {Promise<Boolean>} - Success status
 */
export const exportToExcel = async (data, fileName) => {
  try {
    if (!data || data.length === 0) return false;
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');
    
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Add headers
    worksheet.addRow(headers);
    
    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE5E7EB' }
    };
    
    // Add data rows
    data.forEach(row => {
      const values = headers.map(header => row[header]);
      worksheet.addRow(values);
    });
    
    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 15;
    });
    
    // Generate and download the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.xlsx`;
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
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
    
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escape commas and quotes in CSV
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return false;
  }
};
