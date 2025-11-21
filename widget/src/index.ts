/**
 * Entry point for Marquee Notification Bar Widget
 * Initializes and bootstraps the widget for Koru App Manager
 */

import MarqueeNotificationBarWidget from './MarqueeWidget'

// Auto-initialize widget with Koru SDK
new MarqueeNotificationBarWidget().start()

// Export for programmatic usage if needed
export { MarqueeNotificationBarWidget }
export default MarqueeNotificationBarWidget
