<!--
  Title: Setting Basic User Information
  Catalog: huaweihealth-Guides
  Document ID: set-user-basic-info-0000002447352053
  Updated: 2026-08-05 02:10:11
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-user-basic-info-0000002447352053
-->
# Setting Basic User Information

This section describes how to set basic user information of a wearable, including the date of birth, gender, height, and weight.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.

> **Note:** If the wearable user has not set the maximum workout heart rate and heart rate zones, the API for [setting the maximum workout heart rate](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-max-heart-rate-0000002447352057) will be called to set the maximum workout heart rate to the default value during basic user information setting. The default value is calculated as 220 minus the user's age, with a lower limit of 100.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for setting basic user information. 
```cpp
{
    "settingKey": "userBasicInfo",
    "settingValue": {
        "dateOfBirth": 19900101,
        "gender": "male",
        "height": 170,
        "weight": 50
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | userBasicInfo | Key of basic user information. |
| settingValue | Fields included: **dateOfBirth**, **gender**, **height**, and **weight** | Basic user information. |
| dateOfBirth | • Date in yyyyMMdd format • The date must be no earlier than January 1, 1900 (**19000101**). • The age calculated from the date must be at least 18 years old. | Date of birth. |
| gender | male | Male. |
| female | Female. |  |
| height | Integer ranging from 50 to 250 | Height, in centimeters. |
| weight | Integer ranging from 10 to 250 | Weight, in kilograms. |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section447217361429) method to set basic user information. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext()); 

// Construct input data in ZSON format for setting basic user information.
ZSONObject zsonObject = new ZSONObject();
ZSONObject valueObject = new ZSONObject();
try {
    zsonObject.put("settingKey", "userBasicInfo");
    valueObject.put("dateOfBirth", 19900101);
    valueObject.put("gender", "male");
    valueObject.put("height", 170);
    valueObject.put("weight", 50);
    zsonObject.put("settingValue", valueObject);
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the set method to set basic user information.
deviceManageClient.set(zsonObject.toString(), new ServiceCallback() {
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
