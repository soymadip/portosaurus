# CLI Specification

The {{meta.project.title}} CLI is the central orchestration tool for your digital environment.

## `init`

Bootstraps a fresh project instance with all necessary boilerplate.

```bash
bunx {{meta.pkg}} init <project-name> [options]
# or
npx {{meta.pkg}} init <project-name> [options]
```

**Options:**

- `--no-install`: Defer dependency resolution to manual execution.
- `--no-git-pages`: Bypass automated GitHub Pages OIDC configuration.

## `dev`

Spawns the development engine with real-time orchestration and HMR.

```bash
bunx {{meta.pkg}} dev [project-path]
# or
npx {{meta.pkg}} dev [project-path]
```

**Core Features:**

- **Schema Guard**: Real-time YAML validation and typo detection.
- **Dynamic Resolution**: On-the-fly resolution of `{{variables}}`.
- **Hot-Reloading**: Instantaneous HMR for both content and metadata blueprints.

## `build`

Compiles the high-performance production distribution.

```bash
bunx {{meta.pkg}} build [project-path]
# or
npx {{meta.pkg}} build [project-path]
```

**Artifact Generation:**

- Optimized static assets are exported to the `build/` directory, ready for immutable deployment.
