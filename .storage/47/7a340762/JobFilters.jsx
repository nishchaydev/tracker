import { useState } from 'react';

/**
 * Component for filtering job listings
 */
function JobFilters({ onFilterChange, sources, locations }) {
  const [filters, setFilters] = useState({
    keyword: '',
    source: '',
    location: '',
    remote: false
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    const newFilters = {
      ...filters,
      [name]: newValue
    };
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters = {
      keyword: '',
      source: '',
      location: '',
      remote: false
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Filter Jobs</h2>
      
      <div className="space-y-4">
        {/* Keyword search */}
        <div>
          <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <input
              id="keyword"
              name="keyword"
              type="text"
              value={filters.keyword}
              onChange={handleChange}
              placeholder="Job title, company, or keywords..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {filters.keyword && (
              <button
                onClick={() => {
                  const newFilters = { ...filters, keyword: '' };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Source filter */}
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
            Source
          </label>
          <select
            id="source"
            name="source"
            value={filters.source}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Sources</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
        
        {/* Location filter */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <select
            id="location"
            name="location"
            value={filters.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        
        {/* Remote jobs filter */}
        <div className="flex items-center">
          <input
            id="remote"
            name="remote"
            type="checkbox"
            checked={filters.remote}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="remote" className="ml-2 block text-sm text-gray-700">
            Remote jobs only
          </label>
        </div>
        
        {/* Clear filters button */}
        <div className="pt-2">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 w-full bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobFilters;