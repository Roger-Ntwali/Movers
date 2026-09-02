# Movers Rwanda — Website

A premium, single-page marketing site for Movers Rwanda, built with plain HTML, CSS and JavaScript (no build step, no dependencies to install).

## Project structure

```
movers-rwanda/
├── index.html          → all page content and sections
├── css/
│   └── styles.css      → design tokens, layout, components
├── js/
│   └── script.js       → nav, quote form, FAQ accordion, reveal animations, gallery lightbox
├── assets/
│   └── favicon.svg
└── README.md
```

## Run it in VS Code

1. Unzip/open the `movers-rwanda` folder in VS Code (**File → Open Folder…**).
2. Install the **Live Server** extension (by Ritwick Dey) from the Extensions panel if you don't already have it.
3. Right-click `index.html` in the file explorer and choose **"Open with Live Server"** (or click "Go Live" in the bottom-right status bar).
4. The site opens at `http://127.0.0.1:5500` (or similar) and auto-reloads whenever you save a file.

No Live Server? You can also just double-click `index.html` to open it directly in a browser — everything works without a local server, since there's no backend.

## What's real vs. placeholder

Per the brief, nothing is invented that would misrepresent the business:

- **No fake reviews, ratings, review counts, licenses, certifications, or "years of experience"** are presented as real. The 4 testimonial cards are clearly marked as development placeholders (see the note under the Reviews section) — swap in verified reviews when available.
- **No pricing is calculated.** The quote form collects the visitor's details and shows a confirmation message; it does not pretend to generate a price.
- **Photography is placeholder.** All "photo" areas (hero, about, services, gallery, blog) are styled gradient blocks rather than real photos, since no licensed photography was provided. Drop real images into `assets/` and swap the relevant CSS `background` / add `<img>` tags to finish the visual identity — the layout, spacing and hover states are already built to accommodate real photos.

## Wiring up the quote form for real

Right now, submitting the form just shows a client-side confirmation message (see `js/script.js`). To actually receive leads, connect the `<form id="quoteForm">` in `index.html` to:
- a form backend (e.g. Formspree, Getform), or
- your own endpoint / serverless function, or
- an email service.

## Customizing

- **Colors, type, spacing** — all defined as CSS custom properties at the top of `css/styles.css` (`:root`), so palette or font changes propagate everywhere.
- **WhatsApp number** — currently `+250 787 225 782`, used in three places (`hero`, `final CTA`, floating button, footer). Search for `250787225782` in `index.html` to update it everywhere at once.
- **Navigation links** — currently anchor links to sections on the same page (`#services`, `#areas`, etc.). Point them to separate pages once those are built.
