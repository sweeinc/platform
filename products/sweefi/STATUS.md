---
intent: graduates-to-platform
target_graduation_signal: 3+ external developers using packages
status: graduated
---

# SweeFi Status

The SweeFi product family graduated to `sweeinc/platform` as the initial seed of the architecture v5.2 monorepo (April 2026). 10 published `@sweefi/*` packages migrate from `sweeinc/sweefi` into `products/sweefi/`.

## Components

| Component | npm | Status |
|---|---|---|
| `ui-core/` | `@sweefi/ui-core@0.1.2` | graduated (canary, April 2026) |
| `sui/` | `@sweefi/sui@0.4.x` | pending migration |
| `solana/` | `@sweefi/solana@0.2.x` | pending migration |
| `cli/` | `@sweefi/cli@0.3.x` | pending migration |
| `hono/` | `@sweefi/hono@0.2.x` | pending migration |
| `mcp/` | `@sweefi/mcp@0.1.x` | pending migration |
| `react/` | `@sweefi/react@0.1.x` | pending migration |
| `vue/` | `@sweefi/vue@0.1.x` | pending migration |
| `ap2-adapter/` | `@sweefi/ap2-adapter@0.1.x` | pending migration |
| `facilitator/` | `@sweefi/facilitator` (CLI) | pending migration + flip from private:true to publishable |

## Notes

- `@sweefi/server@0.1.1` on npm is a legacy name; renamed to `@sweefi/hono`. Will deprecate the legacy name with redirect notice during full migration.
