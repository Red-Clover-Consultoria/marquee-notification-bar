# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Multi-platform support**: Standalone widget for Koru App Manager and any website
- **Shared core logic**: Platform-agnostic business logic in `widget/src/core/`
- **Widget SDK implementation**: Full KoruWidget lifecycle support (onInit, onRender, onConfigUpdate, onDestroy)
- **Build system**: Webpack configuration with TypeScript, CSS bundling, multiple output formats (UMD, ESM, minified)
- **Interactive demo**: `widget/examples/programmatic.html` with real-time configuration controls
- **TypeScript definitions**: Full type safety with exported .d.ts files
- **Documentation**: Widget-specific README, integration guide, implementation summary

### Fixed
- **Infinite loop animation**: Messages now loop continuously without disappearing
- **Color picker synchronization**: Input values now reflect widget configuration correctly
- **Checkbox interaction**: Checkboxes respond to clicks on both label and input
- **Real-time updates**: Configuration changes apply instantly without manual update button
- **Build errors**: Fixed TypeScript errors (NODE_ENV, unused variables, export type syntax)

### Changed
- **UI redesign**: `widget/examples/programmatic.html` updated to minimal light mode design (white background, black buttons, 4px borders)
- **Removed preview panel**: Streamlined demo interface by removing non-functional preview section

## [0.0.2] - 2025-11-19

### Added
- Initial release.
