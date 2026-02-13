<br>
<div align="center">
    <img src="https://raw.githubusercontent.com/soymadip/portosaurus/refs/heads/compiler/static/img/icon.png" width=90>
    <h1>My Portfolio Site</h1>
    <p>
        Complete portfolio cum personal website for my digital personality
        <br>
        <small>Made with <a href="https://github.com/soymadip/portosaurus">Portosaurus</a></small>
    </p>
</div>

## Project Structure

```
.
├── config.js          # Site configuration
├── blog/              # Blog posts    (Markdown/MDX)
├── notes/             # Documentation (Markdown/MDX)
├── static/            # Static assets (images, files, binaries)
└── package.json       # Dependencies
```

## Configuration

Edit [`config.js`](./config.js) to customize your site. See the [Portosaurus documentation](https://github.com/soymadip/portosaurus#configuration) for all available options.

## Development

Start the development server:

```bash
# With Bun
bun run dev

# With npm
npm run dev
```

The site will be available at `http://localhost:3000`.

## Build & Deploy

### GitHub Pages

1. Create a repository on GitHub named `yourUsername.github.io`.
2. Go to the repo's `Settings` > `Pages` > `Build and deployment` > `Source` > **`GitHub Actions`**.
3. Push your code:
   ```bash
   git remote add origin https://github.com/yourUsername/yourUsername.github.io.git
   git branch -M main
   git push -u origin main
   ```

### Other Providers

A portosaurus project can be deployed to any static hosting provider like:

- Netlify
- Vercel
- Cloudflare pages
- Other static providers

To generate the static site for production:

```bash
# With Bun
bun run build

# With npm
npm run build
```

The output will be in the `build/` directory.

---

<div align="center">

Made with [Portosaurus](https://github.com/soymadip/portosaurus)

<br>
</div>
