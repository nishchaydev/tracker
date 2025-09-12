import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../App';
import JobList from './JobList';

function JobBoard() {
  const { jobs, isLoading } = useContext(AppContext);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    source: 'all',
    location: 'all',
    sortBy: 'newest'
  });

  // Available job sources from the jobs data
  const jobSources = ['all', ...new Set(jobs.map(job => job.source))];
  
  // Available job locations from the jobs data
  const jobLocations = ['all', ...new Set(jobs.map(job => job.location))];

  // Apply filters and sorting to jobs
  useEffect(() => {
    let result = [...jobs];
    
    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        (job.keywords && job.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchLower)
        ))
      );
    }
    
    // Apply source filter
    if (filters.source !== 'all') {
      result = result.filter(job => job.source === filters.source);
    }
    
    // Apply location filter
    if (filters.location !== 'all') {
      result = result.filter(job => job.location === filters.location);
    }
    
    // Apply sorting
    if (filters.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    } else if (filters.sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
    } else if (filters.sortBy === 'company') {
      result.sort((a, b) => a.company.localeCompare(b.company));
    }
    
    setFilteredJobs(result);
  }, [jobs, filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      source: 'all',
      location: 'all',
      sortBy: 'newest'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Job Board</h2>
        <p className="text-gray-600 mt-1">Find and track job opportunities</p>
      </div>
      
      {/* Filters section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                placeholder="Search jobs by title, company, or keywords..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <select
              name="source"
              value={filters.source}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {jobSources.map(source => (
                <option key={source} value={source}>
                  {source === 'all' ? 'All Sources' : source}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {jobLocations.map(location => (
                <option key={location} value={location}>
                  {location === 'all' ? 'All Locations' : location}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="company">Company Name</option>
            </select>
          </div>
        </div>
        
        <div className="mt-3 flex justify-end">
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {/* Job listings */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading jobs...</p>
        </div>
      ) : filteredJobs.length > 0 ? (
        <JobList jobs={filteredJobs} />
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No jobs found matching your criteria.</p>
          {filters.searchTerm || filters.source !== 'all' || filters.location !== 'all' ? (
            <button
              onClick={clearFilters}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Clear filters and try again
            </button>
          ) : (
            <p className="mt-2 text-gray-500">Check back later for new job listings.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default JobBoard;