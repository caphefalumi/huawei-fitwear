<!--
  Title: Deleting Music from a Wearable
  Catalog: huaweihealth-Guides
  Document ID: delete-device-local-music-0000002417529473
  Updated: 2026-08-05 02:10:31
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/delete-device-local-music-0000002417529473
-->
# Deleting Music from a Wearable

The Health Industry SDK supports deleting songs from a wearable.

> **Note:** For a [smart wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557), the music app on the wearable must be opened and granted the storage access permission before deleting songs from the wearable. Otherwise, error code **500** will be returned, indicating that song deletion is not authorized (see [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401)). For a [lite wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li1184517579555) or [smart band](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li19369195911148), there is no restriction on the storage access permission for deleting songs from the wearable.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for deleting music from the wearable. 
```cpp
{
    "item":"deleteDeviceLocalMusic",
    "value": {
        "songIds":[0,1]
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| item | deleteDeviceLocalMusic | Key of deleting music from the wearable. |
| value | Field included: **songIds** | Value of deleting music from the wearable. |
| songIds | Data of the int[] type, with the value being that of **songId** returned in [Querying Music on a Wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-device-local-music-0000002417409613) | Song IDs. Multiple songs can be deleted at a time. Note that a maximum of 10 songs can be deleted at a time. If the number of songs to be deleted exceeds this upper limit, status code **504** is returned. |

- Call the [send](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__send-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to delete music from the wearable. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for deleting music from the wearable.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject value = new JSONObject();
    JSONArray jsonArray = new JSONArray();

    // Delete songs whose IDs are 0 and 1.
    jsonArray.put(0);
    jsonArray.put(1);
    value.put("songIds", jsonArray);
    jsonObject.put("item", "deleteDeviceLocalMusic");
    jsonObject.put("value", value);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the send method to delete music from the wearable.
deviceManageClient.send(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int resultCode, String result) {
        // Process the returned information.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 30, 500, 504 | Result code of the API call. For details, please refer to the universal result codes and music synchronization status codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, an empty string is returned. If the API call fails, an error message is returned. |
 > **Note:** If a song ID does not exist, the API regards the deletion as a success and returns status code **0**. If the song ID list contains any song ID that does not exist, the API only deletes songs that exist and returns status code **0**.
