# Bridgeway Developers — Website

A modern, premium, fully responsive marketing website for **Bridgeway Developers**, a
Lahore-based real estate development and construction company. Built with **React**,
**Vite**, and **Tailwind CSS**.

## ✨ Features

- **Premium corporate design** — deep navy & charcoal palette with gold/bronze accents
- **Sticky navigation** with a transparent-to-solid scroll transition and animated mobile menu
- **Hero** with layered background image, gradient fallback, and staggered entrance animations
- **About** section with floating experience badge and trust pillars
- **Services** — 6 service cards (development, apartments, residential, commercial, planning, management)
- **Featured Projects** with category filters (All / Residential / Commercial / Apartments)
- **Why Choose Us**, **Process** (5 steps), and an animated **Stats** counter section
- **Testimonials** from clients and investors
- **Contact** section with a validated form (client-side success state), contact details, and an embedded map
- **Footer** with quick links, services, contact info, and social placeholders
- Smooth scrolling, scroll-reveal animations, hover effects, back-to-top button
- Fully responsive (desktop / tablet / mobile) and accessibility-minded

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

## 🎨 Customisation

Most content lives in **`src/data/siteData.js`** — company details, navigation, services,
projects, testimonials, stats, and process steps. Edit there to update copy without touching
components.

- **Colours / theme:** `tailwind.config.js`
- **Global styles & component classes:** `src/index.css`
- **Project & section images:** Unsplash URLs in `src/data/siteData.js` and individual
  components (each has a gradient fallback if images don't load).

## 📁 Project Structure

```
src/
├── components/      # Navbar, Hero, About, Services, Projects, etc.
├── data/            # siteData.js — all editable content
├── hooks/           # useReveal.js — scroll-reveal animations
├── App.jsx
├── main.jsx
└── index.css
```

## 📝 Notes

- The contact form has **no backend** — it validates input and shows a success message. Wire
  `handleSubmit` in `src/components/Contact.jsx` to your email service or API when ready.
- All phone, email, and address values are placeholders in `src/data/siteData.js`.
