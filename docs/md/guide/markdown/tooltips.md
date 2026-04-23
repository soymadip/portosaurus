# Tooltips

Add interactive hints to any text or element using the `<Tooltip />` component.

## Usage

```jsx
You can hover over this <Tooltip msg="Surprise!" underline>text</Tooltip> to see a tooltip.
```

## Props

| Prop        | Type      | Default | Description                                                                               |
| :---------- | :-------- | :------ | :---------------------------------------------------------------------------------------- |
| `msg`       | `string`  | `null`  | **(Required)** The text content to show inside the tooltip.                               |
| `position`  | `string`  | `"top"` | Position of the tooltip relative to the child (`top`, `bottom`, `left`, `right`).         |
| `underline` | `boolean` | `true`  | If `true`, adds a subtle dotted underline to the child element to indicate interactivity. |
| `color`     | `string`  | `null`  | Custom text color for the tooltip.                                                        |
| `bg`        | `string`  | `null`  | Custom background color for the tooltip.                                                  |
| `gap`       | `number`  | `5`     | Distance in pixels between the element and the tooltip.                                   |
| `shadow`    | `string`  | `null`  | Custom CSS shadow for the tooltip.                                                        |
