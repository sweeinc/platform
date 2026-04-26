# Swee Inc Architecture — v5.2

> Canonical architecture decision record for `sweeinc/platform` and `sweeinc/lab`.
> Last updated: 2026-04-26.
> Full migration history + risk analysis: [Linear DAN-411](https://linear.app/dannydevs/issue/DAN-411).

## TL;DR

Two monorepos with product-based subtree organization:

- **`sweeinc/platform`** PUBLIC, Apache-2.0 — mature, audited, ready-to-show code
- **`sweeinc/lab`** PRIVATE — incubator + commercial products + strategic moats

Within each: `products/{X}/{move,sdk,gateway,dapp,audits}/` + `shared/` + (lab only: `moats/`).

Per-product repos extracted lazily via `git filter-repo` only when justified (independent deploy lifecycle, external maintainers, audit boundary).

## Cardinal rules

1. **Visibility rule**: a repo and its npm packages share visibility. Within a monorepo, `package.json` `"private": true` gates per-package npm publish.
2. **Placement rule**: split by OSS intent (public vs private), NOT by maturity.
3. **Lazy creation**: never pre-create empty repos.
4. **Cross-monorepo dep rule**: `platform` packages CANNOT depend on `lab` packages. Lab package must graduate first OR be inlined/duplicated.
5. **Product cohesion rule**: a product's full stack lives under `products/{name}/`. Atomic graduation = single `git mv`.

## Naming convention

| Pattern | Rule | Examples |
|---|---|---|
| Brand-name product | NO hyphen | `sweedollar`, `sweecoin`, `sweetap`, `sweesense`, `sweeworld`, `sweemandate`, `sweepay`, `sweeverify`, `sweeid` |
| Multi-concept descriptor | Hyphenated | `sweefi-cli`, `sweefi-contracts`, `sweeinc-landing`, `sui-gas-station` |
| Product SDKs on npm | `@sweeinc/{brand}-sdk` | `@sweeinc/sweemandate-sdk`, `@sweeinc/sweepay-sdk`, `@sweeinc/sweeid-sdk` |
| Generic infra | `@sweeinc/{name}` | `@sweeinc/std` |

Physical paths use `products/{brand}/{component}/`. Component names are short within product context (`sui/`, `cli/`, `move/`, `sdk/`, `gateway/`, `dapp/`).

## Maturity gate (external forcing functions)

A package graduates from `lab` → `platform` when **at least one** scriptably-verifiable external forcing function passes:

| Type | External signal (must pass at least one) |
|---|---|
| TS SDK | (a) ≥3 unique GitHub usernames NOT in `sweeinc/`/`Danny-Devs/`/`s402-protocol/` orgs, with public dep declaration OR merged PR OR public Issue with code; OR (b) Sui docs citation; OR (c) paying customer dependency |
| Move contract | (a) external audit firm signed off; OR (b) ≥4 weeks testnet uptime AND ≥100 unique non-Danny addresses; OR (c) bug bounty 30+ days no critical findings |
| Service | (a) ≥4 weeks production uptime serving external traffic; OR (b) external operator self-hosting (fork or non-sweeinc.com deployment) |
| App / dApp | (a) ≥100 unique real wallet users (on-chain verifiable); OR (b) Sui Foundation feature; OR (c) public launch announcement |

Internal criteria (tests ≥80%, README quality, no AI-slop) are **prerequisites only**. External signal triggers graduation.

`lab/moats/*` is **structurally ineligible** for graduation regardless of any forcing function. Path enforces policy.

## STATUS.md (per product)

Every product folder has a `STATUS.md`:

```yaml
---
intent: graduates-to-platform | proprietary-forever | undecided
target_graduation_signal: external-audit | testnet-uptime | external-users | sui-docs-citation | n/a
status: greenfield | dev | testnet | pre-graduation | graduated
---

## Notes
{prose context, what blocks graduation, last review date}
```

`lab/moats/*` STATUS.md must declare `intent: proprietary-forever`.

## MOVE-PROVENANCE.md (per Move package)

Per Move package, lives at `products/{X}/MOVE-PROVENANCE.md`:

```markdown
# {Product} Move Provenance

## Deployed Package IDs

| Network | Package ID | Deployed | Source SHA | Source Path | Audit Ref |
|---|---|---|---|---|---|
| testnet | 0x... | 2026-MM-DD | sha | path | — |
| mainnet | 0x... | 2026-MM-DD | sha | path | audits/{X}/AUDIT-v1.pdf |

## Source Path History
{path migrations across graduation events}

## Upgrade Policy
- {immutable | publisher-trusted}
- UpgradeCap holder: {address or DAO}

## Audit References
{linked reports}
```

Move package IDs are immutable once deployed. Source paths change across graduation. Provenance doc bridges the two for auditors and on-chain investigators.

## Codegen flow (3-stage Pattern B)

`@mysten/codegen` supports BOTH `move build` artifact mode AND on-chain mode:

- **Stage 1 (greenfield)**: `sui move build` → codegen from build artifacts. SDK + dapp dev iterates without testnet deploy.
- **Stage 2 (testnet)**: deploy to testnet, codegen from deployed package ID.
- **Stage 3 (mainnet, post-audit)**: deploy to mainnet, codegen final, publish SDK to npm.

Update `MOVE-PROVENANCE.md` at each stage transition.

## Audit reports flow (dual-track)

| Where | What | When |
|---|---|---|
| `lab/products/{X}/audits/` | Proprietary process artifacts: auditor correspondence, drafts, internal triage | Forever — never moves |
| `platform/audits/{X}/` | Sanitized public report (PDF/markdown) | Copied at graduation |

## Cross-monorepo discipline

**Workspace deps alignment**: both monorepos use `pnpm.overrides` to force major-version alignment on shared upstream deps (`@mysten/sui`, `vitest`, `vite`, `typescript`). Quarterly dep-sync ritual.

**Secrets management**: GitHub Organization-level secrets, inherited by both repos.

**Branch protection**: identical main branch rules across repos via templated GitHub Settings.

**Forwarder markers**: when a package graduates, leave `MIGRATED-TO.md` in lab path with new platform path + commit SHA.

## Tooling

See Linear DAN-411 §16 for the canonical tooling stack. Subject to amendment as polyglot needs evolve.

## Graduation + rollback

- See [GRADUATION.md](./GRADUATION.md) (when scaffolded) for single-package + coupled-product runbooks.
- See [ROLLBACK.md](./ROLLBACK.md) (when scaffolded) for the 30-day demote window.

## Existing repos absorbed (planned)

| Existing | Destination |
|---|---|
| `sweeinc/sweefi` (PUBLIC, 1.6MB) | `sweeinc/platform/products/sweefi/` (this repo) |
| `sweeinc/sweeagent` (PRIVATE) | `sweeinc/lab/products/sweeagent/` |
| `sweeinc/sweesense` (PRIVATE, Rust) | `sweeinc/lab/moats/sweesense/` |
| `sweeinc/sweeworld` (PRIVATE) | `sweeinc/lab/moats/sweeworld/` |
| `sweeinc/sweeos` (PRIVATE) | `sweeinc/lab/products/sweeos/` (or moats — TBD) |

Migration via `git filter-repo` to preserve full history.

## Companion

`sweeinc/lab` (private) holds work-in-progress, commercial products, and strategic moats. Mature work graduates here via the runbook.
