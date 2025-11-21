/**
 * Marquee Notification Bar Widget for Koru App Manager
 * Extends KoruWidget to provide marquee notification functionality
 */

import { KoruWidget } from '@redclover/koru-sdk'
import { MarqueeCore } from './core/MarqueeCore'
import { MarqueeConfig } from './core/types'

// CSS will be bundled separately
import './styles.css'

/**
 * Widget configuration interface extending base Koru config
 */
export interface MarqueeWidgetConfig extends MarqueeConfig {
  // Add any Koru-specific config here if needed
  containerId?: string
  position?: 'top' | 'bottom'
}

/**
 * Marquee Notification Bar Widget
 * Integrates with Koru App Manager using the Widget SDK
 */
class MarqueeNotificationBarWidget extends KoruWidget {
  protected core: MarqueeCore
  protected wrapper: HTMLElement | null = null
  protected widgetConfig: MarqueeWidgetConfig

  constructor() {
    // Detect debug mode from URL parameter or localhost
    const isDebug =
      new URLSearchParams(window.location.search).has('debug') ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'

    super({
      name: 'marquee-notification-bar',
      version: '0.0.3',
      options: {
        cache: true, // Enable caching for better performance
        cacheDuration: 3600, // Cache for 1 hour (3600 seconds)
        retryAttempts: 3, // Retry authorization 3 times on failure
        retryDelay: 1000, // Wait 1 second between retries
        analytics: true, // Enable analytics tracking
        debug: isDebug // Enable debug logging in development
      }
    })

    // Initialize with default config
    this.widgetConfig = {
      containerId: 'marquee-notification-bar',
      position: 'top'
    }
    this.core = new MarqueeCore(this.widgetConfig)
  }

  /**
   * Initialize widget after authorization
   * @param config Configuration from Koru App Manager
   */
  async onInit(config: MarqueeWidgetConfig): Promise<void> {
    this.log('Marquee Notification Bar Widget initialized', config)

    // Parse individual message fields from Koru into messages array
    const parsedConfig = this.parseKoruConfig(config)

    // Validate configuration before proceeding
    this.validateConfig(parsedConfig)

    // Merge config from Koru with defaults
    this.widgetConfig = {
      containerId: 'marquee-notification-bar',
      position: 'top',
      ...parsedConfig
    }

    // Update core with new config
    this.core.updateConfig(this.widgetConfig)

    if (!this.core.shouldRender()) {
      this.log('No messages to display, widget will not render')
    }
  }

  /**
   * Validate widget configuration
   * @param config Configuration to validate
   * @throws Error if configuration is invalid
   */
  private validateConfig(config: MarqueeWidgetConfig): void {
    // Check if messages array exists and has at least one message
    if (!config.messages || !Array.isArray(config.messages)) {
      throw new Error(
        'Widget configuration error: messages array is required'
      )
    }

    if (config.messages.length === 0) {
      throw new Error(
        'Widget configuration error: At least one message is required. Please configure message1_text in Koru App Manager.'
      )
    }

    // Validate each message
    config.messages.forEach((message, index) => {
      // Check if message has text
      if (!message.text || typeof message.text !== 'string') {
        throw new Error(
          `Widget configuration error: Message ${index + 1} is missing text`
        )
      }

      // Check if text is not empty after trimming
      if (message.text.trim() === '') {
        throw new Error(
          `Widget configuration error: Message ${index + 1} has empty text`
        )
      }

      // Validate icon position if icon is provided
      if (message.icon && message.iconPosition) {
        if (!['left', 'right'].includes(message.iconPosition)) {
          throw new Error(
            `Widget configuration error: Message ${index + 1} has invalid iconPosition. Must be 'left' or 'right'`
          )
        }
      }
    })

    // Validate fontSize if provided
    if (config.fontSize) {
      const validFontSizes = ['12px', '14px', '16px', '18px']
      if (!validFontSizes.includes(config.fontSize)) {
        throw new Error(
          `Widget configuration error: fontSize must be one of ${validFontSizes.join(', ')}`
        )
      }
    }

    // Validate speed if provided
    if (config.speed) {
      const validSpeeds = ['slow', 'normal', 'fast']
      if (!validSpeeds.includes(config.speed)) {
        throw new Error(
          `Widget configuration error: speed must be one of ${validSpeeds.join(', ')}`
        )
      }
    }

    // Validate position if provided
    if (config.position) {
      const validPositions = ['top', 'bottom']
      if (!validPositions.includes(config.position)) {
        throw new Error(
          `Widget configuration error: position must be 'top' or 'bottom'`
        )
      }
    }

    // Validate color patterns if provided
    const hexColorPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

    if (config.backgroundColor && !hexColorPattern.test(config.backgroundColor)) {
      throw new Error(
        'Widget configuration error: backgroundColor must be a valid hex color (e.g., #000000)'
      )
    }

    if (config.textColor && !hexColorPattern.test(config.textColor)) {
      throw new Error(
        'Widget configuration error: textColor must be a valid hex color (e.g., #FFFFFF)'
      )
    }

    this.log('Configuration validation passed', {
      messageCount: config.messages.length
    })
  }

