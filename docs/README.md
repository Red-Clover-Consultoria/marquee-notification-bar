# Marquee Notification Bar

A customizable notification bar with marquee scrolling effect for VTEX IO stores. Display multiple promotional messages, announcements, or important information with smooth animations and full customization options.

## Features

- Multiple messages support with customizable separators
- Icon/emoji support with configurable position (left or right)
- Marquee animation with adjustable speed (slow, normal, fast)
- Pause animation on hover
- Toggle marquee effect on/off (centered mode)
- Fully customizable colors, fonts, and styling
- Responsive design for mobile and desktop
- CSS Handles for advanced customization

## Configuration

### Step 1 - Adding the app as a dependency

Add `redcloverqa.marquee-notification-bar` to your theme's dependencies in the `manifest.json` file:

```json
{
  "dependencies": {
    "redcloverqa.marquee-notification-bar": "0.x"
  }
}
```

### Step 2 - Adding the block to your theme

Add the `marquee-notification-bar` block to your desired template or layout. For example, in your `store/blocks/header/header.jsonc`:

```json
{
  "header-layout.desktop": {
    "children": [
      "marquee-notification-bar",
      "header-row#desktop"
    ]
  }
}
```

### Step 3 - Configuring the block

Configure the block properties in your theme's blocks file:

```json
{
  "marquee-notification-bar": {
    "props": {
      "messages": [
        {
          "text": "3 CUOTAS SIN INTERÉS desde $60.000",
          "icon": "🎉",
          "iconPosition": "left"
        },
        {
          "text": "ENVÍO GRATIS en compras mayores a $80.000",
          "icon": "🚚",
          "iconPosition": "left"
        },
        {
          "text": "20% OFF en segunda unidad",
          "icon": "⭐",
          "iconPosition": "left"
        }
      ],
      "separator": "•",
      "backgroundColor": "#000000",
      "textColor": "#ffffff",
      "fontSize": "14px",
      "speed": "normal",
      "pauseOnHover": true,
      "showMarquee": true
    }
  }
}
```

## Props

### `marquee-notification-bar` props

| Prop name | Type | Description | Default value |
| --------- | ---- | ----------- | ------------- |
| `messages` | `array` | Array of message objects to display in the marquee | `[{"text": "3 CUOTAS SIN INTERÉS desde $60.000", "icon": "🎉", "iconPosition": "left"}]` |
| `separator` | `string` | Character or symbol to separate messages (e.g., •, \|, -, etc) | `"•"` |
| `backgroundColor` | `string` | Background color in hex format (e.g., #f5f5f5) | `"#f5f5f5"` |
| `textColor` | `string` | Text color in hex format (e.g., #333333) | `"#333333"` |
| `fontSize` | `enum` | Text size: `12px`, `14px`, `16px`, `18px` | `"14px"` |
| `speed` | `enum` | Animation speed: `slow`, `normal`, `fast` | `"normal"` |
| `pauseOnHover` | `boolean` | Pause animation when user hovers over the bar | `true` |
| `showMarquee` | `boolean` | Enable/disable marquee animation. When disabled, text is centered without animation | `true` |

### `messages` array object structure

Each message object in the `messages` array can have the following properties:

| Prop name | Type | Description | Default value |
| --------- | ---- | ----------- | ------------- |
| `text` | `string` | The message content to display | `""` |
| `icon` | `string` | URL of image/SVG or emoji (e.g., 🎉, 🔥, ⭐) | `""` |
| `iconPosition` | `enum` | Position of icon relative to text: `left` or `right` | `"left"` |

## Animation Speeds

| Speed | Duration | Best for |
| ----- | -------- | -------- |
| `slow` | 40s | Long messages, detailed reading |
| `normal` | 25s | Standard announcements (recommended) |
| `fast` | 15s | Short, urgent messages |

## Examples

### Example 1: Single promotional message

```json
{
  "marquee-notification-bar": {
    "props": {
      "messages": [
        {
          "text": "BLACK FRIDAY - Up to 70% OFF on selected items!",
          "icon": "🔥",
          "iconPosition": "left"
        }
      ],
      "backgroundColor": "#FF0000",
      "textColor": "#FFFFFF",
      "fontSize": "16px",
      "speed": "normal"
    }
  }
}
```

### Example 2: Multiple rotating announcements

```json
{
  "marquee-notification-bar": {
    "props": {
      "messages": [
        {
          "text": "Free shipping on orders over $50",
          "icon": "🚚",
          "iconPosition": "left"
        },
        {
          "text": "New arrivals every week",
          "icon": "✨",
          "iconPosition": "left"
        },
        {
          "text": "24/7 Customer support",
          "icon": "💬",
          "iconPosition": "left"
        }
      ],
      "separator": "|",
      "backgroundColor": "#f5f5f5",
      "textColor": "#333333",
      "fontSize": "14px",
      "speed": "normal",
      "pauseOnHover": true
    }
  }
}
```

### Example 3: Static banner (no animation)

```json
{
  "marquee-notification-bar": {
    "props": {
      "messages": [
        {
          "text": "Important: Store will be closed on December 25th",
          "icon": "⚠️",
          "iconPosition": "left"
        }
      ],
      "backgroundColor": "#FFF3CD",
      "textColor": "#856404",
      "fontSize": "14px",
      "showMarquee": false
    }
  }
}
```

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

### CSS Handles

| CSS Handle | Description |
| ---------- | ----------- |
| `marqueeContainer` | Main container wrapper |
| `marqueeContent` | Animated content wrapper |
| `marqueeIcon` | Icon/emoji container |
| `marqueeMessage` | Individual message container |
| `marqueeSeparator` | Separator between messages |
| `marqueeText` | Text content |
| `marqueeWrapper` | Inner wrapper for animation |

### Customization Example

```css
/* Custom styling for the notification bar */
.marqueeContainer {
  border-top: 2px solid #e5e5e5;
  border-bottom: 2px solid #e5e5e5;
  padding: 12px 0;
}

.marqueeText {
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
}

.marqueeIcon {
  filter: grayscale(100%);
}

.marqueeSeparator {
  color: #ff0000;
  font-size: 20px;
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- If no messages are provided, the component will not render anything
- Images used as icons should be optimized for web (< 50KB recommended)
- For best performance, limit the number of messages to 5-10
- The component is fully responsive and adapts to mobile screens automatically

## Contributors

This app was developed by Red Clover QA team.

---

**Note:** Custom apps are the responsibility of the vendor and VTEX does not provide direct support for them.
