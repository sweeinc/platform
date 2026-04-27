# ADR-001: Turbo as Canonical Task Runner

**Status:** Accepted
**Date:** 2026-04-26
**Supersedes:** none

## Context

The Swee Inc two-monorepo architecture (DAN-411 v5.2) needs a single canonical task runner for both `sweeinc/platform` (public) and `sweeinc/lab` (private). The runner orchestrates `build`, `test`, and `typecheck` across many TS packages, ideally with dependency-aware ordering and caching.

DAN-411 §16 originally named **Turbo** as the canonical tool, citing convergent adoption by Mysten, Vue, Anthropic SDK, viem, and Vercel itself. The initial scaffolds of both repos drifted from this and adopted **Moon** (`@moonrepo/cli`) instead — likely because Moon's auto-discovery of projects via leaf-folder globs read as zero-config simplicity at scaffold time.

The drift surfaced concretely on 2026-04-26 when post-DAN-411 cleanup work hit a Moon `project_graph::duplicate_id` error in lab: `products/sweedollar/move/` and `products/sweefi-contracts/move/` both auto-derived the project ID `move` from their leaf folder names. Renaming `move/ → sui-move/` resolved the named collision but immediately surfaced a second one (`packages` between `products/sweeagent/packages/` and `products/sweeos/packages/`) — revealing that Moon's auto-id strategy is structurally incompatible with the nested-products layout this monorepo uses.

A counterargument was raised: **vendor-capture risk** on Turbo, given Vercel's acquisition (Dec 2021) and the recurring industry pattern of OSS-acquired-by-vendor → eventual upsell-into-paid-tier (Sentry, HashiCorp BSL, Redis license change). Moon, built by moonrepo (Miles Johnson, ex-Airbnb infra) with no commercial product, has cleaner alignment with users vs. shareholders.

This ADR documents the resolution after deliberation.

## Decision

**Adopt Turbo as the canonical task runner across `sweeinc/platform` and `sweeinc/lab`. Remove Moon entirely.**

This re-aligns implementation with the original DAN-411 §16 decision.

## Alternatives Considered

### Option A: Stay on Moon (status quo at time of ADR)
**Why not:**
- Moon is too new (~2K stars vs Turbo's ~26K) and too small to bet a multi-monorepo build pipeline on. Smaller maintainer pool = real abandonment risk.
- Zero overlap with the ecosystem of trusted reference implementations (Mysten ts-sdks, Vue, Anthropic SDK, viem, Vercel itself — all Turbo).
- Auto-id strategy bit us once and would keep biting as products multiply with conventional `packages/`, `contracts/`, `apps/`, `move/` subdirs.
- Fixing Moon's id strategy requires writing `moon.yml` per project (~30 files across both repos) — pure config debt.

### Option B: Adopt Moon everywhere with explicit `moon.yml` per project
**Why not:**
- Even if config debt is paid, the ecosystem-alignment cost remains. Future agents and contributors will arrive expecting Turbo (because Mysten + Vue + Anthropic SDK use it) and have to ramp on Moon-specific concepts (toolchain, tasks, project graph syntax) instead.
- Moon's killer feature is multi-language project graphs (Rust + TS in one DAG). The current monorepos have Rust (`vault/sweesense/`) but it lives in its own Cargo workspace and is not a bottleneck. Paying Moon's ecosystem cost for a feature we are not using is a bad trade.

### Option C (chosen): Migrate everything to Turbo
**Why this:**
- Convergent adoption — same tool as Mysten ts-sdks, Vue ecosystem, Anthropic SDK, viem, Vercel. Future hires and AI agents land in familiar territory.
- Vendor-capture risk on Turbo is real but slow-moving (5-year horizon, not 12-month). Migration is symmetric — if Vercel does something hostile (e.g., Remote Cache requires Vercel account, BSL relicense), we revisit.
- Aligns lab tooling with platform tooling — one mental model across both repos. DAN-411 §11 invariant ("workspace alignment") gets stronger.
- Restores DAN-411 §16's canonical choice. Removes a doc-vs-reality drift.

## Consequences

### Positive
- One mental model for build/test/typecheck across both repos.
- Aligns with the trusted reference ecosystem (Mysten et al.).
- Removes Moon's brittle auto-id strategy (the bug source).
- `turbo.json` is one file per repo — less config surface than per-project `moon.yml`.
- Future agents arrive with prior Turbo knowledge instead of having to learn Moon.

### Negative
- Vendor-capture risk on Turbo is real (Vercel-owned). Must be monitored.
- Loses Moon's multi-language graph capability — if cross-language orchestration becomes needed later, we may need to revisit.
- Migration cost: drop Moon plumbing in both repos, add `turbo.json`, update root scripts, update CI.

### Risks (Watch List for Re-evaluation)

Trigger a re-read of this ADR if any of these happen to Turbo:

1. **License change** — anything other than MIT (e.g., BSL, SSPL, Elastic License).
2. **Remote Cache requires Vercel account** — currently self-hostable; if that breaks, alignment cost rises.
3. **Vercel-only features creep into core** — e.g., features that only work when deployed on Vercel.
4. **Maintenance signal collapse** — release cadence stalls, GitHub issues queue grows past 1000 unaddressed, or core maintainers leave Vercel without replacement.
5. **A clearly-better alternative emerges** — and the trusted reference ecosystem (Mysten, Vue, Anthropic) moves to it. Trailing-edge migration, not leading-edge.

If 1-4 happen, candidate replacements: Moon (re-evaluate after maturity), Nx (corporate-backed but more entrenched than Turbo's parent), or pnpm's own `--filter` + `--recursive` + `concurrently` (lowest-tech but loses caching).

## References

- Linear DAN-411 §16 — canonical tooling decision (this ADR memorializes it post-drift)
- Mysten ts-sdks: https://github.com/MystenLabs/ts-sdks (Turbo reference)
- Anthropic SDK TypeScript: https://github.com/anthropics/anthropic-sdk-typescript (Turbo reference)
- Vue ecosystem: https://github.com/vuejs (Turbo reference)
- viem: https://github.com/wevm/viem (Turbo reference)
- Moon: https://moonrepo.dev/ (alternative considered, deferred)
- Vercel acquisition of Turborepo (Dec 2021) — origin of vendor-capture concern
