<!--
  Title: Setting and Querying the Abnormal SpO2 Alert
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-spo2-alert-0000002376394505
  Updated: 2026-08-05 02:10:25
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-spo2-alert-0000002376394505
-->
# Setting and Querying the Abnormal SpO2 Alert

This section describes how to set and query the abnormal SpO2 alert switch state and alert threshold (in percentage). After the alert switch is enabled, the wearable will generate an abnormal SpO2 alert when detecting that the SpO2 value is lower than the alert threshold for three consecutive times. After the alert switch is disabled, no abnormal SpO2 alert will be generated.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.
- When a wearable reconnects to the Huawei Health app after disconnection, the app will send its own abnormal SpO2 alert switch state and alert threshold to the wearable.

> **Note:** If you want to enable the abnormal SpO2 alert, automatic SpO2 measurement needs to be enabled first. For details, please refer to [Setting and Querying the Automatic SpO2 Measurement Switch State](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-and-query-spo2-measurement-switch-0000002376394501). If the abnormal SpO2 alert is not set, error code **9** will be returned for a query. If the abnormal SpO2 alert switch is disabled but the alert threshold is set, SpO2 values are not checked against the alarm threshold. In the query response, the abnormal SpO2 alert switch state is **false** and the alert threshold is the configured value. If the alert switch is disabled and the threshold is not set, the switch state is **false** and the threshold is **null** in the query response.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1639374991110) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set the abnormal SpO2 alert switch state and alert threshold. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct the parameters for setting the abnormal SpO2 alert switch state and alert threshold.
    let info: IndustryService.AlertSetting = {
      switch: true,
      threshold: 80
    };
    // Call the setSettingInfo method of the Device object to set the abnormal SpO2 alert switch state and alert threshold.
    device.setSettingInfo(IndustryService.SettingType.SPO2_ALERT, info).then(() => {
      // The abnormal SpO2 alert switch state and alert threshold are set successfully.
      console.info('Succeeded in setting spO2Alert.');
    }).catch((err: BusinessError) => {
      // The setting of the abnormal SpO2 alert switch state and alert threshold fails.
      console.error(`Failed to set spO2Alert. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Call the [getSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section15787757114) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query the abnormal SpO2 alert switch state and alert threshold. 
```cpp
// Call the getSettingInfo method of the Device object to query the abnormal SpO2 alert switch state and alert threshold.
device.getSettingInfo(IndustryService.SettingType.SPO2_ALERT).then((result: IndustryService.AlertSetting) => {
  // Output the returned abnormal SpO2 alert switch state and alert threshold if the query is successful.
  console.info(`Succeeded in getting spO2Alert, result is ${JSON.stringify(result)}.`);
}).catch((err: BusinessError) => {
  // Output error information if the query fails.
  console.error(`Failed to get spO2Alert. Code is ${err.code}, message is ${err.message}.`);
});
```
