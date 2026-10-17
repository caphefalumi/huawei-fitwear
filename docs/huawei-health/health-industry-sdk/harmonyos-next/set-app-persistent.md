<!--
  Title: Setting Industry App Keep-Alive
  Catalog: huaweihealth-Guides
  Document ID: set-app-persistent-0000002342676422
  Updated: 2026-08-05 02:10:26
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-app-persistent-0000002342676422
-->
# Setting Industry App Keep-Alive

This section describes how to set the industry app keep-alive switch. After the switch is enabled, industry apps can remain active in the background and will automatically restart when they are terminated unexpectedly due to a system error or other process error. After the switch is disabled, industry apps cannot remain active in the background and will not automatically restart when they are terminated unexpectedly due to a system error or other process error.

> **Note:** After an industry app is restarted or the wearable is rebooted, the state of the industry app keep-alive switch remains unchanged. To ensure that an industry app can still run in the background in screen-off mode, you also need to enable the [running lock](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-runninglock). To ensure that an industry app remains in the foreground after the wearable screen is turned off and subsequently reawakened, please refer to the FAQ on [handling cases where an app in the foreground moves to the background after screen-off and wake-up](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/faq-0000002511427352#section482213763016). Enabling the industry app keep-alive switch may have a certain impact on the battery life of the wearable. Use this function properly based on the actual requirements.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setApplicationAbility](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1043434833) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to keep your app alive. 
```cpp
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the Device object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Call the setApplicationAbility method to keep your app alive.
    device.setApplicationAbility(IndustryService.ApplicationAbilityType.APP_PERSISTENT, true).then(() => {
      console.info(`Succeeded in setting appPersistent.`);
    }).catch((err: BusinessError) => {
      console.error(`Failed to set appPersistent. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  })
```
