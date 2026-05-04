# Copilot Instructions for Portosaur

Portosaur is a CLI-first monorepo for building portfolio and personal websites using Docusaurus.

## Build, Test, and Lint Commands

### Testing

```bash
# Run all tests across all packages
bun test

# Run tests for a specific package
bun run test:cli         # CLI package tests
bun run test:core        # Core package tests
bun run test:logger      # Logger package tests
bun run test:all         # Run all test scripts

# Run a single test file
bun test packages/core/tests/resolveVars.test.mjs

# Run tests with watch mode
bun test --watch
```

### Formatting & Linting

```bash
# Check code formatting
bun run lint

# Fix formatting issues
bun run format
```

### Development & Building

```bash
# Start development server (docs site)
bun run dev           # Same as: bun run dev:docs

# Build documentation site
bun run build:docs

# Build everything
bun run build:all
```

## Monorepo Structure

The repository uses Bun workspaces defined in the root `package.json`:

```
packages/
├── cli/      - CLI entry point and commands (unscoped: published as "portosaur")
├── core/     - YAML → Docusaurus translation engine (@portosaur/core)
├── logger/   - Unified logging and terminal colors (@portosaur/logger)
├── theme/    - React components and plugins (@portosaur/theme)
├── wizard/   - Interactive prompt library for CLI (@portosaur/wizard)

docs/        - Documentation site (built with VitePress)
```

## High-Level Architecture

### Dependency Flow (UNIDIRECTIONAL - NEVER BREAK THIS)

```
cli → core → logger
cli → wizard
theme → core
```

**Key rule**: No circular dependencies. Data flows only downward.

### Package Purposes

- **`@portosaur/core`**:
  - Loads YAML config files (`config.yml`)
  - Resolves variables and references within config
  - Generates Docusaurus configuration, favicon sets, robots.txt
  - Contains no CLI logic or interactive prompts

- **`@portosaur/logger`**:
  - Terminal output formatting
  - Color management
  - No dependencies on other packages (foundational layer)

- **`@portosaur/wizard`**:
  - Interactive CLI prompts
  - Consumes prompts.mjs for question definitions
  - Uses Bun's built-in prompt/input system

- **`@portosaur/cli`**:
  - Command definitions (init, dev, build, serve, schema, providers)
  - Orchestrates core, wizard, and logger
  - Entry point for the CLI

- **`@portosaur/theme`**:
  - React components for Docusaurus
  - Docusaurus plugins
  - Styling and assets

### Code Organization

Each package follows this structure:

```
package-name/
├── src/
│   ├── index.mjs      - Main entry point (ESM module)
│   ├── index.d.ts     - Type definitions (MUST be kept in sync)
│   ├── commands/      - Command definitions (cli only)
│   ├── generators/    - Code generators (core only)
│   ├── utils/         - Utility modules
│   ├── lib/           - Helper libraries
│   └── plugins/       - Plugins (theme only)
├── tests/
│   └── *.test.mjs     - Bun test files
└── package.json
```

## Key Conventions

### Imports & Module System

- **All code is ESM**: Use `.mjs` extension and `import`/`export` syntax
- **Cross-package imports**: Always use scoped packages (`@portosaur/logger`), never relative paths (`../../logger`)
- Example:

  ```javascript
  import { createLogger } from "@portosaur/logger";
  import { loadUserConfig } from "@portosaur/core";
  ```

### Type Definitions

- Every library package MUST have an `index.d.ts` in `src/`
- Link via `"types": "./src/index.d.ts"` in `package.json`
- Keep in sync with source code changes—**any implementation change requires a types update**

### Logging & CLI Output

- Always use `@portosaur/logger` for CLI output (not `console.log`)
- Logger provides consistent formatting and color support
- Example:

  ```javascript
  import { createLogger } from "@portosaur/logger";
  const log = createLogger("init");
  log.success("Project created!");
  ```

### Terminology

- **VCS Provider**: The git host (e.g., GitHub, GitLab)
- **Hosting Platform**: The deployment target (e.g., Vercel, Netlify)
- Use `none` to indicate skipped configuration

### Code Style

- **Linear flow**: Imports → Constants → Logic (top to bottom)
- **Human-readable formatting**:
  - Use meaningful newlines between logical sections
  - Group related properties with descriptive comments
  - Avoid machine-dense logic
  - Never use numbered comments (`// 1.`, `// 2.`) — use descriptive headers instead
  - Example:

    ```javascript
    // Section: Variable Resolution
    const resolvedVars = resolveVars(config, context);

    // Section: Docusaurus Generation
    const docConfig = generateDocusaurusConfig(resolvedVars);
    ```

- **Always use braces** for if statements, even single-line ones:

  ```javascript
  if (!config) {
    throw new Error("Missing config");
  }
  ```

### Configuration Format

- User projects use `config.yml` (YAML format)
- Core package provides `loadUserConfig()` to parse it
- Configuration is resolved through the variable resolution system in `@portosaur/core`

### Testing

- Use **Bun's test framework** (`bun:test`)
- Test file naming: `*.test.mjs`
- **Always verify `bun test` passes before finishing any task**
- Example patterns in existing tests:
  - Use `mock.module()` for dependency mocking
  - Use `describe()` and `test()` for organization
  - Use `beforeAll()`, `afterAll()`, `afterEach()` for setup/cleanup

### Package Management

- **Use Bun** (`bun install`, `bun add`) for all package operations
- Keep Node compatibility (minimum Node 24.15.0)
- `package.json` specifies `"packageManager": "bun@1.3.12"`

## Common Tasks

### Adding a New Command

1. Create `packages/cli/src/commands/newCommand.mjs`
2. Export function from `packages/cli/src/index.mjs`
3. Add prompt definitions if needed to `packages/wizard/src/prompts.mjs`
4. Add tests to `packages/cli/tests/`
5. Run `bun test` to verify

### Adding Utilities to Core

1. Create utility file in `packages/core/src/utils/`
2. Export from `packages/core/src/index.mjs`
3. Update `packages/core/src/index.d.ts` with types
4. Add tests to `packages/core/tests/`
5. Run `bun test` to verify

### Updating Type Definitions

- Always update `.d.ts` when changing API
- Test types with TypeScript: `bun test` includes type checking
- Keep export signatures matching the `.mjs` files

## Important Notes

- **Do not commit/stage without asking** — review changes with the maintainer
- Check `AGENTS.md` and `DOCS_ARCHITECTURE.md` for architectural decisions and future plans
- The documentation site (in `/docs`) is built with VitePress and is separate from the Portosaur core
- Future: A `porto-doc` package is planned to use Portosaur itself for documentation (see `DOCS_ARCHITECTURE.md`)
