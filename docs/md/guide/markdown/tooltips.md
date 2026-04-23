# Tooltips

Add interactive hints to any text or element using the `<Tooltip />` component.

## Usage

```mdx
You can hover over this <Tooltip msg="Surprise!" underline>text</Tooltip> to see a tooltip.
```

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `msg` | `string` | `null` | **(Required)** The text content to show inside the tooltip. |
| `position` | `string` | `"top"` | Position of the tooltip relative to the child (`top`, `bottom`, `left`, `right`). |
| `underline` | `boolean` | `false` | If `true`, adds a subtle dotted underline to the child element to indicate interactivity. |
