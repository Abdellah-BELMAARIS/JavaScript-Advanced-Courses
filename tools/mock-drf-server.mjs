/**
 * Local Dev Server + Mock Django REST Framework (DRF) API
 * Run with: npm run dev
 * - Serves workspace HTML/CSS/JS files with ES Module support (http://localhost:8000)
 * - Simulates DRF endpoints:
 *   GET/POST       http://localhost:8000/api/tasks/
 *   PATCH/DELETE   http://localhost:8000/api/tasks/:id/
 *   GET/POST       http://localhost:8000/api/articles/
 *   GET            http://localhost:8000/api/weather/?city=Casablanca
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 8000;

// In-memory mock database
let tasks = [
  { id: 1, title: 'Replace Django {% for %} loop with <template> & DocumentFragment', completed: true, priority: 'high' },
  { id: 2, title: 'Practice fetch() with X-CSRFToken & DRF error handling', completed: false, priority: 'high' },
  { id: 3, title: 'Build Weather App frontend with async/await', completed: false, priority: 'medium' },
];

let articles = [
  { id: 1, title: 'Optimizing Django ORM Queries (select_related & prefetch_related)', category: 'django', is_published: true, views: 1420 },
  { id: 2, title: 'Why Frontend Event Delegation Beats Direct Listeners', category: 'javascript', is_published: true, views: 980 },
  { id: 3, title: 'Connecting Python Backends to LLM RAG Pipelines', category: 'ai', is_published: false, views: 640 },
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-CSRFToken, Authorization',
    'Set-Cookie': 'csrftoken=mock_django_csrf_token_12345; Path=/; SameSite=Lax',
  });
  res.end(JSON.stringify(data, null, 2));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON payload'));
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {});
  }

  // --- MOCK DRF API ROUTES ---
  if (pathname === '/api/tasks/' || pathname === '/api/tasks') {
    if (req.method === 'GET') {
      return sendJson(res, 200, { count: tasks.length, next: null, previous: null, results: tasks });
    }
    if (req.method === 'POST') {
      const body = await parseBody(req);
      if (!body.title || String(body.title).trim().length < 3) {
        // Simulate DRF Serializer 400 Bad Request field validation error
        return sendJson(res, 400, { title: ['Ensure this field has at least 3 characters.'] });
      }
      const newTask = {
        id: tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
        title: String(body.title).trim(),
        completed: Boolean(body.completed),
        priority: body.priority || 'medium',
      };
      tasks.push(newTask);
      return sendJson(res, 201, newTask);
    }
  }

  const taskMatch = pathname.match(/^\/api\/tasks\/(\d+)\/?$/);
  if (taskMatch) {
    const id = Number(taskMatch[1]);
    const task = tasks.find((t) => t.id === id);
    if (!task) return sendJson(res, 404, { detail: 'Not found.' });

    if (req.method === 'PATCH' || req.method === 'PUT') {
      const body = await parseBody(req);
      Object.assign(task, body);
      return sendJson(res, 200, task);
    }
    if (req.method === 'DELETE') {
      tasks = tasks.filter((t) => t.id !== id);
      res.writeHead(204);
      return res.end();
    }
  }

  if (pathname === '/api/articles/' || pathname === '/api/articles') {
    const category = url.searchParams.get('category');
    const search = (url.searchParams.get('search') || '').toLowerCase();
    let filtered = articles;
    if (category && category !== 'all') filtered = filtered.filter((a) => a.category === category);
    if (search) filtered = filtered.filter((a) => a.title.toLowerCase().includes(search));
    return sendJson(res, 200, { count: filtered.length, next: null, previous: null, results: filtered });
  }

  if (pathname === '/api/weather/' || pathname === '/api/weather') {
    const city = url.searchParams.get('city') || 'Casablanca';
    return sendJson(res, 200, {
      city,
      country: 'MA',
      temp_c: 24,
      condition: 'Clear Sky',
      humidity: 65,
      wind_kph: 18,
    });
  }

  // --- STATIC FILE SERVER ---
  let filePath = path.join(ROOT_DIR, decodeURIComponent(pathname === '/' ? '/js-frontend-reference/practice-sandbox/index.html' : pathname));
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    return sendJson(res, 404, { detail: `File or endpoint not found: ${pathname}` });
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
    'Set-Cookie': 'csrftoken=mock_django_csrf_token_12345; Path=/; SameSite=Lax',
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`\n🚀 Local Frontend & Mock DRF Server running at: http://localhost:${PORT}`);
  console.log(`   ├─ Practice Sandbox UI : http://localhost:${PORT}/js-frontend-reference/practice-sandbox/`);
  console.log(`   ├─ Mock Tasks DRF API  : http://localhost:${PORT}/api/tasks/`);
  console.log(`   ├─ Mock Articles API   : http://localhost:${PORT}/api/articles/`);
  console.log(`   └─ Mock Weather API    : http://localhost:${PORT}/api/weather/?city=Casablanca\n`);
});
