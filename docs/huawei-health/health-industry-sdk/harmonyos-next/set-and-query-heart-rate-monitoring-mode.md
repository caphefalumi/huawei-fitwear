<!--
  Title: Setting and Querying the Continuous Heart Rate Monitoring Mode
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-heart-rate-monitoring-mode-0000002342516586
  Updated: 2026-08-05 02:10:25
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-heart-rate-monitoring-mode-0000002342516586
-->
# Setting and Querying the Continuous Heart Rate Monitoring Mode

This section describes how to set and query the continuous heart rate monitoring mode for a wearable. After continuous heart rate monitoring (smart mode) is enabled, the wearable will dynamically adjust the measurement frequency based on users' workout status and provide 24-hour smart heart rate monitoring. After continuous heart rate monitoring (real-time mode) is enabled, the wearable will provide 24-hour real-time heart rate monitoring. After continuous heart rate monitoring is disabled, the wearable will not automatically measure the heart rate.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.
- When a wearable reconnects to the Huawei Health app after disconnection, the app will send its own continuous heart rate monitoring mode to the wearable.

> **Note:** If the continuous heart rate monitoring mode is not set, error code **9** will be returned for a query.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section12927126161015) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set the continuous heart rate monitoring mode. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Setting of the continuous heart rate monitoring mode.
    let value: number = 2;
    // Call the setSettingInfo method of the Device object to set the continuous heart rate monitoring mode.
    device.setSettingInfo(IndustryService.SettingType.CONTINUOUS_HEART_RATE_MONITORING_MODE, value).then(() => {
      // The continuous heart rate monitoring mode is set successfully.
      console.info(`Succeeded in setting continuousHeartRateMonitoringMode.`);
    }).catch((error: BusinessError) => {
      // The continuous heart rate monitoring mode fails to be set.
      console.info(`Failed to set continuousHeartRateMonitoringMode. Code is ${error.code}, message is ${error.message}.`);
    });
  })
  .catch((error: BusinessError) => {
    // The wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${error.code}, message is ${error.message}.`);
  });
```

- Call the [getSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1638171325717) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query the continuous heart rate monitoring mode. 
```cpp
// Call the getSettingInfo method of the Device object to query the continuous heart rate monitoring mode.
device.getSettingInfo(IndustryService.SettingType.CONTINUOUS_HEART_RATE_MONITORING_MODE).then((value: number) => {
  // Output the return value if the query is successful.
  console.info(`Succeeded in getting continuousHeartRateMonitoringMode, value is ${value}.`);
}).catch((error: BusinessError) => {
  // Output error information if the query fails.
  console.error(`Failed to get continuousHeartRateMonitoringMode. Code is ${error.code}, message is ${error.message}.`);
});
```
