#!/usr/bin/env node
import { parseArgs } from "node:util";
import { createRequire } from "node:module";
import { serve } from "@hono/node-server";
import { createApp } from "./app";
import { loadConfig } from "./config";

const require = createRequire(import.meta.url);
const pkg = require("../package.json") as { version: string };

const HELP = `@sweefi/facilitator — s402 payment verification & settlement service

Usage:
  npx @sweefi/facilitator <command>

Commands:
  start       Start the facilitator HTTP server (default)
  version     Print version
  help        Print this message

Environment:
  Required:  API_KEYS  (comma-separated, each ≥16 chars)
  Optional:  PORT (default 4022), FACILITATOR_KEYPAIR, *_RPC overrides,
             FEE_MICRO_PERCENT (default 5000 = 0.5%)

  Run with --env-file=.env (Node ≥20.6) to load a local file:
    node --env-file=.env $(which npx) @sweefi/facilitator start

Docs:
  https://github.com/sweeinc/platform/tree/main/products/sweefi/facilitator
`;

async function start(): Promise<void> {
  const config = loadConfig();
  const { app, gasSponsorService } = createApp(config);

  if (gasSponsorService) {
    gasSponsorService.initialize().catch((err) => {
      console.error("[gas-service] Failed to initialize gas sponsor pool:", err);
      console.error("[gas-service] Gas sponsorship will be unavailable. Fix the sponsor keypair/balance and restart.");
    });
  }

  const server = serve({ fetch: app.fetch, port: config.PORT }, (info) => {
    console.log(`@sweefi/facilitator v${pkg.version} listening on http://localhost:${info.port}`);
  });

  const shutdown = async (): Promise<void> => {
    console.log("@sweefi/facilitator shutting down...");
    if (gasSponsorService) {
      await gasSponsorService.close();
    }
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

async function main(): Promise<void> {
  const { positionals } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    strict: false,
  });

  const command = positionals[0] ?? "start";

  switch (command) {
    case "start":
      await start();
      return;
    case "version":
    case "--version":
    case "-v":
      console.log(pkg.version);
      return;
    case "help":
    case "--help":
    case "-h":
      console.log(HELP);
      return;
    default:
      console.error(`Unknown command: ${command}\n`);
      console.error(HELP);
      process.exit(2);
  }
}

main().catch((err) => {
  console.error("[facilitator] fatal:", err);
  process.exit(1);
});
