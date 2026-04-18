# Portosaurus Core Engine

This directory contains the central configuration engine that transforms user-provided settings into a valid Docusaurus configuration.

- **`buildDocuConfig.mjs`**: The main orchestration file. It deep-merges user configs with template defaults, resolves variable placeholders (`{{...}}`), and registers internal plugins and themes.
