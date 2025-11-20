# Marquee Notification Bar Widget

Standalone widget version of the Marquee Notification Bar for Koru App Manager and general web usage.

## Installation

### Via npm

```bash
npm install @redcloverqa/marquee-notification-bar-widget
```

### Via CDN (Script Tag) - Koru Integration

```html
<script
  src="https://cdn.example.com/marquee-widget.min.js"
  data-website-id="your-website-id"
  data-app-id="marquee-notification-bar"
  data-app-manager-url="https://app-manager.redclover.com.ar"
></script>
```

**Note:** Configuration (messages, colors, etc.) is managed through the Koru App Manager dashboard, not via data attributes.

## Usage

### Automatic Initialization with Koru SDK

The widget automatically initializes when loaded via script tag with Koru credentials:

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
    data-website-id="your-website-id"
    data-app-id="marquee-notification-bar"
    data-app-manager-url="https://app-manager.redclover.com.ar"
  ></script>

  <!-- Your page content -->
  <h1>Welcome to our store!</h1>
</body>
</html>
```

**Configuration is managed through Koru App Manager:**
1. Log into your Koru dashboard
2. Configure messages, colors, speed, and other settings
3. The widget automatically fetches and applies the configuration

### Programmatic Usage (Advanced)

For advanced use cases, you can access the widget instance:

```javascript
import { MarqueeNotificationBarWidget } from '@redcloverqa/marquee-notification-bar-widget'

// Create and start widget instance
const widget = new MarqueeNotificationBarWidget()
await widget.start()

// Control widget lifecycle
await widget.stop()   // Stop and cleanup
await widget.reload() // Refresh configuration from Koru

// Access widget state
console.log(widget.isRunning())
```

**Note:** Configuration is always fetched from Koru App Manager, not passed programmatically.

## Configuration Options

### Required Data Attributes (Koru Integration)

| Attribute | Type | Description | Required |
|-----------|------|-------------|----------|
| `data-website-id` | string | Your Koru website ID | ✅ Yes |
| `data-app-id` | string | App identifier: `marquee-notification-bar` | ✅ Yes |
| `data-app-manager-url` | string | Koru App Manager URL | ✅ Yes |

### Configuration (via Koru Dashboard)

All widget configuration is managed through the Koru App Manager dashboard:

- **Messages**: Text, icons, and icon position
- **Styling**: Background color, text color, font size
- **Animation**: Speed (slow, normal, fast), pause on hover
- **Behavior**: Enable/disable marquee, position (top/bottom)
- **Container**: Custom container ID

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
