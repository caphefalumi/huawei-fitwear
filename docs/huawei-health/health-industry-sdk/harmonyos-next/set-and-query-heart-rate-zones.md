<!--
  Title: Setting and Querying Heart Rate Zones
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-heart-rate-zones-0000002376514393
  Updated: 2026-08-05 02:10:21
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-heart-rate-zones-0000002376514393
-->
# Setting and Querying Heart Rate Zones

This section describes how to set and query workout heart rate zones. During workout, the wearable determines the current heart rate zone based on the user's actual heart rate and displays the corresponding workout status.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.
- When a wearable reconnects to the Huawei Health app after disconnection, the app will send its own heart rate zones to the wearable.

> **Note:** The heart rate zones are comprised of six heart rate values in descending order (unit: beats/min), which respectively represent the following thresholds: maximum heart rate (upper limit of extreme zone), lower limit of extreme zone (upper limit of anaerobic zone), lower limit of anaerobic zone (upper limit of aerobic zone), lower limit of aerobic zone (upper limit of fat-burning zone), lower limit of fat-burning zone (upper limit of warm-up zone), and lower limit of warm-up zone. These six heart rate values together define five heart rate zones, corresponding to the following workout statuses: extreme, anaerobic endurance, aerobic endurance, fat-burning, and warm-up. Heart rate zone value setting rules: Maximum heart rate > lower limit of extreme zone > lower limit of anaerobic zone > lower limit of aerobic zone > lower limit of fat-burning zone > lower limit of warm-up zone Each heart rate zone value must fall within the range of 30% of the maximum heart rate to the maximum heart rate. The valid range of the maximum heart rate is [100, 220]. If the basic user information and heart rate zones are not set, error code **9** will be returned for a query.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [setSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section160512211115) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to set heart rate zones. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Heart rate zones.
    let value: number[] = [190,171,152,133,114,95];
    // Call the setSettingInfo method of the Device object to set heart rate zones.
    device.setSettingInfo(IndustryService.SettingType.HEART_RATE_ZONES, value).then(() => {
      // The heart rate zones are set successfully.
      console.info(`Succeeded in setting heartRateZones.`);
    }).catch((error: BusinessError) => {
      // The heart rate zones fail to be set.
      console.error(`Failed to set heartRateZones. Code is ${error.code}, message is ${error.message}.`);
    });
  })
  .catch((error: BusinessError) => {
    // The wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${error.code}, message is ${error.message}.`);
  });
```

- Call the [getSettingInfo](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7856155813595) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query heart rate zones. If the query succeeds, an array of six integers in descending order is returned. The integers in the array represents the maximum heart rate (upper limit of extreme zone), lower limit of extreme zone (upper limit of anaerobic zone), lower limit of anaerobic zone (upper limit of aerobic zone), lower limit of aerobic zone (upper limit of fat-burning zone), lower limit of fat-burning zone (upper limit of warm-up zone), and lower limit of warm-up zone, respectively. 
```cpp
// Call the getSettingInfo method of the Device object to query heart rate zones.
device.getSettingInfo(IndustryService.SettingType.HEART_RATE_ZONES).then((value: number[]) => {
  // Output the returned heart rate zones if the query is successful.
  console.info(`Succeeded in getting heartRateZones, value is ${value}.`);
}).catch((error: BusinessError) => {
  // Output error information if the query fails.
  console.error(`Failed to get heartRateZones. Code is ${error.code}, message is ${error.message}.`);
});
```
