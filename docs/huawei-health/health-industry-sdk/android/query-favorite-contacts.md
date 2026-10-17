<!--
  Title: Querying Favorite Contacts
  Catalog: huaweihealth-Guides
  Document ID: query-favorite-contacts-0000002417529489
  Updated: 2026-08-05 02:10:28
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-favorite-contacts-0000002417529489
-->
# Querying Favorite Contacts

Industry apps can call the corresponding API to query favorite contacts on wearables.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying favorite contacts. 
```cpp
{
  "item": "favoriteContacts"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query favorite contacts. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying favorite contacts.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "favoriteContacts");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query favorite contacts.
deviceManageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 2, 3, 6, 7, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, favorite contacts' information is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. Favorite contacts' information is carried in **result** when the query is successful. 
```cpp
result example:
{
  "maxSupportNumber": 10,
  "contactsList": [
    {
      "name": "zs",
      "phoneNumber": "11122223333"
    },
    ...
    {
      "name": "ls",
      "phoneNumber": "44455556666"
    }
  ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| maxSupportNumber | Data of the int type | Maximum number of favorite contacts supported by the wearable. |
| contactsList | - | Data list. Fields vary depending on the data type. |
| name | Data of the String type | Contact name. |
| phoneNumber | Data of the String type | Phone number of a contact. |
