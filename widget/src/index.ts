/**
 * Entry point for Marquee Notification Bar Widget
 * Initializes and bootstraps the widget for Koru App Manager
 */

import MarqueeNotificationBarWidget from './MarqueeWidget'
import { MarqueeWidgetConfig } from './MarqueeWidget'

// Create widget instance and start it
// The SDK will handle authorization and configuration fetching
new MarqueeNotificationBarWidget().start()

// Export for manual usage and testing
export { MarqueeNotificationBarWidget }
export type { MarqueeWidgetConfig }
export default MarqueeNotificationBarWidget
