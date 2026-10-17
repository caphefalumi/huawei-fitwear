<!--
  Title: Setting and Querying the Stand Reminder Switch State
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-stand-reminder-switch-0000002342516582
  Updated: 2026-08-05 02:10:20
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-stand-reminder-switch-0000002342516582
-->
# Setting and Querying the Stand Reminder Switch State

This section describes how to set and query the stand reminder switch state of a wearable. After the switch is enabled, the wearable will generate a stand reminder if the user remains seated for one hour between 8:00 and 21:00 each day. After the switch is disabled, no stand reminder will be generated.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.

> **Note:** The stand reminder switch state set through this API and the state modified manually by the user on the wearable (under **Activity records** > **Reminders** > **Stand**) override each other. The stand reminder switch state is determined by the latest modification.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section477121014816) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set the stand reminder switch. 
```cpp
// Import required modules.
import {IndustryService, industryServiceClient} from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // State of the stand reminder switch.
    let value: boolean = true;
    // Call the setSettingInfo method of the Device object to set the stand reminder switch.
    device.setSettingInfo(IndustryService.SettingType.STAND_REMINDER_SWITCH, value).then(() => {
      // The stand reminder switch state is set successfully.
      console.info('Succeeded in setting standReminderSwitch.');
    }).catch((err: BusinessError) => {
      // The stand reminder switch state fails to be set.
      console.error(`Failed to set standReminderSwitch. Code is ${err.code}, message is ${err.message}.`);
    });
  })
  .catch((err: BusinessError) => {
    // The wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Call the [getSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1047641955517) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query the stand reminder switch state. 
```cpp
// Call the getSettingInfo method of the Device object to query the stand reminder switch state.
device.getSettingInfo(IndustryService.SettingType.STAND_REMINDER_SWITCH).then((result: boolean) => {
  // Output the returned stand reminder switch state if the query is successful.
  console.info(`Succeeded in getting standReminderSwitch, result is ${result}.`);
}).catch((err: BusinessError) => {
  // Output error information if the query fails.
  console.error(`Failed to get standReminderSwitch. Code is ${err.code}, message is ${err.message}.`);
});
```
