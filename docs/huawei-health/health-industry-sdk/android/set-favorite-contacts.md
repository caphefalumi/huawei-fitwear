<!--
  Title: Setting Favorite Contacts
  Catalog: huaweihealth-Guides
  Document ID: set-favorite-contacts-0000002417409629
  Updated: 2026-08-05 02:10:25
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-favorite-contacts-0000002417409629
-->
# Setting Favorite Contacts

Industry apps can call the corresponding API to set favorite contacts on wearables. After the setting, users can quickly make calls to the favorite contacts on wearables.

> **Note:** If you need to obtain the contact information on the phone and deliver it to the wearable as parameters, please refer to [How Do I Obtain Phone Contact Data?](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/faq-0000002511427352#section498154014567) in FAQs.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting favorite contacts. 
```cpp
{
  "settingKey": "favoriteContacts",
  "settingValue": [
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
| settingKey | favoriteContacts | Key of favorite contacts. |
| settingValue | JSON array consisting of name and phoneNumber (The length of the JSON array cannot exceed the maximum number of favorite contacts supported by the wearable, which can be obtained in [Querying Favorite Contacts](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-favorite-contacts-0000002417529489).) | Value of favorite contacts. |
| name | String, no more than 30 bytes | Contact name. |
| phoneNumber | String, no more than 20 bytes | Contact phone number. The value can contain only digits (0–9), parentheses (()), plus signs (+), and minus signs (–). Make sure at least one digit is included. |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set favorite contacts. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting favorite contacts.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "favoriteContacts");
    JSONArray valueArray = new JSONArray();

    JSONObject item1 = new JSONObject();
    item1.put("name", "zs");
    item1.put("phoneNumber", "11122223333");
    valueArray.put(item1);

    JSONObject item2 = new JSONObject();
    item2.put("name", "ls");
    item2.put("phoneNumber", "44455556666");
    valueArray.put(item2);

    jsonObject.put("settingValue", valueArray);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set favorite contacts.
deviceManageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 2, 3, 6, 7, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Setting result. An error message is returned if the API call fails. |
