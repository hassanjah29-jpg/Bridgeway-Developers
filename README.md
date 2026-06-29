# Bridgeway Developers — Website + Admin CMS

A modern, premium, fully responsive marketing website for **Bridgeway Developers**, a
Lahore-based real estate development and construction company — now with a **password-protected
backend** that lets you edit every part of the site, add projects with photos & videos, and
**publish changes live** with one button.

---

## ✨ What the backend gives you

- 🔒 **Password-protected admin panel** at `/admin`
- 🗂️ **Every section is separated** into its own tab — Hero, About & Stats, Projects, Services,
  Why Us, Process, Testimonials, Contact, Footer, Site & SEO, Media Library, Settings
- 🏗️ **Add / edit / delete / reorder projects**, each with a cover image, an optional cover video,
  and a **photo + video gallery**
- 🖼️ **Upload images and videos** (drag into the file picker) — stored on the server, reusable
  from the Media Library
- ✏️ **Edit all text** — headings, paragraphs, stats, contact details, SEO meta, footer, etc.
- 📝 **Draft → Publish workflow:** your edits are saved as a private **draft**. The public site
  only changes when you press the big green **“Publish to Site”** button.
- 👁️ **Preview Draft** before publishing, and **Discard Changes** to revert to what's live
- 🔑 **Change password** from the Settings tab

---

## 🚀 Run it

```bash
npm install
npm start
```

Then open:

- **Website:** <http://localhost:3000/>
- **Admin panel:** <http://localhost:3000/admin>

### First login

On first run the server prints a default admin login in the console:

```
username: admin
password: bridgeway123
```

> ⚠️ **Log in and change the password immediately** from the **Settings** tab.
> You can also set your own from the start with environment variables (below).

---

## 🔐 The Publish workflow (most important part)

1. Edit anything in the admin — it **auto-saves to a draft** (you'll see *Saving… → Saved*).
2. The public website **does not change yet**. Use **Preview Draft** (top-right) to see your
   draft in a new tab.
3. When you're happy, click **🟢 Publish to Site**. Your draft is promoted to live instantly.
4. Made a mistake before publishing? Click **Discard Changes** to revert the draft to the
   currently-live content.

The button shows an **“● Unpublished changes”** indicator and pulses whenever you have edits
that haven't gone live yet.

---

## ⚙️ Configuration (environment variables)

| Variable          | Default                  | Purpose                                  |
| ----------------- | ------------------------ | ---------------------------------------- |
| `PORT`            | `3000`                   | Port to listen on                        |
| `ADMIN_USERNAME`  | `admin`                  | Admin login username (first run only)    |
| `ADMIN_PASSWORD`  | `bridgeway123`           | Admin login password (first run only)    |
| `SESSION_SECRET`  | random                   | Set a fixed value in production          |

Example:

```bash
ADMIN_USERNAME=bridgeway ADMIN_PASSWORD='a-strong-password' SESSION_SECRET='long-random-string' npm start
```

---

## 📁 Project structure

```
server.js              — Express backend (site rendering, admin API, auth, uploads, publish)
package.json           — dependencies (express, ejs, multer, express-session, bcryptjs)
views/
  index.ejs            — the public website template (your original design, now editable)
  admin/login.ejs      — admin login page
  admin/dashboard.ejs  — admin dashboard shell (sidebar + Publish button)
public/admin/
  admin.css            — admin panel styling
  admin.js             — admin panel logic (section editors, uploads, publish/discard)
data/
  seed.json            — starting content (committed)
  published.json       — live site content     (generated at runtime, git-ignored)
  draft.json           — your working draft     (generated at runtime, git-ignored)
  auth.json            — hashed admin password  (generated at runtime, git-ignored)
uploads/               — uploaded images & videos (git-ignored)
styles.css, script.js, logo.png, favicon.svg, hero-video.mp4  — original front-end assets
```

> **Note:** `data/draft.json`, `data/published.json`, `data/auth.json` and everything in
> `uploads/` are **runtime state** — they're git-ignored and created automatically from
> `data/seed.json` on first launch. On a host, keep the `data/` and `uploads/` folders on a
> **persistent disk** so your content and media survive restarts/redeploys.

---

## ☁️ Deploying

This is now a **Node.js app** (it needs a server to handle logins and uploads), so deploy it to a
Node host rather than a static-only host:

- **Render / Railway / Fly.io / a VPS** — set the start command to `npm start`, add the
  environment variables above, and attach a persistent disk mounted so `data/` and `uploads/`
  are not wiped on redeploy.
- Put it behind HTTPS (most hosts do this automatically) so admin logins are encrypted.

---

## 🎨 API reference (for developers)

| Method & path                       | Auth | Purpose                                  |
| ----------------------------------- | ---- | ---------------------------------------- |
| `GET /`                             | —    | Public site (published content)          |
| `GET /?preview=1`                   | ✅   | Public site rendered from the draft      |
| `GET /api/content`                  | —    | Published content as JSON                |
| `POST /admin/login` / `/admin/logout` | —  | Session login / logout                   |
| `GET /api/admin/state`              | ✅   | Draft content + publish status           |
| `PUT /api/admin/section/:key`       | ✅   | Save one section to the draft            |
| `POST /api/admin/publish`           | ✅   | **Publish draft → live**                 |
| `POST /api/admin/discard`           | ✅   | Revert draft to the live content         |
| `POST /api/admin/upload`            | ✅   | Upload an image/video                     |
| `GET /api/admin/media`              | ✅   | List uploaded media                      |
| `DELETE /api/admin/media/:name`     | ✅   | Delete an uploaded file                  |
| `POST /api/admin/password`          | ✅   | Change the admin password                |
