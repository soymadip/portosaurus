# Portosaurus CLI Commands

This directory contains the entry points for the `porto` CLI. Each command is implemented as an asynchronous function that handles project lifecycle tasks.

- **`init.mjs`**: Handles new project creation, template mirroring, and initial setup.
- **`dev.mjs`**: Wraps the Docusaurus development server, providing automatic config shimming and asset generation.
- **`build.mjs`**: Orchestrates production builds, ensuring the site is ready for deployment.
- **`serve.mjs`**: Provides a way to preview the production build locally.
