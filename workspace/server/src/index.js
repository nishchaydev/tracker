import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { scrapeSampleBoard, scrapeRemoteOK, scrapeWeWorkRemotely, dedupeJobs } from './scraper.js';
import { startDailyScrape } from './cron.js';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Path to persistent jobs store
const dataDir = path.join(__dirname, '..', 'data');
const jobsFile = path.join(dataDir, 'jobs.json');

// Ensure data directory and file exist
function ensureStorage() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(jobsFile)) {
    fs.writeFileSync(jobsFile, JSON.stringify({ jobs: [] }, null, 2));
  }
}

ensureStorage();

// Health endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'tracker-server' });
});

// Read jobs helper
function readJobs() {
  try {
    const raw = fs.readFileSync(jobsFile, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.jobs) ? parsed.jobs : [];
  } catch {
    return [];
  }
}

// Write jobs helper
function writeJobs(jobs) {
  fs.writeFileSync(jobsFile, JSON.stringify({ jobs }, null, 2));
}

// GET /jobs - return merged jobs (persisted + link-only)
app.get('/jobs', (_req, res) => {
  const jobs = readJobs();
  // Merge link-only entries
  const sourcesPath = path.join(__dirname, '..', 'data', 'sources.json');
  let linkOnly = [];
  try {
    if (fs.existsSync(sourcesPath)) {
      const raw = fs.readFileSync(sourcesPath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.linkOnly)) linkOnly = parsed.linkOnly;
    }
  } catch {}
  res.json({ jobs: [...linkOnly, ...jobs] });
});

// POST /scrape - trigger scraping now (multiple sources) and persist results
app.post('/scrape', async (_req, res) => {
  try {
    ensureStorage();
    const existing = readJobs();
    const [sample, rok, wwr] = await Promise.all([
      scrapeSampleBoard(),
      scrapeRemoteOK(),
      scrapeWeWorkRemotely()
    ]);
    const scraped = [...sample, ...rok, ...wwr];
    const merged = dedupeJobs(existing, scraped);
    writeJobs(merged);
    res.json({ message: 'Scrape completed', added: merged.length - existing.length, total: merged.length });
  } catch (e) {
    res.status(500).json({ error: 'Scrape failed', details: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`tracker-server listening on http://localhost:${PORT}`);
});

// Start cron after server boots
startDailyScrape();


