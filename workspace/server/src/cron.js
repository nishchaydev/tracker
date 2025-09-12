import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { scrapeSampleBoard, scrapeRemoteOK, scrapeWeWorkRemotely, dedupeJobs } from './scraper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');
const jobsFile = path.join(dataDir, 'jobs.json');

function ensureStorage() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(jobsFile)) fs.writeFileSync(jobsFile, JSON.stringify({ jobs: [] }, null, 2));
}

function readJobs() {
  try {
    const raw = fs.readFileSync(jobsFile, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.jobs) ? parsed.jobs : [];
  } catch {
    return [];
  }
}

function writeJobs(jobs) {
  fs.writeFileSync(jobsFile, JSON.stringify({ jobs }, null, 2));
}

export function startDailyScrape() {
  ensureStorage();
  // Run at 09:00 every day server time
  cron.schedule('0 9 * * *', async () => {
    try {
      const existing = readJobs();
      const [sample, rok, wwr] = await Promise.all([
        scrapeSampleBoard(),
        scrapeRemoteOK(),
        scrapeWeWorkRemotely()
      ]);
      const scraped = [...sample, ...rok, ...wwr];
      const merged = dedupeJobs(existing, scraped);
      writeJobs(merged);
      console.log(`Cron: merged ${scraped.length} new jobs (total ${merged.length}).`);
    } catch (e) {
      console.error('Cron scrape error:', e);
    }
  });
}


