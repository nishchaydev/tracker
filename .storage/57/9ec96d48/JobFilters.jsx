import { useState, useEffect } from 'react';

function JobFilters({ onFilterChange, sources, locations }) {
  const [filters, setFilters] = useState({
    keyword: '',
    source: '',
    location: '',
    remote: false
  });
  
  // Apply filters when they change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Update a single filter value
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      keyword: '',
      source: '',
      location: '',
      remote: false
    });
  };

  // Handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter application is already handled in useEffect
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Filter Jobs</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Search by keyword */}
          <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="keyword"
              name="keyword"
              value={filters.keyword}
              onChange={handleFilterChange}
              placeholder="Job title, company, skills..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          {/* Filter by source */}
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
              Job Source
            </label>
            <select
              id="source"
              name="source"
              value={filters.source}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Sources</option>
              {sources.map(source => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
          
          {/* Filter by location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          
          {/* Remote jobs filter */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remote"
              name="remote"
              checked={filters.remote}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remote" className="ml-2 block text-sm text-gray-700">
              Remote jobs only
            </label>
          </div>
          
          {/* Filter actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear filters
            </button>
            
            <button
              type="submit"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default JobFilters;