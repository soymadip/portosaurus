# Developer Guide

Welcome to the Portosaurus Developer Guide. This section is intended for contributors and power users who want to extend or understand the inner workings of {{meta.project.title}}.

## Project Layout

- `bin/portosaurus.mjs`: CLI entry point and command registration.
- `src/cli`: command implementations for `init`, `init-ci`, `dev`, `build`, `serve`, and schema generation.
- `src/core`: Docusaurus configuration builder.
- `src/template`: files copied into newly initialized user projects.
- `src/template/workflows`: deployment workflow templates and provider registry.
- `src/theme`: Docusaurus theme components, pages, CSS, and MDX helpers.
- `src/plugins`: Docusaurus plugins for theme loading, favicons, robots, and asset processing.
- `docs`: this VitePress documentation site.

## Main Development Tasks

- [**Deployment Templates**](./templates): add or update CI/CD providers used by `portosaurus init` and `portosaurus init-ci`.

## Local Development

Portosaurus is built with **Bun** and uses **Docusaurus** under the hood for the generator and **VitePress** for the documentation.

To get started with local development:

```bash
# Clone the repo
git clone https://github.com/soymadip/portosaurus.git

# Install dependencies
bun install

# Run the CLI from the working tree
bun ./bin/portosaurus.mjs --help
```

Useful commands:

```bash
# Run tests
bun test

# Check formatting
bun run lint

# Format files
bun run format

# Run this documentation site
cd docs
bun run dev
```

## CLI Flow

`portosaurus init` creates a new project from `src/template`, applies template variables, optionally copies a deployment workflow, runs a provider hook, commits the initial files, then installs dependencies unless `--no-install` is used.

`portosaurus init-ci` is for an existing Portosaurus project. It validates the current directory, detects or prompts for a provider, copies only the selected workflow template, then runs its hook.

`portosaurus dev`, `build`, and `serve` validate the current project, generate a temporary Docusaurus config shim under `.docusaurus/portosaurus`, then delegate to the local package manager.
