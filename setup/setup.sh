#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SELF_NAME="$(basename "$0")"

mapfile -t SCRIPTS < <(find "$SCRIPT_DIR" -maxdepth 1 -type f -name "*.sh" ! -name "$SELF_NAME" | sort)

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
  echo "-> Running $(basename "$script")"
  "$script"
done

echo
echo "All setup scripts completed."
