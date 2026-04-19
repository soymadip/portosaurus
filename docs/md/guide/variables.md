# Dynamic Variables

{{meta.project.title}} allows you to use placeholders in your `config.yaml` or markdown files that are resolved at build time.

## Syntax

Use double curly braces to reference a variable: `{{variable_name}}`.

## Available Variables

### System Variables

- `\{{portoVersion}}`: Current {{meta.project.title}} version.
- `\{{compileYear}}`: Year at build time (e.g. {{compileYear}}).
- `\{{compileDate}}`: Date at build time.

### Environment Variables

Access any system environment variable using the `env:` prefix:

```yaml
footer_text: "Built with love on \{{env:HOSTNAME}}"
```

## Custom Variables

You can define your own variables in the `custom:` block of your `config.yaml` and reference them elsewhere:

```yaml
custom:
  twitter_handle: "@myname"

hero_section:
  description: "Follow me on Twitter: \{{custom.twitter_handle}}"
```

## Literals & Escaping

If you want to display the literal `{{variable_name}}` without it being resolved, prefix the first brace with a backslash: `\{{variable_name}}`.
