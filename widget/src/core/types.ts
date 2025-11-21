/**
 * Shared types for Marquee Notification Bar
 * Used across VTEX IO and Koru Widget implementations
 */

export type IconPosition = 'left' | 'right'
export type Speed = 'slow' | 'normal' | 'fast'
export type FontSize = '12px' | '14px' | '16px' | '18px'

export interface Message {
  text: string
  icon?: string
  iconPosition?: IconPosition
}

export interface MarqueeConfig {
  enabled?: boolean
  messages?: Message[]
  separator?: string
  backgroundColor?: string
  textColor?: string
  fontSize?: FontSize
  speed?: Speed
  pauseOnHover?: boolean
  showMarquee?: boolean
}

export interface MarqueeDefaults {
  enabled: boolean
  messages: Message[]
  separator: string
  backgroundColor: string
  textColor: string
  fontSize: FontSize
  speed: Speed
  pauseOnHover: boolean
  showMarquee: boolean
}
