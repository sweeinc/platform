#!/usr/bin/env node
/**
 * Cross-monorepo dependency boundary check.
 *
 * Enforces DAN-411 §15 rule #4: platform packages CANNOT depend on lab-only
 * scopes. Forces graduation order — if a platform package needs lab
 * functionality, the lab package must graduate first OR functionality is
 * inlined/duplicated.
 *
 * Lab-only scopes (deny-list):
 *   @sweeagent/*, @sweeos/*, @sweesense/*, @sweeworld/*,
 *   @sweeinc/sweemandate*, @sweeinc/sweeid*, @sweeinc/sweepay*,
 *   @sweeinc/sweedollar*, @sweeinc/sweecoin*, @sweeinc/sweeverify*,
 *   @sweeinc/sweetap*
 *
 * Platform-allowed scopes:
 *   @sweefi/*  — every published package on npm
 *   @sweeinc/std (and any future @sweeinc/* infra utility)
 *
 * Exit 0 if clean. Exit 1 with file:dep details if a violation is found.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

const DENY_PATTERNS = [
  /^@sweeagent\//,
  /^@sweeos\//,
  /^@sweesense\//,
  /^@sweeworld\//,
  /^@sweeinc\/swee(mandate|id|pay|dollar|coin|verify|tap)/,
];

const SKIP_DIRS = new Set(['node_modules', 'dist', '.turbo', 'build', '.git']);

function walkPackageJson(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const p = join(dir, entry);
    let s;
    try {
      s = statSync(p);
    } catch {
      continue;
    }
    if (s.isDirectory()) {
      out.push(...walkPackageJson(p));
    } else if (entry === 'package.json') {
      out.push(p);
    }
  }
  return out;
}

const files = [
  ...walkPackageJson(join(ROOT, 'products')),
  ...walkPackageJson(join(ROOT, 'shared')),
];

const violations = [];

for (const file of files) {
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    continue;
  }
  const relFile = file.replace(ROOT + '/', '');

  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies,
    ...pkg.optionalDependencies,
  };

  for (const dep of Object.keys(allDeps)) {
    for (const pattern of DENY_PATTERNS) {
      if (pattern.test(dep)) {
        violations.push({ file: relFile, pkg: pkg.name ?? '(unnamed)', dep });
      }
    }
  }
}

if (violations.length === 0) {
  console.log(
    `✓ Platform boundary check passed (${files.length} packages scanned, no lab-scope deps found)`,
  );
  process.exit(0);
}

console.error(`✗ Platform boundary check FAILED — found ${violations.length} violation(s):\n`);
console.error(`DAN-411 §15 rule #4: platform packages CANNOT depend on lab-only scopes.`);
console.error(
  `If you need this dep, the lab package must graduate first OR the functionality must be inlined.\n`,
);
for (const v of violations) {
  console.error(`  ${v.file}`);
  console.error(`    package: ${v.pkg}`);
  console.error(`    forbidden dep: ${v.dep}\n`);
}
process.exit(1);
