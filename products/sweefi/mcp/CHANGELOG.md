# Changelog

## 0.1.6

### Patch Changes

- c409402: Bulk migrate `@sweefi/*` packages from `sweeinc/sweefi` to `sweeinc/platform` under the v5.2 product-based subtree architecture (`products/sweefi/{name}/`). No API changes; same source code, new repo home. Patch bumps across all 8 packages. Tooling now Moon-orchestrated alongside pnpm + changesets.
- Updated dependencies [c409402]
  - @sweefi/sui@0.4.2

All notable changes to `@sweefi/mcp` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3] - 2026-03-10

### Fixed

- Added 13 missing Move error code descriptions to `humanizeError`: ETimeoutTooLong (111), EBuyerIsSeller (214), EDeadlineReached (215), EAutoUnpauseNotReady (503), and all prepaid v0.2 fraud proof errors (614-622)
- `parseAmount` and `parseAmountOrZero` now truncate oversized input strings in error messages (prevents log bloat from malicious payloads)

## [0.1.2] - 2026-03-08

### Changed

- Sync with v11 testnet deploy
