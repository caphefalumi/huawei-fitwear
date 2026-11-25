# Test and Debug for Huawei Smartwatch Apps

DevEco Studio provides an integrated workflow for validating smartwatch layouts, sensor behaviors, and distributed interactions across Previewers, Emulators, and physical Huawei watches.

## 1. Multi-Tier Testing Workflow
* **UI Previewer (Rapid Layout Iteration)**:
  * Use the DevEco Studio Previewer to inspect circular watch masks, `xs` responsive breakpoints, font scaling, and dark-mode contrast in real time without deploying a build.
* **Huawei Wearable Emulator (Functional & Sensor Simulation)**:
  * Create a **Wearable** virtual device in **Device Manager** to test multi-page navigation, `ArcList` scrolling, and lifecycle transitions (`onForeground` / `onBackground`).
  * Use the Emulator's **Extended Controls / Virtual Sensors** panel to inject simulated heart rate, step count, GPS coordinates, and battery state changes.
* **Physical Huawei Smartwatch (Hardware & Performance Sign-Off)**:
  * Connect a physical Huawei smartwatch via wireless ADB/HDC debugging (over Wi-Fi or Bluetooth bridge via the companion phone) to verify real-world:
    * Rotating crown tactile responsiveness and bezel edge touch accuracy.
    * Live optical heart-rate / accelerometer sensor latency.
    * Phone-to-watch distributed data synchronization and reconnection recovery.

## 2. Debugging Best Practices
* **HiLog Filtering**: Tag wearable logs with domain-specific `HiLog` identifiers and filter by process/tag in DevEco Studio Logcat to trace background sensor callbacks without flooding I/O.
* **Lifecycle & Watch-Face Interruptions**: Test incoming calls, notifications, palm-to-sleep gestures, and wrist-off lock events to ensure active workouts and timers persist reliably.