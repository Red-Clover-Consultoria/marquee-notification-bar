# Integration Guide - Marquee Notification Bar

This document provides quick integration guides for both VTEX IO and standalone widget implementations.

## Quick Start

### For VTEX IO Stores

If you're using VTEX IO Store Framework:

```bash
# Add to your theme's manifest.json
"dependencies": {
  "redcloverqa.marquee-notification-bar": "0.x"
}

# Link your theme
vtex link
```

See [README.md](./README.md#vtex-io-installation) for complete instructions.

### For Other Platforms (Koru, Shopify, WordPress, etc.)

If you're using Koru App Manager or any other platform:

```bash
# Build the widget
cd widget
npm install
npm run build
```

Then deploy `widget/dist/marquee-widget.min.js` to your CDN and integrate:

```html
<script
  src="https://your-cdn.com/marquee-widget.min.js"
  data-messages='[{"text":"Your message","icon":"🎉"}]'
  data-background-color="#000000"
  data-text-color="#ffffff"
></script>
```

See [widget/README.md](./widget/README.md) for complete instructions.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Marquee Notification Bar                  │
└─────────────────────────────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
    ┌─────────▼──────────┐   ┌─────────▼──────────┐
    │    VTEX IO App     │   │  Standalone Widget │
    │  (React Component) │   │   (Vanilla JS)     │
    └─────────┬──────────┘   └─────────┬──────────┘
              │                         │
              └────────────┬────────────┘
                           │
                  ┌────────▼────────┐
                  │   Core Logic    │
                  │  (MarqueeCore)  │
                  └─────────────────┘
```

### Shared Components

Both implementations share:
- **Core business logic** (`widget/src/core/MarqueeCore.ts`)
- **Type definitions** (`widget/src/core/types.ts`)
- **CSS styling** (adapted for each platform)
- **Feature parity** (same functionality, different platforms)

## Platform-Specific Details

### VTEX IO Implementation

**Location**: `./react/`

**Key Files**:
- `MarqueeNotificationBar.tsx` - React component
- `MarqueeNotificationBar.css` - Styles with CSS Handles
- `manifest.json` - VTEX IO app configuration

**Integration Points**:
- Uses VTEX CSS Handles for styling
- Integrates with Store Framework blocks
- Supports VTEX Site Editor configuration

**Build**: Automatic via VTEX CLI (`vtex link`)

### Widget Implementation

**Location**: `./widget/`

**Key Files**:
- `src/MarqueeWidget.ts` - Main widget class
- `src/core/` - Shared business logic
- `src/styles.css` - Standalone styles
- `webpack.config.js` - Build configuration

**Integration Points**:
- Self-contained JavaScript bundle
- Script tag initialization
- Programmatic API available
- Works with any HTML page

**Build**: Webpack (`npm run build`)

## Configuration Mapping

Both platforms use the same configuration structure:

| Property | Type | VTEX IO | Widget |
|----------|------|---------|--------|
| messages | array | Props | data-messages attribute |
| separator | string | Props | data-separator attribute |
| backgroundColor | string | Props | data-background-color attribute |
| textColor | string | Props | data-text-color attribute |
| fontSize | string | Props | data-font-size attribute |
| speed | string | Props | data-speed attribute |
| pauseOnHover | boolean | Props | data-pause-on-hover attribute |
| showMarquee | boolean | Props | data-show-marquee attribute |

## Development Workflow

### Making Changes

1. **Update shared logic** (if needed):
   - Edit files in `widget/src/core/`
   - Both platforms will benefit

2. **Update VTEX IO version**:
   - Edit files in `react/`
   - Test with `vtex link`

3. **Update Widget version**:
   - Edit files in `widget/src/`
   - Build with `npm run build`
   - Test with `widget/examples/*.html`

### Testing

**VTEX IO**:
```bash
vtex link
# Test in browser at your workspace URL
```

**Widget**:
```bash
cd widget
npm run build
# Open widget/examples/basic.html in browser
```

## Deployment

### VTEX IO Deployment

```bash
# Bump version
vtex release patch stable

# Publish to registry
vtex publish

# Install in target account
vtex install redcloverqa.marquee-notification-bar@0.0.2
```

### Widget Deployment

```bash
cd widget
npm run build

# Upload dist/marquee-widget.min.js to your CDN
# Update script src URLs to point to CDN
```

## Koru App Manager Integration

For Koru-specific integration:

1. Build the widget:
```bash
cd widget
npm run build
```

2. Upload to CDN or Koru hosting

3. Configure in Koru dashboard:
   - Widget URL: `https://your-cdn.com/marquee-widget.min.js`
   - Configuration: Use Koru's admin interface to set messages, colors, etc.

4. Koru will inject the script with configured data attributes

## Troubleshooting

### VTEX IO Issues

**Problem**: Block not appearing
- Check `manifest.json` dependencies
- Verify block is added to theme's `interfaces.json`
- Clear cache: `vtex workspace reset`

**Problem**: Styles not applying
- Check CSS Handles are correctly named
- Verify theme's CSS overrides

### Widget Issues

**Problem**: Widget not loading
- Check browser console for errors
- Verify script src URL is accessible
- Ensure data attributes are valid JSON

**Problem**: Messages not displaying
- Validate `data-messages` JSON format
- Check for JavaScript errors
- Verify container element exists

## Support

For implementation questions:
- VTEX IO: Check VTEX IO documentation
- Widget: See [widget/README.md](./widget/README.md)
- General: Open an issue on GitHub

## Next Steps

1. Choose your platform (VTEX IO or Widget)
2. Follow the specific installation guide
3. Configure messages and styling
4. Test in development environment
5. Deploy to production

For detailed information, see:
- [Main README](./README.md)
- [Widget Documentation](./widget/README.md)
