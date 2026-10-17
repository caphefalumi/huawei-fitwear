<!--
  Title: Setting SMS Quick Reply Information
  Catalog: huaweihealth-Guides
  Document ID: set-quick-replies-0000002418368205
  Updated: 2026-08-05 02:10:25
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-quick-replies-0000002418368205
-->
# Setting SMS Quick Reply Information

Industry apps can call the corresponding API to set SMS quick reply information for wearables. After the setting, users can select the desired quick replies to respond to SMS notifications received on wearables.

- It is recommended that you call this API to send the default SMS quick replies to the wearable after the industry app is successfully paired with the wearable, to ensure the normal use of this function.
- At least one SMS quick reply must be set when this API is called. Otherwise, the function may not work properly.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting SMS quick reply information. 
```cpp
{
  "settingKey": "quickReplies",
  "settingValue": [
    {
      "index": 0,
      "reply": "yes"
    },
    ...
    {
      "index": 5,
      "reply": "ok"
    }
  ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | quickReplies | Key of the SMS quick reply information. |
| settingValue | A JSON array consisting of index and reply, with a length of no more than 15 | Value of the SMS quick reply information. |
| index | An integer ranging from 0 to 14 | Index of a reply message, which relates to the sequence of reply messages displayed on the wearable. |
| reply | A string of no more than 36 bytes | Content of a reply message. |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the SMS quick reply information. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting SMS quick reply information.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "quickReplies");
    JSONArray valueArray = new JSONArray();

    JSONObject value1 = new JSONObject();
    value1.put("index", 0);
    value1.put("reply", "yes");
    valueArray.put(value1);

    JSONObject value2 = new JSONObject();
    value2.put("index", 1);
    value2.put("reply", "ok");
    valueArray.put(value2);

    jsonObject.put("settingValue", valueArray);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the SMS quick reply information.
deviceManageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 7, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Setting result. An error message is returned if the API call fails. |
