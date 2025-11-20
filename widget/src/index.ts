/**
 * Entry point for Marquee Notification Bar Widget
 * Initializes and bootstraps the widget for Koru App Manager
 */

import MarqueeNotificationBarWidget from './MarqueeWidget'
import { MarqueeWidgetConfig } from './MarqueeWidget'

/**
 * Initialize widget from script tag data attributes
 */
function initializeFromScriptTag(): void {
  // Find the script tag that loaded this widget
  const scriptTag = document.currentScript as HTMLScriptElement | null

  if (!scriptTag) {
    console.warn('[MarqueeWidget] Could not find script tag, skipping auto-initialization')
    return
  }

  // Extract configuration from data attributes
  const config: MarqueeWidgetConfig = {
    // Extract website and app IDs
    // These would be used by the actual Koru SDK for authorization
    containerId: scriptTag.dataset.containerId || 'marquee-notification-bar',
    position: (scriptTag.dataset.position as 'top' | 'bottom') || 'top',

    // Extract marquee configuration
    messages: scriptTag.dataset.messages
      ? JSON.parse(scriptTag.dataset.messages)
      : undefined,
    separator: scriptTag.dataset.separator,
    backgroundColor: scriptTag.dataset.backgroundColor,
    textColor: scriptTag.dataset.textColor,
    fontSize: scriptTag.dataset.fontSize as any,
    speed: scriptTag.dataset.speed as any,
    pauseOnHover: scriptTag.dataset.pauseOnHover !== 'false',
    showMarquee: scriptTag.dataset.showMarquee !== 'false'
  }

  // Create and start widget
  const widget = new MarqueeNotificationBarWidget(config)

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      widget.onInit().then(() => widget.onRender())
    })
  } else {
    widget.onInit().then(() => widget.onRender())
  }

  // Store widget instance globally for later access
  (window as any).__marqueeWidget = widget
}

/**
 * Manual initialization function
 * Allows developers to create widget programmatically
 */
function createWidget(config: MarqueeWidgetConfig): MarqueeNotificationBarWidget {
  return new MarqueeNotificationBarWidget(config)
}

// Auto-initialize if script tag is present
if (typeof window !== 'undefined' && document.currentScript) {
  initializeFromScriptTag()
}

// Export for manual usage
export { MarqueeNotificationBarWidget, createWidget }
export type { MarqueeWidgetConfig }
export default MarqueeNotificationBarWidget
