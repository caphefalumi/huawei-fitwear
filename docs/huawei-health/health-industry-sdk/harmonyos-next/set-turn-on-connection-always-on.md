<!--
  Title: Setting Network Connection Persistence in AOD Mode for Industry Apps
  Catalog: huaweihealth-Guides
  Document ID: set-turn-on-connection-always-on-0000002342516622
  Updated: 2026-08-05 02:10:22
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-turn-on-connection-always-on-0000002342516622
-->
# Setting Network Connection Persistence in AOD Mode for Industry Apps

This section describes how to set the switch for maintaining an industry app' network connection in AOD mode. After the switch is enabled, industry apps will remain network-connected while the wearable is in AOD mode. After the switch is disabled, industry apps will be disconnected from the network when the wearable is in AOD mode.

After your app enables the switch for maintaining industry apps' network connection in AOD mode, it may be disabled by another app. In this case, the callback function of this API will be called.

> **Note:** After an industry app is restarted or the wearable is rebooted, the state of the AOD network connection persistence function remains unchanged. Enabling the switch for maintaining industry apps' network connection in AOD mode may have a certain impact on the battery life of the wearable. Use this function properly based on the actual requirements.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setApplicationAbility](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section9505153314417) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to maintain network connection in AOD mode. 
```cpp
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the Device object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Call setApplicationAbility to maintain network connection in AOD mode.
    device.setApplicationAbility(IndustryService.ApplicationAbilityType.TURN_ON_CONNECTION_ALWAYS_ON, true, () => {
      console.info(`turnOnConnectionAlwaysOn is disabled.`);
    }).then(() => {
      console.info(`Succeeded in setting turnOnConnectionAlwaysOn.`);
    }).catch((err: BusinessError) => {
      console.error(`Failed to set turnOnConnectionAlwaysOn. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  })
```
