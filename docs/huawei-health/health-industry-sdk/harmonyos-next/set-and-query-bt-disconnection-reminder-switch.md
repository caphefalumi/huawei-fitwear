<!--
  Title: Setting and Querying the Bluetooth Disconnection Reminder Switch State
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-bt-disconnection-reminder-switch-0000002342676382
  Updated: 2026-08-05 02:10:21
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-bt-disconnection-reminder-switch-0000002342676382
-->
# Setting and Querying the Bluetooth Disconnection Reminder Switch State

This section describes how to set and query the Bluetooth disconnection reminder switch state of a wearable. After the switch is enabled, the wearable will generate a Bluetooth disconnection reminder when detecting that a paired device (for example, phone) is disconnected due to distance. After the switch is disabled, no Bluetooth disconnection reminder will be generated.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.

> **Note:** The Bluetooth disconnection reminder switch set via this API and that on the Huawei Health app (under **Devices** > *Connected device* > **Device settings** > **Remind when disconnected**) are mutually independent. The Bluetooth disconnection reminder will only take effect if both switches are enabled. If either switch is disabled, the reminder will not work.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section477121014816) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set the Bluetooth disconnection reminder switch. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // State of the Bluetooth disconnection reminder switch.
    let value: boolean = true;
    // Call the setSettingInfo method of the Device object to set the Bluetooth disconnection reminder switch state.
    device.setSettingInfo(IndustryService.SettingType.BT_DISCONNECTION_REMINDER_SWITCH, value).then(() => {
      // The Bluetooth disconnection reminder switch state is set successfully.
      console.info(`Succeeded in setting BTDisconnectionReminderSwitch.`);
    }).catch((error: BusinessError) => {
      // The Bluetooth disconnection reminder switch state fails to be set.
      console.info(`Failed to set BTDisconnectionReminderSwitch. Code is ${error.code}, message is ${error.message}.`);
    });
  })
  .catch((error: BusinessError) => {
    // The wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${error.code}, message is ${error.message}.`);
  });
```

- Call the [getSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1047641955517) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query the Bluetooth disconnection reminder switch state. 
```cpp
// Call the getSettingInfo method of the Device object to query the Bluetooth disconnection reminder switch state.
device.getSettingInfo(IndustryService.SettingType.BT_DISCONNECTION_REMINDER_SWITCH).then((value: boolean) => {
  // Output the Bluetooth disconnection reminder switch state that is returned if the query is successful.
  console.info(`Succeeded in getting BTDisconnectionReminderSwitch, value is ${value}.`);
}).catch((error: BusinessError) => {
  // Output error information if the query fails.
  console.error(`Failed to get BTDisconnectionReminderSwitch. Code is ${error.code}, message is ${error.message}.`);
});
```
