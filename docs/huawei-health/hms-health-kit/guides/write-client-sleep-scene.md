<!--
  Title: Writing Sleep Data
  Catalog: HMSCore-Guides-V5
  Document ID: write-client-sleep-scene-0000001138273053-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/write-client-sleep-scene-0000001138273053-V5
-->
# Writing Sleep Data

You can call the **addActivityRecord** method to insert activity records of the sleep data type.

Data in the **ActivityRecord** can be divided into two parts:

- **DataType.DT_CONTINUOUS_SLEEP** (detailed sleep data) is carried by **sampleSet** in **ActivityRecordReply**.
- **DataType.DT_STATISTICS_SLEEP** (statistical sleep data) is carried by **dataSummary** in **ActivitySummary**.

```cpp
Log.i(TAG, "Creating a new session for a sleep");
// Build the time range of the request object: start time and end time.
// Note that the start time and end time must be later than the UNIX timestamp corresponding to January 1, 2014.
Calendar cal = Calendar.getInstance();
Date now = new Date();
cal.setTime(now);
long endTime = cal.getTimeInMillis();
cal.add(Calendar.HOUR_OF_DAY, -1);
long startTime = cal.getTimeInMillis();

// Create a data collector for sleep details.
DataCollector dataCollector = new com.huawei.hms.hihealth.data.DataCollector.Builder()
    .setDataType(DataType.DT_CONTINUOUS_SLEEP)
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .setPackageName(getApplicationContext()) 
    .setDataCollectorName("test1")
    .build();
// Build the sampling dataset based on data collector for detailed data.
SampleSet dataSet = SampleSet.create(dataCollector);

// Build the sampling point object for sleep details (DT_CONTINUOUS_SLEEP) and add it to the detailed sampling dataset.
SamplePoint samplePoint1 = dataSet.createSamplePoint().setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS);
samplePoint1.getFieldValue(Field.SLEEP_STATE).setIntValue(SleepFragmentCategory.SLEEP_DEEP.getValue());
dataSet.addSample(samplePoint1);

// Create a data collector for sleep statistics.
// ActivitySummary is used to carry the statistical data.
DataCollector dataCollector2 = new com.huawei.hms.hihealth.data.DataCollector.Builder()
    .setDataType(DataType.DT_STATISTICS_SLEEP)
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .setPackageName(getApplicationContext())
    .setDataCollectorName("test1")
    .build();
// Build sampling points for statistical data based on the data collector and add the sampling points to the DataSummary object.
SamplePoint samplePoint = new SamplePoint.Builder(dataCollector2).build();
samplePoint.setTimeInterval(startTime + 1L, startTime + 300000L, TimeUnit.MILLISECONDS);
samplePoint.getFieldValue(Field.ALL_SLEEP_TIME).setIntValue(352);
samplePoint.getFieldValue(Field.GO_BED_TIME_NEW).setLongValue(1599580041000L);
samplePoint.getFieldValue(Field.DREAM_TIME).setIntValue(58);
samplePoint.getFieldValue(Field.WAKE_UP_TIME).setLongValue(1599608520000L);
samplePoint.getFieldValue(Field.DEEP_SLEEP_TIME).setIntValue(82);
samplePoint.getFieldValue(Field.DEEP_SLEEP_PART).setIntValue(64);
samplePoint.getFieldValue(Field.AWAKE_TIME).setIntValue(3);
samplePoint.getFieldValue(Field.LIGHT_SLEEP_TIME).setIntValue(212);
samplePoint.getFieldValue(Field.WAKE_UP_CNT).setIntValue(2);
samplePoint.getFieldValue(Field.FALL_ASLEEP_TIME).setLongValue(1599587220000L);
activitySummary.setDataSummary(Arrays.asList(samplePoint));

// Create a sleep activity record and set the ActivitySummary object.
ActivityRecord activityRecord = new ActivityRecord.Builder().setName("myActivityRecord")
    .setDesc("this is my activity record")
    .setActivityTypeId(HiHealthActivities.SLEEP)
    .setActivitySummary(activitySummary)
    .setStartTime(startTime, TimeUnit.MILLISECONDS)
    .setEndTime(endTime, TimeUnit.MILLISECONDS)
    .setDurationTime(endTime - startTime, TimeUnit.MILLISECONDS)
    .setTimeZone("+0800")
    .setMetadata("this is a sleep statistics test")
    .build();

// Build an activity record request and set the activityRecord object and the associated detailed sampling dataset.
ActivityRecordInsertOptions insertRequest =
    new ActivityRecordInsertOptions.Builder().setActivityRecord(activityRecord).addSampleSet(dataSet).build();

HiHealthOptions hiHealthOptions = HiHealthOptions.builder().build();
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions);
if (mActivityRecordController == null) {
    mActivityRecordController = HuaweiHiHealth.getActivityRecordsController(this, signInHuaweiId);
}

// Call the addActivityRecord method to write the sleep activity record.
mActivityRecordController.addActivityRecord(insertRequest)
    .addOnSuccessListener(new OnSuccessListener<Void>() {
        @Override
        public void onSuccess(Void aVoid) {
            Log.i("addActivityRecordTest", "add activityRecord success");
        }
    })
    .addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
            Log.i("addActivityRecordTest", "Add Activity Record onFailure: " + e.toString());
        }
    });
```
