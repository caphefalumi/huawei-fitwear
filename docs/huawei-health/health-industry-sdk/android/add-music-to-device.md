<!--
  Title: Adding Music to a Wearable
  Catalog: huaweihealth-Guides
  Document ID: add-music-to-device-0000002383970222
  Updated: 2026-08-05 02:10:32
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/add-music-to-device-0000002383970222
-->
# Adding Music to a Wearable

The Health Industry SDK supports adding music on a phone to a wearable. After the music is added, the music can be played on the wearable.

> **Note:** For a [smart wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557), the music app on the wearable must be opened and granted the storage access permission before adding songs to the wearable. Otherwise, error code **500** will be returned, indicating that song addition is not authorized (see [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401)). For a [lite wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li1184517579555) or [smart band](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li19369195911148), there is no restriction on the storage access permission for adding songs. When songs are being added, the Health Industry SDK checks whether the song formats are supported by the wearable (including compatibility checks for high-definition formats), whether the number of songs exceeds the wearable's upper limit, and whether the song file size exceeds the wearable's available storage space. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). Adding songs to a [smart wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557) and to a [lite wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li1184517579555)/[smart band](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li19369195911148) differ as follows: If the [smart wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557) disconnects when songs are being added to it, some songs will fail to be added. The songs that fail to be added will be displayed on the wearable and can be queried using the API for querying music information. **You are advised to check whether all songs have been added according to the result returned by the API for adding music. If any songs fail to be added, check whether the songs exist on the wearable (by referring to [Querying Music on a Wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-device-local-music-0000002417409613)). If so, delete them and add them again.** If songs fail to be added to a [lite wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li1184517579555) or [smart band](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li19369195911148), the songs will not be displayed on the wearable and cannot be queried.

To add songs, the app must have the storage access or media permission. For details, please refer to [Adding Permissions](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/add-permission-0000002338138528).

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for adding music to the wearable. 
```cpp
{
    "item":"addMusicToDevice",
    "value": {
        "songName":"Dream It Possible",
        "singerName":"Delacey",
        "songFilePath":"/storage/emulated/0/Music/Dream It Possible.flac"
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| item | addMusicToDevice | Key of adding music to the wearable. |
| value | Fields included: **songName**, **singerName**, and **songFilePath** | Value of adding music to the wearable. |
| songName | Data of the String type | Song name. The value contains a maximum of 120 bytes. If the length exceeds the upper limit, status code **2** is returned. |
| singerName | Data of the String type | Singer name. The value contains a maximum of 60 bytes. If the length exceeds the upper limit, status code **2** is returned. |
| songFilePath | Data of the String type | Song file path. The maximum length of a song file path is 1,024 bytes, with the file name itself limited to a maximum of 244 bytes. If the length exceeds the upper limit, status code **2** is returned. |
 > **Note:** Song file paths can only be absolute paths. Relative paths, for example, paths containing "../", are not supported. Obtain an absolute path as follows: If you use **File** to access song files, use the **file.getCanonicalPath()** method to obtain the absolute paths of the song files. If you use **ContentResolver** to access song files, the value of **MediaStore.Audio.Media.DATA** is the absolute path of a song file.
- Call the [send](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__send-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to add music to the wearable. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for adding music to the wearable.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject value = new JSONObject();
    value.put("songName", "Dream It Possible");
    value.put("singerName", "Delacey");
    value.put("songFilePath", "/storage/emulated/0/Music/Dream It Possible.flac");
    jsonObject.put("item", "addMusicToDevice");
    jsonObject.put("value", value);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the send method to add music to the wearable.
deviceManageClient.send(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int resultCode, String result) {
        // Process the returned information.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 11, 30, 40, 41, 42, 43, 44, 208, 500, 501, 502, 503 | Result code of the API call. For details, please refer to the universal result codes and music synchronization status codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, the song file transfer progress and result are returned. If the API call fails, an error message is returned. |
 When songs are being added, the industry app continuously returns the song file transfer progress. If **statusCode** is **208**, it indicates that song files are being transferred; in this case, **result** returns the transfer progress. If **statusCode** is **0**, it indicates that song files have been added successfully; in this case, **result** will be an empty string. 
```cpp
// The following is an example of result of song file transfer:
 {
    "progress": 0
 }  
 {
    "progress": 1
 }  
...
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| progress | Data of the int type | Song file transfer progress. |
