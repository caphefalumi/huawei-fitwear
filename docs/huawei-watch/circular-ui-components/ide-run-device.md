<!--
  Title: Running Your App on a Local Real Device
  Catalog: harmonyos-guides
  Document ID: ide-run-device
  Updated: 2026-09-16 01:52:33
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/ide-run-device
-->
# Running Your App on a Local Real Device

Install and run your HarmonyOS app/atomic service on a local real device in either USB or wireless mode.

> **Note:** Wearables (excluding lite wearables) support only wireless debugging.

#### Prerequisites

- The device operating system is HarmonyOS NEXT Developer Beta1 or later.
- On the HarmonyOS real device, check whether **Developer options** exists in **Settings** > **System**. If it does not exist, choose **Settings** > *Device name*, tap the software version number seven times in quick succession until a prompt like "Enable developer options" appears. Tap the confirm button and enter the PIN (if set). The device will automatically restart. Wait until the restart is complete.
- The app/atomic service has been signed. For details, see [Configuring a Debug Signature](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/ide-signing).

#### In USB Mode

- Use a USB cable to connect the real device to the computer.
- Choose **Settings** > **System** > **Developer options** and enable **USB debugging** (this option is available only when the device is connected through a USB cable).
- When a USB debugging authorization prompt appears on the real device, click **OK**.
- On the menu bar, choose **Run** > **Run '***module name***'** or click , or press **Shift+F10** (**Control+R** on macOS).
- DevEco Studio will start to build and install the HAP on the device. The device will automatically run your app/atomic service once it is installed.

## Troubleshooting with the Device Connection Assistant

Since DevEco Studio 5.1.1 Beta1, if DevEco Studio cannot detect the device after it is connected, the message "No Devices" is displayed. You can use the device connection assistant for troubleshooting. Click the device drop-down menu and select **Troubleshoot Device Connections** to enable it. This initiates a three-step diagnostic process. Click **Next** after completing each step.

- **Connect your device via USB**. Click **Rescan Devices** to refresh the connected device list. Ensure your target device appears in the results.
- **Enable USB debugging**. Verify the OS version of your device. Enable **Developer options** and **USB debugging** on your device.
- **Restart the hdc service**. If DevEco Studio still cannot identify the device, click **Restart hdc Service**. This forces hdc to re-detect connected devices. If issues persist, see [What should I do if the device cannot be detected after being connected?](https://developer.huawei.com/consumer/en/doc/harmonyos-faqs/faqs-app-debugging-3) or [What should I do if a device cannot be identified by hdc?](https://developer.huawei.com/consumer/en/doc/harmonyos-faqs/faqs-performance-analysis-kit-32).

#### In Wireless Mode

- Connect the real device and the PC to the same WLAN.
- Choose **Settings** > **System** > **Developer options** and enable **Wireless debugging** or **Debug via WLAN** (for wearables) and obtain the IP address and port number of the device.
- Connect the device in either of the following ways: Using DevEco StudioFor 6.1.1 Release (6.1.1.300) or later, choose **Tools** > **IP Connection** via the menu bar, or click **IP Connection** in the device drop-down list. Enter the IP address and port number of the device in the format of "IP:port," and click **Connect** to connect to the device. After the connection is successful, the device is displayed in the list. By default, the screen is always on. After screen always-on is enabled, DevEco Studio will continuously send screen-on instructions to the device to keep the screen on. Even if the device is manually locked, the screen will automatically turn back on. This is the normal behavior of DevEco Studio sending screen-on instructions to keep the screen on. To disable the screen always-on mode, use either of the following methods: Method 1: Click **Disable Screen Always-On** in the **IP Connection** panel.
- Method 2: Disconnect the device.

After disabling, DevEco Studio will stop sending screen-on instructions, and the device can enter the sleep mode normally.

- For versions earlier than 6.1.1 Release (6.1.1.300), choose **Tools** > **IP Connection** via the menu bar, enter the IP address and port number of the device to be connected, and click . After the connection is successful, the device status is **online**.

- Using the hdc tool (see [hdc](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/hdc))
```bash
hdc tconn device IP address:port number
```

- On the menu bar, choose **Run** > **Run '***module name***'** or click , or press **Shift+F10** (**Control+R** on macOS).
- DevEco Studio will start to build and install the HAP on the device. The device will automatically run your app/atomic service once it is installed.
