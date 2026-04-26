# sweeinc/platform

> Open-core release vault — Swee Inc's mature TypeScript SDK monorepo

This repo holds Swee Inc's mature, audited, public-ready code. Packages publish to npm under `@sweefi/*`, `@sweeinc/*`, and other Swee scopes.

**Apache 2.0** open source.

## Status

Architecture v5.2 — initial scaffold (April 2026). Migration of existing `@sweefi/*` packages into this monorepo in progress. See [ARCHITECTURE.md](./ARCHITECTURE.md) and Linear DAN-411.

## Currently published from sweeinc/sweefi (will absorb into this repo)

| Package | Version |
|---|---|
| `@sweefi/sui` | 0.4.1 |
| `@sweefi/solana` | 0.2.0 |
| `@sweefi/cli` | 0.3.3 |
| `@sweefi/hono` | 0.2.1 |
| `@sweefi/server` | 0.1.1 |
| `@sweefi/mcp` | 0.1.5 |
| `@sweefi/react` | 0.1.1 |
| `@sweefi/vue` | 0.1.2 |
| `@sweefi/ap2-adapter` | 0.1.2 |
| `@sweefi/ui-core` | 0.1.1 |

## Future repo structure

```
sweeinc/platform/
├── products/
│   └── {brand}/
│       ├── STATUS.md              # intent + status
│       ├── SPEC.md
│       ├── MOVE-PROVENANCE.md     # per Move package
│       ├── sui/, cli/, ...        # TS components
│       ├── move/                  # Move contracts (post-audit)
│       ├── gateway/               # service code
│       ├── dapp/                  # reference dApps
│       └── audits/                # sanitized public audit reports
├── shared/                        # cross-product TS utilities
├── docs/                          # vitepress SDK reference
├── audits/                        # sanitized public reports per product
├── GRADUATION.md                  # lab→platform runbook
├── ROLLBACK.md                    # 30-day demote policy
└── ARCHITECTURE.md
```

## Companion repo

`sweeinc/lab` (private) holds work-in-progress packages, commercial products, and strategic moats. Code matures in `lab` and graduates to `platform` via the documented runbook.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md). Full migration plan + decision history in Linear DAN-411.
