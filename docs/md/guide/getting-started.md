# Getting Started


## Initialization

We will be creating new project **`<yourUsername>.github.io`** (`YourUsername` is your github username). In Github, this repo is a special repo that becomes your github pages url.


Bootstrap your project directory using the CLI

```bash
bunx {{meta.pkg}} init yourUsername.github.io   # you can use npx too
cd yourUsername.github.io
```

This will create your dir with following things:

```txt
soymadip.gitub.io
├── .github           # Github CI workflow for automated deployment
├── blog              # Blog files
│   ├── authors.yml
│   └── welcome.md
├── notes             # Notes
│   ├── index.mdx
│   └── welcome.mdx
├── static            # Assets, will be accessable in website root
├── config.yml        # Config file
├── package.json      # Standard js package.json
└── README.md         # Project Readme
```



## Launch the Dev Server

Start the development server for your site with Hot Module Replacement (HMR) enabled by default:

```bash
bunx {{meta.pkg}} dev  # or npx {{meta.pkg}} dev
```

The engine will be listening at `http://localhost:3000`.

## Configuration

All site metadata, theme toggles, and feature flags are managed via **`config.yaml`**.

For full configuration options go [here](./config.md)

## Content Architecture

Organize your knowledge base and blog using standard Markdown/MDX:

- **`notes/`**: The primary knowledge repository.
- **`blog/`**: Chronological articles and updates.

## 5. Production Compilation

When your project is ready for deployment, compile the static bundle:

```bash
bunx {{meta.pkg}} build
```

This generates a high-performance static site in the `build/` directory, ready for any modern host.
