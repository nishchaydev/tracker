import axios from 'axios';
import { load } from 'cheerio';

/**
 * Scrape jobs from a sample source URL.
 * This is a stub to be filled with actual selectors per source.
 * Returns an array of job objects with a stable id.
 */
export async function scrapeSampleBoard() {
  const url = 'https://example.com/jobs';
  try {
    // Example request; replace with real job board URL and parsing rules
    const { data } = await axios.get(url, { timeout: 15000 });
    const $ = load(data);

    const results = [];
    // Example structure: adapt to real DOM
    $('.job-card').each((_idx, el) => {
      const title = $(el).find('.job-title').text().trim();
      const company = $(el).find('.job-company').text().trim();
      const location = $(el).find('.job-location').text().trim() || 'Remote';
      const description = $(el).find('.job-desc').text().trim();
      const url = $(el).find('a.apply').attr('href');
      const postedDate = new Date().toISOString();
      const scrapedDate = new Date().toISOString();
      const source = 'SampleBoard';

      if (title && url) {
        const id = `${source}:${title}:${company}:${url}`.toLowerCase();
        results.push({ id, title, company, location, description, postedDate, scrapedDate, url, source, remote: /remote/i.test(location) });
      }
    });

    return results;
  } catch (err) {
    console.error('scrapeSampleBoard error:', err.message);
    return [];
  }
}

/**
 * Deduplicate jobs by stable id
 */
export function dedupeJobs(existingJobs, newJobs) {
  const existingIds = new Set(existingJobs.map(j => j.id));
  const merged = [...existingJobs];
  for (const job of newJobs) {
    if (!existingIds.has(job.id)) {
      merged.push(job);
      existingIds.add(job.id);
    }
  }
  return merged;
}

/**
 * Scrape RemoteOK using their public JSON endpoint
 */
export async function scrapeRemoteOK() {
  const url = 'https://remoteok.com/api';
  try {
    const { data } = await axios.get(url, { timeout: 20000, headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!Array.isArray(data)) return [];
    const now = new Date().toISOString();
    const results = data
      .filter(item => item && item.slug && item.position)
      .map(item => {
        const id = `RemoteOK:${item.slug}`.toLowerCase();
        const title = item.position;
        const company = item.company || 'Unknown';
        const location = (item.location || 'Remote').trim();
        const description = (item.description || '').replace(/<[^>]*>/g, '').slice(0, 300);
        const url = item.url || `https://remoteok.com/remote-jobs/${item.id}`;
        const postedDate = item.date || now;
        const scrapedDate = now;
        const source = 'RemoteOK';
        const remote = true;
        const keywords = Array.isArray(item.tags) ? item.tags : [];
        return { id, title, company, location, description, url, postedDate, scrapedDate, source, remote, keywords };
      });
    return results;
  } catch (e) {
    console.error('scrapeRemoteOK error:', e.message);
    return [];
  }
}

/**
 * Scrape WeWorkRemotely (WWR) list page
 */
export async function scrapeWeWorkRemotely() {
  const url = 'https://weworkremotely.com/remote-jobs';
  try {
    const { data } = await axios.get(url, { timeout: 20000, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = load(data);
    const now = new Date().toISOString();
    const results = [];
    $('section.jobs article ul li').each((_i, li) => {
      const anchor = $(li).find('a[href*="remote-jobs/"]').first();
      if (!anchor || anchor.length === 0) return;
      const href = anchor.attr('href');
      const url = href?.startsWith('http') ? href : `https://weworkremotely.com${href}`;
      const title = anchor.find('span.title').text().trim();
      const company = anchor.find('span.company').text().trim();
      const location = anchor.find('span.region').text().trim() || 'Remote';
      if (!title || !url) return;
      const id = `WWR:${title}:${company}:${url}`.toLowerCase();
      results.push({
        id,
        title,
        company: company || 'Unknown',
        location,
        description: '',
        url,
        postedDate: now,
        scrapedDate: now,
        source: 'WeWorkRemotely',
        remote: true,
        keywords: []
      });
    });
    return results;
  } catch (e) {
    console.error('scrapeWeWorkRemotely error:', e.message);
    return [];
  }
}

