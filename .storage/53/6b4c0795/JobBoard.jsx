import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../App';
import JobList from './JobList';
import JobFilters from './JobFilters';

function JobBoard() {
  const { jobs, isLoading } = useContext(AppContext);
  const [filteredJobs, setFilteredJobs] = useState([]);
  
  // Extract unique sources and locations for filter options
  const sources = [...new Set(jobs.map(job => job.source))];
  const locations = [...new Set(jobs.map(job => job.location))];

  // Apply filters to jobs
  const handleFilterChange = (filters) => {
    let result = [...jobs];
    
    // Apply keyword search
    if (filters.keyword) {
      const searchLower = filters.keyword.toLowerCase();
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
    if (filters.source) {
      result = result.filter(job => job.source === filters.source);
    }
    
    // Apply location filter
    if (filters.location) {
      result = result.filter(job => job.location === filters.location);
    }
    
    // Apply remote filter
    if (filters.remote) {
      result = result.filter(job => job.remote === true);
    }
    
    // Sort jobs by date (newest first)
    result.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    
    setFilteredJobs(result);
  };

  // Initialize filtered jobs with all jobs
  useEffect(() => {
    if (jobs) {
      // Sort by date by default
      const sortedJobs = [...jobs].sort((a, b) => 
        new Date(b.postedDate) - new Date(a.postedDate)
      );
      setFilteredJobs(sortedJobs);
    }
  }, [jobs]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Job Board</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="md:col-span-1">
          <JobFilters 
            onFilterChange={handleFilterChange}
            sources={sources}
            locations={locations}
          />
        </div>
        
        {/* Job listings */}
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-600">Loading jobs...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            <>
              <div className="mb-4 text-gray-600">
                Found <span className="font-semibold">{filteredJobs.length}</span> job{filteredJobs.length !== 1 && 's'}
              </div>
              <JobList jobs={filteredJobs} />
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-gray-400 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600">No jobs found matching your criteria.</p>
              <button
                onClick={() => handleFilterChange({})}
                className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters and try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobBoard;