# @sweefi/hono

## 0.2.3

### Patch Changes

- 7f9d79e: **@sweefi/facilitator** — first npm release. The facilitator was previously
  distributed only via `git clone` of the SweeFi monorepo. It is now published
  to npm and runnable as a CLI:

  ```bash
  npx @sweefi/facilitator start
  ```

  Self-host, Docker, and Fly.io workflows are unchanged — see the README for
  all deployment paths. The library API (`createApp`, `loadConfig`) is also
  exposed for embedders.

  **@sweefi/hono** — bump `hono` peerDependency to `>=4.12.15` (was `>=4.0.0`)
  to match the version range exercised by the deployed facilitator and the
  published `@sweefi/sui` 0.4.x line.

## 0.2.2

### Patch Changes

- c409402: Bulk migrate `@sweefi/*` packages from `sweeinc/sweefi` to `sweeinc/platform` under the v5.2 product-based subtree architecture (`products/sweefi/{name}/`). No API changes; same source code, new repo home. Patch bumps across all 8 packages. Tooling now Moon-orchestrated alongside pnpm + changesets.

## 0.1.1

### Patch Changes

- Set hosted SweeFi facilitator (https://swee-facilitator.fly.dev) as the default `facilitatorUrl`. Previously an empty string, requiring all callers to configure their own facilitator. Agents using `createS402Client()` without an explicit `facilitatorUrl` now route through the hosted facilitator automatically.
