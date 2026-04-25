# Deployment Templates

Portosaurus keeps deployment setup in `src/template/workflows`. These templates are used by both `portosaurus init` and `portosaurus init-ci`.

There are two parts:

- `registry.yml`: metadata for VCS providers and hosting platforms.
- Workflow directories such as `github`, `gitlab`, `codeberg`, `woodpecker`, and `netlify`.

## Registry

All platforms and providers must be registered in `src/template/registry.yml`.

```yaml
vcs_providers:
  github:
    name: GitHub
    domain: github.com
    url: "https://github.com/{{user}}/{{projectName}}.git"
    new_url: "https://github.com/new?name={{projectName}}"
    default_hosting: github-pages

hosting_platforms:
  github-pages:
    name: GitHub Pages
    template_dir: github
    repo:
      ideal_name: "{{user}}.github.io"
```

Fields for `hosting_platforms`:

| Field                   | Required | Description                                                                                                                                              |
| ----------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                  | Yes      | Human-readable label shown in prompts and logs.                                                                                                          |
| `template_dir`          | Yes      | Directory under `src/template/workflows` to copy, OR an object mapping VCS providers (e.g. `github`) to directories for multi-target deployment (Surge). |
| `repo.ideal_name`       | Yes      | Suggested project/repository name. `{{user}}` is replaced with the platform username.                                                                    |
| `repo.git_remote_match` | No       | String matched against `git remote -v` by `init-ci` for automatic detection.                                                                             |
| `repo.mismatch_msg`     | No       | Custom warning message shown if the project name doesn't match `ideal_name`.                                                                             |
| `post_setup_tips`       | No       | Array of strings printed after setup.                                                                                                                    |

The registry key is the canonical platform value used internally. Keep it stable once released. CLI input passed through `--hosting` is case-insensitive, so `github`, `GitHub`, and `GITHUB` all resolve to the `github-pages` key (via early resolution).

## Template Directory

The provider directory contains the files copied into the user's project root.

```text
src/template/workflows/github/
├── .github/
│   └── workflows/
│       └── deploy.yml
└── hooks.mjs
```

All files are copied recursively except `hooks.mjs`. Dot directories such as `.github`, `.gitlab`, `.forgejo`, and `.woodpecker` are supported.

## Template Variables

Text files copied from workflow templates are processed with simple `{{name}}` replacements.

Available variables:

| Variable          | Value                                                          |
| ----------------- | -------------------------------------------------------------- |
| `{{projectName}}` | New project directory name.                                    |
| `{{portoVer}}`    | Current Portosaurus package version.                           |
| `{{portoHome}}`   | Portosaurus homepage from `package.json`.                      |
| `{{portoRepo}}`   | Portosaurus repository URL from `package.json`.                |
| `{{userName}}`    | VCS Provider username, or `yourusername` when not provided.    |
| `{{fullName}}`    | Portfolio owner's full name, or `Your Name` when not provided. |

Replacement runs for common text files: `.js`, `.mjs`, `.json`, `.md`, `.mdx`, `.yml`, `.yaml`, `.css`, `.html`, and `.txt`.

## Hooks

A provider can export lifecycle hooks from `hooks.mjs`.

Currently supported:

| Hook        | When it runs                                             |
| ----------- | -------------------------------------------------------- |
| `postSetup` | After workflow files are copied into the target project. |

Example:

```js
export async function postSetup({ logger, projectDir, projectName }) {
  logger.success(`Configured deployment for ${projectName}.`);
  logger.tip(`Review generated files in ${projectDir}.`);
}
```

Hook context:

| Property      | Description                                                            |
| ------------- | ---------------------------------------------------------------------- |
| `logger`      | Portosaurus logger with `info`, `success`, `warn`, `error`, and `tip`. |
| `projectDir`  | Absolute path to the generated or current user project.                |
| `projectName` | Project directory name.                                                |
| `userName`    | Platform username when provided.                                       |
| `fullName`    | Portfolio owner's full name when provided.                             |

`init-ci` also passes `PORTO_HOSTING`, which is the selected registry key.

Hook failures are caught and logged at debug level, so hooks should be helpful but not required for a valid template.

## Add A Hosting Platform

1. Create a directory under `src/template/workflows`.
2. Add the CI/CD files exactly as they should appear in a user project.
3. Add `hooks.mjs` only if setup needs extra tips or custom logic.
4. Register the platform in `src/template/registry.yml`.
5. Test both initialization paths.

```bash
# Generate a new project with the provider
bun ./bin/portosaurus.mjs init scratch-site --vcs-provider github --hosting github-pages --username octocat --name "Octo Cat" --no-install

# Add deployment files to an existing Portosaurus project
cd scratch-site
bun ../bin/portosaurus.mjs init-ci --hosting github-pages
```

Use a canonical key for `--hosting`; casing does not matter. Current built-in keys include `github-pages`, `gitlab-pages`, `codeberg-pages`, `woodpecker`, and `netlify`.

## Existing Hosting Platforms

| Key              | Template        | Output                            |
| ---------------- | --------------- | --------------------------------- |
| `github-pages`   | `github`        | `.github/workflows/deploy.yml`    |
| `gitlab-pages`   | `gitlab`        | `.gitlab-ci.yml`                  |
| `codeberg-pages` | `codeberg`      | `.forgejo/workflows/deploy.yml`   |
| `woodpecker`     | `woodpecker`    | `.woodpecker/deploy.yml`          |
| `netlify`        | `netlify`       | `netlify.toml`                    |
| `surge`          | `surge` (multi) | `.github/...` or `.gitlab-ci.yml` |

## Notes For Maintainers

Keep template docs, `registry.yml`, and CLI examples in sync. The CLI currently reads only `registry.yml`; adding a directory without registering it will not make it available.
