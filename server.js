/* ===================================================================
   Bridgeway Developers — backend server + admin CMS
   -------------------------------------------------------------------
   - Server-side renders the public website from PUBLISHED content
   - Password-protected admin dashboard edits a DRAFT
   - "Publish to Site" promotes the draft to published (live)
   - Image / video uploads for hero, projects, galleries
   No build step. Run: npm install && npm start
   =================================================================== */
'use strict';

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- Paths ---------- */
const ROOT = __dirname;
// Seed is baked into the image (read-only starting content).
const SEED_FILE = path.join(ROOT, 'data', 'seed.json');
// Runtime state + uploads live on a PERSISTENT volume in production.
// Override with STATE_DIR / UPLOAD_DIR env vars (e.g. /data on Fly.io).
const STATE_DIR = process.env.STATE_DIR || path.join(ROOT, 'data');
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(ROOT, 'uploads');
const PUBLISHED_FILE = path.join(STATE_DIR, 'published.json');
const DRAFT_FILE = path.join(STATE_DIR, 'draft.json');
const AUTH_FILE = path.join(STATE_DIR, 'auth.json');

for (const dir of [STATE_DIR, UPLOAD_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/* ---------- Content store (draft / published) ---------- */
function readJSON(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return fallback;
  }
}
function writeJSON(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}

// Seed published + draft on first run.
const seed = readJSON(SEED_FILE, {});
if (!fs.existsSync(PUBLISHED_FILE)) {
  writeJSON(PUBLISHED_FILE, { content: seed, lastPublished: null });
}
if (!fs.existsSync(DRAFT_FILE)) {
  const pub = readJSON(PUBLISHED_FILE, { content: seed });
  writeJSON(DRAFT_FILE, { content: pub.content, updatedAt: null });
}

// One-time: align the editor draft with the live (published) site so the admin
// shows all current website text. Runs exactly once (guarded by a marker file).
const SYNC_MARKER = path.join(STATE_DIR, '.draft-synced-1');
if (!fs.existsSync(SYNC_MARKER)) {
  try {
    const pub = readJSON(PUBLISHED_FILE, { content: seed });
    writeJSON(DRAFT_FILE, { content: pub.content, updatedAt: new Date().toISOString() });
    fs.writeFileSync(SYNC_MARKER, '1');
    console.log('   ↻ Draft synced to live content (one-time).');
  } catch (e) { /* non-fatal */ }
}

function getPublished() {
  return readJSON(PUBLISHED_FILE, { content: seed, lastPublished: null });
}
function getDraft() {
  return readJSON(DRAFT_FILE, { content: seed, updatedAt: null });
}
function saveDraft(content) {
  writeJSON(DRAFT_FILE, { content, updatedAt: new Date().toISOString() });
}
function publishDraft() {
  const draft = getDraft();
  writeJSON(PUBLISHED_FILE, { content: draft.content, lastPublished: new Date().toISOString() });
  return getPublished();
}
function discardDraft() {
  const pub = getPublished();
  saveDraft(pub.content);
  return getDraft();
}

// Are there unpublished changes?
function hasPendingChanges() {
  return JSON.stringify(getDraft().content) !== JSON.stringify(getPublished().content);
}

/* ---------- Admin credentials ----------
   Stored hashed in data/auth.json. Defaults to env or "bridgeway123"
   on first run; the admin is prompted to change it.                    */
function loadAuth() {
  let auth = readJSON(AUTH_FILE, null);
  if (!auth) {
    const initial = process.env.ADMIN_PASSWORD || 'bridgeway123';
    auth = {
      username: process.env.ADMIN_USERNAME || 'admin',
      passwordHash: bcrypt.hashSync(initial, 10),
      isDefault: true
    };
    writeJSON(AUTH_FILE, auth);
    console.log('\n  ⚠  Admin login created — username: "%s", password: "%s"', auth.username, initial);
    console.log('     Change it from the admin Settings tab after logging in.\n');
  }
  return auth;
}
function saveAuth(auth) {
  writeJSON(AUTH_FILE, auth);
}

/* ---------- App setup ---------- */
app.set('view engine', 'ejs');
app.set('views', path.join(ROOT, 'views'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 8 }
  })
);

