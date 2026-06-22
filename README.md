# Bridgeway Developers — Website

A modern, premium, fully responsive marketing website for **Bridgeway Developers**, a
Lahore-based real estate development and construction company.

**Built as a plain static site — pure HTML, CSS and JavaScript. No build step, no
dependencies. Deploys instantly anywhere.**

## 📁 Files

```
index.html    — all page content & sections
styles.css    — the full premium theme (navy / charcoal / gold)
script.js     — mobile menu, scroll reveal, stat counters, project filters, contact form
favicon.svg   — site icon
```

## 🚀 View it

Just open `index.html` in any browser — that's it. Nothing to install or build.

(To preview with a local server instead: `python3 -m http.server` then open
<http://localhost:8000>.)

## ☁️ Deploy (instant — no build needed)

Because this is a static site, any host serves it as-is. **Leave the build command empty.**

**Cloudflare Pages**
- Connect the GitHub repo → on the build screen:
  - Framework preset: **None**
  - Build command: **(leave blank)**
  - Build output directory: **`/`** (the repo root)
- Save and Deploy → live in seconds.

**Or drag-and-drop:** Netlify Drop (<https://app.netlify.com/drop>) or Cloudflare Pages
"Upload assets" — just drop the folder containing these files.

**Or GitHub Pages:** repo Settings → Pages → deploy from branch → root.

## ✨ Features

- Sticky navbar with scroll transition + animated mobile menu
- Hero with gradient background and entrance reveal
- About, Services (6 cards), filterable Featured Projects, Why Choose Us, 5-step Process
- Animated stat counters, testimonials
- Contact form with validation + success message (front-end only)
- Embedded map, footer, back-to-top button, smooth scrolling, scroll-reveal animations
- Fully responsive (desktop / tablet / mobile)

## 🎨 Customise

- **Text / projects / contact details:** edit `index.html` directly.
- **Colours / theme:** the CSS variables at the top of `styles.css` (`:root { … }`).
- **Images:** swap the Unsplash URLs in `index.html` for your own photos.

> The contact form has **no backend** — it validates and shows a success message. Connect
> the `submit` handler in `script.js` to your email service or form endpoint when ready.
> Phone, email, and address are placeholders.
