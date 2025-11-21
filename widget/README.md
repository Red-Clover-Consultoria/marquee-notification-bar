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

All widget configuration is managed through the Koru App Manager dashboard. The configuration interface is automatically generated from `config-schema.json`.

**Configuration Schema**: See [`config-schema.json`](./config-schema.json) for complete field definitions, validations, and UI hints.

**Available Configuration Options:**

- **Messages (1-10)**: Up to 10 customizable messages with:
  - `messageN_text`: Message content (required for message 1)
  - `messageN_icon`: Emoji or image URL (optional)
  - `messageN_iconPosition`: Icon placement - `left` or `right` (default: `left`)

- **Styling**:
  - `backgroundColor`: Hex color for background (e.g., `#000000`)
  - `textColor`: Hex color for text (e.g., `#FFFFFF`)
  - `fontSize`: Text size - `12px`, `14px`, `16px`, or `18px`
  - `separator`: Character between messages (default: `•`)

- **Animation**:
  - `speed`: Scroll speed - `slow`, `normal`, or `fast`
  - `pauseOnHover`: Pause animation on mouse hover (default: `true`)
  - `showMarquee`: Enable/disable scroll animation (default: `true`)

- **Behavior**:
  - `position`: Widget placement - `top` or `bottom` (default: `top`)
  - `containerId`: Custom container ID for advanced usage (default: `marquee-notification-bar`)

### Message Object Structure

```javascript
{
  text: string,        // Message content
  icon?: string,       // Emoji or image URL
  iconPosition?: 'left' | 'right'  // Icon position
}
```

## Development

For detailed development instructions, architecture documentation, and best practices, see **[DEVELOPMENT.md](./DEVELOPMENT.md)**.

### Quick Start

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

### Key Development Files

- **`config-schema.json`**: Configuration schema for Koru App Manager UI
- **`src/MarqueeWidget.ts`**: Main widget class with Koru SDK integration
- **`src/core/MarqueeCore.ts`**: Business logic independent of Koru
- **`DEVELOPMENT.md`**: Complete development guide

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

1. **Upload widget and schema to your CDN:**
   ```bash
   npm run build
   # Upload dist/marquee-widget.min.js to CDN
   # Upload config-schema.json to CDN
   ```

2. **Configure the app in Koru dashboard:**
   - App ID: `marquee-notification-bar`
   - Widget URL: `https://your-cdn.com/marquee-widget.min.js`
   - Config Schema URL: `https://your-cdn.com/config-schema.json`

3. **Configure messages and styling** via Koru's admin interface

4. **Add to website** - The widget will automatically load with the script tag

### Configuration Validation

The widget includes comprehensive validation (see `MarqueeWidget.ts:90-178`):

- ✅ Validates at least one message is configured
- ✅ Checks all message text is non-empty
- ✅ Validates icon positions (`left` or `right`)
- ✅ Validates color formats (hex colors)
- ✅ Validates enum values (fontSize, speed, position)
- ❌ Throws descriptive errors for invalid configurations

Example error messages:
```
Widget configuration error: At least one message is required. Please configure message1_text in Koru App Manager.
Widget configuration error: backgroundColor must be a valid hex color (e.g., #000000)
Widget configuration error: speed must be one of slow, normal, fast
```

## Browser Support

- Chrome 51+
- Firefox 54+
- Safari 10+
- Edge 15+

Requires ES2015+ support and modern DOM APIs.

## Testing & Examples

### Testing with Koru

**`test.html`** - Main test page for development with Koru App Manager:
```bash
# Build the widget
npm run build

# Open test.html in browser (requires Koru backend running)
# http://localhost:8080/test.html
```

### Local Development

**`examples/local.html`** - Test widget locally without Koru backend using data attributes:
```html
<script
  src="./dist/marquee-widget.js"
  data-messages='[{"text":"Test message","icon":"🚀"}]'
  data-background-color="#0066cc"
></script>
```

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- GitHub: https://github.com/Red-Clover-Consultoria/marquee-notification-bar
- Email: support@redclover.com
