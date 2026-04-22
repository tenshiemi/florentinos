# Florentino's Fine Flowers — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dark, luxury static website for Florentino's Fine Flowers with smooth scrolling, a Sanity CMS for content editing, and Netlify Forms-powered inquiry and subscription forms.

**Architecture:** Fully static Astro site deployed to Netlify. Sanity hosts the CMS Studio separately at `<project>.sanity.studio` — Florentino edits content there, a Netlify webhook rebuilds and redeploys on save. No server-side rendering, no payment processing on site.

**Tech Stack:** Astro 4, Lenis, GSAP ScrollTrigger, @sanity/client, Netlify Forms, Playwright, TypeScript

---

## File Map

```
florentinos/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── netlify.toml
├── playwright.config.ts
├── .env.example
├── .gitignore
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Nav.astro           # Transparent→solid nav, hamburger mobile
│   │   ├── Footer.astro        # Footer with links + social
│   │   └── GalleryGrid.astro   # Reusable photo grid (Gallery + Home preview)
│   ├── layouts/
│   │   └── Layout.astro        # HTML shell, fonts, meta, Nav, Footer
│   ├── pages/
│   │   ├── index.astro         # Home — 6 scroll sections
│   │   ├── gallery.astro       # Full portfolio
│   │   ├── order.astro         # Order inquiry form
│   │   ├── subscribe.astro     # Subscription inquiry form
│   │   ├── about.astro         # About Florentino
│   │   └── visit.astro         # Hours, map, gift shop
│   ├── styles/
│   │   ├── tokens.css          # CSS custom properties (colors, fonts, form vars)
│   │   └── global.css          # Reset, base styles, shared components
│   └── lib/
│       ├── sanity.ts           # Sanity client + typed query helpers
│       └── scroll.ts           # Lenis init + GSAP ScrollTrigger animations
├── sanity/
│   ├── sanity.config.ts        # Sanity Studio config
│   └── schemaTypes/
│       ├── index.ts            # Schema registry
│       ├── galleryImage.ts
│       ├── homepageFeatured.ts
│       ├── about.ts
│       ├── visitInfo.ts
│       └── siteSettings.ts
└── e2e/
    ├── order-form.spec.ts      # Playwright: form fields, conditional address, submit
    └── subscribe-form.spec.ts  # Playwright: form fields, conditional address, submit
```

---

## Task 1: Project Initialization

**Files:**
- Create: `astro.config.mjs`
- Create: `netlify.toml`
- Create: `.env.example`
- Create: `.gitignore`

- [ ] **Step 1: Scaffold Astro project**

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-git
```

Answer prompts: TypeScript → strict, install dependencies → yes.

- [ ] **Step 2: Install dependencies**

```bash
npm install lenis gsap @sanity/client @sanity/image-url
npm install -D @playwright/test @astrojs/check
npx playwright install chromium
```

- [ ] **Step 3: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://florentinosseattle.com',
});
```

- [ ] **Step 4: Write `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-lighthouse"
```

- [ ] **Step 5: Write `.env.example`**

```
PUBLIC_SANITY_PROJECT_ID=your_project_id_here
PUBLIC_SANITY_DATASET=production
```

- [ ] **Step 6: Write `.gitignore`**

```
node_modules/
dist/
.env
.env.local
.astro/
.netlify/
.superpowers/
```

- [ ] **Step 7: Verify build passes**

```bash
npm run build
```

Expected: `dist/` created, no errors.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: initialize Astro project with Netlify config"
```

---

## Task 2: Design Tokens and Global Styles

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`

- [ ] **Step 1: Write `src/styles/tokens.css`**

```css
:root {
  /* Brand colors */
  --color-gold: #FFE184;
  --color-navy: #212745;
  --color-blue: #113366;
  --color-bg: #0a0a14;

  /* Form accessibility (WCAG AA) */
  --color-placeholder: #8888aa;
  --color-hint: #9999bb;
  --color-border: #4a4a6e;
  --color-input-bg: #1e2240;
  --color-disclaimer: #9999bb;

  /* Typography */
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Raleway', system-ui, sans-serif;

  /* Form type sizes */
  --text-label: 12px;
  --text-input: 14px;
  --text-disclaimer: 13px;

  /* Layout */
  --space-section: clamp(4rem, 10vw, 8rem);
  --space-content: clamp(1.5rem, 5vw, 4rem);
  --max-width: 1200px;

  /* Transitions */
  --transition-base: 0.3s ease;
  --transition-slow: 0.6s ease;
}
```

- [ ] **Step 2: Write `src/styles/global.css`**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { color-scheme: dark; }
html.lenis { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }

body {
  background: var(--color-bg);
  color: #e8e8f0;
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  overflow-x: hidden;
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--color-gold);
  line-height: 1.2;
}

a { color: var(--color-gold); text-decoration: none; transition: opacity var(--transition-base); }
a:hover { opacity: 0.8; }
img { max-width: 100%; height: auto; display: block; }

/* Sections */
.section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--space-section) var(--space-content);
}
.section--navy { background: var(--color-navy); }
.section--blue { background: var(--color-blue); }
.section-inner { max-width: var(--max-width); margin: 0 auto; width: 100%; }

/* Buttons */
.btn-primary {
  background: var(--color-gold);
  color: var(--color-navy);
  border: none;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 14px 28px;
  cursor: pointer;
  display: inline-block;
  transition: opacity var(--transition-base);
}
.btn-primary:hover { opacity: 0.9; }

.btn-outline {
  background: transparent;
  color: var(--color-gold);
  border: 1px solid var(--color-gold);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 12px 24px;
  cursor: pointer;
  display: inline-block;
  transition: all var(--transition-base);
}
.btn-outline:hover { background: var(--color-gold); color: var(--color-navy); }

/* Forms */
.form-field { display: flex; flex-direction: column; gap: 6px; }
.form-label {
  font-size: var(--text-label);
  color: var(--color-gold);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.form-input, .form-select, .form-textarea {
  background: var(--color-input-bg);
  border: 1.5px solid var(--color-border);
  border-radius: 4px;
  color: #e8e8f0;
  font-family: var(--font-body);
  font-size: var(--text-input);
  padding: 10px 14px;
  transition: border-color var(--transition-base);
  width: 100%;
}
.form-input::placeholder, .form-textarea::placeholder { color: var(--color-placeholder); }
.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
  border-color: var(--color-gold);
}
.form-hint { color: var(--color-hint); font-size: 12px; }
.form-disclaimer { color: var(--color-disclaimer); font-size: var(--text-disclaimer); line-height: 1.7; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }

/* Pill toggle (frequency buttons) */
.pill-group { display: flex; gap: 8px; flex-wrap: wrap; }
.pill-group input[type="radio"] { position: absolute; opacity: 0; width: 0; height: 0; }
.pill-group label {
  border: 1px solid var(--color-border);
  color: var(--color-hint);
  font-size: 12px;
  padding: 6px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all var(--transition-base);
  user-select: none;
}
.pill-group input[type="radio"]:checked + label {
  border-color: var(--color-gold);
  color: var(--color-gold);
  background: rgba(255, 225, 132, 0.08);
}
.pill-group input[type="radio"]:focus-visible + label {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}

