# Configuration

You can customize the behaviour, data of your portfolio using `config.yaml`. It serves as the master source of truth for your site.

## Custom Variables

Use the `custom` block to define any key-value pairs that you wish to reference in your content using the `\{{custom.key}}` syntax.

## Reference

Below is complete list of all possible configuration options.

### Global Settings

| Key                     | Type      | Default                | Description                                                   |
| :---------------------- | :-------- | :--------------------- | :------------------------------------------------------------ |
| `title`                 | `string`  | `"Your Name"`          | The title of your portfolio site.                             |
| `tagline`               | `string`  | `"Your Profession..."` | A short tagline for the site metadata.                        |
| `dark_mode`             | `boolean` | `true`                 | Toggle the premium dark interface.                            |
| `site_url`              | `string`  | `auto`                 | Canonical URL (supports `auto` for CI/CD).                    |
| `site_path`             | `string`  | `auto`                 | Base path for nested deployments. (supports `auto` for CI/CD) |
| `robots_txt`            | `boolean` | `true`                 | Automatically generate a `robots.txt` file.                   |
| `favicon`               | `string`  | `(default icon)`       | Path to your site's favicon.                                  |
| `social_card`           | `string`  | `(default img)`        | Preview image for social media sharing.                       |
| `collapsable_sidebar`   | `boolean` | `true`                 | Allow the sidebar to be collapsed.                            |
| `hide_navbar_on_scroll` | `boolean` | `true`                 | Auto-hide the navbar when scrolling down.                     |
| `disable_theme_switch`  | `boolean` | `false`                | Lock the theme to the `dark_mode` setting.                    |
| `rss`                   | `boolean` | `true`                 | Enable RSS and Atom feeds for the blog.                       |
| `cors_proxy`            | `array`   | `[]`                   | List of custom CORS proxies to allow.                         |

### Hero Section

Primary entry point for your visitors. Nested under the `hero_section:` block.

| Key                     | Type     | Default              | Description                           |
| :---------------------- | :------- | :------------------- | :------------------------------------ |
| `title`                 | `string` | `"Your Name"`        | Your name as displayed in the hero.   |
| `intro`                 | `string` | `"Hello there, I'm"` | Greeting text before the name.        |
| `subtitle`              | `string` | `"I am a"`           | Text displayed above your profession. |
| `profession`            | `string` | `"Your Profession"`  | Your primary professional title.      |
| `description`           | `string` | `(placeholder text)` | A descriptive tagline or short bio.   |
| `learn_more_button_txt` | `string` | `"Learn More"`       | Text for the primary CTA button.      |
| `profile_pic`           | `string` | `(default icon)`     | Path to your main profile image.      |

### About Me

The professional biography section. Nested under the `about_me:` block.

| Key           | Type      | Default | Description                                 |
| :------------ | :-------- | :------ | :------------------------------------------ |
| `enable`      | `boolean` | `true`  | Toggle the "About Me" section.              |
| `image`       | `string`  | `null`  | Optional image (falls back to profile pic). |
| `description` | `array`   | `[...]` | Multi-paragraph bio as a list of strings.   |
| `skills`      | `array`   | `[...]` | List of technical skills or keywords.       |
| `resume_link` | `string`  | `""`    | Link to your professional resume/CV.        |

### Project Shelf

The curated work showcase. Nested under the `project_shelf:` block.

| Key        | Type      | Default | Description                                   |
| :--------- | :-------- | :------ | :-------------------------------------------- |
| `enable`   | `boolean` | `true`  | Toggle the curated projects showcase.         |
| `projects` | `array`   | `[]`    | List of project objects (see Projects guide). |

### Experience

The professional career timeline. Nested under the `experience:` block.

| Key      | Type      | Default | Description                       |
| :------- | :-------- | :------ | :-------------------------------- |
| `enable` | `boolean` | `false` | Toggle the professional timeline. |
| `list`   | `array`   | `[]`    | List of experience objects.       |

### Social Links

External platform connections. Nested under the `social_links:` block.

| Key      | Type      | Default | Description                      |
| :------- | :-------- | :------ | :------------------------------- |
| `enable` | `boolean` | `true`  | Toggle social media icon links.  |
| `links`  | `array`   | `[]`    | List of social platform objects. |

### Tasks Page

Public task and goal tracking. Nested under the `tasks_page:` block.

| Key           | Type      | Default              | Description                           |
| :------------ | :-------- | :------------------- | :------------------------------------ |
| `enable`      | `boolean` | `false`              | Toggle the public task tracking page. |
| `title`       | `string`  | `"Tasks"`            | The heading for the tasks page.       |
| `description` | `string`  | `(placeholder text)` | Subtitle for the tasks page.          |
| `tasks`       | `array`   | `[]`                 | List of task objects to display.      |

### Link Shortener

Configure internal link shortner powered by [StaticShort]({{meta.tools.staticShort}})

| Key           | Type      | Default | Description                         |
| :------------ | :-------- | :------ | :---------------------------------- |
| `enable`      | `boolean` | `false` | Toggle the internal link shortener. |
| `deploy_path` | `string`  | `"/l"`  | Base path for shortened links.      |
| `short_links` | `object`  | `{}`    | Map of slugs to target URLs.        |
