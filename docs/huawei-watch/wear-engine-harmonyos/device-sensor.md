<!--
  Title: Obtaining Wearable Device Sensor Data
  Catalog: harmonyos-guides
  Document ID: device_sensor
  Updated: 2026-10-14 09:34:25
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/device_sensor
-->
# Obtaining Wearable Device Sensor Data

The human body sensor features can only be used by professional research institutions.

Your phone app can use Wear Engine to obtain the sensor information on the wearable device, and control the obtaining of the sensor data by running the on and off command.

Before using a sensor-related API, apply for the corresponding permission from the user on the phone (by referring to [Requesting User Authorization](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/request_user_authorization)). Otherwise, the API calling will fail.

| Sensor Type | Permission |
| --- | --- |
| ECG, PPG, HR | [HEALTH_SENSOR](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#permission) human body sensor |
| ACC, GYRO, MAG | [MOTION_SENSOR](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#permission) motion sensor |

> **Note:** The wearable device sensor data can be obtained by your phone app even if you do not have a counterpart app installed on the wearable device. Ensure that the wearable device is connected to the Huawei Health app. Users can query the connection status on the **Devices** screen in the Huawei Health app. You can determine whether the device is connected by calling [getConnectedDevices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#getconnecteddevices). If the target device is not included in the returned device list, prompt the user to reconnect the device.

#### Obtaining the List of Sensors on the Wearable Device

> **Note:** To call this API, you need to apply for the motion sensor permission or human body sensor permission (restricted) on HUAWEI Developers by referring to [Applying for Integrating Wear Engine](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply) and request user authorization.

Your phone app can obtain the list of sensors on the wearable device, and sensor parameters such as names, IDs, and reporting periods.

- Obtain the list of connected wearable devices by referring to [Querying Connected Wearable Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_connected_devices).
- Select the device to communicate with from the list of connected devices by referring to [Selecting a Target Device](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/we-device-selection).
- Call the [getSensorClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#wearenginegetsensorclient) method in [wearEngine](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api) to obtain the [SensorClient](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#sensorclient) object.
- Call the [getSensorList](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#getsensorlist) method to obtain the list of sensors on a specified connected device. 
```typescript
// Step 3: Obtain the SensorClient client.
let sensorClient: wearEngine.SensorClient = wearEngine.getSensorClient(this.getUIContext().getHostContext());

// Step 4: Obtain the list of sensors on the specified connected device.
sensorClient.getSensorList(targetDevice.randomId).then((sensorList) => {
  console.info(`Succeeded in getting sensor list, result is ${sensorList}`);
}).catch((error: BusinessError) => {
  console.error(`Failed to get sensor list. Code is ${error.code}, message is ${error.message}`);
})
```

#### Subscribing to Data Reporting of a Specified Sensor

> **Note:** To call this API, you need to apply for the motion sensor permission or human body sensor permission (restricted) on HUAWEI Developers by referring to [Applying for Integrating Wear Engine](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply) and request user authorization.

After obtaining the sensor list through [getSensorList](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#getsensorlist), your phone app can subscribe to data of a specified sensor through [subscribeSensor](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#subscribesensor), and cancel the subscription through [unsubscribeSensor](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#unsubscribesensor).

- Obtain the list of connected wearable devices by referring to [Querying Connected Wearable Devices](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/query_connected_devices).
- Select the device to communicate with from the list of connected devices by referring to [Selecting a Target Device](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/we-device-selection).
- Obtain the device's sensor list by referring to [Obtaining the List of Sensors on the Wearable Device](#obtaining-the-list-of-sensors-on-the-wearable-device).
- Check whether the target sensor exists in the sensor list.
- Subscribe to or unsubscribe from sensor data reporting. 
```typescript
let sensorClient: wearEngine.SensorClient = wearEngine.getSensorClient(this.getUIContext().getHostContext());
let sensorList: wearEngine.Sensor[] = await sensorClient.getSensorList(targetDevice.randomId);
sensorList.forEach((sensor, idx, arr) => {
  if (sensor.type === wearEngine.SensorType.ACCELEROMETER) {
    let callback = (sensorResult: wearEngine.SensorResult) => {
      console.info(`Succeeded in getting sensor result, result is ${sensorResult}`);
    }
    // Subscribe to sensor data reporting.
    sensorClient.subscribeSensor(targetDevice.randomId, wearEngine.SensorType.ACCELEROMETER, callback).then(() => {
      console.info(`Succeeded in subscribing sensor data.`);
    }).catch((error: BusinessError) => {
      console.error(`Failed to subscribe sensor data. Code is ${error.code}, message is ${error.message}`);
    })

    // Unsubscribe from sensor data reporting.
    sensorClient.unsubscribeSensor(targetDevice.randomId, wearEngine.SensorType.ACCELEROMETER, callback).then(() => {
      console.info(`Succeeded in unsubscribing sensor data.`);
    }).catch((error: BusinessError) => {
      console.error(`Failed to unsubscribe sensor data. Code is ${error.code}, message is ${error.message}`);
    })
  }
})
```
 > **Note:** After the sensors are enabled, data will be continuously reported through the callback function provided as a parameter of the [subscribeSensor](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#subscribesensor) method, based on the reporting period of each sensor. You can control the data reporting duration by calling the sensor unsubscription API. Each group of data has a timestamp attribute. You are advised to align data based on the timestamp. Data reported by different sensors comes in different formats. For details, see the appendix [Sensor Data Format and Sample of Wearable Devices](#sensor-data-format-and-sample-of-wearable-devices). Sensors are classified into multi-channel sensors, such as PPG and ECG, and non-multi-channel sensors, such as ACC. You can distinguish between channels using the **channel** field in [SensorData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#sensordata) for data reported by multi-channel sensors. When the device is disconnected, the device stops reporting sensor data. In this case, you need to subscribe to the device connection status. After the device is reconnected, call the [subscribeSensor](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#subscribesensor) method to subscribe to data from specified sensors.

#### Sensor Data Format and Sample of Wearable Devices

> **Note:** The volume of reported data is not fixed. The example provided represents typical results, but the actual volume may vary depending on the device.

| Sensor | Multi-channel | Collection Period (ms) | Reporting Period (ms) | Data Format | Sample |
| --- | --- | --- | --- | --- | --- |
| ACC | No | 10 | 100 | Ten groups of data are reported at a time. Each group contains three pieces of data, indicating the acceleration along the x, y, and z axes, respectively. There are 30 pieces of data in total. Unit: m/s^2. 4096 indicates a gravitational acceleration (g). | [34303.0, 10753.0, 54799.0, 33023.0, 15617.0, 2576.0, 33535.0, 9729.0, 5136.0, 24063.0, 6145.0, 62479.0, 23295.0, 6145.0, 58895.0, 35071.0, 9729.0, 57359.0, 46335.0, 10497.0, 53263.0, 55039.0, 4609.0, 57359.0, 42495.0, 2305.0, 60943.0, 41471.0, 64768.0, 57359.0] Note: The original ACC and GYRO data range is signed short, but the reported data range is unsigned short. Therefore, you need to convert the data. |
| GYRO | No | 10 | 100 | Ten groups of data are reported at a time. Each group contains three pieces of data, indicating the angular velocity along the x, y, and z axes, respectively. A total of 30 pieces of data are reported. Unit: 70 mdps/LSB | [34303.0, 10753.0, 54799.0, 33023.0, 15617.0, 2576.0, 33535.0, 9729.0, 5136.0, 24063.0, 6145.0, 62479.0, 23295.0, 6145.0, 58895.0, 35071.0, 9729.0, 57359.0, 46335.0, 10497.0, 53263.0, 55039.0, 4609.0, 57359.0, 42495.0, 2305.0, 60943.0, 41471.0, 64768.0, 57359.0] |
| HR | No | 1000 | 1000 | One piece of data at a time, which indicates the number of heartbeats per minute. Unit: beats/min | [80.0] |
| MAG | No | 100 | 100 | One group of data is reported at a time. Each group contains four pieces of data, indicating the magnetic field strength along the x, y, and z axes, respectively. The last piece of data has no actual meaning and can be ignored. Unit: μT | [3.9310358, 21.161278, -34.467373, 0.0] |
| PPG | Yes | 10 | 100 | Three channels of data (GREEN, RED, and IR) report 10 packets every 100 ms. Each packet contains four bytes. | [758457.0, 2273675.0, 2276247.0, 2278939.0, 2281102.0, 2283411.0, 2285717.0, 2288307.0, 2290863.0, 2293297.0] (one channel of data) |
| ECG | Yes | 2 | 100 | A channel of data reports 50 packets every 100 ms. (Same for the wearable device being worn on the left or right wrist.) Unit: nV | [-5020837.0, -4742510.0, -4896082.0, -4938397.0, -4796497.0, -4886598.0, -4871642.0, -4943139.0, -5209429.0, -5294787.0, -5161278.0, -5174045.0, -5588071.0, -5323970.0, -5342938.0, -5028133.0, -5094523.0, -5240070.0, -5394008.0, -5540285.0, -5655190.0, -5589895.0, -5539920.0, -5559618.0, -5623090.0, -5501618.0, -5747845.0, -5871870.0, -5814964.0, -5885002.0, -6069946.0, -5678536.0, -5839040.0, -5903971.0, -5959417.0, -6172084.0, -6263279.0, -6029455.0, -6097669.0, -6165518.0, -6174638.0, -6284072.0, -6347544.0, -6319091.0, -6085631.0, -6143631.0, -6382198.0, -6250512.0, -6396059.0, -6424512.0] |
