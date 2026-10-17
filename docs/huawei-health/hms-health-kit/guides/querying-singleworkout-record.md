<!--
  Title: Querying Health Data
  Catalog: HMSCore-Guides-V5
  Document ID: querying-singleworkout-record-0000001053333367-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/querying-singleworkout-record-0000001053333367-V5
-->
**
# Querying Health Data

The following describes how to query the sleep, stress, weight, heart rate, heart rate details, and blood oxygen datasets from the HUAWEI Health app.

- The sleep data comes from a Huawei wearable device worn by the user, including the sleep score and sleep duration.
- The stress data comes from a Huawei wearable device worn by the user, after the user has enabled stress test in the HUAWEI Health app.
- The weight data comes from the data measured by a compatible body fat scale listed in Devices > Add in the HUAWEI Health app, manually input data, and data written by the third-party app.
- The heart rate, heart rate details, and blood oxygen data come from the datasets measured by a Huawei wearable device or a compatible heart rate monitor or oximeter listed in Devices > Add in the HUAWEI Health app.

> **Note:** To access TruSleep data, the user needs to open the HUAWEI Health app, and touch Devices . Then from the device details screen, turn on TruSleep . If the integrated version is 5.0.0.300 or earlier, you can only query weight data of the last 30 days at a time. For example, to obtain the weight data over the past 60 days, the query needs to be performed twice. If 5.1.0.300 or a later version is integrated, [pagination](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/pagination-query-0000001071262988-V5) can be used to obtain more query results.
Figure 1 **Health data

Before querying the data, make sure that you have obtained the related permissions from Huawei. Otherwise, the API calling will fail. If the user has not authorized the related permission, the API calling will also fail.

