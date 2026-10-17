<!--
  Title: Running a Lite Wearable App via the Simulator
  Catalog: harmonyos-guides
  Document ID: ide-run-simulator
  Updated: 2026-09-16 01:52:33
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/ide-run-simulator
-->
# Running a Lite Wearable App via the Simulator

The Simulator provided by DevEco Studio can run and debug HarmonyOS apps on lite wearables, supporting both signed and unsigned HAPs.

#### Procedure

- Select **Huawei Lite Wearable Simulator** from the device dropdown in the upper-right corner of DevEco Studio.
- Click **Run** or **Debug** . In the dialog box displayed, set the device shape and resolution, and click **OK** to run or debug the app.
- DevEco Studio begins compilation, building, and installation. Upon completion, the app can run on the Simulator.

#### Supported Features

In the Simulator screen, click **More** above the device to expand additional features.

## Screen

- **Turn screen on**: Controls the screen on/off.
- **Keep screen on**: Controls whether the screen remains on. When disabled, the screen will automatically turn off after the timeout period, and the **Turn screen on** switch will also be disabled. After turning the screen on, you must enable **Keep screen on** to keep the screen awake.
- **Brightness adjustment mode**: Adjusts the screen brightness.**Manual**: Adjust by dragging the slider or entering a brightness value.
- **Automatic**: Adjust automatically.

- **Resolution**: Adjusting resolution is not supported in run or debug mode. To change it, stop the current session and select a new resolution by following the [operation steps](#section1332819367496).

## Sensor

The Simulator provides virtual sensors to emulate hardware capabilities. On this page, you can adjust various sensors to test your app. Use the [@system.sensor](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-system-sensor) module to listen for changes in sensor values and the [@system.geolocation](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-system-location) module to listen for geographic location changes. The following virtual sensors are available:

- **On-body status**: indicates whether the device is being worn.
- **Barometer**: Measures the ambient air pressure in Pascals (Pa).
- **Heart rate**: Measures the user's heart rate. Adjust the value by dragging the slider or entering it directly.
- **Step count**: Tracks the number of walking steps. Adjust the value by dragging the slider or entering it directly.
- **Geographic location**: Simulates the device's geographical position by allowing you to input longitude and latitude.

## Battery
The Simulator allows you to simulate different battery states, including three charging states. You can also change the battery level manually by entering a value or dragging the slider. In your app, use the [@system.battery](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-system-battery) module to query the simulated device's battery level and charging state.

- **Not charging**
- **Charging**
- **Wireless charging**

## Device Settings

You can change the device's language and region. This is only supported in run mode, not in debug mode.

## Debugging

- **Screen coordinate system**: When enabled, moving the cursor over the watch face will display the screen coordinates.
- **Show device mask**: When disabled, the color of the crown around the watch face fades.
