<div align="center">
    <img src="https://raw.githubusercontent.com/soymadip/portosaurus/refs/heads/code/static/img/icon.png" width=150>
    <h1>Portosaurus</h1>
    <p>Complete portfolio cum personal website solution for your digital personality.</p>
</div>



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


<br/>

## 📤 Deployment

There are several ways get portosaurus up and running.


### 1. GitHub Pages

GitHub provides free hosting service for static sites (like portosaurus).  

To host, we need to create a repository named `username.github.io`. The site will be live at `https://username.github.io/`.

Here are the steps:

1. Use the `use this template` button at top right corner & choose `Create a new repository` option.
2. In the following page, name the new repository `yourUsername.github.io`, like for me it's `soymadip.github.io`.
3. Now edit the [`config.js`](./config.js) with appropriate details.
4. Go to repo settings > `pages`> `Build and deployment`>`Branch` & select `gh-page` from the dropdown, hit save.

The site should be up and running after a few minutes.


### 2. Manual building

Also you can compile the source code & manually upload/host with your preferred hosting service.

In your terminal, paste these commands:-

```bash
git clone https://github.com/soymadip/portosaurus
cd portosaurus && git switch main
npm run build
```
This will compile the site and put them in `build` dir.


## 💻 Development

Source code can be found at `code` branch.

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
