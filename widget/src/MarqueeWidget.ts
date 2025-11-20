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
    super({
      name: 'marquee-notification-bar',
      version: '0.0.3'
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

    // Merge config from Koru with defaults
    this.widgetConfig = {
      containerId: 'marquee-notification-bar',
      position: 'top',
      ...config
    }

    // Update core with new config
    this.core.updateConfig(this.widgetConfig)

    if (!this.core.shouldRender()) {
      this.log('No messages to display, widget will not render')
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
    let container = document.getElementById(this.config.containerId!)

    if (!container) {
      container = this.createElement('div', {
        id: this.config.containerId,
        className: 'marquee-notification-bar'
      })

      // Insert at the position specified
      if (this.config.position === 'top') {
        document.body.insertBefore(container, document.body.firstChild)
      } else {
        document.body.appendChild(container)
      }
    }

    return container
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
