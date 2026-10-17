<!--
  Title: Setting Basic User Information
  Catalog: huaweihealth-Guides
  Document ID: set-user-basic-info-0000002338298260
  Updated: 2026-08-05 02:10:23
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-user-basic-info-0000002338298260
-->
# Setting Basic User Information

To improve the data monitoring accuracy of a wearable, an industry app can call the corresponding API to set the basic user information on the wearable. Basic user information includes the date of birth, gender, height, and weight.

> **Note:** If the wearable user has not set the maximum workout heart rate and heart rate zones, the API for [setting the maximum workout heart rate](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-max-heart-rate-0000002372218949) will be called to set the maximum workout heart rate to the default value during basic user information setting. The default value is calculated as 220 minus the user's age, with a lower limit of 100. You are advised to call this API to set the basic user information after connecting to a wearable for the first time. This can ensure the data monitoring accuracy of the wearable.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting basic user information. 
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

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set basic user information. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this); 

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting basic user information.
JSONObject jsonObject = new JSONObject();
JSONObject valueObject = new JSONObject();
try {
    jsonObject.put("settingKey", "userBasicInfo");
    valueObject.put("dateOfBirth", 19900101);
    valueObject.put("gender", "male");
    valueObject.put("height", 170);
    valueObject.put("weight", 50);
    jsonObject.put("settingValue", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set basic user information.
deviceManageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 4, 5, 6, 7 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Setting result. An error message is returned if the API call fails. |
