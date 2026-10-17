<!--
  Title: Querying the Device SN
  Catalog: huaweihealth-Guides
  Document ID: get-device-sn-0000002342516574
  Updated: 2026-08-05 02:10:10
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/get-device-sn-0000002342516574
-->
# Querying the Device SN

This section describes how to query the SN of a wearable.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Obtain the wearable SN through the **deviceSn** attribute of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Obtain the wearable SN through the deviceSn attribute of the Device object.
    let deviceSn = device.deviceSn;
    console.info(`Succeeded in getting deviceSn, result is ${deviceSn}.`);
  }).catch((err: BusinessError) => {
    // The wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```
