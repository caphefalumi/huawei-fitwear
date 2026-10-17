<!--
  Title: Differences Between the Emulator and the Real Device
  Catalog: harmonyos-guides
  Document ID: ide-emulator-specification
  Updated: 2026-09-16 01:52:54
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/ide-emulator-specification
-->
# Differences Between the Emulator and the Real Device

The Emulator is a convenient tool for developing and debugging HarmonyOS apps and atomic services. For example, you can develop and debug atomic services without configuring the server domain name. In most cases, pushing packages for debugging on the Emulator does not require signing; however, some Kits still require signing to run properly. For specific requirements, see the corresponding Kit development guides.

Due to differences in hardware and capabilities between the Emulator and real devices, some functional scenarios still need to be tested on real devices. This document helps you to determine which features to test on the Emulator and which on real devices.

#### Performance Differences

The Emulator is a virtual machine app running on a macOS or Windows computer. It uses the computer's hardware resources, including CPUs, memory, and network connections. These resources may differ significantly from those of real devices in terms of capacity and speed. Therefore, the Emulator is not suitable for testing the performance (for example, data processing, graphics rendering, and network speed) or resource usage (for example, memory, CPU, and power consumption) of apps/atomic services. Performance test results from the Emulator can only be used to evaluate relative differences in app functionalities. To obtain user experience data in real scenarios, you are advised to conduct tests on real devices.

#### Display Effect Differences

- The Emulator uses the computer's display, which differs from the screen of real devices. This may cause jagged edges on text and images displayed in the Emulator. Enlarging the Emulator window can make text and images clearer.
- The color gamut range of computer screens may differ from that of mobile devices, leading to inaccurate color display.
- The Emulator does not support screen brightness adjustment.

#### Graphics API Differences

- The Emulator does not support OpenGL ES 3.1 or 3.2.
- Versions earlier than DevEco Studio 6.1.0 Beta2 do not support Vulkan. Since DevEco Studio 6.1.0 Beta2, all Vulkan APIs are supported except for **vkGetSwapchainGrallocUsageOHOS**, **vkAcquireImageOHOS**, and **vkQueueSignalReleaseImageOHOS**.

#### Multimedia Differences

- The Emulator does not support images in HEIF format.
- The Emulator supports only H.264-encoded video files in the RGBA pixel format.
- The Emulator does not support video recording, transcoding, processing, and screen recording.

#### Kit Differences

Currently, some Kits behave differently on emulators than on real devices. For details, see the specific Kit documentation.

If an app crashes due to unsupported Kits, [import Kits dynamically](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/arkts-dynamic-import#implementation-of-dynamic-import).

Example of an error message caused by unsupported Kits:

```
LastFatalMessage:[default] [LoadJSPandaFile:00] resolveBufferCallback get hsp buffer failed,hsp path:/data/storage/el1/bundle/com.huawei.hmos.{KitName}.kit
```

#### Other Differences

| Significant Difference | Affected Scenario |
| --- | --- |
| SIM card | Does not support making calls or sending text messages. |
| USB | Does not support connection or data transfer. |
| Bluetooth | Does not support Bluetooth device scanning, connection, or data transfer. |
| NearLink | Does not support NearLink device scanning, connection, data transfer, or distributed capabilities. |
| NFC | Does not support NFC card read, write, or tapping. |
| Trusted Execution Environment (TEE) | Does not support secure GPS, device certificates, or other security-related features. Some security-related Kits are temporarily not supported. For details, see [Security](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/system-security). |
| NPU | Does not support certain AI-related Kits temporarily. For details, see [Agent Framework Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/hmaf-introduction). |
| Biometrics | Does not support fingerprint, facial recognition, or other biometric authentication methods. |
| Camera/Microphone | Relies on computer devices; does not support multi-camera switching (wide-angle/telephoto), color space, flash, or noise reduction algorithms. If no camera is available, the [virtual camera](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/ide-emulator-more-features#section11725194916439) can be used. |
| Power | Emulates power supply; does not support scenarios such as temperature control and fast charging. |
