<!--
  Title: Setting Heart Rate Zones
  Catalog: huaweihealth-Guides
  Document ID: set-heart-rate-interval-0000002413832944
  Updated: 2026-08-05 02:10:26
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-heart-rate-interval-0000002413832944
-->
# Setting Heart Rate Zones

This section describes how to set workout heart rate zones for a wearable. During workout, the wearable determines the current heart rate zone based on the user's actual heart rate and displays the corresponding workout status.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.

> **Note:** The heart rate zones are comprised of six heart rate values in descending order (unit: beats/min), which respectively represent the following thresholds: maximum heart rate (upper limit of extreme zone), lower limit of extreme zone (upper limit of anaerobic zone), lower limit of anaerobic zone (upper limit of aerobic zone), lower limit of aerobic zone (upper limit of fat-burning zone), lower limit of fat-burning zone (upper limit of warm-up zone), and lower limit of warm-up zone. These six heart rate values together define five heart rate zones, corresponding to the following workout statuses: extreme, anaerobic endurance, aerobic endurance, fat-burning, and warm-up. Once the heart rate zones are set, the maximum workout heart rate (the first heart rate value of the heart rate zones) is automatically synchronized to the device. Heart rates you set by calling this API and those set in [Setting the Maximum Workout Heart Rate](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-max-heart-rate-0000002447352057) will override each other, and the latest ones prevail.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for setting heart rate zones. 
```cpp
{
    "settingKey": "heartRateInterval",
    "settingValue": [210,180,150,120,90,70]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | heartRateInterval | Key of heart rate zones. |
| settingValue | Array of six integers in descending order | Heart rate zone values. |
 > **Note:** The value of **settingValue** is an array with six integers in descending order, respectively indicating the maximum heart rate (upper limit of extreme zone), lower limit of extreme zone (upper limit of anaerobic zone), lower limit of anaerobic zone (upper limit of aerobic zone), lower limit of aerobic zone (upper limit of fat-burning zone), lower limit of fat-burning zone (upper limit of warm-up zone), and lower limit of warm-up zone. Heart rate zone value setting rules: Maximum heart rate > lower limit of extreme zone > lower limit of anaerobic zone > lower limit of aerobic zone > lower limit of fat-burning zone > lower limit of warm-up zone Each heart rate zone value must fall within the range of 30% of the maximum heart rate to the maximum heart rate. The valid range of the maximum heart rate is [100, 220].
- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section447217361429) method to set heart rate zones during workout. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for setting heart rate zones.
ZSONObject zsonObject = new ZSONObject();
try {
    ZSONArray intervalArray = new ZSONArray();
    intervalArray.put(210);
    intervalArray.put(180);
    intervalArray.put(150);
    intervalArray.put(120);
    intervalArray.put(90);
    intervalArray.put(70);
    zsonObject.put("settingKey", "heartRateInterval");
    zsonObject.put("settingValue", intervalArray);
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the set method to set heart rate zones during workout.
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
