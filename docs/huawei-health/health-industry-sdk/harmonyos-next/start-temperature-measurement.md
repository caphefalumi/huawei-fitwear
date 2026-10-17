<!--
  Title: Starting Body Temperature Measurement
  Catalog: huaweihealth-Guides
  Document ID: start-temperature-measurement-0000002376514437
  Updated: 2026-08-05 02:10:26
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/start-temperature-measurement-0000002376514437
-->
# Starting Body Temperature Measurement

A wearable provides the body temperature measurement capability. You can use the Health Industry SDK to start the body temperature measurement app on the wearable.

> **Note:** The maximum waiting period for a single measurement is 5 minutes. If no measurement is taken within 5 minutes, the measurement timeout status code **407** will be returned. If a new SpO2 or body temperature measurement is initiated during the waiting period, service conflict status code **11** will be returned.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [startDeviceAbility](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section260419244581) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to start a body temperature measurement. 
```cpp
// Import required modules.
import {IndustryService, industryServiceClient} from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Call the startDeviceAbility method of the Device object to start a body temperature measurement.
    device.startDeviceAbility(IndustryService.DeviceAbilityType.TEMPERATURE_MEASURE, (measureResult: number) => {
      // Output the returned measurement result if the body temperature measurement is started successfully.
      console.info(`Succeeded in starting the temperature measurement, result is ${measureResult}.`);
    }).catch((err: BusinessError) => {
      // Output error information if the body temperature measurement fails to be started.
      console.error(`Failed to start the temperature measurement. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```
