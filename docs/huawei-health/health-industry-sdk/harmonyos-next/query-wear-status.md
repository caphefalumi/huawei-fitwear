<!--
  Title: Querying the Device Wearing Status
  Catalog: huaweihealth-Guides
  Document ID: query-wear-status-0000002342676374
  Updated: 2026-08-05 02:10:14
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-wear-status-0000002342676374
-->
# Querying the Device Wearing Status

This section describes how to query the wearing status of a wearable.

> **Note:** To subscribe to the wearing status of a wearable, please refer to [How Do I Subscribe to or Unsubscribe from the Device Wearing Status?](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/faq-0000002511427352#section13323503431) in FAQs.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryStatus](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section146851522182511) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query the wearing status of the wearable. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Call the queryStatus method of the Device object to query the wearable wearing status.
    device.queryStatus(IndustryService.StatusType.WEARING_STATUS).then((result: number) => {
      // Output the returned wearing status if the query is successful.
      console.info(`Succeeded in querying wearingStatus, result is ${result}.`);
    }).catch((err: BusinessError) => {
      // Output error information if the query fails.
      console.error(`Failed to query wearingStatus. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // The wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```
