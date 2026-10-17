<!--
  Title: Setting Music Playback Information
  Catalog: huaweihealth-Guides
  Document ID: set-music-info-0000002417409617
  Updated: 2026-08-05 02:10:34
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-music-info-0000002417409617
-->
# Setting Music Playback Information

This section describes how to set music playback information displayed on the music screen of a wearable, including the song name, singer name, song playback state, volume, and maximum volume.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting music playback information. 
```cpp
{
    "settingKey":"musicInfo",
    "settingValue": {
        "playState": 3,
        "singerName": "singer2",
        "songName": "song2",
        "maxVolume": 15,
        "currentVolume": 3
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | musicInfo | Key of music playback information. |
| settingValue | Fields included: **playState**, **singerName**, **songName**, **maxVolume**, and **currentVolume** | Value of music playback information. |
| playState | **0**: No music is playing. **1**: Playback stopped. **2**: Playback paused. **3**: Music is playing. | Song playback state. |
| singerName | String, no more than 60 bytes | Singer name. |
| songName | String, no more than 120 bytes | Song name. |
| maxVolume | Integer, with a value range of [1, 255] | Maximum volume of media playback on the phone. |
| currentVolume | Integer, with a value range of [0, 255] (no greater than the value of **maxVolume**) | Current music volume during media playback on the phone. |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set music playback information. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting music playback information.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "musicInfo");
    JSONObject info = new JSONObject();
    info.put("singerName", "singer2");
    info.put("songName", "song2");
    info.put("playState", 3);
    info.put("maxVolume", 15);
    info.put("currentVolume", 3);
    jsonObject.put("settingValue", info);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set music playback information.
deviceManageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 2, 4, 5, 6, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Setting result. An error message is returned if the API call fails. |
 > **Note:** The music information setting feature can be used only when the wearable is on the Assistant·TODAY screen and the subscription is active.
