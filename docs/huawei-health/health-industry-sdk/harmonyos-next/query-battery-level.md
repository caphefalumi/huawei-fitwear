<!--
  Title: Querying the Device Battery Level
  Catalog: huaweihealth-Guides
  Document ID: query-battery-level-0000002376514385
  Updated: 2026-08-05 02:10:16
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-battery-level-0000002376514385
-->
# Querying the Device Battery Level

This section describes how to query the current battery level of a wearable.

> **Note:** To subscribe to the wearable battery status, please refer to [How Do I Subscribe to or Unsubscribe from the Device Battery or Charging Status?](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/faq-0000002511427352#section149635180205) in FAQs.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryStatus](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section146851522182511) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query the remaining battery level of the wearable. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Call the queryStatus method of the Device object to query the remaining battery level.
    device.queryStatus(IndustryService.StatusType.BATTERY_LEVEL).then((result: number) => {
      // Output the returned remaining battery level if the query is successful.
      console.info(`Succeeded in querying batteryLevel, result is ${result}.`);
    }).catch((err: BusinessError) => {
      // Output error information if the query fails.
      console.error(`Failed to query batteryLevel. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // The wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```
