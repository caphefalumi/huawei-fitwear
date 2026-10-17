<!--
  Title: Setting and Querying the TruSleep Switch State
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-trusleep-switch-0000002376514397
  Updated: 2026-08-05 02:10:21
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-trusleep-switch-0000002376514397
-->
# Setting and Querying the TruSleep Switch State

This section describes how to set and query the TruSleep switch state of a wearable. After the switch is enabled, the wearable will continuously monitor users' sleep and breathing quality in real time throughout the sleep period. After the switch is disabled, the wearable will no longer monitor sleep and breathing quality.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.
- When a wearable reconnects to the Huawei Health app after disconnection, the app will send its own TruSleep switch state to the wearable.

> **Note:** If the TruSleep switch is not set, error code **9** will be returned for a query.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section988418811913) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set the TruSleep switch. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // TruSleep switch state. The value true indicates enabled and the value false indicates disabled.
    let value: boolean = true;
    // Call the setSettingInfo method of the Device object to set the TruSleep switch.
    device.setSettingInfo(IndustryService.SettingType.TRU_SLEEP_SWITCH, value).then(() => {
      // The TruSleep switch state is set successfully.
      console.info(`Succeeded in setting TruSleepSwitch.`);
    }).catch((error: BusinessError) => {
      // The TruSleep switch state setting fails.
      console.error(`Failed to set TruSleepSwitch. Code is ${error.code}, message is ${error.message}.`);
    });
  })
  .catch((error: BusinessError) => {
    // The wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${error.code}, message is ${error.message}.`);
  });
```

- Call the [getSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section15162172713563) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query the TruSleep switch. 
```cpp
// Call the getSettingInfo method of the Device object to query the TruSleep switch.
device.getSettingInfo(IndustryService.SettingType.TRU_SLEEP_SWITCH).then((value: boolean) => {
  // Output the returned state if the query is successful.
  console.info(`Succeeded in getting TruSleepSwitch, value is ${value}.`);
}).catch((error: BusinessError) => {
  // Output error information if the query fails.
  console.error(`Failed to get TruSleepSwitch. Code is ${error.code}, message is ${error.message}.`);
});
```
