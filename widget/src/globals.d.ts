/**
 * Global type declarations for the widget
 */

declare global {
  // NODE_ENV will be replaced by webpack at build time
  const NODE_ENV: string

  interface Window {
    __marqueeWidget?: any
  }
}

export {}
