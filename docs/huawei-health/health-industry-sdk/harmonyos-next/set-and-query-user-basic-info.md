<!--
  Title: Setting and Querying Basic User Information
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-user-basic-info-0000002376394493
  Updated: 2026-08-05 02:10:17
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-user-basic-info-0000002376394493
-->
# Setting and Querying Basic User Information

This section describes how to set and query basic user information of a wearable, including the date of birth, gender, height, and weight.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.
- When a wearable reconnects to the Huawei Health app after disconnection, the app will send basic user information to the wearable.

> **Note:** If the wearable user has not set heart rate zones, the API for [setting and querying heart rate zones](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-and-query-heart-rate-zones-0000002376514393) will be called to set default zones during basic user information configuration. The maximum heart rate is calculated as 220 minus the user's age. If the result is less than 100, the maximum heart rate is 100. The heart rate zone values are sequentially defined as 100%, 90%, 80%, 70%, 60%, and 50% of the maximum heart rate, with each value rounded to the nearest integer. If the user has not set their basic information, error code **9** will be returned for a query.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section184491929822) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set the basic user information. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct basic user information.
    let userInfo: IndustryService.UserBasicInfo = {
      dateOfBirth: '20000101',
      gender: IndustryService.Gender.MALE,
      height: 178,
      weight: 77
    }
    // Call the setSettingInfo method of the Device object to set the basic user information.
    device.setSettingInfo(IndustryService.SettingType.USER_BASIC_INFO, userInfo).then(() => {
      // The basic user information is set successfully.
      console.info(`Succeeded in setting userBasicInfo.`);
    }).catch((err: BusinessError) => {
      // The basic user information fails to be set.
      console.error(`Failed to set userBasicInfo. Code is ${err.code}, message is ${err.message}.`);
    });
  })
  .catch((err: BusinessError) => {
    // The wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Call the [getSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section9399103045119) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query the basic user information. 
```cpp
// Call the getSettingInfo method of the Device object to query the basic user information.
device.getSettingInfo(IndustryService.SettingType.USER_BASIC_INFO).then((userInfo:IndustryService.UserBasicInfo) => {
  // Output the returned basic user information if the query is successful.
  console.info(`Succeeded in getting userBasicInfo, result is ${JSON.stringify(userInfo)}.`);
}).catch((err: BusinessError) => {
  // Output error information if the query fails.
  console.error(`Failed to get userBasicInfo. Code is ${err.code}, message is ${err.message}.`);
});
```
