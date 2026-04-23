# Configuration Guide

You can customize the behavior and data of your portfolio using `config.yml`. This file serves as the master source of truth for your site, controlling everything from SEO metadata to the content of individual sections.

## Top-Level Structure

The configuration is divided into several main blocks that map directly to the root keys in your `config.yml`:

- **`site`**: Metadata, SEO, and global site settings.
- **`theme`**: Visual appearance and navigation behavior.
- **`home_page`**: Content for the primary sections of your site.
- **`tasks`**: Public roadmap and goal tracking.
- **`tools`**: Functional utilities like link shorteners.
- **`custom`**: User-defined variables for re-use.

## `site`

The `site` block contains global settings for your site identity and SEO. This information is used to generate meta tags, site titles, and social sharing previews.

| Key                  | Type      | Default          | Description                                                      |
| :------------------- | :-------- | :--------------- | :--------------------------------------------------------------- |
| `title`              | `string`  | `"Your Name"`    | The name displayed in the browser tab and site headers.          |
| `tagline`            | `string`  | `"Short bio..."` | A brief description used for SEO meta tags.                      |
| `favicon`            | `string`  | `(default icon)` | Path to your site's favicon.                                     |
| `social_card`        | `string`  | `(default img)`  | Preview image used when sharing your site on social media.       |
| `url`                | `string`  | `"auto"`         | Canonical URL. Use `auto` for automatic CI/CD detection.         |
| `path`               | `string`  | `"auto"`         | Base path for sub-directory deployments.                         |
| `on_broken_links`    | `string`  | `"throw"`        | Behavior when a link is broken (`throw`, `warn`, `ignore`).      |
| `on_missing_anchors` | `string`  | `"throw"`        | Behavior when a link anchor (#) is missing.                      |
| `robots_txt`         | `boolean` | `true`           | Automatically generate a `robots.txt` file.                      |
| `rss`                | `boolean` | `true`           | Enable RSS and Atom feeds for the blog.                          |
| `head_tags`          | `array`   | `[]`             | Custom HTML tags to inject into `<head>` (see Advanced section). |
| `cors_proxy`         | `array`   | `[]`             | Custom CORS proxies for image loading (see Advanced section).    |

## `theme`

The `theme` block controls the visual appearance and navigation behavior of your portfolio. It allows you to toggle dark mode, customize the sidebar, and enable advanced Markdown features.

### `appearance`

Settings related to the visual theme and mode switching.

| Key              | Type      | Default | Description                       |
| :--------------- | :-------- | :------ | :-------------------------------- |
| `dark_mode`      | `boolean` | `true`  | Enable the dark theme by default. |
| `disable_switch` | `boolean` | `false` | Hide the dark/light mode toggle.  |

### `navigation`

Settings for the site's navigation components.

| Key                     | Type      | Default | Description                                        |
| :---------------------- | :-------- | :------ | :------------------------------------------------- |
| `collapsable_sidebar`   | `boolean` | `true`  | Allow users to collapse the side navigation.       |
| `hide_navbar_on_scroll` | `boolean` | `true`  | Automatically hide the navbar when scrolling down. |

### `markdown`

Fine-tune the behavior of the Markdown renderer and documentation features.

| Key                | Type      | Default   | Description                             |
| :----------------- | :-------- | :-------- | :-------------------------------------- |
| `on_broken_links`  | `string`  | `"throw"` | MD-specific broken link behavior.       |
| `on_broken_images` | `string`  | `"throw"` | MD-specific broken image behavior.      |
| `mermaid`          | `boolean` | `true`    | Enable support for Mermaid.js diagrams. |

## `home_page`

The `home_page` block contains the content for the primary sections of your site. This is where you define your hero banner, about text, project showcase, and more.

### `hero`

The hero section is the first thing visitors see. It should provide a clear and concise introduction to who you are.

| Key                  | Type     | Default               | Description                                 |
| :------------------- | :------- | :-------------------- | :------------------------------------------ |
| `title`              | `string` | `{{site.title}}`      | The main heading (defaults to site title).  |
| `profession`         | `string` | `"Software Engineer"` | Your professional title.                    |
| `description`        | `string` | `{{site.tagline}}`    | A short bio or mission statement.           |
| `profile_pic`        | `string` | `(default icon)`      | Path to your main profile image.            |
| `intro`              | `string` | `"Hello there, I'm"`  | Small greeting text above the title.        |
| `subtitle`           | `string` | `"I am a"`            | Text displayed above your profession.       |
| `learn_more_btn_txt` | `string` | `"Learn More"`        | Text for the primary call-to-action button. |

### `about`

The about section allows you to provide a more detailed biography and list your technical skills.

| Key              | Type      | Default       | Description                                     |
| :--------------- | :-------- | :------------ | :---------------------------------------------- |
| `enable`         | `boolean` | `true`        | Toggle the About section.                       |
| `heading`        | `string`  | `"About Me"`  | Heading for the about section.                  |
| `image`          | `string`  | `null`        | Optional bio image (falls back to profile pic). |
| `bio`            | `array`   | `[...]`       | List of strings, each rendered as a paragraph.  |
| `skills_heading` | `string`  | `"My Skills"` | Heading for the technical skills section.       |
| `skills`         | `array`   | `[]`          | List of skills to display as badges.            |
| `resume`         | `string`  | `null`        | Link to your resume/CV file.                    |

### `project_shelf`

The project shelf is a curated showcase of your best work. You can feature specific projects to give them more prominence.

| Key        | Type      | Default | Description                                 |
| :--------- | :-------- | :------ | :------------------------------------------ |
| `enable`   | `boolean` | `true`  | Toggle the project showcase.                |
| `projects` | `array`   | `[]`    | List of project objects (see schema below). |

**Project Object Schema:**

| Key        | Type      | Default            | Description                                                                                                                                |
| :--------- | :-------- | :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| `title`    | `string`  | `"Future Project"` | Name of the project.                                                                                                                       |
| `img`      | `string`  | `(blank icon)`     | Path to project thumbnail. Supports internal paths using `{{portoRoot}}` (e.g., `{{portoRoot}}/src/assets/img/icon.png`) or external URLs. |
| `state`    | `string`  | `"active"`         | Project status badge (`active`, `completed`, `maintenance`, `paused`, `archived`, `planned`). Rendered as a themed pill in the top-right.  |
| `featured` | `boolean` | `false`            | If true, the project gets a prominent border and is **automatically sorted to the beginning** of the carousel.                             |
| `desc`     | `string`  | `"Coming soon..."` | Brief description of the project and tech stack.                                                                                           |
| `tags`     | `array`   | `[]`               | Tech keywords (e.g., `["React", "Node"]`). Displayed as micro-glass pills inside the image container.                                      |
| `website`  | `string`  | `null`             | URL to the live website or production version.                                                                                             |
| `repo`     | `string`  | `null`             | URL to the source code repository (e.g., GitHub).                                                                                          |
| `demo`     | `string`  | `null`             | URL to a live demo or interactive preview.                                                                                                 |

### `experience`

The experience section provides a timeline of your professional career, education, or other milestones.

| Key      | Type      | Default | Description                                          |
| :------- | :-------- | :------ | :--------------------------------------------------- |
| `enable` | `boolean` | `false` | Toggle the experience timeline.                      |
| `list`   | `array`   | `[]`    | List of career milestone objects (see schema below). |

**Experience Object Schema:**

| Key        | Type     | Default | Description                                        |
| :--------- | :------- | :------ | :------------------------------------------------- |
| `company`  | `string` | `null`  | Name of the organization.                          |
| `role`     | `string` | `null`  | Your job title.                                    |
| `duration` | `string` | `null`  | Time period (e.g., "2022 - Present").              |
| `desc`     | `string` | `null`  | Summary of your responsibilities and achievements. |

### `social`

Manage your social media presence and contact links. These are usually displayed in the footer or social section.

| Key      | Type      | Default | Description                                         |
| :------- | :-------- | :------ | :-------------------------------------------------- |
| `enable` | `boolean` | `true`  | Toggle social media links.                          |
| `links`  | `array`   | `[]`    | List of social platform objects (see schema below). |

**Social Link Schema:**

| Key    | Type     | Default | Description                                          |
| :----- | :------- | :------ | :--------------------------------------------------- |
| `name` | `string` | `null`  | Name of the platform (e.g., "GitHub").               |
| `icon` | `string` | `null`  | Icon identifier (supports FontAwesome/Lucide names). |
| `link` | `string` | `null`  | URL to your profile.                                 |

## `tasks`

The `tasks` block powers a public roadmap and goal tracking system. It allows you to share what you're working on and your progress with your audience.

| Key           | Type      | Default         | Description                              |
| :------------ | :-------- | :-------------- | :--------------------------------------- |
| `enable`      | `boolean` | `true`          | Toggle the public tasks page.            |
| `title`       | `string`  | `"Tasks"`       | Heading for the tasks page.              |
| `description` | `string`  | `(placeholder)` | Sub-heading for the page.                |
| `list`        | `array`   | `[]`            | List of task objects (see schema below). |

**Task `list` Object Schema:**

| Key      | Type     | Default  | Description                                       |
| :------- | :------- | :------- | :------------------------------------------------ |
| `title`  | `string` | `null`   | Short name of the task.                           |
| `status` | `string` | `"todo"` | Current progress (`done`, `todo`, `in-progress`). |
| `desc`   | `string` | `null`   | Optional details about the task.                  |

## `tools`

The `tools` block includes functional utilities that enhance your portfolio's capabilities, such as a built-in link shortener.

### `link_shortener`

A built-in utility to create short, memorable URLs that redirect to external sites.

| Key           | Type      | Default | Description                            |
| :------------ | :-------- | :------ | :------------------------------------- |
| `enable`      | `boolean` | `false` | Toggle the internal link shortener.    |
| `deploy_path` | `string`  | `"/l"`  | URL base path for redirects.           |
| `short_links` | `object`  | `{}`    | Key-value map of slugs to target URLs. |

## `custom`

Define any key-value pairs in the `custom` block to reference them throughout your content using the `{{custom.key}}` syntax. This is useful for centralizing information like usernames or common links.

```yaml
custom:
  github: "yourusername"
  twitter: "@yourhandle"
```

## Advanced Configuration

### Custom Head Tags

Inject HTML directly into `<head>`. Useful for analytics, custom fonts, or verification tags.

```yaml
site:
  head_tags:
    - meta:
        name: "description"
        content: "Custom SEO description"
    - script:
        src: "https://example.com/script.js"
        async: true
```