| Data Openness Type | Query API | Requesting Permissions from User (See [Signing In and Applying for Permissions](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/requesting-user-authorization-0000001071733944-V5)) | Scope URL | Requesting Permissions from Huawei (See [Applying for Health Kit](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/apply-kitservice-0000001071254802-V5)) |
| --- | --- | --- | --- | --- |
| Sleep | [execQuery](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s491f47becc70431e8a89b2f0dc649715) Queries data by start time, end time, and data type. [getCount](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s679e1e2aa392468b92918d2337086104) Queries the number of data items. | [HEALTHKIT_EXTEND_HEARTHEALTHSLEEP_READ](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthextendscope-0000001071609519-V5#EN-US_TOPIC_0000001136869919__se71ce3a1cd0146df9e2516e11102f7e9) Read permission for heart health/sleep management (including sleep, heart rate, and heart rate details) | https://www.huawei.com/healthkit/extend/hearthealthsleep.read Read the heart health/sleep information in the Health app via Health Kit. | Heart health/Sleep management |
| Stress | [HEALTHKIT_EXTEND_EMOTION_READ](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthextendscope-0000001071609519-V5#EN-US_TOPIC_0000001136869919__HEALTHKIT_EXTEND_EMOTION_READ) Read permission for emotion/stress management (including stress data) | https://www.huawei.com/healthkit/extend/emotion.read Read the emotion/stress information in the Health app via Health Kit. | Emotion/Stress management |  |
| Weight | [HEALTHKIT_EXTEND_FATREDUCTION_READ](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthextendscope-0000001071609519-V5#EN-US_TOPIC_0000001136869919__HEALTHKIT_EXTEND_FATREDUCTION_READ) Read permission for diet/Fat reduction management | https://www.huawei.com/healthkit/extend/fatreduction.read Read the diet/fat reduction information in the Health app via Health Kit. | Diet/Fat reduction management |  |
| Heart health | [HEALTHKIT_EXTEND_HEARTHEALTHSLEEP_READ](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthextendscope-0000001071609519-V5#EN-US_TOPIC_0000001136869919__se71ce3a1cd0146df9e2516e11102f7e9) Read permission for heart health/sleep management (including sleep, heart rate, and heart rate details) | https://www.huawei.com/healthkit/extend/hearthealthsleep.read Read the heart health/sleep information in the Health app via Health Kit. | Heart health/Sleep management |  |
| Heart rate details | [HEALTHKIT_EXTEND_HEARTHEALTHSLEEP_READ](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthextendscope-0000001071609519-V5#EN-US_TOPIC_0000001136869919__se71ce3a1cd0146df9e2516e11102f7e9) Read permission for heart health/sleep management (including sleep, heart rate, and heart rate details) | https://www.huawei.com/healthkit/extend/hearthealthsleep.read Read the heart health/sleep information in the Health app via Health Kit. | Heart health/Sleep management |  |
| Blood oxygen | [HEALTHKIT_EXTEND_CHRONICDISEASE_READ](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthextendscope-0000001071609519-V5#EN-US_TOPIC_0000001136869919__HEALTHKIT_EXTEND_CHRONICDISEASE_READ) Read permission for chronic disease management (including blood oxygen, blood glucose, and blood pressure data) | https://www.huawei.com/healthkit/extend/chronicdisease.read Read the chronic disease information in the Health app via Health Kit. | Chronic disease management |  |

#### Calling the execQuery Method to Query the Health Data

- Call the [execQuery](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s491f47becc70431e8a89b2f0dc649715) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to query the health data.
- The query result will be returned via the [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) object defined as an input parameter. **Sample code 1** (for weight data query) 
```cpp
int timeout = 0;
    // Set the start time and end time for the query.
long endTime = System.currentTimeMillis();
long startTime = endTime - 86400000L * 30;
HiHealthDataQuery hiHealthDataQuery = new HiHealthDataQuery(HiHealthSetType.DATA_SET_WEIGHT_EX, startTime,
    endTime, new HiHealthDataQueryOption());
HiHealthDataStore.execQuery(context, hiHealthDataQuery, timeout, new ResultCallback() {
    @Override
    public void onResult(int resultCode, final Object data) {
        if (resultCode == HiHealthError.SUCCESS && data instanceof List) {
            Log.i(TAG, "query not null,enter set data");
            List dataList = (List) data;
            for (Object obj : dataList) {
                HiHealthSetData hiHealthData = (HiHealthSetData) obj;
                    // UTC start time of data generation
                Log.i(TAG, "data start time : " + hiHealthData.getStartTime());
                    // UTC end time of data generation
                Log.i(TAG, "data end time : " + hiHealthData.getEndTime());
                Map map = hiHealthData.getMap();
                Log.i(TAG, "weight : weight " + map.get(HiHealthPointType.DATA_POINT_WEIGHT));
                Log.i(TAG, "weight : bmi " + map.get(HiHealthPointType.DATA_POINT_WEIGHT_BMI));
                Log.i(TAG, "weight : muscle volume " + map.get(HiHealthPointType.DATA_POINT_WEIGHT_MUSCLES));
                Log.i(TAG, "weight : basic metabolism " + map.get(HiHealthPointType.DATA_POINT_WEIGHT_BMR));
                Log.i(TAG, "weight : moisture " + map.get(HiHealthPointType.DATA_POINT_WEIGHT_MOISTURE));
                Log.i(TAG, "weight : visceral fat " + map.get(HiHealthPointType.DATA_POINT_WEIGHT_FATLEVEL));
                Log.i(TAG, "weight : bone mineral content "
                    + map.get(HiHealthPointType.DATA_POINT_WEIGHT_BONE_MINERAL));
                Log.i(TAG, "weight : protein " + map.get(HiHealthPointType.DATA_POINT_WEIGHT_PROTEIN));
                Log.i(TAG, "weight : body score " + map.get(HiHealthPointType.DATA_POINT_WEIGHT_BODYSCORE));
                Log.i(TAG, "weight : physical age " + map.get(HiHealthPointType.DATA_POINT_WEIGHT_BODYAGE));
                Log.i(TAG,
                    "weight : body fat percentage " + map.get(HiHealthPointType.DATA_POINT_WEIGHT_BODYFAT));
                Log.i(TAG, "weight : body fat scale " + map.get(HiHealthPointType.DATA_POINT_WEIGHT_IMPEDANCE));
                Log.i(TAG, "weight : moisture percentage "
                    + map.get(HiHealthPointType.DATA_POINT_WEIGHT_MOISTURERATE));
                Log.i(TAG, "weight : skeletal muscle mass  "
                    + map.get(HiHealthPointType.DATA_POINT_WEIGHT_SKELETAL_MUSCLE_MASS));
            }
        }
    }
});
```
 
```cpp
int timeout = 0;
long endTime = System.currentTimeMillis();
// The time range for the query is the past 30 days.
long startTime = endTime - 1000 * 60 * 60 * 24 * 30L;
// Query the body temperature.
HiHealthDataQuery hiHealthDataQuery = new HiHealthDataQuery(HiHealthPointType.DATA_POINT_BODY_THERMOMETER,
    startTime, endTime, new HiHealthDataQueryOption());
HiHealthDataStore.execQuery(context, hiHealthDataQuery, timeout, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object data) {
        if (resultCode == HiHealthError.SUCCESS && data instanceof List) {
            List dataList = (List) data;
            for (Object obj : dataList) {
                HiHealthPointData pointData = (HiHealthPointData) obj;
                Log.i(TAG, "start time : " + pointData.getStartTime());
                Log.i(TAG, "body thermometer :" + pointData.getDoubleValue());
            }
        }
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| query | HiHealthDataQuery | Query criteria. | M |
| timeout | int | Timeout. | M |
| callback | ResultCallback | Result callback. | M |
 
| Parameter Name | Parameter Type | Description |
| --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). |
| data | Object | Data list. Succeeded (data available): body temperature and heart rate details: List<HiHealthPointData> Succeeded (no data): success information description (String) Other: error description (String) |

#### Calling the getCount Method to Query the Health Data Entries

- Call the [getCount](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s679e1e2aa392468b92918d2337086104) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to query the health data entries.
- The query result will be returned via the [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) object defined as an input parameter.**Sample code** (for weight data query)
```cpp
// Set the start time and end time for the query.
long endTime = System.currentTimeMillis();
long startTime = endTime - 86400000L * 30;
HiHealthDataQuery hiHealthDataQuery = new HiHealthDataQuery(HiHealthSetType.DATA_SET_WEIGHT_EX,
    startTime, endTime, new HiHealthDataQueryOption());
HiHealthDataStore.getCount(context, hiHealthDataQuery, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object data) {
        if (resultCode == HiHealthError.SUCCESS) {
            Log.i(TAG, "number : " + (int)data);
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

| Data Openness Type | Parameter for Query | Query Method | Constant Definition of the Key Value for Query Method | Key Value | Value Type | Result Meaning and Unit |
| --- | --- | --- | --- | --- | --- | --- |
| Sleep Includes the sleep data such as sleep scores and sleep durations. | TruSleep data ([DATA_SET_CORE_SLEEP](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__DATA_SET_CORE_SLEEP): 10007) Dataset type | HiHealthSetData.[getMap](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsetdata-0000001071859320-V5#EN-US_TOPIC_0000001136869907__getMap--)() .get(Key) | HiHealthSetType.[CONTENT_SLEEP_REM](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_REM) | 44101 | Float | REM sleep duration (unit: minute) |
| HiHealthSetType.[CONTENT_SLEEP_DEEP](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_DEEP) | 44102 | Float | Deep sleep duration of the day (unit: minute) |  |  |  |
| HiHealthSetType.[CONTENT_SLEEP_LIGHT](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_LIGHT) | 44103 | Float | Light sleep duration of the day (unit: minute) |  |  |  |
| HiHealthSetType.[CONTENT_SLEEP_WHOLE_DAY_AMOUNT](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_WHOLE_DAY_AMOUNT) | 44209 | Float | Total sleep duration of the day (unit: minute) |  |  |  |
| HiHealthSetType.[CONTENT_SLEEP_DEEP_CONTINUITY](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_DEEP_CONTINUITY) | 44106 | Float | Deep sleep continuity (unit: score) |  |  |  |
| HiHealthSetType.[CONTENT_SLEEP_AWAKE_TIMES](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_AWAKE_TIMES) | 44107 | Float | Number of times the user is awake (unit: times) |  |  |  |
| HiHealthSetType.[CONTENT_SLEEP_BED_TIME](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_BED_TIME) | 44201 | Long | Time when the user falls asleep (timestamp) (unit: none) |  |  |  |
| HiHealthSetType.[CONTENT_SLEEP_RISE_TIME](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_RISE_TIME) | 44202 | Long | Wakeup time (timestamp) (unit: none) |  |  |  |
| HiHealthSetType.[CONTENT_SLEEP_SCORE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_SCORE) | 44203 | Long | Score (unit: score) |  |  |  |
| HiHealthSetType.[CONTENT_SLEEP_NIGHT_SLEEP_AMOUNT](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_NIGHT_SLEEP_AMOUNT) | 44105 | Float | Sleep duration at night (unit: minute) |  |  |  |
| Regular sleep ([STAT_DAY_SLEEP_MIN](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__STAT_DAY_SLEEP_MIN): 44000) | HiHealthSetData.[getMap](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsetdata-0000001071859320-V5#EN-US_TOPIC_0000001136869907__getMap--)().get(Key) | HiHealthPointType.[DATA_POINT_SLEEP_DEEP_DURATION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_SLEEP_DEEP_DURATION) | 44001 | Float | Deep sleep duration (unit: second) |  |
| HiHealthPointType.[DATA_POINT_SLEEP_SHALLOW_DURATION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_SLEEP_SHALLOW_DURATION) | 44002 | Float | Light sleep duration (unit: second) |  |  |  |
| HiHealthPointType.[DATA_POINT_SLEEP_WAKE_DURATION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_SLEEP_WAKE_DURATION) | 44003 | Float | Wakeup duration (unit: second) |  |  |  |
| HiHealthPointType.[DATA_POINT_SLEEP_DURATION_SUM](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_SLEEP_DURATION_SUM) | 44004 | Float | Total sleep duration (unit: second) |  |  |  |
| HiHealthPointType.[DATA_POINT_SLEEP_WAKE_COUNT](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_SLEEP_WAKE_COUNT) | 44005 | Float | Number of times the user is awake (unit: times) |  |  |  |
| HiHealthPointType.[DATA_POINT_SLEEP_START_TIME](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_SLEEP_START_TIME) | 44006 | Long | Time when the user falls asleep (timestamp) (unit: none) |  |  |  |
| HiHealthPointType.[DATA_POINT_SLEEP_END_TIME](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_SLEEP_END_TIME) | 44007 | Long | Wakeup time (timestamp) (unit: none) |  |  |  |
| Stress | Stress ([DATA_POINT_STRESS](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_STRESS): 2034) | HiHealthPointData.[getValue](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointdata-0000001071707429-V5#EN-US_TOPIC_0000001136987081__getValue--)() | HiHealthPointType.[DATA_POINT_STRESS](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_STRESS) | 2034 | int | Stress (unit: stress value) |
| Weight: Includes the BMI, fat rate, muscle mass, and other related data measured by the body fat scale. | Weight ([DATA_SET_WEIGHT_EX](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__DATA_SET_WEIGHT_EX): 10006) Dataset type | HiHealthSetData.[getMap](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsetdata-0000001071859320-V5#EN-US_TOPIC_0000001136869907__getMap--)().get(Key) | HiHealthPointType.[DATA_POINT_WEIGHT](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_WEIGHT) | 2004 | Double | Weight (unit: kg) |
| HiHealthPointType.[DATA_POINT_WEIGHT_BMI](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_WEIGHT_BMI) | 2022 | Double | BMI (unit: kg/m2) |  |  |  |
| HiHealthPointType.[DATA_POINT_WEIGHT_MUSCLES](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_WEIGHT_MUSCLES) | 2023 | Double | Muscle mass (unit: kg) |  |  |  |
| HiHealthPointType.[DATA_POINT_WEIGHT_BMR](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_WEIGHT_BMR) | 2024 | Double | Basic metabolic rate (unit: kcal/day) |  |  |  |
| HiHealthPointType.[DATA_POINT_WEIGHT_MOISTURE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_WEIGHT_MOISTURE) | 2025 | Double | Body water (unit: L/kg) |  |  |  |
| HiHealthPointType.[DATA_POINT_WEIGHT_FATLEVEL](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_WEIGHT_FATLEVEL) | 2026 | Double | Visceral fat (unit: level) |  |  |  |
| HiHealthPointType.[DATA_POINT_WEIGHT_BONE_MINERAL](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_WEIGHT_BONE_MINERAL) | 2027 | Double | Bone salt (unit: kg) |  |  |  |
| HiHealthPointType.[DATA_POINT_WEIGHT_PROTEIN](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_WEIGHT_PROTEIN) | 2028 | Double | Protein (unit: kg) |  |  |  |
| HiHealthPointType.[DATA_POINT_WEIGHT_BODYSCORE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_WEIGHT_BODYSCORE) | 2029 | Double | Body score (unit: score) |  |  |  |
| HiHealthPointType.[DATA_POINT_WEIGHT_BODYAGE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_WEIGHT_BODYAGE) | 2030 | Double | Body age (unit: years) |  |  |  |
| HiHealthPointType.[DATA_POINT_WEIGHT_BODYFAT](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_WEIGHT_BODYFAT) | 2031 | Double | Body fat rate (unit: percentage) (Body fat (%) = 1.2 x BMI + 0.23 x Age – 5.4 – 10.8 x Gender. The value is 1 for male users and 0 for female users.) |  |  |  |
| HiHealthPointType.[DATA_POINT_WEIGHT_IMPEDANCE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_WEIGHT_IMPEDANCE) | 2032 | Double | Impedance of the body fat scale (unit: ohm) |  |  |  |
| HiHealthPointType.[DATA_POINT_WEIGHT_MOISTURE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_WEIGHT_MOISTURE) | 2033 | Double | Water rate (unit: percentage) |  |  |  |
| HiHealthPointType.[DATA_POINT_WEIGHT_SKELETAL_MUSCLE_MASS](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__sf2e906b919464d7db849fb9cc22e12f8) | 2053 | Double | Skeletal muscle mass (unit: kg) |  |  |  |
| Heart rate: Includes the heart rate range and resting heart rate. | Heart rate ([DATA_SET_HEART](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__DATA_SET_HEART): 10008) Dataset type | HiHealthSetData.[getMap](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsetdata-0000001071859320-V5#EN-US_TOPIC_0000001136869907__getMap--)().get(Key) | HiHealthSetType.[CONTENT_HEART_RATE_MAX](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_HEART_RATE_MAX) | 46016 | Float | Maximum heart rate of each day (unit: bpm) |
| HiHealthSetType.[CONTENT_HEART_RATE_MIN](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_HEART_RATE_MIN) | 46017 | Float | Minimum heart rate of each day (unit: bpm) |  |  |  |
| HiHealthSetType.[CONTENT_HEART_RATE_REST](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_HEART_RATE_REST) | 46018 | Float | Average resting heart rate of each day (unit: bpm) |  |  |  |
| Heart rate details | Heart rate details ([DATA_POINT_HEART_RATE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_HEART_RATE): 2002) | HiHealthPointData.[getValue](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointdata-0000001071707429-V5#EN-US_TOPIC_0000001136987081__getValue--)() | HiHealthPointType.[DATA_POINT_HEART_RATE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_HEART_RATE) | 2002 | int | Heart rate (unit: times/minute). The average number of heartbeats per minute is returned. |
| Blood oxygen | Maximum blood oxygen level of the current day ([DATA_POINT_MAX_OXYGEN_SATURATION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_MAX_OXYGEN_SATURATION): 47201) | HiHealthSetData.[getMap](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsetdata-0000001071859320-V5#EN-US_TOPIC_0000001136869907__getMap--)().get(Key) | HiHealthPointType.[DATA_POINT_MAX_OXYGEN_SATURATION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_MAX_OXYGEN_SATURATION) | 47201 | Double | Blood oxygen (unit: percentage) |
| Minimum blood oxygen level of the current day ([DATA_POINT_MIN_OXYGEN_SATURATION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_MIN_OXYGEN_SATURATION): 47202) | HiHealthPointType.[DATA_POINT_MIN_OXYGEN_SATURATION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_MIN_OXYGEN_SATURATION) | 47202 | Double |  |  |  |
| Average blood oxygen level of the current day ([DATA_POINT_AVG_OXYGEN_SATURATION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_AVG_OXYGEN_SATURATION): 47203) | HiHealthPointType.[DATA_POINT_AVG_OXYGEN_SATURATION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_AVG_OXYGEN_SATURATION) | 47203 | Double |  |  |  |
| Last measured blood oxygen level of the current day ([DATA_POINT_LAST_OXYGEN_SATURATION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_LAST_OXYGEN_SATURATION): 47204) | HiHealthPointType.[DATA_POINT_LAST_OXYGEN_SATURATION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_LAST_OXYGEN_SATURATION) | 47204 | Double |  |  |  |
