/**
 * Entry point for Marquee Notification Bar Widget
 * Initializes and bootstraps the widget for Koru App Manager
 */

import MarqueeNotificationBarWidget from './MarqueeWidget'
import { MarqueeWidgetConfig } from './MarqueeWidget'

// Check if we're in local development mode (has data-messages attribute)
const scriptTag = document.currentScript as HTMLScriptElement | null

if (scriptTag?.dataset.messages) {
  // Local development mode - parse config from data attributes
  console.log('[MarqueeWidget] Running in LOCAL DEVELOPMENT MODE')

  const config: MarqueeWidgetConfig = {
    containerId: scriptTag.dataset.containerId || 'marquee-notification-bar',
    position: (scriptTag.dataset.position as 'top' | 'bottom') || 'top',
    messages: scriptTag.dataset.messages ? JSON.parse(scriptTag.dataset.messages) : [],
    separator: scriptTag.dataset.separator,
    backgroundColor: scriptTag.dataset.backgroundColor,
    textColor: scriptTag.dataset.textColor,
    fontSize: scriptTag.dataset.fontSize as any,
    speed: scriptTag.dataset.speed as any,
    pauseOnHover: scriptTag.dataset.pauseOnHover !== 'false',
    showMarquee: scriptTag.dataset.showMarquee !== 'false'
  }

  // Create widget with local config
  const widget = new MarqueeNotificationBarWidget()

  // Initialize without Koru SDK
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
      await widget.onInit(config)
      await widget.onRender(config)
    })
  } else {
    widget.onInit(config).then(() => widget.onRender(config))
  }
} else {
  // Production mode - use Koru SDK
  console.log('[MarqueeWidget] Running in PRODUCTION MODE with Koru SDK')
  new MarqueeNotificationBarWidget().start()
}

// Export for manual usage and testing
export { MarqueeNotificationBarWidget }
export type { MarqueeWidgetConfig }
export default MarqueeNotificationBarWidget
