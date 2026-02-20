#!/usr/bin/env bash
set -euo pipefail

THRESHOLD="${1:-85}"
TMP_FILE="$(mktemp)"
trap 'rm -f "$TMP_FILE"' EXIT

bun test --coverage 2>&1 | tee "$TMP_FILE"

LINES_PERCENT="$(
  awk -F'|' '/All files/{gsub(/ /,"",$3); print $3}' "$TMP_FILE" | tail -n1
)"

if [[ -z "${LINES_PERCENT}" ]]; then
  echo "Could not parse coverage percentage from bun output."
  exit 1
fi

awk -v lines="${LINES_PERCENT}" -v threshold="${THRESHOLD}" '
  BEGIN {
    if (lines + 0 < threshold + 0) {
      printf("Coverage gate failed: lines %.2f%% < %.2f%%\n", lines + 0, threshold + 0);
      exit 1;
    }
    printf("Coverage gate passed: lines %.2f%% >= %.2f%%\n", lines + 0, threshold + 0);
  }
'