/* Utilities */
.visually-hidden {
  position: absolute; width: 1px; height: 1px; padding: 0;
  margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
[hidden] { display: none !important; }
```

- [ ] **Step 3: Verify no syntax errors**

```bash
npx stylelint "src/styles/*.css" --config '{"rules":{"block-no-empty":true}}' 2>/dev/null || echo "stylelint not installed — visually verify files look correct"
```

- [ ] **Step 4: Commit**

```bash
git add src/styles/
git commit -m "feat: add design tokens and global styles"
```

---

## Task 3: Base Layout, Nav, and Footer

**Files:**
- Create: `src/layouts/Layout.astro`
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Write `src/layouts/Layout.astro`**

```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import '../styles/tokens.css';
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
}

const {
  title = "Florentino's Fine Flowers",
  description = "Custom floral arrangements and flower subscriptions in Madison Valley, Seattle.",
} = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Raleway:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
    <Footer />
    <script>
      import { initScroll, initAnimations } from '../lib/scroll';
      initScroll();
      initAnimations();
    </script>
  </body>
</html>
```

- [ ] **Step 2: Write `src/components/Nav.astro`**

```astro
---
const links = [
  { href: '/gallery', label: 'Gallery' },
  { href: '/order', label: 'Order' },
  { href: '/subscribe', label: 'Subscribe' },
  { href: '/about', label: 'About' },
  { href: '/visit', label: 'Visit' },
];
---
<nav id="main-nav" class="nav">
  <a href="/" class="nav-logo" aria-label="Florentino's Fine Flowers — Home">
    Florentino's
  </a>
  <button
    class="nav-toggle"
    aria-label="Toggle navigation menu"
    aria-expanded="false"
    aria-controls="nav-links"
  >
    <span></span><span></span><span></span>
  </button>
  <ul id="nav-links" class="nav-links" role="list">
    {links.map(({ href, label }) => (
      <li><a href={href}>{label}</a></li>
    ))}
  </ul>
</nav>

<style>
  .nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem var(--space-content);
    transition: background var(--transition-slow), padding var(--transition-slow);
  }
  .nav--scrolled {
    background: var(--color-navy);
    padding-top: 0.875rem;
    padding-bottom: 0.875rem;
    box-shadow: 0 1px 0 rgba(255,225,132,0.1);
  }
  .nav-logo {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-gold);
    letter-spacing: 1px;
  }
  .nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
  }
  .nav-links a {
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #e8e8f0;
    transition: color var(--transition-base);
  }
  .nav-links a:hover { color: var(--color-gold); }
  .nav-toggle {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
  }
  .nav-toggle span {
    display: block;
    width: 22px;
    height: 1.5px;
    background: var(--color-gold);
    transition: transform var(--transition-base), opacity var(--transition-base);
  }
  @media (max-width: 768px) {
    .nav-toggle { display: flex; }
    .nav-links {
      position: fixed;
      top: 0; right: 0;
      height: 100vh;
      width: min(280px, 80vw);
      background: var(--color-navy);
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 2rem;
      gap: 2rem;
      transform: translateX(100%);
      transition: transform var(--transition-slow);
    }
    .nav-links--open { transform: translateX(0); }
    .nav-links a { font-size: 14px; }
  }
</style>

<script>
  const nav = document.getElementById('main-nav')!;
  const toggle = document.querySelector('.nav-toggle') as HTMLButtonElement;
  const links = document.getElementById('nav-links')!;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 80);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    links.classList.toggle('nav-links--open');
  });
</script>
```

- [ ] **Step 3: Write `src/components/Footer.astro`**

```astro
---
const year = new Date().getFullYear();
---
<footer class="footer">
  <div class="footer-inner">
    <p class="footer-brand">Florentino's Fine Flowers</p>
    <p class="footer-sub">Madison Valley · Seattle</p>
    <nav class="footer-links" aria-label="Footer navigation">
      <a href="/gallery">Gallery</a>
      <a href="/order">Order</a>
      <a href="/subscribe">Subscribe</a>
      <a href="/about">About</a>
      <a href="/visit">Visit</a>
    </nav>
    <p class="footer-copy">&copy; {year} Florentino's Fine Flowers. All rights reserved.</p>
  </div>
</footer>

<style>
  .footer {
    background: var(--color-navy);
    border-top: 1px solid rgba(255,225,132,0.15);
    padding: 3rem var(--space-content);
    text-align: center;
  }
  .footer-inner { max-width: var(--max-width); margin: 0 auto; }
  .footer-brand {
    font-family: var(--font-display);
    font-size: 1.25rem;
    color: var(--color-gold);
    margin-bottom: 0.25rem;
  }
  .footer-sub { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #888; margin-bottom: 1.5rem; }
  .footer-links { display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; margin-bottom: 2rem; }
  .footer-links a { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #aaa; }
  .footer-links a:hover { color: var(--color-gold); }
  .footer-copy { font-size: 11px; color: #555; }
</style>
```

- [ ] **Step 4: Add a minimal `src/pages/index.astro` to verify layout renders**

```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout>
  <section class="section" style="background: var(--color-bg);">
    <div class="section-inner">
      <h1>Florentino's Fine Flowers</h1>
    </div>
  </section>
</Layout>
```

- [ ] **Step 5: Run dev server and visually verify nav, footer, fonts**

```bash
npm run dev
```

Open http://localhost:4321. Check: Cormorant Garamond loads for h1, nav is fixed and transparent, footer appears. Scroll 100px — nav should gain `nav--scrolled` navy background.

- [ ] **Step 6: Commit**

```bash
git add src/
git commit -m "feat: add Layout, Nav, and Footer components"
```

---

## Task 4: Smooth Scroll (Lenis + GSAP)

**Files:**
- Create: `src/lib/scroll.ts`

- [ ] **Step 1: Write `src/lib/scroll.ts`**

```ts
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initScroll(): Lenis {
  const lenis = new Lenis();

  gsap.registerPlugin(ScrollTrigger);

  lenis.on('scroll', () => ScrollTrigger.update());

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function initAnimations(): void {
  // Fade up: any element with data-animate="fade-up"
  gsap.utils.toArray<HTMLElement>('[data-animate="fade-up"]').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      opacity: 0,
      y: 32,
      duration: 0.8,
      ease: 'power2.out',
    });
  });

  // Stagger children: parent with data-animate="stagger"
  gsap.utils.toArray<HTMLElement>('[data-animate="stagger"]').forEach((parent) => {
    gsap.from(parent.children, {
      scrollTrigger: {
        trigger: parent,
        start: 'top 80%',
        once: true,
      },
      opacity: 0,
      y: 24,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
    });
  });
}
```

- [ ] **Step 2: Add `data-animate` to the placeholder h1 in index.astro and verify**

```astro
<h1 data-animate="fade-up">Florentino's Fine Flowers</h1>
```

Run `npm run dev`. Reload the page — the h1 should fade in upward on load (ScrollTrigger fires immediately when element is in viewport).

- [ ] **Step 3: Verify TypeScript passes**

```bash
npx astro check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/scroll.ts src/pages/index.astro
git commit -m "feat: add Lenis smooth scroll and GSAP ScrollTrigger animations"
```

---

## Task 5: Sanity CMS Setup

**Files:**
- Create: `sanity/sanity.config.ts`
- Create: `sanity/schemaTypes/index.ts`
- Create: `sanity/schemaTypes/galleryImage.ts`
- Create: `sanity/schemaTypes/homepageFeatured.ts`
- Create: `sanity/schemaTypes/about.ts`
- Create: `sanity/schemaTypes/visitInfo.ts`
- Create: `sanity/schemaTypes/siteSettings.ts`
- Create: `src/lib/sanity.ts`

- [ ] **Step 1: Create a Sanity project**

Go to https://sanity.io, create a free account, create a new project named "Florentinos Fine Flowers", dataset: `production`. Note the Project ID — add it to `.env`:

```
PUBLIC_SANITY_PROJECT_ID=<your_project_id>
PUBLIC_SANITY_DATASET=production
```

- [ ] **Step 2: Initialize Sanity Studio in the `sanity/` directory**

```bash
mkdir sanity && cd sanity
npm init -y
npm install sanity @sanity/vision
```

- [ ] **Step 3: Write `sanity/schemaTypes/galleryImage.ts`**

```ts
import { defineType, defineField } from 'sanity';

