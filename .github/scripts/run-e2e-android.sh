#!/usr/bin/env bash
set -Eeuo pipefail

# Android emulator is provisioned by android-emulator-runner before this script.
# e2e writes junit.xml, report.json and per-test results/ (videos, screenshots,
# traces) under --output, which e2e requires inside its project (apps/mobile).
artifacts="$PWD/apps/mobile/e2e-artifacts"
mkdir -p "$artifacts"

# Each test's video is written to results/<test>/<attempt>/video/video.mp4.
# Copy them to recordings/<test>__<attempt>.mp4 so every test has its own file.
collect_recordings() {
  local recordings="$artifacts/recordings" video name
  rm -rf "$recordings"
  [[ -d "$artifacts/results" ]] || return 0
  mkdir -p "$recordings"
  while IFS= read -r -d '' video; do
    name="${video#"$artifacts/results/"}"
    name="${name%/video/*}"
    name="${name//\//__}"
    cp "$video" "$recordings/$name.mp4"
  done < <(find "$artifacts/results" -type f -path '*/video/*.mp4' -print0)
}

finish() {
  local original_status=$?
  trap - EXIT
  set +e
  collect_recordings
  adb shell am force-stop com.fitwear.mobile >/dev/null 2>&1
  local stop_status=$?
  adb shell pm clear com.fitwear.mobile >/dev/null 2>&1
  local clear_status=$?
  adb shell cmd connectivity airplane-mode disable >/dev/null 2>&1
  local network_status=$?
  # Cleanup failures cannot be hidden by a successful e2e run.
  if (( original_status == 0 && (stop_status != 0 || clear_status != 0 || network_status != 0) )); then
    original_status=1
  fi
  printf 'E2E_EXIT_CODE=%s\n' "$original_status" >> "$GITHUB_ENV"
  exit 0 # Let the later report and final gate run; the final gate restores failure.
}
trap finish EXIT

: "${E2E_TEST_EMAIL:?E2E_TEST_EMAIL is required}"
: "${E2E_TEST_PASSWORD:?E2E_TEST_PASSWORD is required}"

adb wait-for-device
adb shell getprop sys.boot_completed | grep -q '^1$'
# A slow runner can leave Pixel Launcher "isn't responding" over the app under
# test, hiding it from the test runner. App crashes still fail the tests.
adb shell settings put global hide_error_dialogs 1
adb install -r apps/mobile/android/app/build/outputs/apk/release/app-release.apk
adb shell pm path com.fitwear.mobile >/dev/null

# The photo picker test needs this fixture indexed by the API 34 media store.
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

# Comma-separated tags select tests carrying any of them.
args=()
if [[ -n "${E2E_TAGS:-}" ]]; then
  args+=(--tag "$E2E_TAGS")
fi

cd apps/mobile
npx --no-install e2e run \
  --target android \
  --reporter list,junit \
  --output e2e-artifacts \
  "${args[@]}"
