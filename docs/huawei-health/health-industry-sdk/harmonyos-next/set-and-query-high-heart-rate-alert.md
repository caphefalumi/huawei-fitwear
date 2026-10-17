<!--
  Title: Setting and Querying the High Heart Rate Alert
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-high-heart-rate-alert-0000002342676386
  Updated: 2026-08-05 02:10:29
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-high-heart-rate-alert-0000002342676386
-->
# Setting and Querying the High Heart Rate Alert

This section describes how to set and query the high heart rate alert switch state and alert threshold (unit: beats/min) for non-workout states on a wearable. After the alert switch is enabled, the wearable will generate a high heart rate alert when detecting that the heart rate is higher than the alert threshold for 10 consecutive minutes. After the alert switch is disabled, no high heart rate alert will be generated.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.
- When a wearable reconnects to the Huawei Health app after disconnection, the app will send its own high heart rate alert switch state and alert threshold to the wearable.

> **Note:** To enable the high heart rate alert, you need to enable continuous heart rate monitoring first. For details, please refer to [Setting and Querying the Continuous Heart Rate Monitoring Mode](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-and-query-heart-rate-monitoring-mode-0000002342516586). If the high heart rate alert is not set, error code **9** will be returned for a query. If the high heart rate alert is disabled but the alert threshold is set, the alert threshold will not be verified. In the query response, the high heart rate alert switch state is **false** and the alert threshold is the configured value. If the alert is disabled and the threshold is not set, the switch state is **false** and the threshold is **null** in the query response.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the =[setSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1639374991110) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set the high heart rate alert switch state and alert threshold. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct the parameters for setting the high heart rate alert switch state and alert threshold.
    let info: IndustryService.AlertSetting = {
      switch: true,
      threshold: 130
    };
    // Call the setSettingInfo method of the Device object to set the high heart rate alert switch state and alert threshold.
    device.setSettingInfo(IndustryService.SettingType.HIGH_HEART_RATE_ALERT, info).then(() => {
      // The high heart rate alert switch state and alert threshold are set successfully.
      console.info('Succeeded in setting highHeartRateAlert.');
    }).catch((err: BusinessError) => {
      // The high heart rate alert switch state and alert threshold fail to be set.
      console.error(`Failed to set highHeartRateAlert. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // The wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Call the [getSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section15787757114) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query the high heart rate alert switch state and alert threshold. 
```cpp
// Call the getSettingInfo method of the Device object to query the high heart rate alert switch state and alert threshold.
device.getSettingInfo(IndustryService.SettingType.HIGH_HEART_RATE_ALERT).then((result: IndustryService.AlertSetting) => {
  // Output the returned high heart rate alert switch state and alert threshold if the query is successful.
  console.info(`Succeeded in getting highHeartRateAlert, result is ${JSON.stringify(result)}.`);
}).catch((err: BusinessError) => {
  // Output error information if the query fails.
  console.error(`Failed to get highHeartRateAlert. Code is ${err.code}, message is ${err.message}.`);
});
```
