<div align="center">
    <img src="./static/img/icon.png" width=150>
    <h1>Postosaurus</h1>
    <h2>Your complete portfolio solution</h1>
    <p>Portosaurus is a complete portfolio cum personal website sulution with various features like notes, blog, tasks etc.</p>
</div>

<br/>


## 🧩 Features

- **📝 Full-featured Portfolio Site** — Showcase your work, skills, and experience with a modern, responsive design
- **🎨 Beautiful UI** — Responsive design with Catppuccin color scheme inspiration
- **🖼️ Project Showcase** — Interactive project cards with support for featured projects, project status badges, and tags
- **📚 Knowledge Base** — Integrated notes system with custom icons and categorization
- **✏️ Blog Platform** — Built-in blogging capabilities powered by Docusaurus
- **📋 Task Tracking** — Development roadmap with priority levels and completion status
- **🛠️ Highly Configurable** — Extensive customization options in a central config file
- **🧩 Modular Structure** — Includes Hero, About, Projects, Experience, and Contact sections
- **🔍 Powerful Search** — Integrated search functionality for notes and blog content
- **📱 Mobile-Friendly** — Fully responsive design works on all devices
- **🚀 Easy Deployment** — Ready for GitHub Pages or any static hosting


## 📁 Project Structure

As this project is built upon docusaurus, it follows it's guidelines.

```
./
├── blog/
│   ├── ...
│   └── My mindset 
├── notes/
│   ├── ...
│   ├── sidebars.js
│   └── Self written notes, accessiable in /notes
├── src/
│   ├── components/
│   ├── css/
│   ├── pages/
│   │   ├─ ...
│   │   ├── index.js - entry point
│   │   └── holds standalone pages
│   └── ...
├── static/
│   ├── img/
│   ├── ...
│   └── static files
├── config.js
├── docusaurus.config.js
└── package.json
```

## 📤 Deployment

Portosaurus is designed to be deployed on any static site hosting service.

>[!NOTE]
> For GitHub pages, the [workflow](./.github/workflows/deploy.yml) will automatically build & deploy.  
> Only manually enabling pages from settings is needed.  

1. Build the production version:

    ```bash
    npm run build
    ```

2. Deploy using:

    ```bash
    npm run deploy
    ```

## 💻 Development

- Run the local development server:

    ```bash
    npm run start
    ```

- Build the website:

    ```bash
    npm run build
    ```

- Serve the built website locally:

    ```bash
    npm run serve
    ```

## 📄 Credits

- [Docusaurus](https://docusaurus.io/) - The builder framework this portfolio is built upon.
- [React](https://react.dev) - UI library for building the interactive components.
- [React Icons](https://react-icons.github.io/) - Icon library used throughout the site.
- Libraries listed in [package.json](./package.json) - Essential dependencies for the project.
- [Hugo Profile](https://hugo-profile.netlify.app/) - Design inspiration.
- [Catppuccin](https://github.com/catppuccin/catppuccin) - Color scheme that inspired the site's palette.
- [Deepseek R1](https://www.deepseek.com/) hosted using [Ollama](https://ollama.com/library/deepseek-r1) - prism.js theme & project card component.
- Countless Internet forum posts - Filling me with information.
