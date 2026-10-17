<!--
  Title: Querying a Single Workout Record
  Catalog: HMSCore-Guides-V5
  Document ID: querying-dailyactivities-0000001053213332-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/querying-dailyactivities-0000001053213332-V5
-->
**
# Querying a Single Workout Record

The following describes how to query the dataset from the HUAWEI Health app for a single workout session, such as walking, running, or cycling.

The data is originated from the data recorded by the HUAWEI Health app on the phone or a Huawei wearable device after the user starts an exercise activity.
Figure 1 **Single workout record

Before querying the data, make sure that you have obtained the related permissions from Huawei. Otherwise, the API calling will fail. If the user has not authorized the related permission, the API calling will also fail.

| Data Openness Type | Query API | Requesting Permissions from User (See [Signing In and Applying for Permissions](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/requesting-user-authorization-0000001071733944-V5)) | Scope URL | Requesting Permissions from Huawei (See [Applying for Health Kit](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/apply-kitservice-0000001071254802-V5)) |
| --- | --- | --- | --- | --- |
| Walking dataset | [execQuery](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s7358cf11ae47431cb3f071a33e54f191) Queries data by start time, end time, and data type. [getCount](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s249a7a32acd04c629001db9f95e24074) Queries the number of data items. | [HEALTHKIT_EXTEND_SPORT_READ](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthextendscope-0000001071609519-V5#EN-US_TOPIC_0000001136869919__HEALTHKIT_EXTEND_SPORT_READ) Read permission for basic workout management (including data for a single workout session) | https://www.huawei.com/healthkit/extend/sport.read Read the basic workout information in the Health app via Health Kit. | Basic workout management |
| Cycling dataset |  |  |  |  |
| Running dataset |  |  |  |  |

#### Calling the execQuery Method to Query the Single Workout Record

- Call the [execQuery](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s7358cf11ae47431cb3f071a33e54f191) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to query the single workout record of the user.
- The query result will be returned via the [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) object defined as an input parameter. **Sample code 1** (for walking data query) 
```cpp
int timeout = 0;
long endTime = System.currentTimeMillis();
    // The time range for the query is the past 30 days.
long startTime = endTime - 1000 * 60 * 60 * 24 * 30L;
// Query the walking data.
HiHealthDataQuery hiHealthDataQuery = new HiHealthDataQuery(HiHealthSetType.DATA_SET_WALK_METADATA, startTime,
    endTime, new HiHealthDataQueryOption());
HiHealthDataStore.execQuery(context, hiHealthDataQuery, timeout, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object data) {
        if (resultCode == HiHealthError.SUCCESS && data instanceof List){ 
            List dataList = (List) data;
            for (Object obj : dataList) {
                HiHealthSetData hiHealthData = (HiHealthSetData) obj;
                Map map = hiHealthData.getMap();
                Log.i(TAG, "start time : " + hiHealthData.getStartTime());
                Log.i(TAG, "total_time : " + map.get("total_time"));
                Log.i(TAG, "total_distance : " + map.get("total_distance"));
                Log.i(TAG, "total_calories : " + map.get("total_calories"));
                Log.i(TAG, "step : " + map.get("step"));
                Log.i(TAG, "average_pace : " + map.get("average_pace"));
                Log.i(TAG, "average_speed : " + map.get("average_speed"));
                Log.i(TAG, "average_step_rate : " + map.get("average_step_rate"));
                Log.i(TAG, "step_distance : " + map.get("step_distance"));
                Log.i(TAG, "average_heart_rate : " + map.get("average_heart_rate"));
                Log.i(TAG, "total_altitude : " + map.get("total_altitude"));
                Log.i(TAG, "total_descent : " + map.get("total_descent"));
                Log.i(TAG, "data source : " + map.get("data_source"));
            }
        }
    }
});
```
 **Sample code 2** (for running data query) 
```cpp
int timeout = 0;
long endTime = System.currentTimeMillis();
    // The time range for the query is the past 30 days.
long startTime = endTime - 1000 * 60 * 60 * 24 * 30L;
    // Query the running data.
HiHealthDataQuery hiHealthDataQuery = new HiHealthDataQuery(HiHealthSetType.DATA_SET_RUN_METADATA, startTime,
    endTime, new HiHealthDataQueryOption());
HiHealthDataStore.execQuery(context, hiHealthDataQuery, timeout, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object data) {
        if (resultCode == HiHealthError.SUCCESS && data instanceof List){ 
            List dataList = (List) data;
            for (Object obj : dataList) {
                HiHealthSetData hiHealthData = (HiHealthSetData) obj;
                Map map = hiHealthData.getMap();
                Log.i(TAG, "start time : " + hiHealthData.getStartTime());
                Log.i(TAG, "total_time : " + map.get("total_time"));
                Log.i(TAG, "total_distance : " + map.get("total_distance"));
                Log.i(TAG, "total_calories : " + map.get("total_calories"));
                Log.i(TAG, "step : " + map.get("step"));
                Log.i(TAG, "average_pace : " + map.get("average_pace"));
                Log.i(TAG, "average_speed : " + map.get("average_speed"));
                Log.i(TAG, "average_step_rate : " + map.get("average_step_rate"));
                Log.i(TAG, "step_distance : " + map.get("step_distance"));
                Log.i(TAG, "average_heart_rate : " + map.get("average_heart_rate"));
                Log.i(TAG, "total_altitude : " + map.get("total_altitude"));
                Log.i(TAG, "total_descent : " + map.get("total_descent"));
                Log.i(TAG, "data source : " + map.get("data_source"));
            }
        }
    }
});
```
 **Sample code 3** (for cycling data query)
```cpp
int timeout = 0;
long endTime = System.currentTimeMillis();
    // The time range for the query is the past 30 days.
long startTime = endTime - 1000 * 60 * 60 * 24 * 30L;
    // Query the cycling data.
final HiHealthDataQuery hiHealthDataQuery = new HiHealthDataQuery(HiHealthSetType.DATA_SET_RIDE_METADATA,
    startTime, endTime, new HiHealthDataQueryOption());
HiHealthDataStore.execQuery(context, hiHealthDataQuery, timeout, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object data) {
        if (resultCode == HiHealthError.SUCCESS && data instanceof List) {
            List dataList = (List) data;
            for (Object obj : dataList) {
                HiHealthSetData hiHealthData = (HiHealthSetData) obj;
                Map map = hiHealthData.getMap();
                Log.i(TAG, "start time : " + hiHealthData.getStartTime());
                Log.i(TAG, "total_time : " + map.get("total_time"));
                Log.i(TAG, "total_distance : " + map.get("total_distance"));
                Log.i(TAG, "total_calories : " + map.get("total_calories"));
                Log.i(TAG, "average_pace : " + map.get("average_pace"));
                Log.i(TAG, "average_speed : " + map.get("average_speed"));
                Log.i(TAG, "average_heart_rate : " + map.get("average_heart_rate"));
                Log.i(TAG, "data source : " + map.get("data_source"));
            }
        }
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| hiHealthDataQuery | HiHealthDataQuery | Query criteria. | M |
| timeout | int | Timeout. | M |
| callback | ResultCallback | Result callback. | M |
 
| Parameter Name | Parameter Type | Description |
| --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). |
| data | Object | Data list. Succeeded (data available): List<HiHealthSetData> Succeeded (no data): success information description (String) Other: error description (String) |

#### Calling the getCount Method to Query the Single Workout Record Entries

- Call the [getCount](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s249a7a32acd04c629001db9f95e24074) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to query the single workout record entries of the user.
- The query result will be returned via the [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) object defined as an input parameter. **Sample code** (for walking data query) 
```cpp
final long endTime = System.currentTimeMillis();
final long startTime = endTime - 1000L * 60 * 60 * 24 * 30L; // Data of the past 30 days.
HiHealthDataQuery hiHealthDataQuery = new HiHealthDataQuery(HiHealthSetType.DATA_SET_WALK_METADATA, startTime,
    endTime, new HiHealthDataQueryOption());
HiHealthDataStore.getCount(context, hiHealthDataQuery, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object data) {
        if (resultCode == HiHealthError.SUCCESS) {
            int count = (int) data;
            Log.i(TAG, "walk track number: " + count);
        }
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| hiHealthDataQuery | HiHealthDataQuery | Query criteria. | M |
| callback | ResultCallback | Result callback. | M |
 
| Parameter Name | Parameter Type | Description |
| --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). |
| data | Object | Data entries (int). |

#### Parameters required for data query and query results

| Data Openness Type | Parameter for Query | Query Method | Constant Definition of the Key Value for Query Method | Constant Definition | Value Type | Result Meaning and Unit |
| --- | --- | --- | --- | --- | --- | --- |
| Single workout record: Includes walking, running, and cycling records, but does not include GPS tracks. | Walking ([DATA_SET_WALK_METADATA](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__DATA_SET_WALK_METADATA)) Running ([DATA_SET_RUN_METADATA](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__DATA_SET_RUN_METADATA)) Cycling ([DATA_SET_RIDE_METADATA](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__DATA_SET_RIDE_METADATA)) | HiHealthSetData.[getMap](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsetdata-0000001071859320-V5#EN-US_TOPIC_0000001136869907__getMap--)().get(Key) | HiHealthKitConstant.[BUNDLE_KEY_DATE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthkitconstant-0000001072627358-V5#EN-US_TOPIC_0000001090250912__BUNDLE_KEY_DATE) | Common constants for walking, running, and cycling activities | Integer | Date (unit: none) |
| HiHealthKitConstant.[BUNDLE_KEY_TOTAL_TIME](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthkitconstant-0000001072627358-V5#EN-US_TOPIC_0000001090250912__BUNDLE_KEY_TOTAL_TIME) | Long | Total time (unit: second) |  |  |  |  |
| HiHealthKitConstant.[BUNDLE_KEY_TOTAL_DISTANCE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthkitconstant-0000001072627358-V5#EN-US_TOPIC_0000001090250912__BUNDLE_KEY_TOTAL_DISTANCE) | Integer | Total distance (unit: meter) |  |  |  |  |
| HiHealthKitConstant.[BUNDLE_KEY_TOTAL_CALORIES](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthkitconstant-0000001072627358-V5#EN-US_TOPIC_0000001090250912__BUNDLE_KEY_TOTAL_CALORIES) | Integer | Total calories (unit: kcal) |  |  |  |  |
| HiHealthKitConstant.[BUNDLE_KEY_AVERAGEPACE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthkitconstant-0000001072627358-V5#EN-US_TOPIC_0000001090250912__BUNDLE_KEY_AVERAGEPACE) | Float | Average pace (unit: s/km) |  |  |  |  |
| HiHealthKitConstant.[BUNDLE_KEY_AVERAGE_SPEED](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthkitconstant-0000001072627358-V5#EN-US_TOPIC_0000001090250912__BUNDLE_KEY_AVERAGE_SPEED) | Double | Average speed (unit: km/s) |  |  |  |  |
| HiHealthKitConstant.[BUNDLE_KEY_AVERAGE_HEART_RATE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthkitconstant-0000001072627358-V5#EN-US_TOPIC_0000001090250912__BUNDLE_KEY_AVERAGE_HEART_RATE) | Integer | Average heart rate (unit: bpm) |  |  |  |  |
| HiHealthKitConstant.[BUNDLE_KEY_TOTAL_ALTITUDE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthkitconstant-0000001072627358-V5#EN-US_TOPIC_0000001090250912__BUNDLE_KEY_TOTAL_ALTITUDE) | Variables specific to walking and running | Float | Total ascent height (unit: dm) |  |  |  |
| HiHealthKitConstant.[BUNDLE_KEY_TOTALDESCENT](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthkitconstant-0000001072627358-V5#EN-US_TOPIC_0000001090250912__BUNDLE_KEY_TOTALDESCENT) | Float | Total descent height (unit: dm) |  |  |  |  |
| HiHealthKitConstant.[BUNDLE_KEY_STEP_DISTANCE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthkitconstant-0000001072627358-V5#EN-US_TOPIC_0000001090250912__BUNDLE_KEY_STEP_DISTANCE) | Double | Average stride length (unit: meter) |  |  |  |  |
| HiHealthKitConstant.[BUNDLE_KEY_AVERAGE_STEP_RATE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthkitconstant-0000001072627358-V5#EN-US_TOPIC_0000001090250912__BUNDLE_KEY_AVERAGE_STEP_RATE) | Integer | Average step cadence (unit: step/min) |  |  |  |  |
| HiHealthKitConstant.[BUNDLE_KEY_STEP](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthkitconstant-0000001072627358-V5#EN-US_TOPIC_0000001090250912__BUNDLE_KEY_STEP) | Integer | Step count (unit: number) |  |  |  |  |
