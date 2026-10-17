<!--
  Title: Scenario-based Example for Sleep Data
  Catalog: HMSCore-Guides-V5
  Document ID: client-sleep-scene-0000001055102955-V5
  Updated: 2021-04-30 06:41:58
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/client-sleep-scene-0000001055102955-V5
-->
# Scenario-based Example for Sleep Data

This section provides an example of reading sleep data using the Health Kit client API.

You can call **addActivityRecord** to insert activity records of the sleep data type.

Data in the ActivityRecord can be divided into two parts:

- **DT_CONTINUOUS_SLEEP** (detailed sleep data) is carried by sampleSet in ActivityRecordReply.
- **DT_STATISTICS_SLEEP** (statistical sleep data) is carried by dataSummary in ActivitySummary.

```cpp
Log.i(TAG, "Creating a new session for a sleep");
Calendar cal = Calendar.getInstance();
Date now = new Date();
cal.setTime(now);
long endTime = cal.getTimeInMillis();
cal.add(Calendar.HOUR_OF_DAY, -1);
long startTime = cal.getTimeInMillis();

        // Create a data collector for sleep details.
        // SampleSet in ActivityRecord is used to bear the detailed data.
DataCollector dataCollector = new com.huawei.hms.hihealth.data.DataCollector.Builder()
    .setDataType(DataType.DT_CONTINUOUS_SLEEP)
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .setPackageName(mContext)
    .setDataCollectorName("test1")
    .build();
SampleSet dataSet = SampleSet.create(dataCollector);
SamplePoint samplePoint1 = dataSet.createSamplePoint().setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS);
samplePoint1.getFieldValue(Field.SLEEP_STATE).setIntValue(SleepFragmentCategory.SLEEP_DEEP.getValue());
dataSet.addSample(samplePoint1);

ActivitySummary activitySummary = new ActivitySummary();
PaceSummary paceSummary = new PaceSummary();
paceSummary.setAvgPace(247.27626);
paceSummary.setBestPace(212.0);
paceSummary.setBritishPaceMap((Map<String, Double>) new HashMap<>().put(50001893, 365));
paceSummary.setPartTimeMap((Map<String, Double>) new HashMap<>().put(1.0, 456));
paceSummary.setPaceMap((Map<String, Double>) new HashMap<>().put(1.0, 263));
paceSummary.setPartTimeMap((Map<String, Double>) new HashMap<>().put(1.0, 263));
paceSummary.setSportHealthPaceMap((Map<String, Double>) new HashMap<>().put(102802480, 535));
activitySummary.setPaceSummary(paceSummary);

        // Create a data collector for sleep statistics.
        // ActivitySummary is used to bear the statistical data.
DataCollector dataCollector2 = new com.huawei.hms.hihealth.data.DataCollector.Builder()
    .setDataType(DataType.DT_STATISTICS_SLEEP)
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .setPackageName(mContext)
    .setDataCollectorName("test1")
    .build();
SamplePoint samplePoint = new SamplePoint.Builder(dataCollector2).build();
samplePoint.setTimeInterval(startTime + 1L, startTime + 300000L, TimeUnit.MILLISECONDS);
samplePoint.getFieldValue(Field.ALL_SLEEP_TIME).setIntValue(352);
samplePoint.getFieldValue(Field.GO_BED_TIME).setLongValue(1599580041000L);
samplePoint.getFieldValue(Field.SLEEP_EFFICIENCY).setIntValue(4);
samplePoint.getFieldValue(Field.DREAM_TIME).setIntValue(58);
samplePoint.getFieldValue(Field.WAKE_UP_TIME).setLongValue(1599608520000L);
samplePoint.getFieldValue(Field.DEEP_SLEEP_TIME).setIntValue(82);
samplePoint.getFieldValue(Field.DEEP_SLEEP_PART).setIntValue(64);
samplePoint.getFieldValue(Field.AWAKE_TIME).setIntValue(3);
samplePoint.getFieldValue(Field.SLEEP_SCORE).setIntValue(73);
samplePoint.getFieldValue(Field.LIGHT_SLEEP_TIME).setIntValue(212);
samplePoint.getFieldValue(Field.SLEEP_LATENCY).setIntValue(7487000);
samplePoint.getFieldValue(Field.WAKE_UP_CNT).setIntValue(2);
samplePoint.getFieldValue(Field.FALL_ASLEEP_TIME).setLongValue(1599587220000L);
activitySummary.setDataSummary(Arrays.asList(samplePoint));

        // Generate an ActivityRecord object.
ActivityRecord activityRecord = new ActivityRecord.Builder().setName("myActivityRecord")
    .setDesc("this is my activity record")
    .setActivityTypeId("myActivityRecord001")
    .setActivitySummary(activitySummary)
    .setStartTime(startTime, TimeUnit.MILLISECONDS)
    .setEndTime(endTime, TimeUnit.MILLISECONDS)
    .setDurationTime(endTime - startTime, TimeUnit.MILLISECONDS)
    .setTimeZone("+0800")
    .build();

        // Generate an ActivityRecordInsertOptions object.
ActivityRecordInsertOptions insertRequest =
    new ActivityRecordInsertOptions.Builder().setActivityRecord(activityRecord).addSampleSet(dataSet).build();
HiHealthOptions hiHealthOptions = HiHealthOptions.builder().build();

AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult( hiHealthOptions);
HiHealthOptions hiHealthOptions = HiHealthOptions.builder().build();
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult( hiHealthOptions);
if (mActivityRecordController == null) {
    mActivityRecordController = HuaweiHiHealth.getActivityRecordsController(this, signInHuaweiId);
}
mActivityRecordController.addActivityRecord(insertRequest);
```
