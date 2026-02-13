# Static Assets

Place your static files here. Everything in this directory will be copied to the root of your built website.

## Common Files

- **Binaries/scripts:** Install scripts or binaries
- **Favicon:** `favicon.ico` or `favicon.png`
- **Images:** `img/` directory for site images
- **Documents:** PDFs, downloads, etc.
- **robots.txt:** Search engine instructions
- **CNAME:** Custom domain configuration (for GitHub Pages)

## Example Structure

```
static/
├── favicon.ico
├── img/
│   ├── logo.svg
│   └── social-card.jpg
├── downloads/
│   └── resume.pdf
└── robots.txt
```

## Usage

Files in this directory are served at the root URL:

- `static/favicon.ico` → `https://yoursite.com/favicon.ico`
- `static/img/logo.svg` → `https://yoursite.com/img/logo.svg`
- `static/downloads/resume.pdf` → `https://yoursite.com/downloads/resume.pdf`
