#!/usr/bin/env bash
set -Eeuo pipefail

# Android emulator is provisioned by android-emulator-runner before this script.
mkdir -p maestro-artifacts

finish() {
  local original_status=$?
  trap - EXIT
  set +e
  adb shell am force-stop com.fitwear.mobile >/dev/null 2>&1
  local stop_status=$?
  adb shell pm clear com.fitwear.mobile >/dev/null 2>&1
  local clear_status=$?
  adb shell cmd connectivity airplane-mode disable >/dev/null 2>&1
  local network_status=$?
  # Cleanup failures cannot be hidden by a successful Maestro run.
  if (( original_status == 0 && (stop_status != 0 || clear_status != 0 || network_status != 0) )); then
    original_status=1
  fi
  printf 'MAESTRO_EXIT_CODE=%s\n' "$original_status" >> "$GITHUB_ENV"
  exit 0 # Let the later report and final gate run; the final gate restores failure.
}
trap finish EXIT

: "${MAESTRO_TEST_EMAIL:?MAESTRO_TEST_EMAIL is required}"
: "${MAESTRO_TEST_PASSWORD:?MAESTRO_TEST_PASSWORD is required}"

adb wait-for-device
adb shell getprop sys.boot_completed | grep -q '^1$'
# A slow runner can leave Pixel Launcher "isn't responding" over the app under
# test, hiding it from Maestro. App crashes still fail the flows.
adb shell settings put global hide_error_dialogs 1
adb install -r apps/mobile/android/app/build/outputs/apk/release/app-release.apk
adb shell pm path com.fitwear.mobile >/dev/null

# Maestro addMedia returned before the API 34 picker could see the fixture.
fixture=hao-hao-barcode.jpg
photo="/sdcard/Pictures/$fixture"
adb push "apps/mobile/e2e/fixtures/$fixture" "$photo"
adb shell am broadcast -a android.intent.action.MEDIA_SCANNER_SCAN_FILE -d "file://$photo"
fixture_indexed() {
  adb shell content query --uri content://media/external/images/media \
    --projection _display_name | grep -F "$fixture" >/dev/null
}
for attempt in {1..15}; do
  if fixture_indexed; then break; fi
  sleep 1
done
if ! fixture_indexed; then
  echo "::error::Android did not index the barcode photo fixture."
  exit 1
fi

args=()
if [[ -n "${MAESTRO_INCLUDE_TAGS:-}" ]]; then
  args+=(--include-tags "$MAESTRO_INCLUDE_TAGS")
fi

maestro test \
  --format junit \
  --output maestro-artifacts/report.xml \
  --test-output-dir maestro-artifacts \
  -e "MAESTRO_TEST_EMAIL=$MAESTRO_TEST_EMAIL" \
  -e "MAESTRO_TEST_PASSWORD=$MAESTRO_TEST_PASSWORD" \
  "${args[@]}" \
  apps/mobile/e2e