/* ---------- File uploads (images + video) ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = file.originalname.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/-+/g, '-');
    const stamp = Date.now().toString(36) + '-' + crypto.randomBytes(3).toString('hex');
    cb(null, stamp + '-' + safe);
  }
});
const MAX_UPLOAD_MB = 1024; // 1 GB per file
const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const okMime = /^image\//.test(file.mimetype) || /^video\//.test(file.mimetype);
    const okExt = /\.(jpe?g|png|gif|webp|avif|svg|bmp|heic|mp4|webm|mov|m4v|ogg|ogv|avi|mkv|3gp|m2ts)$/i.test(file.originalname);
    if (okMime || okExt) cb(null, true);
    else cb(new Error('Unsupported file type "' + (file.mimetype || file.originalname) + '". Use an image or video file.'));
  }
});

/* ---------- Never cache admin or API responses ---------- */
app.use(['/api', '/admin'], (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  next();
});

/* ---------- Static assets ---------- */
app.use('/uploads', express.static(UPLOAD_DIR));
app.use('/admin/assets', express.static(path.join(ROOT, 'public', 'admin')));
// Existing site assets at repo root (css, js, logo, favicon, default hero video).
for (const f of ['styles.css', 'script.js', 'logo.png', 'favicon.svg', 'hero-video.mp4']) {
  app.get('/' + f, (req, res) => res.sendFile(path.join(ROOT, f)));
}

/* ===================================================================
   PUBLIC SITE  (rendered from PUBLISHED content; ?preview=1 = draft)
   =================================================================== */
app.get('/', (req, res) => {
  const isPreview = req.query.preview === '1' && req.session.user;
  const content = isPreview ? getDraft().content : getPublished().content;
  res.render('index', { c: content, preview: isPreview });
});

// Dedicated project page
app.get('/projects/:id', (req, res) => {
  const isPreview = req.query.preview === '1' && req.session.user;
  const content = isPreview ? getDraft().content : getPublished().content;
  const items = (content.projects && content.projects.items) || [];
  const project = items.find((p) => p.id === req.params.id);
  if (!project) return res.redirect('/#projects');
  res.render('project', { c: content, project, preview: isPreview });
});

// JSON content API (handy for headless use)
app.get('/api/content', (req, res) => res.json(getPublished().content));

/* ===================================================================
   AUTH
   =================================================================== */
function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'Not authenticated' });
  return res.redirect('/admin/login');
}

app.get('/admin/login', (req, res) => {
  if (req.session.user) return res.redirect('/admin');
  res.render('admin/login', { error: null });
});

app.post('/admin/login', (req, res) => {
  const auth = loadAuth();
  const { username, password } = req.body;
  const ok =
    username === auth.username && bcrypt.compareSync(password || '', auth.passwordHash);
  if (!ok) return res.status(401).render('admin/login', { error: 'Invalid username or password.' });
  req.session.user = { username: auth.username };
  res.redirect('/admin');
});