export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'caption', media: 'image' },
    prepare: ({ title, media }) => ({ title: title ?? 'Untitled', media }),
  },
});
```

- [ ] **Step 4: Write `sanity/schemaTypes/homepageFeatured.ts`**

```ts
import { defineType, defineField } from 'sanity';

export const homepageFeatured = defineType({
  name: 'homepageFeatured',
  title: 'Homepage Featured',
  type: 'document',
  fields: [
    defineField({
      name: 'images',
      title: 'Featured Images (max 4)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'galleryImage' }] }],
      validation: (Rule) => Rule.max(4),
    }),
  ],
});
```

- [ ] **Step 5: Write `sanity/schemaTypes/about.ts`**

```ts
import { defineType, defineField } from 'sanity';

export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'photo',
      title: 'Photo of Florentino',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
});
```

- [ ] **Step 6: Write `sanity/schemaTypes/visitInfo.ts`**

```ts
import { defineType, defineField } from 'sanity';

export const visitInfo = defineType({
  name: 'visitInfo',
  title: 'Visit Info',
  type: 'document',
  fields: [
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'Google Maps Embed URL',
      type: 'url',
    }),
    defineField({
      name: 'hours',
      title: 'Hours',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'day', type: 'string', title: 'Day' },
          { name: 'hours', type: 'string', title: 'Hours (e.g. 10 AM – 3 PM or Closed)' },
        ],
        preview: {
          select: { title: 'day', subtitle: 'hours' },
        },
      }],
    }),
  ],
});
```

- [ ] **Step 7: Write `sanity/schemaTypes/siteSettings.ts`**

```ts
import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'businessName', type: 'string', title: 'Business Name' }),
    defineField({ name: 'phone', type: 'string', title: 'Phone Number' }),
    defineField({ name: 'email', type: 'string', title: 'Email Address' }),
    defineField({ name: 'address', type: 'string', title: 'Street Address' }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'instagram', type: 'url', title: 'Instagram URL' },
        { name: 'facebook', type: 'url', title: 'Facebook URL' },
      ],
    }),
  ],
});
```

- [ ] **Step 8: Write `sanity/schemaTypes/index.ts`**

```ts
import { galleryImage } from './galleryImage';
import { homepageFeatured } from './homepageFeatured';
import { about } from './about';
import { visitInfo } from './visitInfo';
import { siteSettings } from './siteSettings';

export const schemaTypes = [
  galleryImage,
  homepageFeatured,
  about,
  visitInfo,
  siteSettings,
];
```

- [ ] **Step 9: Write `sanity/sanity.config.ts`**

```ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'florentinos',
  title: "Florentino's Fine Flowers",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
```

- [ ] **Step 10: Write `src/lib/sanity.ts`**

```ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  useCdn: true,
  apiVersion: '2026-04-21',
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export interface GalleryImage {
  _id: string;
  image: SanityImageSource;
  caption?: string;
  displayOrder: number;
}

export interface AboutContent {
  photo: SanityImageSource;
  bio: unknown[];
}

export interface VisitContent {
  address: string;
  googleMapsUrl?: string;
  hours: Array<{ day: string; hours: string }>;
}

export interface SiteSettings {
  businessName: string;
  phone?: string;
  email?: string;
  address?: string;
  socialLinks?: { instagram?: string; facebook?: string };
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  return sanityClient.fetch(
    `*[_type == "galleryImage"] | order(displayOrder asc) { _id, image, caption, displayOrder }`
  );
}

export async function getFeaturedImages(): Promise<GalleryImage[]> {
  return sanityClient.fetch(
    `*[_type == "homepageFeatured"][0].images[]-> { _id, image, caption, displayOrder }`
  );
}

export async function getAbout(): Promise<AboutContent | null> {
  return sanityClient.fetch(`*[_type == "about"][0] { photo, bio }`);
}

export async function getVisitInfo(): Promise<VisitContent | null> {
  return sanityClient.fetch(`*[_type == "visitInfo"][0] { address, googleMapsUrl, hours }`);
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityClient.fetch(
    `*[_type == "siteSettings"][0] { businessName, phone, email, address, socialLinks }`
  );
}
```

- [ ] **Step 11: Verify TypeScript**

```bash
npx astro check
```

Expected: no errors.

- [ ] **Step 12: Deploy Sanity Studio**

```bash
cd sanity
npx sanity deploy
```

Note the Studio URL (e.g. `florentinos.sanity.studio`). Open it, upload at least one Gallery Image to use while building pages.

- [ ] **Step 13: Commit**

```bash
cd ..
git add sanity/ src/lib/sanity.ts .env.example
git commit -m "feat: add Sanity schemas and client"
```

---

## Task 6: Home Page

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write the full `src/pages/index.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import { getFeaturedImages, urlFor } from '../lib/sanity';

