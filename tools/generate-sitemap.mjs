#!/usr/bin/env node
/**
 * Simple sitemap generator that parses Angular route definitions in app-routing.module.ts.
 * It looks for objects like: { path: 'privacy-policy', component: X ... }
 * and ignores wildcard/redirect routes and 404.
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = resolve(__dirname, '..');
const routingFile = resolve(projectRoot, 'src/app/app-routing.module.ts');
const outputFile = resolve(projectRoot, 'src/sitemap.xml');

const BASE_URL = process.env.SITEMAP_BASE_URL || 'https://keshavsingh.net';

const src = readFileSync(routingFile, 'utf-8');

// naive regex to capture path: 'xyz'
const routeRegex = /path:\s*'([^']+)'/g;
let match;
const paths = new Set();
while ((match = routeRegex.exec(src)) !== null) {
  const p = match[1];
  if (p === '**' || p === '404') continue;
  // redirectTo path (we only want final destination) - skip .txt/.xml duplicates
  if (p.endsWith('.txt') || p.endsWith('.xml')) continue;
  paths.add(p);
}

// Always include root
paths.add('');

// Priority heuristic
function priorityFor(path) {
  if (path === '') return '1.0';
  if (path.includes('privacy') || path.includes('terms') || path.includes('cookie') || path.includes('disclaimer')) return '0.3';
  return '0.5';
}

const today = new Date().toISOString().split('T')[0];

const urlsXml = Array.from(paths).sort().map(p => {
  const loc = p ? `${BASE_URL}/${p}` : `${BASE_URL}/`;
  const changefreq = p === '' ? 'weekly' : 'yearly';
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priorityFor(p)}</priority>\n    <lastmod>${today}</lastmod>\n  </url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>\n`;

writeFileSync(outputFile, xml, 'utf-8');
console.log(`Sitemap generated with ${paths.size} entries -> ${outputFile}`);
