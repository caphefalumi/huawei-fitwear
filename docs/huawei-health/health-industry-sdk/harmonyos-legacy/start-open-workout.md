<!--
  Title: Starting the Workout App
  Catalog: huaweihealth-Guides
  Document ID: start-open-workout-0000002414072672
  Updated: 2026-08-05 02:10:16
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/start-open-workout-0000002414072672
-->
# Starting the Workout App

A wearable supports multiple workout types. You can use the Health Industry SDK to start the Workout app on the wearable.

> **Note:** The API supports only industry wearable devices that have the Workout app. Currently, HUAWEI WATCH H7546 is supported.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for starting the Workout app. 
```cpp
{
    "item": "openWorkout"
}
```

- Call the [send](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section162931529126) method to start the Workout app. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for starting the Workout app.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "openWorkout");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the send method to start the Workout app.
ServiceCallback serviceCallback = new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String data) {
        // Process the return value.
    }
};
deviceManageClient.send(zsonObject.toString(), serviceCallback);
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 5, 7 | Result code of the API call. For details, please refer to the universal result codes and device control and device event status codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the API call succeeds, an empty string is returned. If the API call fails, an error message is returned. |
