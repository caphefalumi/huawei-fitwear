<!--
  Title: Querying Basic User Information
  Catalog: huaweihealth-Guides
  Document ID: query-user-basic-info-0000002372259089
  Updated: 2026-08-05 02:10:27
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-user-basic-info-0000002372259089
-->
# Querying Basic User Information

This section describes how to query basic user information of a wearable. If the user has not set their basic information, error code **9** will be returned for a query.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying basic user information. 
```cpp
{
    "item": "userBasicInfo"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query basic user information. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying basic user information.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "userBasicInfo");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query basic user information.
deviceManageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 9 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, basic user information is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. Basic user information is carried in **result** when the query is successful. 
```cpp
result example:
{
    "userBasicInfo":{
        "dateOfBirth": 19900101,
        "gender": "male",
        "height": 170,
        "weight": 50
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dateOfBirth | Date in yyyyMMdd format, no earlier than January 1, 1900 (**19000101**) | Date of birth. |
| gender | male | Male. |
| female | Female. |  |
| height | Integer ranging from 50 to 250 | Height, in centimeters. |
| weight | Integer ranging from 10 to 250 | Weight, in kilograms. |
