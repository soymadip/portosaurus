<div align="center">
    <img src="https://raw.githubusercontent.com/soymadip/portosaurus/refs/heads/code/static/img/icon.png" width=150>
    <h1>Portosaurus</h1>
    <p>Complete portfolio cum personal website solution for your digital personality.</p>
</div>


<br/>

## 🧩 Features

- **📝 Full-featured Portfolio Site** — Showcase your work, skills, experience, social identity.
- **🎨 Beautiful UI** — Responsive design with Catppuccin color scheme.
- **🖼️ Project Showcase** — Interactive project cards with support for featured projects, project status badges, and tags
- **📚 Knowledge Base** — Integrated notes system with custom icons and categorization
- **✏️ Blog Platform** — Built-in blogging capabilities.
- **📋 Task Tracking** — Track your plans with priority levels and completion status
- **🛠️ Highly Configurable** — Extensive customization options in a central config file
- **🔍 Powerful Search** — Integrated search functionality for notes and blog content
- **📱 Mobile-Friendly** — Fully responsive design works on all devices
- **🚀 Auto Deployment** — Ready for GitHub Pages or any static hosting


<br/>

## 📤 Deployment

> [!WARNING]
> **Beta Notice:**  
> Portosaurus is currently in its beta phase.  
> Expect frequent updates and breaking changes.   

There are several ways get Portosaurus up and running.


### 1. GitHub Pages

GitHub provides free hosting service for static sites like these in [GitHub Pages](https://pages.github.com).  

Here are the steps:

1. Use the `use this template` button at top right corner & choose `Create a new repository` option.
2. In the following page, name the new repository `<your_username>.github.io` (like for me it's `soymadip.github.io`).
3. In the newly created repository, Go to `settings` > `Pages` > `Build and deployment` > `Source` & select `GitHub Actions` from the dropdown.
4. Now edit the [`config.js`](./config.js) with appropriate details.

The site should be up and running after a few minutes.


### 2. Manual building

Also you can compile the source code & manually upload/host with your preferred hosting service.

In your terminal, paste these commands:-

```bash
git clone https://github.com/soymadip/portosaurus
cd portosaurus 
bash .github/compile.sh
```
This will compile the site and put them in `build` dir.

<br>


## ⚙️ Configuration

> [!NOTE]  
> Configuration instructions will be added slowly.

<br>


## 💻 Development

- This branch is used as template to create new repos to hold content.
- Go to [`code`](https://github.com/soymadip/portosaurus/tree/code) branch for actual source code and development info.


## 📄 Credits

- [Docusaurus](https://docusaurus.io/) - The static site builder framework this is built upon.
- [React](https://react.dev) - UI library for building the interactive components.
- [React Icons](https://react-icons.github.io/) - Icon library used throughout the site.
- Libraries listed in [package.json](https://github.com/soymadip/portosaurus/blob/code/package.json#L16) - Essential dependencies.
- [Hugo Profile](https://hugo-profile.netlify.app/) - Design inspiration.
- [Catppuccin](https://github.com/catppuccin/catppuccin) - Color scheme that inspired the site's palette.
- [Deepseek R1](https://www.deepseek.com/) hosted using [Ollama](https://ollama.com/library/deepseek-r1) - prism.js theme & project card component.
- Countless Internet forum posts - Filling me with information.
