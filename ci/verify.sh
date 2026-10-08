#!/usr/bin/env bash
set -Eeuo pipefail
cd -- "$(dirname -- "$0")/.."
bun install --frozen-lockfile
bun run verify
bun test scripts
git diff --check
