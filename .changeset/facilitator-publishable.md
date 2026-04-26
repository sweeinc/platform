---
"@sweefi/facilitator": minor
"@sweefi/hono": patch
---

**@sweefi/facilitator** — first npm release. The facilitator was previously
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
