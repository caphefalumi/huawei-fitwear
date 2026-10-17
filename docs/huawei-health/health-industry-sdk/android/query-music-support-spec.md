<!--
  Title: Querying Music Specifications Supported by a Wearable
  Catalog: huaweihealth-Guides
  Document ID: query-music-support-spec-0000002383810338
  Updated: 2026-08-05 02:10:25
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-music-support-spec-0000002383810338
-->
# Querying Music Specifications Supported by a Wearable

A wearable supports only certain music formats and has a limit on the maximum number of songs. If the storage space of the wearable is insufficient, music will fail to be added. Therefore, querying music specifications supported by the wearable is provided to help users add music to the wearable successfully.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying music specifications supported by the wearable. 
```cpp
{
    "item": "musicSupportSpec"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the music specifications supported by the wearable. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying music specifications supported by the wearable.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "musicSupportSpec");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the music specifications supported by the wearable.
deviceManageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int resultCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, music specifications supported by the device are returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. Music specifications supported by the device are carried in **result** when the query is successful. 
```cpp
result example:
{
    "maxMusicNum":500,
    "musicSupportedFormat":["MP3","WAV","AAC","M4A","FLAC","OPUS"],
    "musicRemainingStorageSpace":1501
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| maxMusicNum | Data of the int type | Maximum number of songs supported by the wearable. |
| musicSupportedFormat | Data of the String[] type | Music formats supported by the wearable. |
| musicRemainingStorageSpace | Data of the int type | Remaining storage space of the wearable, in MB. |
