<!--
  Title: Subscribing to Real-Time PPG Data
  Catalog: huaweihealth-Guides
  Document ID: subscribe-ppg-sensor-0000002527132100
  Updated: 2026-08-05 02:10:11
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-ppg-sensor-0000002527132100
-->
# Subscribing to Real-Time PPG Data

This section describes how to subscribe to and unsubscribe from the real-time PPG data for a wearable. After a successful subscription, the wearable reports the current real-time PPG data. After unsubscription, the real-time PPG data is no longer reported.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.

- Call the [subscribeRealTimeData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section049515146113) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to subscribe to the PPG data. 
```cpp
// Import required modules.
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError, Callback } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Callback parameter for real-time PPG data.
    let callback: Callback<IndustryService.RealTimeData> = (realTimeData: IndustryService.RealTimeData) => {
      console.info(`report ppgSensor: ${JSON.stringify(realTimeData)}`);
    };
    // Call the subscribeRealTimeData method of the Device object to subscribe to the real-time PPG data.
    device.subscribeRealTimeData(IndustryService.RealTimeDataType.PPG_SENSOR, callback).then(() => {
      // The subscription is successful.
      console.info('Succeeded in subscribing ppgSensor.');
    }).catch((err: BusinessError) => {
      // The subscription fails.
      console.error(`Failed to subscribe ppgSensor. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
    // Output error information if the wearable list fails to be obtained.
    console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
  });
```

- Process the real-time PPG data obtained from the wearable in **Callback<IndustryService.**[RealTimeData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section12262172612114)**>**. **realTimeData** contains the real-time PPG data generated. 
```cpp
realTimeData example:
{
	"time": 1773212425379,
	"type": "ppgSensor",
	"errorCode": 0,
	"fields": {
		"ppg": [{
			"channel": 3,
			"data": "[4975370,5146846,2822378,1443333,2244537,1848356,1848532,1848618,1848823,1849085]"
		},
		{
			"channel": 5,
			"data": "[17427086,8077879,21825462,21828614,21287426,10857652,16123185,13505959,14820043,14820043]"
		},
		{
			"channel": 7,
			"data": "[20771304,8078026,21831240,21833748,21832756,12866805,19205638,16055861,14458503,14458531]"
		}]
	}
}
```
 
| Parameter | Type | Unit | Description |
| --- | --- | --- | --- |
| fields | Record<string, object \| string \| number> | - | Object that contains real-time data. |
| channel | number | - | Three types of data channels, with **3**, **5**, and **7** corresponding to the GREEN, RED, and IR channels, respectively. |
| data | number[] | - | Specific PPG data of each channel. |
 > **Note:** The PPG sensor collects data at an interval of 10 milliseconds, and reports data at an interval of approximately 100 milliseconds. There are three channels of data (GREEN, RED, and IR), and each channel reports 10 floating-point numbers. The volume of reported data is not fixed. The example provided represents typical cases, but the actual reporting interval and data volume may vary depending on the device.

- Call the [unSubscribeRealTimeData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1638711819219) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to unsubscribe from the real-time PPG data. 
```cpp
// Call the unSubscribeRealTimeData method to unsubscribe from the real-time PPG data.
// Note: The callback object used here must be the same as that used for real-time PPG data subscription.
device.unSubscribeRealTimeData(IndustryService.RealTimeDataType.PPG_SENSOR, callback).then(() => {
  // The unsubscription is successful.
  console.info('Succeeded in unsubscribing ppgSensor.');
}).catch((err: BusinessError) => {
  // The unsubscription fails.
  console.error(`Failed to unsubscribe heartRate. Code is ${err.code}, message is ${err.message}.`);
});
```
 > **Note:** The callback object passed for unsubscription must be the same as that passed for subscription.
