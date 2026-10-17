<!--
  Title: Setting and Querying the Pulse Wave Arrhythmia Alert Switch State
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-ppg-notify-switch-0000002557659125
  Updated: 2026-08-05 02:10:26
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-ppg-notify-switch-0000002557659125
-->
# Setting and Querying the Pulse Wave Arrhythmia Alert Switch State

This section describes how to set and query the arrhythmia alert switch state of a wearable. After the switch is turned on, the wearable issues alerts upon detecting abnormal heartbeat rhythms. Once the switch is turned off, the wearable no longer displays alerts.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.
- If the pulse wave arrhythmia detection feature is not activated, calling the API for setting or querying the arrhythmia alert switch state will not take effect.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section116193619289) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set the arrhythmia alert switch. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Set the arrhythmia alert switch.
    const switchValue: boolean = true; // true: enabled; false: disabled.
    // Call the setSettingInfo method of the Device object to set the arrhythmia alert switch.
    device.setSettingInfo(IndustryService.SettingType.PPG_NOTIFY_SWITCH, switchValue).then(() => {
      // The setting is successful.
      console.info('Succeeded in setting ppgNotifySwitch.');
    }).catch((err: BusinessError) => {
      // The setting fails.
      console.error(`Failed to set ppgNotifySwitch. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Call the [getSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section134881731165612) method of [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) to query the state of the arrhythmia alert switch. 
```cpp
// Call the getSettingInfo method of the Device object to query the state of the arrhythmia alert switch.
device.getSettingInfo(IndustryService.SettingType.PPG_NOTIFY_SWITCH).then((result: boolean) => {
  // Output the returned state of the arrhythmia alert switch if the query is successful.
  console.info(`Succeeded in getting ppgNotifySwitch, result is ${result}.`);
}).catch((err: BusinessError) => {
  // Output error information if the query fails.
  console.error(`Failed to get ppgNotifySwitch. Code is ${err.code}, message is ${err.message}.`);
});
```