const featured = await getFeaturedImages().catch(() => []);
---
<Layout>
  <!-- Section 1: Hero -->
  <section class="hero">
    <div class="hero-bg"></div>
    <div class="hero-content" data-animate="fade-up">
      <p class="hero-eyebrow">Madison Valley · Seattle</p>
      <h1 class="hero-title">Florentino's<br />Fine Flowers</h1>
      <p class="hero-tagline">A place where life and style coalesce,<br />and simple moments become fond memories.</p>
      <a href="/order" class="btn-primary">Order an Arrangement</a>
    </div>
    <div class="hero-scroll-hint" aria-hidden="true">↓</div>
  </section>

  <!-- Section 2: Gallery Preview -->
  <section class="section section--navy">
    <div class="section-inner">
      <h2 data-animate="fade-up">Our Work</h2>
      <div data-animate="stagger" class="featured-grid">
        {featured.slice(0, 4).map((img) => (
          <div class="featured-item">
            <img
              src={urlFor(img.image).width(600).height(750).fit('crop').auto('format').url()}
              alt={img.caption ?? 'Florentino arrangement'}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <div style="text-align:center;margin-top:2.5rem;" data-animate="fade-up">
        <a href="/gallery" class="btn-outline">View Full Gallery</a>
      </div>
    </div>
  </section>

  <!-- Section 3: Order Teaser -->
  <section class="section">
    <div class="section-inner teaser-layout" data-animate="fade-up">
      <div>
        <h2>Every arrangement,<br />made for you.</h2>
        <p class="teaser-body">
          Tell us the feeling, the occasion, the budget — we take it from there.
          No catalogs, no compromises. Just flowers, thoughtfully designed.
        </p>
        <a href="/order" class="btn-primary">Start Your Order</a>
      </div>
    </div>
  </section>

  <!-- Section 4: Subscribe Teaser -->
  <section class="section section--blue">
    <div class="section-inner teaser-layout teaser-layout--right" data-animate="fade-up">
      <div>
        <h2>Fresh flowers,<br />on your schedule.</h2>
        <p class="teaser-body">
          Weekly, biweekly, or monthly — a fresh arrangement delivered or ready for pickup.
          Tell us your preferences, we'll handle the rest.
        </p>
        <a href="/subscribe" class="btn-primary">See Subscription Options</a>
      </div>
    </div>
  </section>

  <!-- Section 5: About Teaser -->
  <section class="section">
    <div class="section-inner teaser-layout" data-animate="fade-up">
      <div>
        <p class="section-eyebrow">About</p>
        <h2>Rooted in Madison Valley.</h2>
        <p class="teaser-body">
          Florentino's has been part of the neighborhood for years — a neighborhood shop
          with a passion for flowers, a gallery of unique gifts, and a commitment to craft.
        </p>
        <a href="/about" class="btn-outline">Our Story</a>
      </div>
    </div>
  </section>

  <!-- Section 6: Visit -->
  <section class="section section--navy">
    <div class="section-inner teaser-layout teaser-layout--right" data-animate="fade-up">
      <div>
        <p class="section-eyebrow">Visit the Shop</p>
        <h2>Come see what<br />else we have.</h2>
        <p class="teaser-body">
          The flowers are just the beginning. Stop by and discover the gift shop —
          candles, home goods, and one-of-a-kind finds. Madison Valley, Seattle.
        </p>
        <div class="visit-hours">
          <p>Mon–Wed &amp; Fri 10 AM – 3 PM &nbsp;|&nbsp; Thu–Sat 10 AM – 4 PM &nbsp;|&nbsp; Sun Closed</p>
        </div>
        <a href="/visit" class="btn-outline">Hours &amp; Directions</a>
      </div>
    </div>
  </section>
</Layout>

<style>
  /* Hero */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .hero-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 60% 50%, var(--color-navy) 0%, var(--color-bg) 65%);
  }
  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 2rem var(--space-content);
    max-width: 700px;
  }
  .hero-eyebrow {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--color-gold);
    margin-bottom: 1.25rem;
    opacity: 0.8;
  }
  .hero-title {
    font-size: clamp(2.5rem, 7vw, 5rem);
    font-weight: 700;
    color: var(--color-gold);
    margin-bottom: 1.5rem;
    line-height: 1.1;
  }
  .hero-tagline {
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    color: #b0b0c8;
    margin-bottom: 2.5rem;
    line-height: 1.8;
  }
  .hero-scroll-hint {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    color: var(--color-gold);
    opacity: 0.4;
    font-size: 1.25rem;
    animation: bounce 2s infinite;
  }
  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(8px); }
  }

  /* Featured grid */
  .featured-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-top: 2rem;
  }
  @media (max-width: 768px) {
    .featured-grid { grid-template-columns: repeat(2, 1fr); }
  }
  .featured-item img {
    width: 100%;
    aspect-ratio: 3/4;
    object-fit: cover;
    filter: brightness(0.9);
    transition: filter var(--transition-slow);
  }
  .featured-item:hover img { filter: brightness(1.05); }

  /* Teasers */
  .teaser-layout {
    max-width: 600px;
  }
  .teaser-layout--right {
    margin-left: auto;
    text-align: right;
  }
  .section-eyebrow {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--color-gold);
    opacity: 0.7;
    margin-bottom: 1rem;
  }
  .teaser-body {
    color: #b0b0c8;
    line-height: 1.9;
    margin: 1.25rem 0 2rem;
    font-size: 1.05rem;
  }
  .visit-hours {
    font-size: 12px;
    color: #888;
    letter-spacing: 0.5px;
    margin-bottom: 1.5rem;
  }
</style>
```

- [ ] **Step 2: Run dev server and verify all 6 sections render**

```bash
npm run dev
```

Open http://localhost:4321. Scroll through all 6 sections. Verify: hero text visible, featured grid shows (or is empty if no Sanity content yet), teasers render, animations trigger on scroll.

- [ ] **Step 3: Add at least 4 photos to Sanity Studio, set as Homepage Featured, verify grid populates**

Open your Sanity Studio URL. Add Gallery Images, then create a Homepage Featured document selecting up to 4. Reload http://localhost:4321 — the grid should show your photos.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: build home page with 6 scroll sections"
```

---

## Task 7: Gallery Page

**Files:**
- Create: `src/components/GalleryGrid.astro`
- Create: `src/pages/gallery.astro`

- [ ] **Step 1: Write `src/components/GalleryGrid.astro`**

```astro
---
import { urlFor } from '../lib/sanity';
import type { GalleryImage } from '../lib/sanity';

interface Props {
  images: GalleryImage[];
}

const { images } = Astro.props;
---
<div class="gallery-grid" data-animate="stagger">
  {images.map((img) => (
    <figure class="gallery-item">
      <img
        src={urlFor(img.image).width(800).height(1000).fit('crop').auto('format').url()}
        alt={img.caption ?? 'Florentino arrangement'}
        loading="lazy"
      />
      {img.caption && <figcaption>{img.caption}</figcaption>}
    </figure>
  ))}
</div>

<style>
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  @media (max-width: 900px) { .gallery-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 500px) { .gallery-grid { grid-template-columns: 1fr; } }

  .gallery-item { position: relative; overflow: hidden; }
  .gallery-item img {
    width: 100%;
    aspect-ratio: 3/4;
    object-fit: cover;
    filter: brightness(0.88);
    transition: filter var(--transition-slow), transform var(--transition-slow);
  }
  .gallery-item:hover img {
    filter: brightness(1.0);
    transform: scale(1.02);
  }
  figcaption {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 1rem;
    background: linear-gradient(to top, rgba(10,10,20,0.85), transparent);
    color: #e8e8f0;
    font-size: 12px;
    letter-spacing: 1px;
    opacity: 0;
    transition: opacity var(--transition-base);
  }
  .gallery-item:hover figcaption { opacity: 1; }
</style>
```

- [ ] **Step 2: Write `src/pages/gallery.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import GalleryGrid from '../components/GalleryGrid.astro';
import { getGalleryImages } from '../lib/sanity';

const images = await getGalleryImages().catch(() => []);
---
<Layout title="Gallery — Florentino's Fine Flowers" description="Browse our portfolio of custom floral arrangements.">
  <div class="page-hero" data-animate="fade-up">
    <p class="page-eyebrow">Portfolio</p>
    <h1>Our Work</h1>
  </div>
  <section class="gallery-page">
    <div class="section-inner">
      {images.length > 0
        ? <GalleryGrid images={images} />
        : <p class="empty-state">Gallery coming soon.</p>
      }
    </div>
  </section>
</Layout>

<style>
  .page-hero {
    padding: calc(var(--space-section) + 80px) var(--space-content) var(--space-section);
    text-align: center;
    max-width: var(--max-width);
    margin: 0 auto;
  }
  .page-eyebrow {
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--color-gold);
    opacity: 0.7;
    margin-bottom: 0.75rem;
  }
  .page-hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); }
  .gallery-page { padding: 0 var(--space-content) var(--space-section); }
  .empty-state { color: #555; font-size: 14px; text-align: center; padding: 4rem 0; }
</style>
```

- [ ] **Step 3: Verify gallery page renders**

```bash
npm run dev
```

Open http://localhost:4321/gallery. Verify photos load in 3-column grid, hover shows figcaption if caption exists.

- [ ] **Step 4: Commit**

```bash
git add src/components/GalleryGrid.astro src/pages/gallery.astro
git commit -m "feat: add Gallery page and GalleryGrid component"
```

---

## Task 8: Order Form Page

**Files:**
- Create: `src/pages/order.astro`
- Create: `e2e/order-form.spec.ts`

