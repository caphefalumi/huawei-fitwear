<!--
  Title: Stopping Adding Music
  Catalog: huaweihealth-Guides
  Document ID: stop-add-music-0000002383810342
  Updated: 2026-08-05 02:10:33
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/stop-add-music-0000002383810342
-->
# Stopping Adding Music

This section describes how to stop adding music to a wearable.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for stopping adding music. 
```cpp
{
    "item":"stopAddMusic",
    "value": {
        "songFilePath":"/storage/emulated/0/Music/Dream It Possible.flac"
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| item | stopAddMusic | Key of stopping adding music. |
| value | Field included: **songFilePath** | Value of stopping adding music. |
| songFilePath | Data of the String type | Song file path. The maximum length of a song file path is 1024 bytes. If the length exceeds the upper limit, status code **2** is returned. |

- Call the [send](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__send-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to stop adding music. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for stopping adding music.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject value = new JSONObject();
    value.put("songFilePath", "/storage/emulated/0/Music/Dream It Possible.flac");
    jsonObject.put("item", "stopAddMusic");
    jsonObject.put("value", value);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the send method to stop adding music.
deviceManageClient.send(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int resultCode, String result) {
        // Process the returned information.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, an empty string is returned. If the API call fails, an error message is returned. |
