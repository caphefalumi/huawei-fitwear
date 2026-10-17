<!--
  Title: Setting and Querying the Sleep Apnea Detection Switch State
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-osa-switch-0000002526659252
  Updated: 2026-08-05 02:10:21
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-osa-switch-0000002526659252
-->
# Setting and Querying the Sleep Apnea Detection Switch State

This section describes how to set and query the sleep apnea detection switch state of a wearable. After the switch is turned on, the wearable performs sleep apnea detection when the user is asleep. Once the switch is turned off, the wearable stops sleep apnea detection.

- The sleep apnea detection feature depends on the TruSleep feature. Therefore, it is recommended that TruSleep be enabled before turning on the sleep apnea detection switch, and the sleep apnea detection be disabled after turning off TruSleep.
- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.
- When a wearable reconnects to the Huawei Health app after disconnection, the app will send its own sleep apnea detection switch state to the wearable.

> **Note:** Before a wearable is connected to the Huawei Health app and the sleep apnea detection feature is activated, error code **6** will be returned for any attempt to set or query the sleep apnea detection switch state.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section988418811913) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set the sleep apnea detection switch. 
```cpp
// Import required modules.
import { IndustryService, industryServiceClient } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // State value of the sleep apnea detection switch.
    let value: boolean = true;
    // Call the setSettingInfo method of the Device object to set the sleep apnea detection switch.
    device.setSettingInfo(IndustryService.SettingType.OBSTRUCTIVE_SLEEP_APNEA_DETECTION_SWITCH, value).then(() => {
      // The setting is successful.
      console.info('Succeeded in setting obstructiveSleepApneaDetectionSwitch.');
    }).catch((err: BusinessError) => {
      // The setting fails.
      console.error(`Failed to set obstructiveSleepApneaDetectionSwitch. Code is ${err.code}, message is ${err.message}.`);
    });
  })
  .catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Call the [getSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section15162172713563) method of [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) to query the state of the sleep apnea detection switch. 
```cpp
// Call the getSettingInfo method of the Device object to query the state of the sleep apnea detection switch.
device.getSettingInfo(IndustryService.SettingType.OBSTRUCTIVE_SLEEP_APNEA_DETECTION_SWITCH).then((result: boolean) => {
  // Output the returned state of the sleep apnea detection switch if the query is successful.
  console.info(`Succeeded in getting obstructiveSleepApneaDetectionSwitch, result is ${result}.`);
}).catch((err: BusinessError) => {
  // Output error information if the query fails.
  console.error(`Failed to get obstructiveSleepApneaDetectionSwitch. Code is ${err.code}, message is ${err.message}.`);
});
```
