<!--
  Title: Querying Music on a Wearable
  Catalog: huaweihealth-Guides
  Document ID: query-device-local-music-0000002417409613
  Updated: 2026-08-05 02:10:28
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-device-local-music-0000002417409613
-->
# Querying Music on a Wearable

This section describes how to query information about music on a wearable so that users can view and manage music using their phones.

> **Note:** Only information about songs downloaded to the wearable can be queried. Information about online songs cannot be queried. For a [smart wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557), the music app on the wearable must be opened and granted the storage access permission before querying song information. Otherwise, error code **500** will be returned, indicating that song information query is not authorized (see [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401)). For a [lite wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li1184517579555) or [smart band](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li19369195911148), there is no restriction on the storage access permission for querying song information. Concurrent query of music on the same wearable is not supported. You must wait for the previous query to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying information about music on the wearable. 
```cpp
{
    "item": "deviceLocalMusicInfo"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query information about music on the wearable. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying information about music on the wearable.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "deviceLocalMusicInfo");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query information about music on the wearable.
deviceManageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int resultCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 11, 30, 500 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, information about music on the wearable is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. Information about music on the wearable is carried in **result** when the query is successful. 
```cpp
result example:
{
    "dataType":"deviceLocalMusicInfo",
    "totalCount":2,
    "index":0,
    "count":2,
    "dataList":[
        {
            "songId":0,
            "songName":"Dream It Possible",
            "singerName":"Delacey"
        },
        {
            "songId":1,
            "songName":"Beijing Bass",
            "singerName":"J.R.G."
        }
    ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataType | deviceLocalMusicInfo | Type of music information on the wearable. |
| totalCount | Data of the int type | Total number of data records of the current data type. |
| index | Data of the int type | Index of the first returned data record among all data. |
| count | Data of the int type | Number of records returned. |
| dataList | Fields included: **songId**, **songName**, and **singerName** | Data list. Fields vary depending on the data type. |
| songId | Data of the int type | Song ID returned by the wearable, which is unique and used to delete the song. |
| songName | Data of the String type | Song name returned by the wearable. |
| singerName | Data of the String type | Singer name returned by the wearable. |
 > **Note:** If the data to be returned in a single callback exceeds 1 MB, the system automatically paginates it. Each page is then delivered through a separate callback, so you do not need to call the query API again. If the sum of **index** and **count** is equal to the value of **totalCount**, all data of the current type is returned.
