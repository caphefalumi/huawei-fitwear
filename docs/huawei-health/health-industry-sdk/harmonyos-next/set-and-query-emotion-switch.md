<!--
  Title: Setting and Querying the Automatic Emotion/Stress Test Switch State
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-emotion-switch-0000002526499302
  Updated: 2026-08-05 02:10:21
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-emotion-switch-0000002526499302
-->
# Setting and Querying the Automatic Emotion/Stress Test Switch State

This section describes how to set and query the automatic emotion/stress test switch state of a wearable. After the switch is turned on, the wearable automatically measure the stress value and emotional status when the user is at rest. Once the switch is turned off, the wearable stops performing these automatic measurements.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.
- When a wearable reconnects to the Huawei Health app after disconnection, the app will send its own automatic emotion/stress test switch state to the wearable.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section764313158327) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set the automatic emotion/stress test switch. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // State value of the automatic emotion/stress test switch: true indicates that the switch is turned on, and false indicates that the switch is turned off.
    let value: boolean = true;
    // Call the setSettingInfo method of the Device object to set the automatic emotion/stress test switch.
    device.setSettingInfo(IndustryService.SettingType.EMOTION_AUTO_MEASUREMENT_SWITCH, value).then(() => {
      // The setting is successful.
      console.info('Succeeded in setting emotionAutoMeasurementSwitch.');
    }).catch((err: BusinessError) => {
      // The setting fails.
      console.error(`Failed to set emotionAutoMeasurementSwitch. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Call the [getSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section3340164814219) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query the state of the automatic emotion/stress test switch. 
```cpp
// Call the getSettingInfo method of the Device object to query the state of the automatic emotion/stress test switch.
device.getSettingInfo(IndustryService.SettingType.EMOTION_AUTO_MEASUREMENT_SWITCH).then((result: boolean) => {
  // Output the returned state of the automatic emotion/stress test switch if the query is successful.
  console.info(`Succeeded in getting emotionAutoMeasurementSwitch, result is ${result}.`);
}).catch((err: BusinessError) => {
  // Output error information if the query fails.
  console.error(`Failed to get emotionAutoMeasurementSwitch. Code is ${err.code}, message is ${err.message}.`);
});
```
