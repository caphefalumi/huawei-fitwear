<!--
  Title: Setting and Querying the Unit System
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-unit-0000002342676378
  Updated: 2026-08-05 02:10:19
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-unit-0000002342676378
-->
# Setting and Querying the Unit System

This section describes how to set and query the unit system of fitness data on a wearable. During workout, the wearable displays fitness data according to the set unit system. (For example, if outdoor running is started on the wearable, the distance unit will be shown as km when the unit system is set to metric, and as mi when the unit system is set to imperial.)

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.
- When a wearable reconnects to the Huawei Health app after disconnection, the app will send its own unit system to the wearable.

> **Note:** If no unit system is set, error code **9** will be returned for a query.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section45051114675) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set the unit system. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from 'industrysdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Call the setSettingInfo method of the Device object to set the unit system.
    device.setSettingInfo(IndustryService.SettingType.UNIT, IndustryService.Unit.Metric).then(() => {
      // The unit system is set successfully.
      console.info('Succeeded in setting unit.');
    }).catch((err: BusinessError) => {
      // The unit system fails to be set.
      console.error(`Failed to set unit. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // The wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Call the [getSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section16701734145419) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query the unit system. 
```cpp
// Call the getSettingInfo method of the Device object to query the unit system.
device.getSettingInfo(IndustryService.SettingType.UNIT).then((result: IndustryService.Unit) => {
  // Output the returned unit system if the query is successful.
  console.info(`Succeeded in getting unit, result is ${result}.`);
}).catch((err: BusinessError) => {
  // Output error information if the unit system query fails.
  console.error(`Failed to get unit. Code is ${err.code}, message is ${err.message}.`);
});
```
