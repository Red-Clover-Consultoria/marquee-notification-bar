# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.3] - 2025-11-20

### Added
- **Koru SDK Integration**: Full integration with `@redclover/koru-sdk` for official Koru App Manager support
- **Automatic configuration fetching**: Widget now retrieves configuration from Koru dashboard automatically
- **SDK lifecycle methods**: Proper implementation of `start()`, `stop()`, and `reload()` methods
- **Authorization handling**: Built-in authorization flow through Koru App Manager
- **Deployment configs**: Added GitHub Actions workflow and Vercel configuration

### Changed
- **Breaking**: Widget now extends `KoruWidget` from official SDK instead of manual implementation
- **Breaking**: Configuration now managed through Koru dashboard, not data attributes
- **Breaking**: Removed manual widget instantiation - SDK handles initialization automatically
- **Updated examples**: Both `basic.html` and `programmatic.html` now use Koru SDK integration
- **Updated documentation**: README reflects Koru-first approach with proper data attributes
- **Method signatures**: `onInit()` and `onRender()` now receive config from Koru as parameter

### Removed
- **Removed**: Manual helper implementations (createElement, isMobile, track, log) - now provided by SDK
- **Removed**: Manual widget instantiation from examples - handled by SDK `.start()`
- **Removed**: Data attribute configuration (except Koru credentials) - config comes from dashboard

### Fixed
- **Infinite loop animation**: Messages now loop continuously without disappearing
- **Color picker synchronization**: Input values now reflect widget configuration correctly
- **Checkbox interaction**: Checkboxes respond to clicks on both label and input
- **Real-time updates**: Configuration changes apply instantly without manual update button
- **Build errors**: Fixed TypeScript errors (NODE_ENV, unused variables, export type syntax)
- **Property visibility**: Changed private properties to protected for SDK compatibility

## [0.0.2] - 2025-11-19

### Added
- **Multi-platform support**: Standalone widget for any website
- **Shared core logic**: Platform-agnostic business logic in `widget/src/core/`
- **Build system**: Webpack configuration with TypeScript, CSS bundling
- **Interactive demo**: `widget/examples/programmatic.html` with real-time configuration controls
- **TypeScript definitions**: Full type safety with exported .d.ts files
- **Documentation**: Widget-specific README, integration guide, implementation summary

## [0.0.2] - 2025-11-19

### Added
- Initial release.
