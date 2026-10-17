<!--
  Title: Setting and Querying the Elevated Body Temperature Alert Switch State
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-elevated-temp-warning-switch-0000002557581359
  Updated: 2026-08-05 02:10:26
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-elevated-temp-warning-switch-0000002557581359
-->
# Setting and Querying the Elevated Body Temperature Alert Switch State

This section describes how to set and query the elevated body temperature alert switch state of a wearable. After the switch is turned on, the wearable continuously monitors the body temperature and issues an alert if the body temperature remains above 37.2°C for more than 10 minutes. Once the switch is turned off, the wearable no longer generates alerts.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.
- When a wearable reconnects to the Huawei Health app after disconnection, the app will send its own elevated body temperature alert switch state to the wearable.
- This switch is only available on certain wearables released in the Chinese mainland. If an unsupported wearable is used, error code **10** will be returned.

> **Note:** To set the elevated body temperature alert switch, the Body Temperature Study feature must be activated in the Body temperature app on the wearable. Activation path: Touch **Body temperature** > **Join study**. The API for setting the elevated body temperature alert switch cannot be used if Body Temperature Study is not enabled, and the setting will not take effect.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1639374991110) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set the elevated body temperature alert switch. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct input data for setting the elevated body temperature alert switch.
    let info: IndustryService.AlertSetting = {
      switch: true
    };
    // Call the setSettingInfo method of the Device object to set the elevated body temperature alert switch.
    device.setSettingInfo(IndustryService.SettingType.ELEVATED_TEMP_WARNING_SWITCH, info).then(() => {
      // The setting is successful.
      console.info('Succeeded in setting elevatedTempWarningSwitch.');
    }).catch((err: BusinessError) => {
      // The setting fails.
      console.error(`Failed to set elevatedTempWarningSwitch. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Call the [getSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section15787757114) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query the state of the elevated body temperature alert switch. 
```cpp
// Call the getSettingInfo method of the Device object to query the state of the elevated body temperature alert switch.
device.getSettingInfo(IndustryService.SettingType.ELEVATED_TEMP_WARNING_SWITCH).then((result: IndustryService.AlertSetting) => {
  // Output the returned state of the elevated body temperature alert switch if the query is successful.
  console.info(`Succeeded in getting elevatedTempWarningSwitch, result is ${JSON.stringify(result)}.`);
}).catch((err: BusinessError) => {
  // Output error information if the query fails.
  console.error(`Failed to get elevatedTempWarningSwitch. Code is ${err.code}, message is ${err.message}.`);
});
```
