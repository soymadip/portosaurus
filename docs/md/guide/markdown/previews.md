# Interactive Previews

Portosaurus provides a powerful interactive preview system using the `<Pv />` component. This allows you to embed links that, when clicked, open a persistent preview window for images, PDFs, external websites, or source code.

## The `<Pv />` Component

The `<Pv />` component is available globally in all your Markdown and MDX files.

### Basic Usage

The simplest way to use it is by wrapping a link or text:

```jsx
Check out my resume: <Pv href="/resume.pdf">View PDF</Pv>
```

### Advanced Parameters

You can customize the preview behavior using various props:

| Prop        | Type      | Description                                                     |
| :---------- | :-------- | :-------------------------------------------------------------- |
| `href`      | `string`  | The path or URL of the file to preview.                         |
| `title`     | `string`  | Custom title for the window header. Overrides filename/label.   |
| `modal`     | `boolean` | If `true`, opens as a centered pop-up with a themed backdrop.   |
| `docked`    | `boolean` | If `true`, pins the window to the side upon opening.            |
| `desc`      | `string`  | Optional description that appears as a tooltip on hover.        |
| `id`        | `string`  | Custom slug for deep-linking (e.g., `#my-custom-id-pv:window`). |
| `activeIdx` | `number`  | The index of the file to show first (if using `sources`).       |

### Examples

#### 1. Centered Modal (Pop-up Mode)

Perfect for resumes or critical documents where you want to focus the user's attention.

```jsx
<Pv href="/resume.pdf" title="Professional Resume" modal>
  Preview My Resume
</Pv>
```

#### 2. Pinned Sidebar (Docked Mode)

Ideal for source code or documentation where you want to keep the main content visible alongside the preview.

```jsx
<Pv href="/main.js" docked>
  View Source Code
</Pv>
```

#### 3. Deep Linking

By default, Portosaurus generates a slug from your link text. You can override this:

```jsx
<Pv href="/design-spec.pdf" id="specs">
  Design Specifications
</Pv>
```

This link can be shared as `https://yoursite.com/#specs-pv:window`.

#### 4. Multiple Files (Tabbed View)

You can pass an array of sources to create a tabbed preview experience:

```jsx
<Pv
  title="Project Source"
  sources={[
    { path: "/src/main.js", label: "Logic" },
    { path: "/src/styles.css", label: "Styles" },
  ]}
>
  View Source Code
</Pv>
```

## The `<SrcPv />` Component

The `<SrcPv />` component is a specialized version of the preview trigger, often used in footers to list source files.

```jsx
<SrcPv
  prefixText="Resources: "
  sources={[
    { path: "https://github.com", label: "GitHub" },
    { path: "/local-file.txt", label: "Local Docs" },
  ]}
/>
```