app.post('/admin/logout', requireAuth, (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

/* ===================================================================
   ADMIN DASHBOARD
   =================================================================== */
app.get('/admin', requireAuth, (req, res) => {
  const auth = loadAuth();
  res.render('admin/dashboard', {
    user: req.session.user,
    isDefaultPassword: !!auth.isDefault
  });
});

/* ---------- Admin API ---------- */

// Current draft + publish state
app.get('/api/admin/state', requireAuth, (req, res) => {
  const draft = getDraft();
  const pub = getPublished();
  res.json({
    content: draft.content,
    updatedAt: draft.updatedAt,
    lastPublished: pub.lastPublished,
    pendingChanges: hasPendingChanges()
  });
});

// Save one section of the draft (e.g. "hero", "projects", "services"...)
app.put('/api/admin/section/:key', requireAuth, (req, res) => {
  const key = req.params.key;
  const draft = getDraft();
  if (!(key in draft.content) && key !== 'site') {
    // allow new top-level keys too, but normally these exist
  }
  draft.content[key] = req.body;
  saveDraft(draft.content);
  res.json({ ok: true, pendingChanges: hasPendingChanges(), updatedAt: new Date().toISOString() });
});

// Replace the entire draft content (used for import / bulk)
app.put('/api/admin/content', requireAuth, (req, res) => {
  if (!req.body || typeof req.body !== 'object') return res.status(400).json({ error: 'Invalid content' });
  saveDraft(req.body);
  res.json({ ok: true, pendingChanges: hasPendingChanges() });
});

// >>> PUBLISH TO SITE <<<
app.post('/api/admin/publish', requireAuth, (req, res) => {
  const pub = publishDraft();
  res.json({ ok: true, lastPublished: pub.lastPublished, pendingChanges: false });
});

// Discard draft changes (revert to live)
app.post('/api/admin/discard', requireAuth, (req, res) => {
  discardDraft();
  res.json({ ok: true, content: getDraft().content, pendingChanges: false });
});

/* ---------- Media ---------- */
const uploadLog = [];
function logUpload(entry) {
  const e = Object.assign({ at: new Date().toISOString() }, entry);
  uploadLog.push(e);
  while (uploadLog.length > 40) uploadLog.shift();
  console.log('[upload]', JSON.stringify(e));
}

app.post('/api/admin/upload', requireAuth, (req, res) => {
  const started = Date.now();
  logUpload({ event: 'start', contentType: req.headers['content-type'] || '', contentLength: req.headers['content-length'] || '' });
  req.on('aborted', () => logUpload({ event: 'client-aborted' }));
  upload.single('file')(req, res, (err) => {
    if (err) {
      const msg = err.code === 'LIMIT_FILE_SIZE'
        ? 'That file is too large (max ' + MAX_UPLOAD_MB + ' MB). Please compress the video and try again.'
        : err.message;
      logUpload({ event: 'error', code: err.code || null, message: err.message });
      // Drain any remaining body so the browser receives this JSON error
      // instead of a dropped connection ("network error").
      try { req.unpipe(); req.resume(); } catch (e) {}
      return res.status(400).json({ error: msg });
    }
    if (!req.file) { logUpload({ event: 'no-file' }); return res.status(400).json({ error: 'No file received' }); }
    logUpload({ event: 'success', name: req.file.originalname, type: req.file.mimetype, size: req.file.size, ms: Date.now() - started });
    res.json({
      ok: true,
      url: '/uploads/' + req.file.filename,
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    });
  });
});

// Diagnostics: open this URL while logged in to see recent upload attempts.
app.get('/api/admin/uploadlog', requireAuth, (req, res) => {
  let free = null;
  try { const st = fs.statfsSync ? fs.statfsSync(UPLOAD_DIR) : null; if (st) free = Math.round((st.bavail * st.bsize) / 1048576) + ' MB free'; } catch (e) {}
  res.json({ uploadDir: UPLOAD_DIR, diskFree: free, maxUploadMB: MAX_UPLOAD_MB, recent: uploadLog.slice(-25) });
});

app.get('/api/admin/media', requireAuth, (req, res) => {
  const files = fs
    .readdirSync(UPLOAD_DIR)
    .filter((f) => !f.startsWith('.'))
    .map((f) => {
      const stat = fs.statSync(path.join(UPLOAD_DIR, f));
      const ext = path.extname(f).toLowerCase();
      const isVideo = ['.mp4', '.webm', '.mov', '.ogg', '.m4v'].includes(ext);
      return { name: f, url: '/uploads/' + f, size: stat.size, mtime: stat.mtimeMs, kind: isVideo ? 'video' : 'image' };
    })
    .sort((a, b) => b.mtime - a.mtime);
  res.json(files);
});

app.delete('/api/admin/media/:name', requireAuth, (req, res) => {
  const name = path.basename(req.params.name); // prevent traversal
  const target = path.join(UPLOAD_DIR, name);
  if (fs.existsSync(target)) fs.unlinkSync(target);
  res.json({ ok: true });
});

/* ---------- Change password ---------- */
app.post('/api/admin/password', requireAuth, (req, res) => {
  const auth = loadAuth();
  const { currentPassword, newPassword } = req.body;
  if (!bcrypt.compareSync(currentPassword || '', auth.passwordHash)) {
    return res.status(400).json({ error: 'Current password is incorrect.' });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }
  auth.passwordHash = bcrypt.hashSync(newPassword, 10);
  auth.isDefault = false;
  saveAuth(auth);
  res.json({ ok: true });
});

/* ---------- Catch-all error handler (return JSON, never reset) ---------- */
app.use((err, req, res, next) => {
  console.error('[error]', req.method, req.path, '-', (err && err.message) || err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: (err && err.message) || 'Server error' });
});

/* ---------- Start ---------- */
loadAuth(); // ensure credentials exist on boot
const server = app.listen(PORT, () => {
  console.log('  Bridgeway Developers running:');
  console.log('   • Website : http://localhost:%d/', PORT);
  console.log('   • Admin   : http://localhost:%d/admin', PORT);
  console.log('   • STATE_DIR=%s  (draft exists: %s, published exists: %s)',
    STATE_DIR, fs.existsSync(DRAFT_FILE), fs.existsSync(PUBLISHED_FILE));
});
// Allow long-running uploads (large videos on slow connections) without the
// server killing the request mid-transfer.
server.requestTimeout = 0;        // no overall request timeout
server.headersTimeout = 120000;   // 2 min to receive headers
server.keepAliveTimeout = 75000;