  /**
   * Parse Koru config with individual message fields into messages array
   * Supports both formats: individual fields (message1_text, etc.) and direct messages array
   */
  private parseKoruConfig(config: any): MarqueeWidgetConfig {
    // If messages array is already provided, use it directly (backward compatibility)
    if (config.messages && Array.isArray(config.messages)) {
      return config as MarqueeWidgetConfig
    }

    // Parse individual message fields (message1_text, message2_text, etc.)
    const messages: any[] = []

    for (let i = 1; i <= 10; i++) {
      const textKey = `message${i}_text`
      const iconKey = `message${i}_icon`
      const iconPositionKey = `message${i}_iconPosition`

      const text = config[textKey]

      // Only add message if text is provided and not empty
      if (text && text.trim()) {
        messages.push({
          text: text.trim(),
          icon: config[iconKey] || undefined,
          iconPosition: config[iconPositionKey] || 'left'
        })
      }
    }

    // Return config with parsed messages array
    return {
      ...config,
      messages
    }
  }

  /**
   * Render the widget UI
   * @param config Configuration from Koru App Manager
   */
  async onRender(config: MarqueeWidgetConfig): Promise<void> {
    // Update config if provided
    if (config) {
      this.widgetConfig = { ...this.widgetConfig, ...config }
      this.core.updateConfig(this.widgetConfig)
    }
    try {
      // Check if widget is enabled
      if (this.widgetConfig.enabled === false) {
        this.log('Widget is disabled by configuration')
        return
      }

      if (!this.core.shouldRender()) {
        this.log('Skipping render: no messages configured')
        return
      }

      // Create or get container
      this.container = this.getOrCreateContainer()

      // Apply container styles
      const containerStyles = this.core.getContainerStyles()
      Object.assign(this.container.style, containerStyles)

      // Build the marquee structure
      this.buildMarqueeStructure()

      // Setup event listeners
      if (this.core.isPauseOnHoverEnabled() && this.core.isMarqueeEnabled()) {
        this.setupEventListeners()
      }

      // Track render event
      this.track?.('marquee_rendered', {
        messageCount: this.core.getMessages().length,
        speed: this.core.getConfig().speed,
        showMarquee: this.core.isMarqueeEnabled()
      })

      this.log('Widget rendered successfully')
    } catch (error) {
      console.error('Error rendering Marquee Notification Bar:', error)
      this.renderError()
    }
  }

  /**
   * Update configuration without full re-render
   * @param config Partial configuration to update
   */
  async onConfigUpdate(config: Partial<MarqueeWidgetConfig>): Promise<void> {
    this.log('Updating widget configuration', config)

    this.widgetConfig = { ...this.widgetConfig, ...config }
    this.core.updateConfig(config)

    // For now, do a full re-render
    // Could be optimized to only update changed parts
    await this.onDestroy()
    await this.onRender(this.widgetConfig)
  }

  /**
   * Cleanup and destroy widget
   */
  async onDestroy(): Promise<void> {
    this.log('Destroying widget')

    // Remove event listeners
    this.removeEventListeners()

    // Remove container from DOM
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
    }

