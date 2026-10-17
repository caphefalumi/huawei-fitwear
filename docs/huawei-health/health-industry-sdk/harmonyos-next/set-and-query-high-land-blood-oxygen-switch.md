<!--
  Title: Setting and Querying the State of the Automatic Monitoring Switch for High Altitude Adaptation
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-high-land-blood-oxygen-switch-0000002526499306
  Updated: 2026-08-05 02:10:22
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-high-land-blood-oxygen-switch-0000002526499306
-->
# Setting and Querying the State of the Automatic Monitoring Switch for High Altitude Adaptation

This section describes how to set and query the state of the automatic monitoring switch for High altitude adaptation on a wearable. After the switch is turned on, when the wearable detects an altitude of 2500 meters, the High altitude adaptation app on the wearable will provide altitude sickness evaluations and suggestions. Users identified as high risk will receive a reminder based on the SpO2 measurement results within a period of time.

- The automatic monitoring for High altitude adaptation depends on the automatic SpO2 measurement feature. Therefore, when the automatic monitoring switch for High altitude adaptation is turned on, the automatic SpO2 measurement will also be enabled. Turning off the automatic monitoring switch for High altitude adaptation will not affect the state of the automatic SpO2 measurement switch.
- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.
- When a wearable reconnects to the Huawei Health app after disconnection, the app will send its own state of the automatic monitoring switch for High altitude adaptation to the wearable.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section209303302232) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set the automatic monitoring switch for High altitude adaptation. 
```cpp
// Import required modules.
import { IndustryService, industryServiceClient } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // State value of the automatic monitoring switch for High altitude adaptation.
    let value: boolean = true;
    // Call the setSettingInfo method of the Device object to set the automatic monitoring switch for High altitude adaptation.
    device.setSettingInfo(IndustryService.SettingType.HIGH_LAND_BLOOD_OXYGEN_SWITCH, value).then(() => {
      // The setting is successful.
      console.info('Succeeded in setting highLandBloodOxygenSwitch.');
    }).catch((err: BusinessError) => {
      // The setting fails.
      console.error(`Failed to set highLandBloodOxygenSwitch. Code is ${err.code}, message is ${err.message}.`);
    });
  })
  .catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Call the [getSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4786175712107) method of [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) to query the state of the automatic monitoring switch for High altitude adaptation. 
```cpp
// Call the getSettingInfo method of the Device object to query the state of the automatic monitoring switch for High altitude adaptation.
device.getSettingInfo(IndustryService.SettingType.HIGH_LAND_BLOOD_OXYGEN_SWITCH).then((result: boolean) => {
  // Output the returned state of the automatic monitoring switch for High altitude adaptation if the query is successful.
  console.info(`Succeeded in getting highLandBloodOxygenSwitch, result is ${result}.`);
}).catch((err: BusinessError) => {
  // Output error information if the query fails.
  console.error(`Failed to get highLandBloodOxygenSwitch. Code is ${err.code}, message is ${err.message}.`);
});
```
