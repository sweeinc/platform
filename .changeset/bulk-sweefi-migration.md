---
"@sweefi/sui": patch
"@sweefi/solana": patch
"@sweefi/cli": patch
"@sweefi/hono": patch
"@sweefi/mcp": patch
"@sweefi/react": patch
"@sweefi/vue": patch
"@sweefi/ap2-adapter": patch
---

Bulk migrate `@sweefi/*` packages from `sweeinc/sweefi` to `sweeinc/platform` under the v5.2 product-based subtree architecture (`products/sweefi/{name}/`). No API changes; same source code, new repo home. Patch bumps across all 8 packages. Tooling now Moon-orchestrated alongside pnpm + changesets.