    // Clear references
    this.container = null
    this.wrapper = null
  }

  /**
   * Get or create the main container element
   */
  private getOrCreateContainer(): HTMLElement {
    let container = document.getElementById(this.widgetConfig.containerId!)

    if (!container) {
      container = this.createElement('div', {
        id: this.widgetConfig.containerId,
        className: 'marquee-notification-bar'
      })

      // Apply positioning styles
      this.applyPositionStyles(container)

      // Insert at the position specified
      if (this.widgetConfig.position === 'top') {
        document.body.insertBefore(container, document.body.firstChild)
      } else {
        document.body.appendChild(container)
      }
    } else {
      // Container exists, apply positioning styles
      this.applyPositionStyles(container)
    }

    return container
  }

  /**
   * Apply positioning styles to container
   */
  private applyPositionStyles(container: HTMLElement): void {
    // Use fixed positioning to ensure widget stays on top
    container.style.position = 'fixed'
    container.style.left = '0'
    container.style.right = '0'
    container.style.zIndex = '9999'

    if (this.widgetConfig.position === 'top') {
      container.style.top = '0'
      container.style.bottom = 'auto'
    } else {
      container.style.top = 'auto'
      container.style.bottom = '0'
    }
  }

  /**
   * Build the marquee structure (wrapper and content)
   */
  private buildMarqueeStructure(): void {
    if (!this.container) return

    // Clear existing content
    this.container.innerHTML = ''

    // Create wrapper
    this.wrapper = this.createElement('div', {
      className: this.core.isMarqueeEnabled()
        ? 'marquee-notification-bar__wrapper'
        : 'marquee-notification-bar__wrapper marquee-notification-bar__wrapper--static'
    })

    const contentHTML = this.buildContent()

    if (this.core.isMarqueeEnabled()) {
      // Create two content divs for seamless loop
      const content1 = this.createContentElement(contentHTML)
      const content2 = this.createContentElement(contentHTML, true)

      this.wrapper.appendChild(content1)
      this.wrapper.appendChild(content2)
    } else {
      // Static mode - single content
      const content = this.createContentElement(contentHTML)
      content.style.animation = 'none'
      this.wrapper.appendChild(content)
    }

    this.container.appendChild(this.wrapper)
  }

  /**
   * Build content HTML using core logic
   */
  private buildContent(): string {
    const handles = {
      marqueeMessage: 'marquee-notification-bar__message',
      marqueeText: 'marquee-notification-bar__text',
      marqueeIcon: 'marquee-notification-bar__icon',
      marqueeSeparator: 'marquee-notification-bar__separator'
    }

    return this.core.buildContentHTML(handles)
  }

  /**
   * Create a content element with HTML
   */
  private createContentElement(html: string, ariaHidden: boolean = false): HTMLElement {
    const content = this.createElement('div', {
      className: 'marquee-notification-bar__content'
    })

    const contentStyles = this.core.getContentStyles()
    Object.assign(content.style, contentStyles)

    if (ariaHidden) {
      content.setAttribute('aria-hidden', 'true')
    }

    content.innerHTML = html
    return content
  }

  /**
   * Setup mouse event listeners for pause on hover
   */
  private setupEventListeners(): void {
    if (!this.wrapper) return

    this.wrapper.addEventListener('mouseenter', this.handleMouseEnter)
    this.wrapper.addEventListener('mouseleave', this.handleMouseLeave)
  }

  /**
   * Remove event listeners
   */
  private removeEventListeners(): void {
    if (!this.wrapper) return

    this.wrapper.removeEventListener('mouseenter', this.handleMouseEnter)
    this.wrapper.removeEventListener('mouseleave', this.handleMouseLeave)
  }

  /**
   * Handle mouse enter - pause animation
   */
  private handleMouseEnter = (): void => {
    if (!this.wrapper || !this.core.isPauseOnHoverEnabled()) return

    const contents = this.wrapper.querySelectorAll<HTMLElement>(
      '.marquee-notification-bar__content'
    )

    contents.forEach(content => {
      content.classList.add('marquee-notification-bar__content--paused')
      content.style.animationPlayState = 'paused'
    })

    this.track?.('marquee_paused', {})
  }

  /**
   * Handle mouse leave - resume animation
   */
  private handleMouseLeave = (): void => {
    if (!this.wrapper || !this.core.isPauseOnHoverEnabled()) return

    const contents = this.wrapper.querySelectorAll<HTMLElement>(
      '.marquee-notification-bar__content'
    )

    contents.forEach(content => {
      content.classList.remove('marquee-notification-bar__content--paused')
      content.style.animationPlayState = 'running'
    })

    this.track?.('marquee_resumed', {})
  }

  /**
   * Render error state
   */
  private renderError(): void {
    if (!this.container) return

    this.container.innerHTML = `
      <div style="padding: 10px; background: #ffebee; color: #c62828; text-align: center;">
        Error loading notification bar
      </div>
    `
  }
}

// Export for use in Koru App Manager
export default MarqueeNotificationBarWidget
export { MarqueeNotificationBarWidget }
