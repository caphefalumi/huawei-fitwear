<!--
  Title: Setting and Querying the Automatic SpO2 Measurement Switch State
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-spo2-measurement-switch-0000002376394501
  Updated: 2026-08-05 02:10:21
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-spo2-measurement-switch-0000002376394501
-->
# Setting and Querying the Automatic SpO2 Measurement Switch State

This section describes how to set and query the automatic SpO2 measurement switch state. After the switch is enabled, the wearable will automatically measure SpO2 every 10 minutes while the user is stationary. After the switch is disabled, the wearable will stop automatic SpO2 measurement.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.
- When a wearable reconnects to the Huawei Health app after disconnection, the app will send its own automatic SpO2 measurement switch state to the wearable.

> **Note:** If the automatic SpO2 measurement switch is not set, error code **9** will be returned for a query.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section988418811913) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set the automatic SpO2 measurement switch. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Call the setSettingInfo method of the Device object to set the automatic SpO2 measurement switch.
    device.setSettingInfo(IndustryService.SettingType.AUTOMATIC_SPO2_MEASUREMENT_SWITCH, true).then(() => {
      // The automatic SpO2 measurement switch state is set successfully.
      console.info('Succeeded in setting automaticSpO2MeasurementSwitch.');
    }).catch((err: BusinessError) => {
      // The automatic SpO2 measurement switch state setting fails.
      console.error(`Failed to set automaticSpO2MeasurementSwitch. Code is ${err.code}, message is ${err.message}.`);
    })
  }).catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Call the [getSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section15162172713563) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query the automatic SpO2 measurement switch state. 
```cpp
// Call the getSettingInfo method of the Device object to query the automatic SpO2 measurement switch state.
device.getSettingInfo(IndustryService.SettingType.AUTOMATIC_SPO2_MEASUREMENT_SWITCH).then((result: boolean) => {
  // Output the returned automatic SpO2 measurement switch state if the query is successful.
  console.info(`Succeeded in getting automaticSpO2MeasurementSwitch, result is ${result}.`);
}).catch((err: BusinessError) => {
  // Output error information if the query fails.
  console.error(`Failed to get automaticSpO2MeasurementSwitch. Code is ${err.code}, message is ${err.message}.`);
});
```
