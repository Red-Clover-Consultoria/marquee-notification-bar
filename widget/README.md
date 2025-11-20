# Marquee Notification Bar Widget

Standalone widget version of the Marquee Notification Bar for Koru App Manager and general web usage.

## Installation

### Via npm

```bash
npm install @redcloverqa/marquee-notification-bar-widget
```

### Via CDN (Script Tag)

```html
<script
  src="https://cdn.example.com/marquee-widget.min.js"
  data-messages='[{"text":"Free shipping on orders over $50","icon":"🚚","iconPosition":"left"}]'
  data-separator="•"
  data-background-color="#000000"
  data-text-color="#ffffff"
  data-font-size="14px"
  data-speed="normal"
  data-pause-on-hover="true"
  data-show-marquee="true"
></script>
```

## Usage

### Automatic Initialization (Script Tag)

The widget will automatically initialize when loaded via script tag with data attributes:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Marquee Widget Example</title>
</head>
<body>
  <script
    src="./dist/marquee-widget.min.js"
    data-messages='[
      {"text":"3 CUOTAS SIN INTERÉS desde $60.000","icon":"🎉","iconPosition":"left"},
      {"text":"ENVÍO GRATIS en compras mayores a $80.000","icon":"🚚","iconPosition":"left"},
      {"text":"20% OFF en segunda unidad","icon":"💰","iconPosition":"left"}
    ]'
    data-separator="•"
    data-background-color="#000000"
    data-text-color="#ffffff"
    data-font-size="14px"
    data-speed="normal"
    data-position="top"
  ></script>

  <!-- Your page content -->
  <h1>Welcome to our store!</h1>
</body>
</html>
```

### Programmatic Usage (JavaScript)

```javascript
import { createWidget } from '@redcloverqa/marquee-notification-bar-widget'

// Create widget instance
const widget = createWidget({
  containerId: 'my-marquee',
  position: 'top',
  messages: [
    {
      text: 'Free shipping on orders over $50',
      icon: '🚚',
      iconPosition: 'left'
    },
    {
      text: 'New arrivals every week',
      icon: '✨',
      iconPosition: 'left'
    }
  ],
  separator: '|',
  backgroundColor: '#f5f5f5',
  textColor: '#333333',
  fontSize: '14px',
  speed: 'normal',
  pauseOnHover: true,
  showMarquee: true
})

// Initialize and render
await widget.onInit()
widget.onRender()

// Update configuration later
widget.onConfigUpdate({
  backgroundColor: '#ff0000',
  textColor: '#ffffff'
})

// Cleanup when done
widget.onDestroy()
```

## Configuration Options

### Data Attributes (Script Tag)

| Attribute | Type | Description | Default |
|-----------|------|-------------|---------|
| `data-messages` | JSON | Array of message objects | `[]` |
| `data-separator` | string | Character to separate messages | `"•"` |
| `data-background-color` | string | Hex color for background | `"#f5f5f5"` |
| `data-text-color` | string | Hex color for text | `"#333333"` |
| `data-font-size` | string | Font size (12px, 14px, 16px, 18px) | `"14px"` |
| `data-speed` | string | Animation speed (slow, normal, fast) | `"normal"` |
| `data-pause-on-hover` | boolean | Pause on mouse hover | `true` |
| `data-show-marquee` | boolean | Enable marquee animation | `true` |
| `data-container-id` | string | Container element ID | `"marquee-notification-bar"` |
| `data-position` | string | Position (top, bottom) | `"top"` |

### Message Object Structure

```javascript
{
  text: string,        // Message content
  icon?: string,       // Emoji or image URL
  iconPosition?: 'left' | 'right'  // Icon position
}
```

## Development

### Build from Source

```bash
# Install dependencies
npm install

# Development build with watch
npm run watch

# Production build
npm run build

# Serve with hot reload
npm run serve
```

### Build Output

The build process generates multiple formats:

- `dist/marquee-widget.js` - UMD build (development)
- `dist/marquee-widget.min.js` - UMD build (minified)
- `dist/marquee-widget.esm.js` - ESM build
- `dist/index.d.ts` - TypeScript definitions

### Project Structure

```
widget/
├── src/
│   ├── core/              # Shared business logic
│   │   ├── types.ts
│   │   └── MarqueeCore.ts
│   ├── MarqueeWidget.ts   # Main widget class
│   ├── styles.css         # Widget styles
│   └── index.ts           # Entry point
├── dist/                  # Build output
├── package.json
├── tsconfig.json
├── webpack.config.js
└── README.md
```

## Integration with Koru App Manager

This widget is designed to work seamlessly with Koru App Manager. To integrate:

1. Upload the built widget to your CDN
2. Configure the app in Koru dashboard
3. Add configuration via Koru's admin interface
4. The widget will automatically load on configured websites

## Browser Support

- Chrome 51+
- Firefox 54+
- Safari 10+
- Edge 15+

Requires ES2015+ support and modern DOM APIs.

## Examples

See the `examples/` directory for complete usage examples:

- `basic.html` - Simple integration with script tag
- `programmatic.html` - Interactive demo with real-time configuration controls

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- GitHub: https://github.com/Red-Clover-Consultoria/marquee-notification-bar
- Email: support@redclover.com
