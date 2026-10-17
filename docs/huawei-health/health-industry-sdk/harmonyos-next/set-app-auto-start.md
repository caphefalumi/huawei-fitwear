<!--
  Title: Setting Industry App Auto-Start on Boot
  Catalog: huaweihealth-Guides
  Document ID: set-app-auto-start-0000002376514441
  Updated: 2026-08-05 02:10:29
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-app-auto-start-0000002376514441
-->
# Setting Industry App Auto-Start on Boot

This section describes how to set the switch of industry app auto-start on boot. After the switch is enabled, industry apps automatically start when the wearable boots. After the switch is disabled, industry apps no longer automatically start.

> **Note:** After an industry app is restarted or the wearable is rebooted, the state of the industry app auto-start on boot switch remains unchanged. When you are setting the industry app auto-start on boot switch, error code **1** is returned if **abilityName** does not exist.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setApplicationAbility](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section969812112164) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set app auto-start on boot. 
```cpp
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the Device object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Call setApplicationAbility to set app auto-start on boot.
    const abilityName = "EntryAbility"; // abilityName of the screen during app auto-start.
    device.setApplicationAbility(IndustryService.ApplicationAbilityType.APP_AUTO_START, true, abilityName).then(() => {
      console.info(`Succeeded in setting appAutoStart.`);
    }).catch((err: BusinessError) => {
      console.error(`Failed to set appAutoStart. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  })
```
