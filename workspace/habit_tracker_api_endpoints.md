# API Endpoints Documentation

## Job API Endpoints

### GET /api/jobs
- **Description**: Fetch all job listings
- **Query Parameters**:
  - `keyword`: Filter jobs by keyword
  - `location`: Filter jobs by location
  - `company`: Filter jobs by company
  - `limit`: Number of results to return (default: 50)
  - `offset`: Pagination offset (default: 0)
- **Response**: Array of job objects

### GET /api/jobs/:id
- **Description**: Fetch a specific job by ID
- **Parameters**:
  - `id`: Job ID
- **Response**: Job object

### POST /api/jobs/scrape
- **Description**: Manually trigger job scraping (admin only)
- **Response**: Status of scraping operation

## Future Endpoints (for Pro/Startup Level)

### User Authentication
- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: User login
- **GET /api/auth/me**: Get current user
- **POST /api/auth/logout**: User logout

### User Data Sync
- **GET /api/habits**: Get all habits for authenticated user
- **POST /api/habits**: Create a new habit
- **PUT /api/habits/:id**: Update a habit
- **DELETE /api/habits/:id**: Delete a habit
- **POST /api/habits/:id/complete**: Mark a habit as complete for today

### ATS Resume Helper
- **POST /api/resume/analyze**: Analyze resume against job description
- **GET /api/resume/keywords**: Get extracted keywords from job descriptions