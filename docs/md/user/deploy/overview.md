# Deploying your Portfolio

Once you've customized your {{meta.project.title}} site, it's time to share it with the world. Since {{meta.project.title}} generates a **highly optimized static website**, you can host it for free on almost any static hosting provider.

## The Core Concept

Deploying a {{meta.project.title}} site follows a simple two-step process:

1.  **Build**: Generate the static HTML, CSS, and JS files.
2.  **Host**: Upload the contents of the `build` directory to your provider of choice.

## Prerequisites

Before deploying, ensure you have:

- Installed `{{meta.pkg}}` globally or as a dev dependency.
- A working configuration (`config.yml`).
- A repository on your preferred VCS provider (GitHub, GitLab, etc.).

## Automated Setup with `init-ci`

To make deployment even easier, {{meta.project.title}} includes a dedicated command to generate these configuration files for you automatically.

Run the following command in your project root:

```bash
# Using Bun (recommended)
bunx {{meta.pkg}} init-ci

# Or using npm
npx {{meta.pkg}} init-ci
```

This command will:

1.  **Detect** your VCS provider (GitHub, GitLab, Codeberg, etc.) from your git remote.
2.  **Generate** the appropriate CI/CD workflow file for its default hosting platform.

You can also force a specific platform using the `-h` (or `--hosting`) flag:

```bash
# Using Bun
bunx {{meta.pkg}} init-ci -h gitlab-pages

# Using npm
npx {{meta.pkg}} init-ci -h gitlab-pages
```

## Choosing a Platform Manually

If you prefer to set up your CI/CD manually, follow our detailed guides:

- [**GitHub Pages**](./github-pages) (Recommended for most users)
- [**GitLab Pages**](./gitlab-pages)
- [**Codeberg Pages**](./codeberg-pages)
- [**Surge.sh**](./surge)
- [**Other Platforms**](./others) (Netlify, Vercel, Cloudflare)

## Manual Deployment

If you prefer to deploy manually, you can run the following command:

```bash
npx {{meta.pkg}} build
```

This will create a `build` folder in your project root. You can then upload this folder manually to any host (like Surge, Hostinger, or even a simple S3 bucket).
