#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SELF_NAME="$(basename "$0")"
EXCEPTIONS_FILE="$SCRIPT_DIR/exception.txt"

mapfile -t SCRIPTS < <(find "$SCRIPT_DIR" -maxdepth 1 -type f -name "*.sh" ! -name "$SELF_NAME" | sort)
mapfile -t EXCEPTIONS < <(
  if [[ -f "$EXCEPTIONS_FILE" ]]; then
    grep -vE '^\s*($|#)' "$EXCEPTIONS_FILE" || true
  fi
)

if [[ ${#SCRIPTS[@]} -eq 0 ]]; then
  echo "No sibling .sh files found in $SCRIPT_DIR"
  exit 0
fi

echo "Making scripts executable..."
for script in "${SCRIPTS[@]}"; do
  chmod +x "$script"
  echo "  chmod +x $(basename "$script")"
done

echo
echo "Running scripts..."
for script in "${SCRIPTS[@]}"; do
  script_name="$(basename "$script")"
  for excluded in "${EXCEPTIONS[@]}"; do
    if [[ "$script_name" == "$excluded" ]]; then
      echo "-> Skipping $script_name (listed in $(basename "$EXCEPTIONS_FILE"))"
      continue 2
    fi
  done
  echo "-> Running $script_name"
  "$script"
done

echo
echo "All setup scripts completed."
