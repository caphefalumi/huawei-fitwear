<!--
  Title: Writing Basketball Activity Records
  Catalog: HMSCore-Guides-V5
  Document ID: client-basketball-read-scene-0000001098324092-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/client-basketball-read-scene-0000001098324092-V5
-->
# Writing Basketball Activity Records

You can use the collected basketball activity data to insert **ActivityRecord** to the Health platform as instructed:

- Create an **ActivityRecord** by specifying a time period and other necessary information.
- Create an **ActivityRecordInsertOptions** using the **ActivityRecord** and optional dataset or grouped sampling point data.
- Use **ActivityRecordsController.addActivityRecord** to insert basketball activity records into the Health platform.

```cpp
HiHealthOptions hihealthOptions = HiHealthOptions.builder().build();
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hihealthOptions);
final ActivityRecordsController activityRecordsController = HuaweiHiHealth.getActivityRecordsController(getApplicationContext(), signInHuaweiId);

// 1. Build the time range of the request object: start time and end time.
// Note that the start time and end time must be later than the UNIX timestamp corresponding to January 1, 2014.
Calendar cal = Calendar.getInstance();
Date now = new Date();
cal.setTime(now);
long endTime = cal.getTimeInMillis();
cal.add(Calendar.HOUR_OF_DAY, -1);
long startTime = cal.getTimeInMillis();

// 2. Build the PaceSummary object.
// PaceSummary in ActivitySummary is used to carry pace statistical data.
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

// 3.1 Create a data collector for jump statistics.
DataCollector dataCollector1 = new com.huawei.hms.hihealth.data.DataCollector.Builder()
    .setDataType(DataType.DT_CONTINUOUS_JUMP_STATISTICS)
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .setPackageName(getApplicationContext())
    .setDataCollectorName("test1")
    .build();

// 3.2 Build sampling points for jump statistics.
SamplePoint samplePoint1 = new SamplePoint.Builder(dataCollector1).build();
samplePoint1.setTimeInterval(startTime + 1L, startTime + 300000L, TimeUnit.MILLISECONDS);
samplePoint1.getFieldValue(Field.FIELD_JUMP_TIMES).setIntValue(50);
samplePoint1.getFieldValue(Field.FIELD_MIN_JUMP_HEIGHT).setFloatValue(0.68f);
samplePoint1.getFieldValue(Field.FIELD_AVG_JUMP_HEIGHT).setFloatValue(0.78f);
samplePoint1.getFieldValue(Field.FIELD_MAX_JUMP_HEIGHT).setFloatValue(0.88f);
samplePoint1.getFieldValue(Field.FIELD_MIN_PASSAGE_DURATION).setIntValue(352);
samplePoint1.getFieldValue(Field.FIELD_AVG_PASSAGE_DURATION).setIntValue(452);
samplePoint1.getFieldValue(Field.FIELD_MAX_PASSAGE_DURATION).setIntValue(552);

// 3.3 Create a data collector for the step count data.
DataCollector dataCollector2 = new com.huawei.hms.hihealth.data.DataCollector.Builder()
    .setDataType(DataType.DT_CONTINUOUS_STEPS_TOTAL)
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .setPackageName(getApplicationContext())
    .setDataCollectorName("test1")
    .build();

// 3.4 Build sampling points for step count statistics.
SamplePoint samplePoint2 = new SamplePoint.Builder(dataCollector2).build();
samplePoint2.setTimeInterval(startTime + 1L, startTime + 300000L, TimeUnit.MILLISECONDS);
samplePoint2.getFieldValue(Field.FIELD_STEPS).setIntValue(500);

// 4. Build sampling points for statistical data based on the data collector and add the sampling points to the DataSummary object.
List<SamplePoint> samplePointList = new ArrayList<>();
samplePointList.add(samplePoint1);
samplePointList.add(samplePoint2);
activitySummary.setDataSummary(samplePointList);

// 5. Build the activity record and set the ActivitySummary object of the statistical data.
ActivityRecord activityRecord = new ActivityRecord.Builder()
    .setName("AddActivityRecord")
    .setDesc("This is ActivityRecord add test!")
    .setId("MyAddActivityRecordId")
    .setActivityTypeId(HiHealthActivities.RUNNING)
    .setStartTime(startTime, TimeUnit.MILLISECONDS)
    .setEndTime(endTime, TimeUnit.MILLISECONDS)
    .setActivitySummary(activitySummary)
    .setTimeZone("+0800")
    // The metadata is related to the activity record. You can define the metadata as a character string in JSON format.
    .setMetadata("{"metadata":{"burst_score":72,"jump_score":72,"run_score":72,"overall_score":72,"breakthrough_score":72,"sport_intensity_score":72}}")
    .build();

// 6.1 Create a data collector for step count details.
DataCollector dataCollector3 = new com.huawei.hms.hihealth.data.DataCollector.Builder()
    .setDataType(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .setPackageName(getApplicationContext())
    .setDataCollectorName("AddActivityRecord")
    .build();

// 6.2 Build the sampling dataset based on data collector for step count details.
SampleSet sampleSet3 = SampleSet.create(dataCollector3);

// 6.3 Build a sampling point object for the detailed incremental step count data (DT_CONTINUOUS_STEPS_DELTA) and add it to the detailed sampling dataset sampleSet.
SamplePoint samplePoint3 = sampleSet3.createSamplePoint().setTimeInterval(startTime,endTime,TimeUnit.MILLISECONDS);
samplePoint3.getFieldValue(Field.FIELD_STEPS_DELTA).setIntValue(1024);
sampleSet3.addSample(samplePoint3);

// 6.4 Create a data collector for jump details.
DataCollector dataCollector4 = new com.huawei.hms.hihealth.data.DataCollector.Builder()
    .setDataType(DataType.DT_CONTINUOUS_JUMP)
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .setPackageName(getApplicationContext())
    .setDataCollectorName("AddActivityRecord")
    .build();
// 6.5 Build the sampling dataset based on data collector for jump details.
SampleSet sampleSet4 = SampleSet.create(dataCollector4);

// 6.6 Build a sampling point object for the detailed jump data (DT_CONTINUOUS_STEPS_DELTA) and add it to the detailed sampling dataset.
SamplePoint samplePoint4 = sampleSet4.createSamplePoint().setTimeInterval(startTime,endTime,TimeUnit.MILLISECONDS);
samplePoint4.getFieldValue(Field.FIELD_JUMP_HEIGHT).setFloatValue(0.88f);
samplePoint4.getFieldValue(Field.FIELD_JUMP_HEIGHT).setIntValue(1024);
sampleSet4.addSample(samplePoint4);

// 7. Build an activity record request and set the activityRecord object and the associated detailed sampling dataset sampleSet.
ActivityRecordInsertOptions insertOption = new ActivityRecordInsertOptions.Builder()
    .setActivityRecord(activityRecord).addSampleSet(sampleSet3).addSampleSet(sampleSet4).build();

// 8. Call addActivityRecord to add an activity record.
Task<Void> addTask = activityRecordsController.addActivityRecord(insertOption);
addTask.addOnSuccessListener(new OnSuccessListener<Void>() {
    @Override
    public void onSuccess(Void aVoid) {
        Log.i("ActivityRecords","ActivityRecord add was successful!");
    }
}).addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(Exception e) {
        String errorCode = e.getMessage();
        String errorMsg = HiHealthStatusCodes.getStatusCodeMessage(Integer.parseInt(errorCode));
        Log.i("ActivityRecords",errorCode + ": " + errorMsg);
    }
});
```
