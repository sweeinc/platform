---
"@sweefi/sui": patch
"@sweefi/mcp": patch
"@sweefi/ap2-adapter": patch
---

Align declared `@mysten/sui` peerDep / devDep range to `^2.6.0` across the three
packages still declaring `^2.0.0`. The root `pnpm.overrides` already pins the
runtime version to `^2.6.0`, so this is a declaration-hygiene fix with no
functional change. Brings the platform monorepo to consistent semver alignment
with the published `@sweefi/sui@0.4.x` line.
