<!--
  Title: Setting and Querying the Automatic Pulse Wave Arrhythmia Detection Switch State
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-ppg-period-switch-0000002526659256
  Updated: 2026-08-05 02:10:22
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-ppg-period-switch-0000002526659256
-->
# Setting and Querying the Automatic Pulse Wave Arrhythmia Detection Switch State

This section describes how to set and query the automatic arrhythmia detection switch state of a wearable. After the switch is turned on, the wearable automatically measures arrhythmia data on a regular basis. Once the switch is turned off, the wearable stops automatic PPG measurement.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.
- If the pulse wave arrhythmia detection feature is not activated, calling the API for setting or querying the automatic arrhythmia detection switch state will not take effect.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section116193619289) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set the automatic arrhythmia detection switch. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct input data for setting the automatic arrhythmia detection switch.
    let switches: boolean = true;
    // Call the setSettingInfo method of the Device object to set the automatic arrhythmia detection switch.
    device.setSettingInfo(IndustryService.SettingType.PPG_PERIOD_SWITCH, switches).then(() => {
      // The setting is successful.
      console.info('Succeeded in setting PPG period switch.');
    }).catch((err: BusinessError) => {
      // The setting fails.
      console.error(`Failed to set PPG period switch. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Call the [getSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section134881731165612) method of [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) to query the state of the automatic arrhythmia detection switch. 
```cpp
// Call the getSettingInfo method of the Device object to query the state of the automatic arrhythmia detection switch.
device.getSettingInfo(IndustryService.SettingType.PPG_PERIOD_SWITCH).then((result: boolean) => {
  // Output the returned state of the automatic arrhythmia detection switch if the query is successful.
  console.info(`Succeeded in getting PPG period switch, result is ${result}.`);
}).catch((err: BusinessError) => {
  // Output error information if the query fails.
  console.error(`Failed to get PPG period switch. Code is ${err.code}, message is ${err.message}.`);
});
```
