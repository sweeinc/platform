# @sweefi/hono

## 0.2.2

### Patch Changes

- c409402: Bulk migrate `@sweefi/*` packages from `sweeinc/sweefi` to `sweeinc/platform` under the v5.2 product-based subtree architecture (`products/sweefi/{name}/`). No API changes; same source code, new repo home. Patch bumps across all 8 packages. Tooling now Moon-orchestrated alongside pnpm + changesets.

## 0.1.1

### Patch Changes

- Set hosted SweeFi facilitator (https://swee-facilitator.fly.dev) as the default `facilitatorUrl`. Previously an empty string, requiring all callers to configure their own facilitator. Agents using `createS402Client()` without an explicit `facilitatorUrl` now route through the hosted facilitator automatically.
