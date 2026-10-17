<!--
  Title: Setting and Querying the Language
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-language-0000002342516578
  Updated: 2026-08-05 02:10:18
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-language-0000002342516578
-->
# Setting and Querying the Language

This section describes how to set and query the display language of a wearable.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.

- When a wearable reconnects to the Huawei Health app after disconnection, the app will send its own language to the wearable.

> **Note:** If a non-standard language code is passed, the following will occur: The API call is successful, but the language of the wearable is set to English by default. If no language is set, error code **9** will be returned for a query.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section56514171767) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set the language. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Call the setSettingInfo method of the Device object to set the language.
    device.setSettingInfo(IndustryService.SettingType.LANGUAGE, 'en-US').then(() => {
      // The language is set successfully.
      console.info('Succeeded in setting language.');
    }).catch((err: BusinessError) => {
      // The language fails to be set.
      console.error(`Failed to set language. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // The wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Call the [getSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section145611048534) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query the language. 
```cpp
// Call the getSettingInfo method of the Device object to query the language.
device.getSettingInfo(IndustryService.SettingType.LANGUAGE).then((result: string) => {
  // Output the returned language value if the query is successful.
  console.info(`Succeeded in getting language, result is ${result}.`);
}).catch((err: BusinessError) => {
  // Output error information if the language query fails.
  console.error(`Failed to get language. Code is ${err.code}, message is ${err.message}.`);
});
```
