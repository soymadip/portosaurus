# Docusaurus Plugins

This directory contains internal Docusaurus plugins that extend the site's functionality during build and development.

- **`theme.mjs`**: Maps the internal `src/theme` directory so that Docusaurus can pick up Portosaur components natively.
- **`favicon.mjs`**: Automates the generation of a complete favicon suite from the user's profile picture.
- **`robots.mjs`**: Generates a `robots.txt` file based on the configured site URL.
- **`lib/`**: Contains shared internal utilities used by these plugins (image processing, CSS extraction, etc.).
