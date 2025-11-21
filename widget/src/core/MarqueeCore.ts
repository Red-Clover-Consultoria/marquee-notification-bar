/**
 * Core logic for Marquee Notification Bar
 * Platform-agnostic business logic
 */

import { MarqueeConfig, MarqueeDefaults, Message } from './types'

export class MarqueeCore {
  private config: Required<MarqueeConfig>

  private static readonly DEFAULT_CONFIG: MarqueeDefaults = {
    enabled: true,
    messages: [],
    separator: '•',
    backgroundColor: '#f5f5f5',
    textColor: '#333333',
    fontSize: '14px',
    speed: 'normal',
    pauseOnHover: true,
    showMarquee: true
  }

  constructor(config: MarqueeConfig = {}) {
    this.config = { ...MarqueeCore.DEFAULT_CONFIG, ...config }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<MarqueeConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Get current configuration
   */
  getConfig(): Required<MarqueeConfig> {
    return { ...this.config }
  }

  /**
   * Get animation duration based on speed
   */
  getAnimationDuration(): string {
    switch (this.config.speed) {
      case 'slow':
        return '40s'
      case 'normal':
        return '25s'
      case 'fast':
        return '15s'
      default:
        return '25s'
    }
  }

  /**
   * Check if icon is an emoji or URL
   */
  isIconEmoji(icon: string): boolean {
    return icon.length <= 3 || !icon.includes('http')
  }

  /**
   * Validate if component should render
   */
  shouldRender(): boolean {
    return this.config.messages.length > 0
  }

  /**
   * Get messages
   */
  getMessages(): Message[] {
    return this.config.messages
  }

  /**
   * Get separator
   */
  getSeparator(): string {
    return this.config.separator
  }

  /**
   * Check if marquee animation should be shown
   */
  isMarqueeEnabled(): boolean {
    return this.config.showMarquee
  }

  /**
   * Check if pause on hover is enabled
   */
  isPauseOnHoverEnabled(): boolean {
    return this.config.pauseOnHover
  }

  /**
   * Get container styles
   */
  getContainerStyles(): Record<string, string> {
    return {
      backgroundColor: this.config.backgroundColor,
      color: this.config.textColor,
      fontSize: this.config.fontSize
    }
  }

  /**
   * Get content styles
   */
  getContentStyles(): Record<string, string> {
    return {
      animationDuration: this.getAnimationDuration(),
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite'
    }
  }

  /**
   * Build message HTML
   */
  buildMessageHTML(message: Message, index: number, handles?: Record<string, string>): string {
    const { text, icon, iconPosition = 'left' } = message
    const iconHTML = icon ? this.buildIconHTML(icon, handles) : ''

    const messageClass = handles?.marqueeMessage || 'marqueeMessage'
    const textClass = handles?.marqueeText || 'marqueeText'

    return `
      <span class="${messageClass}" data-index="${index}">
        ${iconPosition === 'left' ? iconHTML : ''}
        <span class="${textClass}">${this.escapeHTML(text)}</span>
        ${iconPosition === 'right' ? iconHTML : ''}
      </span>
    `
  }

  /**
   * Build icon HTML
   */
  private buildIconHTML(icon: string, handles?: Record<string, string>): string {
    const iconClass = handles?.marqueeIcon || 'marqueeIcon'

    if (this.isIconEmoji(icon)) {
      return `<span class="${iconClass}">${this.escapeHTML(icon)}</span>`
    }

    return `<img src="${this.escapeHTML(icon)}" alt="notification icon" class="${iconClass}" />`
  }

  /**
   * Build separator HTML
   */
  buildSeparatorHTML(handles?: Record<string, string>): string {
    const separatorClass = handles?.marqueeSeparator || 'marqueeSeparator'
    return `<span class="${separatorClass}">${this.escapeHTML(this.config.separator)}</span>`
  }

  /**
   * Build full content HTML
   */
  buildContentHTML(handles?: Record<string, string>): string {
    if (!this.shouldRender()) {
      return ''
    }

    const messages = this.config.messages.map((message, index) => {
      const messageHTML = this.buildMessageHTML(message, index, handles)
      const separatorHTML = index < this.config.messages.length - 1
        ? this.buildSeparatorHTML(handles)
        : ''
      return messageHTML + separatorHTML
    }).join('')

    return messages
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHTML(str: string): string {
    const div = typeof document !== 'undefined'
      ? document.createElement('div')
      : null

    if (div) {
      div.textContent = str
      return div.innerHTML
    }

    // Fallback for server-side or when document is not available
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
}