- [ ] **Step 1: Write the Playwright test first — `e2e/order-form.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test.describe('Order inquiry form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/order');
  });

  test('renders all required fields', async ({ page }) => {
    await expect(page.locator('#date-needed')).toBeVisible();
    await expect(page.locator('input[name="fulfillment"][value="pickup"]')).toBeVisible();
    await expect(page.locator('input[name="fulfillment"][value="delivery"]')).toBeVisible();
    await expect(page.locator('#recipient-name')).toBeVisible();
    await expect(page.locator('#card-message')).toBeVisible();
    await expect(page.locator('#order-request')).toBeVisible();
    await expect(page.locator('#budget')).toBeVisible();
    await expect(page.locator('#purchaser-name')).toBeVisible();
    await expect(page.locator('#purchaser-email')).toBeVisible();
    await expect(page.locator('#purchaser-phone')).toBeVisible();
    await expect(page.locator('#today-date')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('delivery address field is hidden by default', async ({ page }) => {
    await expect(page.locator('#delivery-address-field')).toBeHidden();
  });

  test('delivery address field shows when delivery is selected', async ({ page }) => {
    await page.click('input[name="fulfillment"][value="delivery"]');
    await expect(page.locator('#delivery-address-field')).toBeVisible();
  });

  test('delivery address field hides when pickup is re-selected', async ({ page }) => {
    await page.click('input[name="fulfillment"][value="delivery"]');
    await page.click('input[name="fulfillment"][value="pickup"]');
    await expect(page.locator('#delivery-address-field')).toBeHidden();
  });

  test('budget dropdown has correct options', async ({ page }) => {
    const options = await page.locator('#budget option:not([disabled])').allTextContents();
    expect(options[0]).toBe('$75');
    expect(options[options.length - 1]).toBe('$400+');
    expect(options.length).toBe(15); // $75 to $400 in $25 increments (14) + $400+
  });

  test('disclaimer text is present', async ({ page }) => {
    await expect(page.locator('.form-disclaimer')).toContainText('not a confirmed order');
  });
});
```

