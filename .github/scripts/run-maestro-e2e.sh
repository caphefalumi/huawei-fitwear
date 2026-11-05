#!/usr/bin/env bash
set -euo pipefail

adb wait-for-device
adb install -r apps/mobile/android/app/build/outputs/apk/release/app-release.apk
sleep 5
mkdir -p maestro-artifacts/recordings

flows=()
if [[ "${RUN_FITNESS:-false}" == "true" ]]; then
  flows+=(apps/mobile/tests/e2e/fitness.yaml)
fi
if [[ "${RUN_ERROR_MESSAGES:-false}" == "true" ]]; then
  flows+=(apps/mobile/tests/e2e/error-messages.yaml)
fi
if ((${#flows[@]} == 0)); then
  echo "::error::No Maestro E2E flow was selected."
  exit 1
fi

printf 'Selected flows: %s\n' "${flows[*]}"
set +e
maestro test --format junit --output maestro-artifacts/report.xml --test-output-dir maestro-artifacts "${flows[@]}"
maestro_exit=$?
set -e
printf 'MAESTRO_EXIT_CODE=%s\n' "$maestro_exit" >> "${GITHUB_ENV:?GITHUB_ENV is required}"
exit "$maestro_exit"
