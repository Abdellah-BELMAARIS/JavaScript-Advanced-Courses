/**
 * Local Dev Server + Mock Django REST Framework (DRF) API
 * Run with: npm run dev
 * - Serves workspace HTML/CSS/JS files with ES Module support (http://localhost:8000)
 * - Simulates DRF endpoints:
 *   GET/POST       http://localhost:8000/api/tasks/
 *   PATCH/DELETE   http://localhost:8000/api/tasks/:id/
 *   GET/POST       http://localhost:8000/api/articles/?page=1&category=all&search=...
 *   GET            http://localhost:8000/api/weather/?city=Casablanca
 *   POST           http://localhost:8000/api/token/ & /api/token/refresh/
 *   GET            http://localhost:8000/api/protected-profile/
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 8000;

let tasks = [
  { id: 1, title: 'Replace Django {% for %} loop with <template> & DocumentFragment', completed: true, priority: 'high' },
  { id: 2, title: 'Practice fetch() with X-CSRFToken & DRF error handling', completed: false, priority: 'high' },
  { id: 3, title: 'Build Weather App frontend with async/await & AbortController', completed: false, priority: 'medium' },
  { id: 4, title: 'Implement URLSearchParams + history.pushState pagination', completed: false, priority: 'low' }
];

let articles = [
  { id: 1, title: 'Optimizing Django ORM Queries (select_related & prefetch_related)', category: 'django', is_published: true, views: 1420 },
  { id: 2, title: 'Why Frontend Event Delegation Beats Direct Listeners', category: 'javascript', is_published: true, views: 980 },
  { id: 3, title: 'Connecting Python Backends to LLM RAG Pipelines', category: 'ai', is_published: false, views: 640 },
  { id: 4, title: 'Zero-XSS DOM Rendering with HTML5 <template> and DocumentFragment', category: 'javascript', is_published: true, views: 1150 },
  { id: 5, title: 'DRF SimpleJWT Authentication & 401 Silent Refresh Interceptors', category: 'django', is_published: true, views: 1310 },
  { id: 6, title: 'Building Interactive 3D Web Arcades with Pygbag & Three.js', category: 'ai', is_published: true, views: 890 },
  { id: 7, title: 'Replacing Jinja2 Server Pagination with URLSearchParams & pushState', category: 'javascript', is_published: true, views: 770 }
];

const WEATHER_DB = {
  casablanca: { city: 'Casablanca', country: 'MA', temp_c: 24, condition: 'Clear Sky', humidity: 65, wind_kph: 18 },
  rabat: { city: 'Rabat', country: 'MA', temp_c: 22, condition: 'Partly Cloudy', humidity: 70, wind_kph: 15 },
  marrakech: { city: 'Marrakech', country: 'MA', temp_c: 31, condition: 'Sunny & Warm', humidity: 32, wind_kph: 11 },
  tangier: { city: 'Tangier', country: 'MA', temp_c: 21, condition: 'Breezy Atlantic', humidity: 74, wind_kph: 28 },
  paris: { city: 'Paris', country: 'FR', temp_c: 16, condition: 'Light Rain', humidity: 82, wind_kph: 14 },
  tokyo: { city: 'Tokyo', country: 'JP', temp_c: 19, condition: 'Clear Night', humidity: 58, wind_kph: 12 }
};

let currentValidAccessToken = 'drf_access_valid_initial';

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

  // 1. TASKS ENDPOINT (/api/tasks/)
  if (pathname === '/api/tasks/' || pathname === '/api/tasks') {
    if (req.method === 'GET') {
      return sendJson(res, 200, { count: tasks.length, next: null, previous: null, results: tasks });
    }
    if (req.method === 'POST') {
      const body = await parseBody(req);
      if (!body.title || String(body.title).trim().length < 3) {
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

  // 2. ARTICLES ENDPOINT WITH DRF PAGINATION (/api/articles/)
  if (pathname === '/api/articles/' || pathname === '/api/articles') {
    if (req.method === 'POST') {
      const body = await parseBody(req);
      if (!body.title || String(body.title).trim().length < 5) {
        return sendJson(res, 400, { title: ['Article title must be at least 5 characters long.'] });
      }
      const created = {
        id: articles.length ? Math.max(...articles.map(a => a.id)) + 1 : 1,
        title: String(body.title).trim(),
        category: body.category || 'django',
        is_published: body.is_published !== undefined ? Boolean(body.is_published) : true,
        views: 1
      };
      articles.unshift(created);
      return sendJson(res, 201, created);
    }

    const category = url.searchParams.get('category');
    const search = (url.searchParams.get('search') || '').toLowerCase();
    const page = Math.max(1, Number(url.searchParams.get('page') || 1));
    const pageSize = Math.max(1, Number(url.searchParams.get('page_size') || 3));

    let filtered = articles;
    if (category && category !== 'all') filtered = filtered.filter((a) => a.category === category);
    if (search) filtered = filtered.filter((a) => a.title.toLowerCase().includes(search));

    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const startIdx = (page - 1) * pageSize;
    const paginatedResults = filtered.slice(startIdx, startIdx + pageSize);

    return sendJson(res, 200, {
      count: totalCount,
      total_pages: totalPages,
      current_page: page,
      next: page < totalPages ? `http://localhost:${PORT}/api/articles/?page=${page + 1}` : null,
      previous: page > 1 ? `http://localhost:${PORT}/api/articles/?page=${page - 1}` : null,
      results: paginatedResults,
    });
  }

  // 3. WEATHER ENDPOINT (/api/weather/?city=Casablanca)
  if (pathname === '/api/weather/' || pathname === '/api/weather') {
    const rawCity = (url.searchParams.get('city') || 'Casablanca').trim();
    const key = rawCity.toLowerCase();
    setTimeout(() => {
      if (key === 'invalid' || key === 'error') {
        return sendJson(res, 404, { detail: `City "${rawCity}" not found in meteorological database.` });
      }
      const record = WEATHER_DB[key] || {
        city: rawCity,
        country: 'GLOBAL',
        temp_c: 20,
        condition: 'Scattered Clouds',
        humidity: 60,
        wind_kph: 16
      };
      sendJson(res, 200, { ...record, updated_at: new Date().toLocaleTimeString() });
    }, 250);
    return;
  }

  // 4. SIMPLEJWT AUTH ENDPOINTS (/api/token/, /api/token/refresh/, /api/protected-profile/)
  if (pathname === '/api/token/' || pathname === '/api/token') {
    currentValidAccessToken = `drf_access_${Date.now()}`;
    return sendJson(res, 200, {
      access: currentValidAccessToken,
      refresh: 'drf_refresh_long_lived_token_2026'
    });
  }

  if (pathname === '/api/token/refresh/' || pathname === '/api/token/refresh') {
    const body = await parseBody(req);
    if (!body.refresh) {
      return sendJson(res, 401, { detail: 'Refresh token missing or invalid.' });
    }
    currentValidAccessToken = `drf_access_refreshed_${Date.now()}`;
    return sendJson(res, 200, { access: currentValidAccessToken });
  }

  if (pathname === '/api/protected-profile/' || pathname === '/api/protected-profile') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (!token || token !== currentValidAccessToken) {
      return sendJson(res, 401, {
        detail: 'Given token not valid for any token type',
        code: 'token_not_valid'
      });
    }
    return sendJson(res, 200, {
      username: 'abdellah_belmaaris',
      role: 'Junior Full-Stack Developer @ BIMPulse Digital',
      permissions: ['articles.add', 'articles.change', 'tasks.manage'],
      token_used: token
    });
  }

  // STATIC FILE SERVER
  const defaultRoute = '/JavaScript-Complete-Beginner-Tutorial--Projects/index.html';
  let filePath = path.join(ROOT_DIR, decodeURIComponent(pathname === '/' ? defaultRoute : pathname));
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
  console.log(`   ├─ Course Hub UI       : http://localhost:${PORT}/JavaScript-Complete-Beginner-Tutorial--Projects/index.html`);
  console.log(`   ├─ Practice Sandbox UI : http://localhost:${PORT}/.agent/js-frontend-reference/practice-sandbox/index.html`);
  console.log(`   ├─ Mock Tasks DRF API  : http://localhost:${PORT}/api/tasks/`);
  console.log(`   ├─ Mock Articles API   : http://localhost:${PORT}/api/articles/?page=1`);
  console.log(`   ├─ Mock Weather API    : http://localhost:${PORT}/api/weather/?city=Casablanca`);
  console.log(`   └─ Mock SimpleJWT API  : http://localhost:${PORT}/api/token/\n`);
});
