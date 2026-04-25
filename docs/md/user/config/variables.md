# Dynamic Variables

{{meta.project.title}} allows you to use placeholders in your `config.yml` or markdown files that are resolved at build time.

## Syntax

Use double curly braces to reference a variable: `{{variable_name}}`.

## Available Variables

### System Variables

- `\{{portoVersion}}`: Current {{meta.project.title}} version.
- `\{{portoRoot}}`: Absolute path to the Portosaurus installation root. Crucial for referencing internal assets.
- `\{{compileYear}}`: Year at build time.
- `\{{compileDate}}`: Date at build time.

### Configuration References

You can reference values from the `site` block within other parts of your configuration:

- `\{{site.title}}`: Site title from the site block.
- `\{{site.tagline}}`: Site tagline from the site block.
- `\{{site.url}}`: Site URL from the site block.

### Environment Variables

Access any system environment variable using the `env:` prefix:

```yaml
footer_text: "Built with love on \{{env:HOSTNAME}}"
```

## Custom Variables

You can define your own variables in the `custom:` block of your `config.yml` and reference them elsewhere:

```yaml
custom:
  twitter_handle: "@myname"

hero_section:
  desc: "Follow me on Twitter: \{{custom.twitter_handle}}"
```

## Literals & Escaping

If you want to display the literal `\{{variable_name}}` without it being resolved, prefix the first brace with a backslash: `\\{{variable_name}}`.

**Note**: In `config.yml`, `\\` is required because `\` is an escape character in YAML itself. You must escape the backslash that escapes the brace.
