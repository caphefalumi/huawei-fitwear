<!--
  Title: Deleting Data
  Catalog: HMSCore-Guides-V5
  Document ID: deleting-data-0000001050163993-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/deleting-data-0000001050163993-V5
-->
# Deleting Data

Your app can delete the weight data that it has written to the HUAWEI Health app.

> **Note:** When the data storage permission is obtained, the data deletion permission is also obtained.

#### Deleting Data Within a Specific Time Period

- Call the [deleteSample](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s91b22ea938f848c799268751676108ad) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to delete data within a specific time period.
- The query result will be returned via the [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) object defined as an input parameter. **Sample code** 
```cpp
Map map = new HashMap();
final long endTime = System.currentTimeMillis();
final long startTime = endTime - 1000L * 60 * 60 * 24;
// Delete the weight data in the last 24 hours.
HiHealthSetData hiHealthSetData =
    new HiHealthSetData(HiHealthSetType.DATA_SET_WEIGHT_EX, map, startTime, endTime);
HiHealthDataStore.deleteSample(context, hiHealthSetData, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object data) {
        Log.i(TAG, "delete sample of the latest 24h onResult: " + resultCode);
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| hiHealthSetData | HiHealthSetData | HiHealthSetData to be deleted. | M |
| callback | ResultCallback | Result callback. | M |
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). | M |
| object | Object | Result description. Succeeded: List<Object> Failed: Object | M |

#### Deleting Data Within Specific Time Periods

- Call the [deleteSamples](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sa4e9cb1612ef49a292c72f59d99a03f4) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to delete data of the same type in multiple time periods (no more than 20).
- The query result will be returned via the [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) object defined as an input parameter. **Sample code** 
```cpp
Map map = new HashMap();
long oneDayInMillis = 1000L * 60 * 60 * 24;
long endTime = System.currentTimeMillis();
long startTime = endTime - oneDayInMillis;
long secondEndTime = startTime - oneDayInMillis * 3;
long secondStartTime = secondEndTime - oneDayInMillis;
// Delete the weight data within two time periods simultaneously.
HiHealthSetData hiHealthSetData =
    new HiHealthSetData(HiHealthSetType.DATA_SET_WEIGHT_EX, map, startTime, endTime);
HiHealthSetData secondHiHealthSetData =
    new HiHealthSetData(HiHealthSetType.DATA_SET_WEIGHT_EX, map, secondStartTime, secondEndTime);
List<HiHealthSetData> hiHealthSetDatas = new ArrayList<>();
hiHealthSetDatas.add(hiHealthSetData);
hiHealthSetDatas.add(secondHiHealthSetData);
HiHealthDataStore.deleteSamples(context, hiHealthSetDatas, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object object) {
        Log.i(TAG, "delete samples onResult: " + resultCode);
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| hiHealthDataList | List<HiHealthData> | HiHealthData dataset. | M |
| callback | ResultCallback | Result callback. | M |
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). | M |
| object | Object | Result description. Succeeded: List<Object> Failed: Object | M |
