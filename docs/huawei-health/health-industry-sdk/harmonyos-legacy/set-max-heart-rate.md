<!--
  Title: Setting the Maximum Workout Heart Rate
  Catalog: huaweihealth-Guides
  Document ID: set-max-heart-rate-0000002447352057
  Updated: 2026-08-05 02:10:22
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-max-heart-rate-0000002447352057
-->
# Setting the Maximum Workout Heart Rate

This section describes how to set the maximum heart rate (beats/min) on a wearable during workout. Heart rate zones will be automatically generated when the maximum workout heart rate is configured. When a user wears a wearable for workout, the wearable automatically identifies the workout intensity.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.

> **Note:** After you set the maximum workout heart rate, heart rate zones will be automatically generated, and the heart rates constituting these zones are respectively 100%, 90%, 80%, 70%, 60%, and 50% of the maximum workout heart rate (decimals rounded off). Heart rates you set by calling this API and those set in [Setting Heart Rate Zones](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-heart-rate-interval-0000002413832944) will override each other, and the latest ones prevail.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for setting the maximum workout heart rate. 
```cpp
{
    "settingKey": "maxHeartRate",
    "settingValue": 180
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | maxHeartRate | Key of the maximum workout heart rate. |
| settingValue | Integer ranging from max(100, (220 - age) × 85%) to min(220, (220 - age) × 115%) | Maximum workout heart rate. |
 > **Note:** Maximum workout heart rate range: max(100, (220 - age) × 85%) to min(220, (220 - age) × 115%) **age** indicates the user age, which is calculated based on the basic user information. If no basic user information is available, the default value of **age** is **18**. **max(***a***, ***b***)** returns the maximum value between *a* and *b*, and **min(***a***, ***b***)** returns the minimum value between *a* and *b*.
- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section447217361429) method to set the maximum workout heart rate. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for setting the maximum workout heart rate.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("settingKey", "maxHeartRate");
    zsonObject.put("settingValue", 180);
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the set method to set the maximum workout heart rate.
manageClient.set(zsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String data) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 4, 5, 7 | Result code of the API call. For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the API call succeeds, an empty string is returned. If the API call fails, an error message is returned. |
