#!/usr/bin/env bash
set -euo pipefail

THRESHOLD="${1:-85}"
TMP_FILE="$(mktemp)"
LCOV_FILE="coverage/lcov.info"
trap 'rm -f "$TMP_FILE"' EXIT

bun test --coverage --coverage-reporter=text --coverage-reporter=lcov 2>&1 | tee "$TMP_FILE"

if [[ ! -f "$LCOV_FILE" ]]; then
  echo "Could not find LCOV output at $LCOV_FILE."
  exit 1
fi

LINES_PERCENT="$(
  awk '
    BEGIN {
      exclude["handlers/fourPlayer.ts"] = 1;
      exclude["bullmq/connection.ts"] = 1;
      exclude["bullmq/queues.ts"] = 1;
      exclude["utils/metrics.ts"] = 1;
      exclude["handlers/http.ts"] = 1;
      exclude["handlers/challenge.ts"] = 1;
    }
    /^SF:/ {
      file = substr($0, 4);
      sub(/^.*backend\/ws-server\//, "", file);
      skip = exclude[file];
      next;
    }
    /^LF:/ && !skip {
      lines_found += substr($0, 4) + 0;
      next;
    }
    /^LH:/ && !skip {
      lines_hit += substr($0, 4) + 0;
      next;
    }
    END {
      if (lines_found == 0) {
        print "";
      } else {
        printf("%.2f", (lines_hit / lines_found) * 100);
      }
    }
  ' "$LCOV_FILE"
)"

if [[ -z "${LINES_PERCENT}" ]]; then
  echo "Could not parse coverage percentage from LCOV output."
  exit 1
fi

awk -v lines="${LINES_PERCENT}" -v threshold="${THRESHOLD}" '
  BEGIN {
    if (lines + 0 < threshold + 0) {
      printf("Coverage gate failed: filtered lines %.2f%% < %.2f%%\n", lines + 0, threshold + 0);
      exit 1;
    }
    printf("Coverage gate passed: filtered lines %.2f%% >= %.2f%%\n", lines + 0, threshold + 0);
  }
'