- [ ] **Step 2: Run test — expect FAIL (page doesn't exist yet)**

```bash
npx playwright test e2e/order-form.spec.ts
```

Expected: all tests fail with "page not found" or similar.

- [ ] **Step 3: Write `src/pages/order.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';

const budgetOptions = [
  '$75','$100','$125','$150','$175','$200',
  '$225','$250','$275','$300','$325','$350','$375','$400','$400+',
];
---
<Layout
  title="Order — Florentino's Fine Flowers"
  description="Request a custom floral arrangement. Tell us the feeling — we'll handle the rest."
>
  <div class="page-hero" data-animate="fade-up">
    <p class="page-eyebrow">Custom Arrangements</p>
    <h1>Order Flowers</h1>
    <p class="page-intro">
      Tell us a little about what you're looking for.
      We'll reach out with ideas and a quote.
    </p>
  </div>

  <section class="form-page">
    <div class="form-wrap">
      <form
        name="order-inquiry"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        class="inquiry-form"
        id="order-form"
      >
        <input type="hidden" name="form-name" value="order-inquiry" />
        <p class="visually-hidden">
          <label>Don't fill this out: <input name="bot-field" /></label>
        </p>

        <!-- Date Needed -->
        <div class="form-field">
          <label class="form-label" for="date-needed">Date Needed</label>
          <input class="form-input" type="date" id="date-needed" name="date-needed" required />
        </div>

        <!-- Delivery or Pickup -->
        <fieldset class="form-field form-fieldset">
          <legend class="form-label">Delivery or Pickup?</legend>
          <div class="pill-group">
            <input type="radio" name="fulfillment" id="pickup" value="pickup" required />
            <label for="pickup">Pickup</label>
            <input type="radio" name="fulfillment" id="delivery" value="delivery" />
            <label for="delivery">Delivery</label>
          </div>
        </fieldset>

        <!-- Recipient -->
        <div class="form-field">
          <label class="form-label" for="recipient-name">Recipient Name</label>
          <input class="form-input" type="text" id="recipient-name" name="recipient-name" placeholder="Who is this for?" required />
        </div>

        <!-- Delivery address (conditional) -->
        <div class="form-field" id="delivery-address-field" hidden>
          <label class="form-label" for="delivery-address">Delivery Address</label>
          <input class="form-input" type="text" id="delivery-address" name="delivery-address" placeholder="Street address, Seattle" />
        </div>

        <!-- Card Message -->
        <div class="form-field">
          <label class="form-label" for="card-message">Card Message</label>
          <textarea class="form-textarea" id="card-message" name="card-message" rows="3" placeholder="What would you like the card to say? (optional)"></textarea>
        </div>

        <!-- Order Request -->
        <div class="form-field">
          <label class="form-label" for="order-request">Order Request</label>
          <p class="form-hint">Describe the vibe, colors, or feeling — we'll handle the rest.</p>
          <textarea class="form-textarea" id="order-request" name="order-request" rows="4" placeholder="e.g. warm and autumnal, mostly roses, for a dining table..." required></textarea>
        </div>

        <!-- Budget -->
        <div class="form-field">
          <label class="form-label" for="budget">Budget</label>
          <select class="form-select" id="budget" name="budget" required>
            <option value="" disabled selected>Select a budget</option>
            {budgetOptions.map((opt) => <option value={opt}>{opt}</option>)}
          </select>
        </div>

        <hr class="form-divider" />

        <!-- Purchaser info -->
        <div class="form-field">
          <label class="form-label" for="purchaser-name">Your Name</label>
          <input class="form-input" type="text" id="purchaser-name" name="purchaser-name" placeholder="Your full name" required />
        </div>
        <div class="form-row">
          <div class="form-field">
            <label class="form-label" for="purchaser-email">Email</label>
            <input class="form-input" type="email" id="purchaser-email" name="purchaser-email" placeholder="you@example.com" required />
          </div>
          <div class="form-field">
            <label class="form-label" for="purchaser-phone">Phone</label>
            <input class="form-input" type="tel" id="purchaser-phone" name="purchaser-phone" placeholder="(206) 555-0100" required />
          </div>
        </div>

        <!-- Today's date -->
        <div class="form-field">
          <label class="form-label" for="today-date">Today's Date</label>
          <input class="form-input" type="date" id="today-date" name="today-date" required />
        </div>

        <!-- Disclaimer -->
        <p class="form-disclaimer">
          By submitting this form you understand that this is an inquiry, not a confirmed order.
          Florentino's will follow up with a custom quote and invoice for your approval.
        </p>

        <button type="submit" class="btn-primary form-submit">Send Inquiry</button>
      </form>

      <!-- Success message (shown after Netlify redirect) -->
      <div id="form-success" class="form-success" hidden>
        <h2>Thank you!</h2>
        <p>We've received your inquiry and will be in touch within 24 hours.</p>
        <a href="/" class="btn-outline">Back to Home</a>
      </div>
    </div>
  </section>
</Layout>

<style>
  .page-hero {
    padding: calc(var(--space-section) + 80px) var(--space-content) 3rem;
    text-align: center;
    max-width: 700px;
    margin: 0 auto;
  }
  .page-eyebrow {
    font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
    color: var(--color-gold); opacity: 0.7; margin-bottom: 0.75rem;
  }
  .page-intro {
    color: #b0b0c8; font-style: italic; margin-top: 1rem;
    font-family: var(--font-display); font-size: 1.1rem;
  }
  .form-page { padding: 0 var(--space-content) var(--space-section); }
  .form-wrap { max-width: 640px; margin: 0 auto; }
  .inquiry-form { display: flex; flex-direction: column; gap: 20px; }
  .form-fieldset { border: none; padding: 0; }
  .form-divider { border: none; border-top: 1px solid rgba(255,225,132,0.1); margin: 0.5rem 0; }
  .form-submit { align-self: flex-start; margin-top: 0.5rem; }
  .form-success { text-align: center; padding: 4rem 0; }
  .form-success h2 { margin-bottom: 1rem; }
  .form-success p { color: #b0b0c8; margin-bottom: 2rem; }
</style>

<script>
  const deliveryRadio = document.getElementById('delivery') as HTMLInputElement;
  const pickupRadio = document.getElementById('pickup') as HTMLInputElement;
  const addressField = document.getElementById('delivery-address-field') as HTMLDivElement;
  const addressInput = document.getElementById('delivery-address') as HTMLInputElement;

  function toggleAddress(show: boolean) {
    addressField.hidden = !show;
    addressInput.required = show;
  }

  deliveryRadio.addEventListener('change', () => toggleAddress(true));
  pickupRadio.addEventListener('change', () => toggleAddress(false));

  // Pre-fill today's date
  const todayInput = document.getElementById('today-date') as HTMLInputElement;
  todayInput.value = new Date().toISOString().split('T')[0];
</script>
```

- [ ] **Step 4: Set up `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm run dev',
    port: 4321,
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://localhost:4321',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
npx playwright test e2e/order-form.spec.ts
```

Expected: all 5 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/pages/order.astro e2e/order-form.spec.ts playwright.config.ts
git commit -m "feat: add Order inquiry form page with Playwright tests"
```

---

## Task 9: Subscribe Form Page

**Files:**
- Create: `src/pages/subscribe.astro`
- Create: `e2e/subscribe-form.spec.ts`

- [ ] **Step 1: Write `e2e/subscribe-form.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test.describe('Subscription inquiry form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/subscribe');
  });

  test('renders all required fields', async ({ page }) => {
    await expect(page.locator('#sub-purchaser-name')).toBeVisible();
    await expect(page.locator('#sub-purchaser-email')).toBeVisible();
    await expect(page.locator('#sub-purchaser-phone')).toBeVisible();
    await expect(page.locator('input[name="sub-fulfillment"][value="pickup"]')).toBeVisible();
    await expect(page.locator('input[name="frequency"][value="weekly"]')).toBeVisible();
    await expect(page.locator('input[name="frequency"][value="biweekly"]')).toBeVisible();
    await expect(page.locator('input[name="frequency"][value="monthly"]')).toBeVisible();
    await expect(page.locator('#sub-recipient-name')).toBeVisible();
    await expect(page.locator('#start-date')).toBeVisible();
    await expect(page.locator('#special-requests')).toBeVisible();
    await expect(page.locator('#sub-budget')).toBeVisible();
    await expect(page.locator('#style-preferences')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('delivery address is hidden by default', async ({ page }) => {
    await expect(page.locator('#sub-delivery-address-field')).toBeHidden();
  });

  test('delivery address shows when delivery is selected', async ({ page }) => {
    await page.click('input[name="sub-fulfillment"][value="delivery"]');
    await expect(page.locator('#sub-delivery-address-field')).toBeVisible();
  });

  test('disclaimer text is present', async ({ page }) => {
    await expect(page.locator('.form-disclaimer')).toContainText("We'll follow up");
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npx playwright test e2e/subscribe-form.spec.ts
```

Expected: all tests fail (page doesn't exist).

- [ ] **Step 3: Write `src/pages/subscribe.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';

const budgetOptions = [
  '$75','$100','$125','$150','$175','$200',
  '$225','$250','$275','$300','$325','$350','$375','$400','$400+',
];
---
<Layout
  title="Subscribe — Florentino's Fine Flowers"
  description="Sign up for regular flower deliveries or pickups, on your schedule."
>
  <div class="page-hero" data-animate="fade-up">
    <p class="page-eyebrow">Flower Subscriptions</p>
    <h1>Fresh Flowers,<br />On Your Schedule</h1>
    <p class="page-intro">
      Fresh arrangements delivered or ready for pickup — weekly, biweekly, or monthly.
      We'll reach out to confirm the details.
    </p>
  </div>

  <section class="form-page">
    <div class="form-wrap">
      <form
        name="flower-subscription"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        class="inquiry-form"
      >
        <input type="hidden" name="form-name" value="flower-subscription" />
        <p class="visually-hidden">
          <label>Don't fill this out: <input name="bot-field" /></label>
        </p>

        <!-- Purchaser contact -->
        <div class="form-field">
          <label class="form-label" for="sub-purchaser-name">Your Name</label>
          <input class="form-input" type="text" id="sub-purchaser-name" name="purchaser-name" placeholder="Your full name" required />
        </div>
        <div class="form-row">
          <div class="form-field">
            <label class="form-label" for="sub-purchaser-email">Email</label>
            <input class="form-input" type="email" id="sub-purchaser-email" name="purchaser-email" placeholder="you@example.com" required />
          </div>
          <div class="form-field">
            <label class="form-label" for="sub-purchaser-phone">Phone</label>
            <input class="form-input" type="tel" id="sub-purchaser-phone" name="purchaser-phone" placeholder="(206) 555-0100" required />
          </div>
        </div>

        <!-- Delivery or pickup -->
        <fieldset class="form-field form-fieldset">
          <legend class="form-label">Delivery or Pickup?</legend>
          <div class="pill-group">
            <input type="radio" name="sub-fulfillment" id="sub-pickup" value="pickup" required />
            <label for="sub-pickup">Pickup</label>
            <input type="radio" name="sub-fulfillment" id="sub-delivery" value="delivery" />
            <label for="sub-delivery">Delivery</label>
          </div>
        </fieldset>

        <!-- Frequency -->
        <fieldset class="form-field form-fieldset">
          <legend class="form-label">How Often?</legend>
          <div class="pill-group">
            <input type="radio" name="frequency" id="freq-weekly" value="weekly" required />
            <label for="freq-weekly">Weekly</label>
            <input type="radio" name="frequency" id="freq-biweekly" value="biweekly" />
            <label for="freq-biweekly">Every 2 Weeks</label>
            <input type="radio" name="frequency" id="freq-monthly" value="monthly" />
            <label for="freq-monthly">Monthly</label>
          </div>
        </fieldset>

        <!-- Recipient -->
        <div class="form-field">
          <label class="form-label" for="sub-recipient-name">Recipient Name</label>
          <input class="form-input" type="text" id="sub-recipient-name" name="recipient-name" placeholder="If different from above" />
        </div>

        <!-- Conditional delivery address -->
        <div class="form-field" id="sub-delivery-address-field" hidden>
          <label class="form-label" for="sub-delivery-address">Delivery Address</label>
          <input class="form-input" type="text" id="sub-delivery-address" name="delivery-address" placeholder="Street address, Seattle" />
        </div>

        <!-- Start date -->
        <div class="form-field">
          <label class="form-label" for="start-date">Preferred Start Date</label>
          <input class="form-input" type="date" id="start-date" name="start-date" required />
        </div>

        <!-- Special requests -->
        <div class="form-field">
          <label class="form-label" for="special-requests">Special Requests</label>
          <p class="form-hint">Colors, styles, anything to avoid — we'll take it from there.</p>
          <textarea class="form-textarea" id="special-requests" name="special-requests" rows="3" placeholder="e.g. no lilies, prefer warm tones..."></textarea>
        </div>

        <!-- Budget -->
        <div class="form-field">
          <label class="form-label" for="sub-budget">Budget Per Arrangement</label>
          <select class="form-select" id="sub-budget" name="budget" required>
            <option value="" disabled selected>Select a budget</option>
            {budgetOptions.map((opt) => <option value={opt}>{opt}</option>)}
          </select>
        </div>

        <!-- Style preferences -->
        <div class="form-field">
          <label class="form-label" for="style-preferences">Style Preferences</label>
          <p class="form-hint">Modern, lush, wild, minimal, seasonal — or let us surprise you.</p>
          <textarea class="form-textarea" id="style-preferences" name="style-preferences" rows="3" placeholder="Describe the aesthetic you love..."></textarea>
        </div>

        <!-- Disclaimer -->
        <p class="form-disclaimer">
          By submitting you understand this is an inquiry. We'll follow up to confirm
          your subscription details and first invoice.
        </p>

        <button type="submit" class="btn-primary form-submit">Start My Subscription</button>
      </form>
    </div>
  </section>
</Layout>

<style>
  .page-hero {
    padding: calc(var(--space-section) + 80px) var(--space-content) 3rem;
    text-align: center;
    max-width: 700px;
    margin: 0 auto;
  }
  .page-eyebrow {
    font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
    color: var(--color-gold); opacity: 0.7; margin-bottom: 0.75rem;
  }
  .page-intro {
    color: #b0b0c8; font-style: italic; margin-top: 1rem;
    font-family: var(--font-display); font-size: 1.1rem;
  }
  .form-page { padding: 0 var(--space-content) var(--space-section); }
  .form-wrap { max-width: 640px; margin: 0 auto; }
  .inquiry-form { display: flex; flex-direction: column; gap: 20px; }
  .form-fieldset { border: none; padding: 0; }
  .form-submit { align-self: flex-start; margin-top: 0.5rem; }
</style>

<script>
  const subDelivery = document.getElementById('sub-delivery') as HTMLInputElement;
  const subPickup = document.getElementById('sub-pickup') as HTMLInputElement;
  const subAddressField = document.getElementById('sub-delivery-address-field') as HTMLDivElement;
  const subAddressInput = document.getElementById('sub-delivery-address') as HTMLInputElement;

  function toggleSubAddress(show: boolean) {
    subAddressField.hidden = !show;
    subAddressInput.required = show;
  }

  subDelivery.addEventListener('change', () => toggleSubAddress(true));
  subPickup.addEventListener('change', () => toggleSubAddress(false));
</script>
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx playwright test e2e/subscribe-form.spec.ts
```

Expected: all 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/pages/subscribe.astro e2e/subscribe-form.spec.ts
git commit -m "feat: add Subscribe inquiry form page with Playwright tests"
```

---

## Task 10: About Page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Write `src/pages/about.astro`**

```astro
---
import Layout from '../layouts/Layout.astro';
import { getAbout, urlFor } from '../lib/sanity';
import { PortableText } from '@portabletext/astro';

const about = await getAbout().catch(() => null);
---
<Layout
  title="About — Florentino's Fine Flowers"
  description="The story behind Florentino's Fine Flowers in Madison Valley, Seattle."
>
  <section class="about-page">
    <div class="section-inner">
      {about ? (
        <div class="about-layout" data-animate="fade-up">
          <div class="about-photo">
            <img
              src={urlFor(about.photo).width(700).height(900).fit('crop').auto('format').url()}
              alt="Florentino"
            />
          </div>
          <div class="about-text">
            <p class="page-eyebrow">About</p>
            <h1>Florentino's<br />Fine Flowers</h1>
            {about.bio && <div class="bio-body"><PortableText value={about.bio} /></div>}
            <div class="about-cta">
              <a href="/order" class="btn-primary">Order an Arrangement</a>
              <a href="/visit" class="btn-outline">Visit the Shop</a>
            </div>
          </div>
        </div>
      ) : (
        <div class="about-placeholder" data-animate="fade-up">
          <p class="page-eyebrow">About</p>
          <h1>Florentino's Fine Flowers</h1>
          <p class="bio-body">Coming soon.</p>
        </div>
      )}
    </div>
  </section>
</Layout>

<style>
  .about-page {
    padding: calc(var(--space-section) + 80px) var(--space-content) var(--space-section);
  }
  .about-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(2rem, 6vw, 5rem);
    align-items: start;
  }
  @media (max-width: 768px) {
    .about-layout { grid-template-columns: 1fr; }
  }
  .about-photo img {
    width: 100%;
    aspect-ratio: 3/4;
    object-fit: cover;
    filter: brightness(0.9);
  }
  .page-eyebrow {
    font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
    color: var(--color-gold); opacity: 0.7; margin-bottom: 0.75rem;
  }
  .about-text h1 { font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 1.5rem; }
  .bio-body { color: #b0b0c8; line-height: 1.9; font-size: 1.05rem; }
  .bio-body p { margin-bottom: 1rem; }
  .about-cta { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 2rem; }
  .about-placeholder { text-align: center; max-width: 600px; margin: 0 auto; padding: 4rem 0; }
</style>
```

- [ ] **Step 2: Install PortableText renderer**

```bash
npm install @portabletext/astro
```

- [ ] **Step 3: Add About content in Sanity Studio, then verify page**

```bash
npm run dev
```

Open http://localhost:4321/about. Verify photo renders, bio text displays.

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro package.json package-lock.json
git commit -m "feat: add About page with Sanity content"
```

---

## Task 11: Visit Page

**Files:**
- Create: `src/pages/visit.astro`

- [ ] **Step 1: Write `src/pages/visit.astro`**

The hours are hardcoded as a fallback since they're also editable in Sanity.

```astro
---
import Layout from '../layouts/Layout.astro';
import { getVisitInfo } from '../lib/sanity';

const visitInfo = await getVisitInfo().catch(() => null);

const fallbackHours = [
  { day: 'Monday', hours: '10 AM – 3 PM' },
  { day: 'Tuesday', hours: '10 AM – 3 PM' },
  { day: 'Wednesday', hours: '10 AM – 3 PM' },
  { day: 'Thursday', hours: '10 AM – 4 PM' },
  { day: 'Friday', hours: '10 AM – 4 PM' },
  { day: 'Saturday', hours: '10 AM – 4 PM' },
  { day: 'Sunday', hours: 'Closed' },
];

const hours = visitInfo?.hours?.length ? visitInfo.hours : fallbackHours;
const address = visitInfo?.address ?? 'Madison Valley, Seattle, WA';
const mapsUrl = visitInfo?.googleMapsUrl ?? `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
---
<Layout
  title="Visit — Florentino's Fine Flowers"
  description="Find Florentino's Fine Flowers in Madison Valley, Seattle. Hours, directions, and the gift shop."
>
  <section class="visit-page">
    <div class="section-inner">

      <div class="visit-header" data-animate="fade-up">
        <p class="page-eyebrow">Find Us</p>
        <h1>Visit the Shop</h1>
      </div>

      <div class="visit-layout">
        <!-- Hours + Address -->
        <div class="visit-info" data-animate="fade-up">
          <h2>Hours</h2>
          <table class="hours-table">
            <tbody>
              {hours.map(({ day, hours: h }) => (
                <tr class={h === 'Closed' ? 'closed' : ''}>
                  <td class="hours-day">{day}</td>
                  <td class="hours-time">{h}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div class="address-block">
            <h2>Location</h2>
            <p>{address}</p>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" class="btn-outline">
              Get Directions
            </a>
          </div>

          <div class="contact-block">
            <h2>Get in Touch</h2>
            <p>
              <a href="/order">Order a custom arrangement →</a>
            </p>
            <p>
              <a href="/subscribe">Sign up for a subscription →</a>
            </p>
          </div>
        </div>

        <!-- Gift shop teaser -->
        <div class="gift-shop" data-animate="fade-up">
          <h2>More Than Flowers</h2>
          <p class="gift-body">
            Step inside and you'll find more than arrangements. Florentino's is also home
            to a thoughtfully curated gift shop — candles, home goods, and one-of-a-kind
            finds you won't come across anywhere else in the neighborhood.
          </p>
          <p class="gift-body">
            Some things are worth discovering in person. Come visit us.
          </p>

          <!-- Map embed -->
          <div class="map-wrap">
            <iframe
              title="Florentino's Fine Flowers location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
              width="100%"
              height="300"
              style="border:0;border-radius:4px;filter:invert(90%) hue-rotate(180deg);"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

    </div>
  </section>
</Layout>

<style>
  .visit-page {
    padding: calc(var(--space-section) + 80px) var(--space-content) var(--space-section);
  }
  .visit-header { margin-bottom: 3rem; }
  .page-eyebrow {
    font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
    color: var(--color-gold); opacity: 0.7; margin-bottom: 0.75rem;
  }
  .visit-layout {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: clamp(2rem, 6vw, 5rem);
    align-items: start;
  }
  @media (max-width: 768px) {
    .visit-layout { grid-template-columns: 1fr; }
  }

  /* Hours table */
  .hours-table { width: 100%; border-collapse: collapse; margin-bottom: 3rem; }
  .hours-table tr { border-bottom: 1px solid rgba(255,225,132,0.08); }
  .hours-day, .hours-time {
    padding: 0.6rem 0;
    font-size: 14px;
    color: #b0b0c8;
  }
  .hours-day { font-weight: 500; padding-right: 2rem; }
  .hours-time { text-align: right; }
  .hours-table tr.closed .hours-day,
  .hours-table tr.closed .hours-time { color: #555; }

  /* Address */
  .address-block { margin-bottom: 3rem; }
  .address-block h2, .contact-block h2, .gift-shop h2 {
    font-size: 1.1rem; margin-bottom: 0.75rem; color: var(--color-gold);
  }
  .address-block p { color: #b0b0c8; margin-bottom: 1rem; }
  .contact-block a { font-size: 14px; display: block; margin-bottom: 0.5rem; }

  /* Gift shop */
  .gift-body { color: #b0b0c8; line-height: 1.9; margin-bottom: 1rem; font-size: 1.05rem; }
  .map-wrap { margin-top: 2rem; }
</style>
```

- [ ] **Step 2: Verify visit page**

```bash
npm run dev
```

Open http://localhost:4321/visit. Verify hours table renders, map embeds (may require iframe permissions), gift shop copy is present.

- [ ] **Step 3: Commit**

```bash
git add src/pages/visit.astro
git commit -m "feat: add Visit page with hours, map, and gift shop section"
```

---

## Task 12: Full Test Run and Build Verification

- [ ] **Step 1: Run all Playwright tests**

```bash
npx playwright test
```

Expected: all tests in `e2e/order-form.spec.ts` and `e2e/subscribe-form.spec.ts` pass.

- [ ] **Step 2: Run TypeScript check**

```bash
npx astro check
```

Expected: 0 errors.

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: `dist/` created, no errors. Output should include `index.html`, `gallery/index.html`, `order/index.html`, `subscribe/index.html`, `about/index.html`, `visit/index.html`.

- [ ] **Step 4: Preview production build locally**

```bash
npm run preview
```

Open http://localhost:4321. Walk through all 6 pages. Verify: Netlify Forms attribute `data-netlify="true"` is present in the built HTML.

```bash
grep -r 'data-netlify' dist/
```

Expected: matches found in `dist/order/index.html` and `dist/subscribe/index.html`.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: verify full build and all tests passing"
```

---

## Task 13: Netlify Deployment and Cloudflare Setup

- [ ] **Step 1: Create Netlify site**

Go to https://netlify.com → New site → Import from Git → connect the GitHub/GitLab repo for this project. Build command: `npm run build`. Publish directory: `dist`.

- [ ] **Step 2: Add environment variables in Netlify**

In Netlify dashboard → Site settings → Environment variables, add:
```
PUBLIC_SANITY_PROJECT_ID=<your_project_id>
PUBLIC_SANITY_DATASET=production
```

- [ ] **Step 3: Trigger first deploy and verify**

Push any commit or click "Deploy site" in Netlify. Once deployed, open the Netlify preview URL. Verify all pages load, forms render, `data-netlify` attributes are present.

- [ ] **Step 4: Set up Netlify Forms notifications**

In Netlify dashboard → Forms → select `order-inquiry` and `flower-subscription` → Add notification → Email notification → enter Florentino's email address.

- [ ] **Step 5: Set up Sanity → Netlify rebuild webhook**

In Netlify dashboard → Site settings → Build hooks → Add build hook named "Sanity Content Update". Copy the webhook URL.

In Sanity management (manage.sanity.io) → API → Webhooks → Create webhook. Name: "Netlify Rebuild". URL: paste the Netlify hook URL. Dataset: production. Trigger on: create, update, delete.

- [ ] **Step 6: Set up Cloudflare for DNS and email routing**

1. Create a free Cloudflare account at cloudflare.com
2. Add site: `florentinosseattle.com`
3. Cloudflare shows you two nameservers (e.g. `bob.ns.cloudflare.com`) — update these in Dreamhost's domain management panel
4. Once DNS propagates (~1–24 hours), in Cloudflare → DNS → add records:
   - CNAME `@` → `<your-netlify-site>.netlify.app` (or use Netlify's provided A record IPs)
   - CNAME `www` → `<your-netlify-site>.netlify.app`
5. In Netlify → Domain management → add custom domain `florentinosseattle.com`. Netlify provisions SSL automatically.

- [ ] **Step 7: Set up Cloudflare Email Routing**

In Cloudflare dashboard → Email → Email Routing → Enable. Add routing rule:
- Custom address: `ciao@florentinosseattle.com`
- Action: Send to → `florentino@gmail.com` (or his ProtonMail address)

Repeat for any other aliases he uses. This fully replaces Dreamhost email at zero cost.

- [ ] **Step 8: Cancel Dreamhost hosting (keep domain if registered there)**

Once DNS is confirmed working through Cloudflare and the site loads on `florentinosseattle.com`:
- If domain is registered at Dreamhost: keep the registration (or transfer to Namecheap)
- Cancel the Dreamhost hosting/shared server plan

- [ ] **Step 9: Final smoke test on production URL**

Open https://florentinosseattle.com. Verify:
- All 6 pages load
- Nav scroll behavior works
- Forms render with `data-netlify` (check View Source)
- Test submit a form — Florentino should receive an email notification

- [ ] **Step 10: Send Sanity Studio URL to Florentino**

Share the Studio URL (e.g. `florentinos.sanity.studio`) with Florentino. Walk him through:
1. Uploading gallery images (set display order)
2. Selecting up to 4 as Homepage Featured
3. Updating About photo and bio
4. Updating Visit address/hours
5. Saving — the site rebuilds in ~1 minute

- [ ] **Step 11: Final commit**

```bash
git add .
git commit -m "chore: deployment complete, Cloudflare and Netlify configured"
```
