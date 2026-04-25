# Getting Started

## Initialization

To initialize a new Portosaurus project, Use init command

> [!TIP] Prequistes:
>
> We Recommend **Bun** instead of Nodejs for running/bundling site.  
> Install [bun]({{meta.tools.bun}}) to get faster CLI experience

### With Interactive Prompt (Recommended)

This will start an interactive prompt to configure your site, then pull necessary dependencies

```bash
# Using Bun (recommended)
bunx {{meta.pkg}} init

# Or using npm
npx {{meta.pkg}} init
```

### Not Interactive Mode

This is useful for using with scripts.

Note that If any flag is provided, {{meta.project.title}} enters **non-interactive mode**. Missing flags will use defaults (like `none` for VCS/Hosting) instead of prompting.

| Flag                   | Description                                                                     | Default              |
| ---------------------- | ------------------------------------------------------------------------------- | -------------------- |
| `-p`, `--vcs-provider` | VCS Provider name (`github`, `gitlab`, `codeberg`, `sourcehut` or `none`)       | `none`               |
| `-h`, `--hosting`      | Hosting Platform name (`github-pages`, `gitlab-pages`, `surge`, etc. or `none`) | `none`               |
| `-u`, `--username`     | Username for the chosen VCS provider                                            | `Git/OS Username`    |
| `-n`, `--name`         | Your Full Name for the portfolio title                                          | `Git Name / OS User` |
| `-k`, `--no-install`   | Skip automatic dependency installation                                          | `Enabled`            |

```bash
# Using Bun (recommended)
bunx {{meta.pkg}} init -p <github|gitlab|codeberg|sourcehut|none> -h <github-pages|surge|...|none> -u <username> -n "<your_name>"

# Or without hosting (skips CI/CD setup)
bunx {{meta.pkg}} init -p <github|gitlab|codeberg|sourcehut> -u <username> -n "<your_name>"

# If not using gh/gl/cb/sh
bunx {{meta.pkg}} init -n "<your_name>" my-site
```

## Content Architecture

Init will create your dir with following things:

```txt
my-site/
├── .github|.gitlab|.forgejo   # CI workflow for automated deployment
│   └── workflows/deploy.yml
├── blog                       # Blog
│   ├── authors.yml
│   └── welcome.md
├── notes                      # Notes
│   ├── index.mdx
│   └── welcome.mdx
├── static                     # Assets
├── config.yml                 # Config File
├── package.json               # Project Package.json
└── README.md                  # Project Readme
```

Organize your knowledge base and blog using standard Markdown/MDX:

- **`notes/`**: Add Your Notes here.
- **`blog/`**: Blog, Articles, & Daily Updates.
- **`static/`**: All Assets, images, pdfs etc. will be accessible in website root.
- **`config.yml`**: Configuration file

## Launch the Dev Server

Start the development server for your site with Hot Module Replacement (HMR) enabled:

```bash
# Using Bun (recommended)
bunx {{meta.pkg}} dev

# Or using Npm
npx {{meta.pkg}} dev
```

The local site will be live at `http://localhost:3000`.
