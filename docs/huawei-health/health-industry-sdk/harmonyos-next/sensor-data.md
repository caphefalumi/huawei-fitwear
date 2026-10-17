<!--
  Title: Sensor Data
  Catalog: huaweihealth-Guides
  Document ID: sensor-data-0000002527131942
  Updated: 2026-08-05 02:10:10
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/sensor-data-0000002527131942
-->
# Sensor Data

You can directly use the system APIs provided by HarmonyOS to implement related requirements. For details, please refer to the [Sensor Service Kit development overview](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/sensorservice-kit-intro).

> **Note:** Sensor Service Kit enables apps to obtain raw data from sensors and provides vibration control capabilities. The sensor module provides APIs for apps to access the underlying sensor hardware. Using these APIs, you can query sensors on your device and subscribe to sensor data. Based on the sensor data obtained, you can customize algorithms and develop various sensor-based apps, such as compass, motion-controlled games, and fitness and health apps. Local sensors: sensors built into the device. Typical examples include accelerometers, gyroscopes, and temperature sensors. Dynamic sensors: external sensors. The sensor module supports refined control over dynamic sensors. To manage dynamically connected devices, use **sensor.on()** to enable listening for device status change events. When receiving a device disconnection event, you must call **sensor.off()** to disable event listening for this device to prevent memory leaks or API call exceptions. The vibrator module maximally unlocks the capabilities of the vibrator device. By expanding the vibrator services, it achieves an integrated design of vibration and interaction, creating a delicate and sophisticated vibration experience that takes user interaction efficiency and usability to the next level. Local vibrators: vibrators built into the device. Typical examples include rotor vibrators and linear vibrators. Dynamic vibrators: external vibrators, which support independent control and management based on information such as device connection status and vibrator status. Dynamic vibrators are widely used in connected devices, such as joysticks, remote controls, and external vibrators. To manage these devices, use **vibrator.on('vibratorStateChange', callback)** to enable listening for device connection and disconnection events.

- **[Subscribing to Real-Time PPG Data](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-ppg-sensor-0000002527132100)**
