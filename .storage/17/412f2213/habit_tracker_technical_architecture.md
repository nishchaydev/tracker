# Technical Architecture Documentation

## Frontend Architecture

### Component Structure
The frontend is built with React.js using a component-based architecture:

1. **App Component**: Root component that manages routing and global state
2. **Layout Components**: 
   - Header - Navigation and application title
   - Sidebar - Quick access to different features
   - Main Content Area - Dynamic content based on selected view
3. **Feature Components**:
   - HabitTracker - Main habit tracking functionality
   - JobBoard - Job listing display and filtering
   - Dashboard - Overview with summary statistics (future)

### State Management
- React Context API for global state management
- Custom hooks for component-specific state
- LocalStorage service for data persistence

### Styling
- Tailwind CSS for utility-first styling
- Custom components with consistent design language
- Responsive design for mobile and desktop views

## Backend Architecture

### Server Structure
- Express.js REST API server
- Modular architecture with separate controllers and services
- Environment-based configuration

### Job Scraper Service
- Separate microservice for scraping job listings
- Configurable job sources
- Cheerio for HTML parsing
- Axios for HTTP requests

### Scheduling
- Node-cron for scheduled job scraping
- Configurable schedule (default: daily)

## Data Storage

### Client-Side Storage
- LocalStorage for habit data persistence
- Structured format with versioning for future migrations

### Server-Side Storage
- JSON files for job data (MVP)
- SQLite database for structured data (future)

## Data Flow

1. **Habit Tracking Flow**:
   - User creates/updates habits via UI
   - Data saved to LocalStorage
   - UI updates to reflect changes
   - Export functionality transforms data for download

2. **Job Aggregation Flow**:
   - Cron job triggers scraper at scheduled intervals
   - Scraper fetches job listings from configured sources
   - Data processed to remove duplicates and extract relevant information
   - Jobs saved to server storage
   - Client requests jobs through REST API
   - UI displays job listings with filtering options

## System Requirements

### Minimum Requirements
- Modern browser with LocalStorage support
- Node.js 14+ for server components
- Internet connectivity for job scraping

### Recommended Requirements
- 1GB RAM for server components
- 500MB disk space
- Stable internet connection

## Deployment Architecture

### Development Environment
- Local development with hot reloading
- Mock data for testing

### Production Environment
- Static hosting for frontend (e.g., Netlify, Vercel)
- Node.js hosting for backend (e.g., Heroku, DigitalOcean)
- Optional: Docker containerization for easier deployment