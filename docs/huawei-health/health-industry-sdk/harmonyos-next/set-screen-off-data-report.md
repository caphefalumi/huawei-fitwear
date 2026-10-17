<!--
  Title: Setting Data Reporting in Screen-Off Mode
  Catalog: huaweihealth-Guides
  Document ID: set-screen-off-data-report-0000002580094292
  Updated: 2026-08-05 02:10:32
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-screen-off-data-report-0000002580094292
-->
# Setting Data Reporting in Screen-Off Mode

This section describes how to set data reporting for a wearable when the screen is off. After the feature is enabled, the wearable continues reporting data of the specified type in screen-off mode. Once disabled, the wearable stops reporting data of the specified type in screen-off mode.

The state of data reporting in screen-off mode set through this API becomes invalid after your industry app is restarted.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setScreenOffDataReport](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section49383268717) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set data reporting in screen-off mode. 
```cpp
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';
// Obtain the Device object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Call setScreenOffDataReport to set data reporting in screen-off mode.
    const dataType = IndustryService.OffNotifyDataType.HEART; // Heart rate data.
    device.setScreenOffDataReport(dataType, 'on').then(() => {
      console.info(`Succeeded in setting screen off data report.`);
    }).catch((err: BusinessError) => {
      console.error(`Failed to set screen off data report. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  })
```
