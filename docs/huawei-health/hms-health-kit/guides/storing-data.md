<!--
  Title: Storing Data
  Catalog: HMSCore-Guides-V5
  Document ID: storing-data-0000001050162036-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/storing-data-0000001050162036-V5
-->
# Storing Data

Your app can store the weight data to the HUAWEI Health app, by writing one or more entries of data at a time.

When storing the weight data, the start time must be the same as the end time (startTime = endTime). Otherwise, the operation will fail.

Before storing the data, make sure that you have obtained the related permissions from Huawei. Otherwise, the API calling will fail. If the user has not authorized the related permission, the API calling will also fail.

| Data Openness Type | API | Requesting Permissions from User (See [Signing In and Applying for Permissions](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/requesting-user-authorization-0000001071733944-V5)) | Scope URL | Requesting Permissions from Huawei (See [Applying for Health Kit](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/apply-kitservice-0000001071254802-V5)) |
| --- | --- | --- | --- | --- |
| Weight data | [saveSample](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s2a5f1547aacd4663813943a33700f0f2) Store a single entry of data | [HEALTHKIT_EXTEND_FATREDUCTION_WRITE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthextendscope-0000001071609519-V5#EN-US_TOPIC_0000001136869919__HEALTHKIT_EXTEND_FATREDUCTION_WRITE) Write permission for diet/fat reducation management (including weight) | https://www.huawei.com/healthkit/extend/fatreduction.write Write the diet/fat reducation information to the Health app via Health Kit. | Diet/Fat reduction management |
| [saveSamples](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s8018bb89ff8b40ba96048e9451c25a66) Store up to 20 entries of data |  |  |  |  |

#### Storing a Single Entry of Data

- Call the [saveSample](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s2a5f1547aacd4663813943a33700f0f2) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to store a single entry of data.
- The query result will be returned via the [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) object defined as an input parameter. **Sample code** 1 (for weight data query) 
```cpp
Map map = new HashMap();
// You can search for all types in the sample dataset in the HiHealthPointType class.
map.put(HiHealthPointType.DATA_POINT_WEIGHT, 70.5D);
map.put(HiHealthPointType.DATA_POINT_WEIGHT_BMI, 18.8D);
map.put(HiHealthPointType.DATA_POINT_WEIGHT_MUSCLES, 33.5D);
map.put(HiHealthPointType.DATA_POINT_WEIGHT_BODYFAT, 23.5D);
map.put(HiHealthPointType.DATA_POINT_WEIGHT_PROTEIN, 14.5D);
final long endTime = System.currentTimeMillis();
final long startTime = endTime;
HiHealthSetData hiHealthSetData =
    new HiHealthSetData(HiHealthSetType.DATA_SET_WEIGHT_EX, map, startTime, endTime);
HiHealthDataStore.saveSample(context, hiHealthSetData, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object object) {
        Log.i(TAG, "saveSample resultCode is " + resultCode);
        if (resultCode == HiHealthError.SUCCESS) {
            Log.i(TAG, "saveSample resultList: " + object);
        }
    }
});
```
 
```cpp
Map map = new HashMap();
// You can search for all types in the sample dataset in the HiHealthPointType class.
map.put(HiHealthPointType.DATA_POINT_BLOODPRESSURE_SYSTOLIC, 115D);
map.put(HiHealthPointType.DATA_POINT_BLOODPRESSURE_DIASTOLIC, 75D);
map.put(HiHealthPointType.DATA_POINT_REST_HEARTRATE, 80D);
final long endTime = System.currentTimeMillis();
final long startTime = endTime;
HiHealthSetData hiHealthSetData =
    new HiHealthSetData(HiHealthSetType.DATA_SET_BLOOD_PRESSURE, map, startTime, endTime);
HiHealthDataStore.saveSample(context, hiHealthSetData, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object object) {
        Log.i(TAG, "saveSample resultCode is " + resultCode);
        if (resultCode == HiHealthError.SUCCESS) {
            Log.i(TAG, "saveSample resultList: " + object);
        }
    }
});
```
 
```cpp
Map map = new HashMap();
// You can search for all types in the sample dataset in the HiHealthPointType class.
map.put(HiHealthPointType.DATA_POINT_BLOODSUGAR_BF_BEFORE, 4.2D);
map.put(HiHealthPointType.DATA_POINT_BLOODSUGAR_BF_AFTER, 5.0D);
map.put(HiHealthPointType.DATA_POINT_BLOODSUGAR_LC_BEFORE, 4.2D);
map.put(HiHealthPointType.DATA_POINT_BLOODSUGAR_LC_AFTER, 5.0D);
map.put(HiHealthPointType.DATA_POINT_BLOODSUGAR_DN_BEFORE, 4.2D);
map.put(HiHealthPointType.DATA_POINT_BLOODSUGAR_DN_AFTER, 5.1D);
map.put(HiHealthPointType.DATA_POINT_BLOODSUGAR_SL_BEFORE, 4.1D);
map.put(HiHealthPointType.DATA_POINT_BLOODSUGAR_BEFORE_DAWN, 4.0D);
final long endTime = System.currentTimeMillis();
final long startTime = endTime;
HiHealthSetData hiHealthSetData =
    new HiHealthSetData(HiHealthSetType.DATA_SET_BLOOD_SUGAR, map, startTime, endTime);
HiHealthDataStore.saveSample(context, hiHealthSetData, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object object) {
        Log.i(TAG, "saveSample resultCode is " + resultCode);
        if (resultCode == HiHealthError.SUCCESS) {
            Log.i(TAG, "saveSample resultList: " + object);
        }
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| hiHealthSetData | HiHealthData | HiHealthData. | M |
| callback | ResultCallback | Result callback. | M |
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). | M |
| object | Object | Result description. Succeeded: List<Object> Failed: Object | M |

#### Storing Multiple Entries of Data

- Call the [saveSamples](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s8018bb89ff8b40ba96048e9451c25a66) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to store up to 20 entries of data.
- The query result will be returned via the [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) object defined as an input parameter. **Sample code 1** (for weight data query) 
```cpp
List<HiHealthData> hiHealthDataList = new ArrayList<>();
final long currentTime = System.currentTimeMillis();
final long oneDayInMillis = 1000L * 60 * 60 * 24;
Map map1 = new HashMap();
map1.put(HiHealthPointType.DATA_POINT_WEIGHT, 72D);
map1.put(HiHealthPointType.DATA_POINT_WEIGHT_BMI, 20.8D);
map1.put(HiHealthPointType.DATA_POINT_WEIGHT_MUSCLES, 34.5D);
map1.put(HiHealthPointType.DATA_POINT_WEIGHT_BODYFAT, 22.5D);
map1.put(HiHealthPointType.DATA_POINT_WEIGHT_PROTEIN, 16.5D);
HiHealthSetData hiHealthSetData1 = new HiHealthSetData(HiHealthSetType.DATA_SET_WEIGHT_EX, map1,
    currentTime - oneDayInMillis, currentTime - oneDayInMillis);
hiHealthDataList.add(hiHealthSetData1);
Map map2 = new HashMap();
map2.put(HiHealthPointType.DATA_POINT_WEIGHT, 73D);
map2.put(HiHealthPointType.DATA_POINT_WEIGHT_BMI, 20.8D);
map2.put(HiHealthPointType.DATA_POINT_WEIGHT_FATLEVEL, 4.0D);
map2.put(HiHealthPointType.DATA_POINT_WEIGHT_MUSCLES, 38.5D);
map2.put(HiHealthPointType.DATA_POINT_WEIGHT_BODYFAT, 29.5D);
HiHealthSetData hiHealthSetData2 =
    new HiHealthSetData(HiHealthSetType.DATA_SET_WEIGHT_EX, map2, currentTime, currentTime);
hiHealthDataList.add(hiHealthSetData2);
HiHealthDataStore.saveSamples(context, hiHealthDataList, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object object) {
        Log.i(TAG, "SaveSamples() resultCode is " + resultCode);
        if (resultCode == HiHealthError.SUCCESS) {
            Log.i(TAG, "saveSample resultList: " + object);
        }
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

#### Constants of Data Types that Support Storage

| Data Openness Type | Constant | Key Value |
| --- | --- | --- |
| Weight | HiHealthSetType.[DATA_SET_WEIGHT_EX](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__DATA_SET_WEIGHT_EX) | 10006 |
