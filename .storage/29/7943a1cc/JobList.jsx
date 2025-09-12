import { useState } from 'react';

function JobList({ jobs }) {
  const [expandedJobId, setExpandedJobId] = useState(null);
  
  // Toggle job expansion
  const toggleExpand = (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(jobId);
    }
  };
  
  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Determine if a job is new (posted within the last 3 days)
  const isNewJob = (dateString) => {
    const postedDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = currentDate - postedDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };
  
  // Open job listing in a new tab
  const openJobLink = (url, e) => {
    e.stopPropagation(); // Prevent toggling expansion
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {jobs.map(job => (
        <div 
          key={job.id} 
          className="bg-white rounded-lg shadow overflow-hidden transition-all cursor-pointer hover:shadow-md"
          onClick={() => toggleExpand(job.id)}
        >
          <div className="p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-gray-800">{job.title}</h3>
                  {isNewJob(job.postedDate) && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                      New
                    </span>
                  )}
                </div>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-gray-500 text-sm mt-1">{job.location}</p>
              </div>
              
              <div className="mt-2 sm:mt-0 sm:text-right flex flex-col items-start sm:items-end">
                <div className="inline-flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {job.source}
                  </span>
                  <span className="text-gray-500 text-xs">
                    Posted: {formatDate(job.postedDate)}
                  </span>
                </div>
                <button
                  onClick={(e) => openJobLink(job.url, e)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
                >
                  Apply 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Keywords */}
            {job.keywords && job.keywords.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {job.keywords.map((keyword, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {keyword}
                  </span>
                ))}
              </div>
            )}
            
            {/* Expanded details */}
            {expandedJobId === job.id && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-md font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-600">{job.description}</p>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Scraped: {formatDate(job.scrapedDate)}
                  </div>
                  
                  <div className="space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // This would save the job to a user's saved jobs list
                        // Will be implemented in future versions
                        alert('Save feature coming soon!');
                      }}
                      className="text-sm text-gray-600 hover:text-gray-800 inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Save
                    </button>
                    
                    <button
                      onClick={(e) => openJobLink(job.url, e)}
                      className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobList;