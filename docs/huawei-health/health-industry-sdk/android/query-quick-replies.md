<!--
  Title: Querying SMS Quick Reply Information
  Catalog: huaweihealth-Guides
  Document ID: query-quick-replies-0000002384728992
  Updated: 2026-08-05 02:10:28
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-quick-replies-0000002384728992
-->
# Querying SMS Quick Reply Information

Industry apps can call the corresponding API to query SMS quick reply information on wearables.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying SMS quick reply information. 
```cpp
{
  "item": "quickReplies"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the SMS quick reply information. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying SMS quick reply information.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "quickReplies");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the SMS quick reply information.
manageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, the SMS quick reply information is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. SMS quick reply information is carried in **result** when the query is successful. 
```cpp
result example:
{
  "quickReplies": [
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
| quickReplies | - | Key of the SMS quick reply. |
| index | Integer | Index of a reply message. |
| reply | String | Content of a reply message. |
