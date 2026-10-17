<!--
  Title: Vibrator Overview
  Catalog: harmonyos-guides
  Document ID: vibrator-overview
  Updated: 2026-10-14 09:33:49
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/vibrator-overview
-->
# Vibrator Overview

The **vibrator** module extends the vibrator service via maximizing utilization of vibrator hardware capabilities. By innovatively integrating vibration and interaction, the module takes user interaction efficiency and usability to the next level.

#### Working Principles

The vibrator is a Misc device that consists of four modules: Vibrator API, Vibrator Framework, Vibrator Service, and HDF layer.

**Figure 1** Vibrator in Misc devices

- Vibrator API: provides basic vibrator APIs, which can be used to query the vibrator list and the vibration effect, and start or stop the vibrator.
- Vibrator framework: manages the framework layer of the vibrator and communicates with the Misc Device Service.
- Misc device service: manages services of controllers.
- HDF layer: adapts to different devices.

#### Constraints

When using a vibrator, you must declare the **ohos.permission.VIBRATE** permission before you can control the vibration effect.
