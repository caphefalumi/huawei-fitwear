<!--
  Title: ActivityRecordsController
  Catalog: HMSCore-References-V5
  Document ID: activityrecordscontroller-0000001050091295-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/activityrecordscontroller-0000001050091295-V5
-->
# ActivityRecordsController

| Class Info |
| --- |
| public class ActivityRecordsController Provides functions to create and manage user activities. |
  The sample code for obtaining the **ActivityRecordsController** instance object is as follows:
```cpp
Java
HiHealthOptions hihealthOptions = HiHealthOptions.builder().build();
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hihealthOptions);
ActivityRecordsController activityRecordsController = HuaweiHiHealth.getActivityRecordsController(this, signInHuaweiId);
```
 
```cpp
Kotlin
val hiHealthOptions = HiHealthOptions.builder().build()
val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions)
activityRecordsController = HuaweiHiHealth.getActivityRecordsController(this, signInHuaweiId)
```

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| Task<Void> | [addActivityRecord](#EN-US_TOPIC_0000001053607035__section1781411218216)(ActivityRecordInsertOptions activityRecordInsertOptions) Inserts a specified activity record and corresponding data to the Health platform. |
| Task<Void> | [beginActivityRecord](#EN-US_TOPIC_0000001053607035__section19439181554415)(ActivityRecord activityRecord) Starts a new activity record for the current app. |
| Task<List<ActivityRecord>> | [endActivityRecord](#EN-US_TOPIC_0000001053607035__section1466201544417)(String activityRecordId) Stops a specified activity record for the current app. |
| Task<ActivityRecordReply> | [getActivityRecord](#EN-US_TOPIC_0000001053607035__section34819155446)(ActivityRecordReadOptions activityRecordReadOptions) Reads data from the Health platform by specifying the activity record and type. |

#### Public Methods

## addActivityRecord(ActivityRecordInsertOptions activityRecordInsertOptions)

| Method |
| --- |
| public Task<Void> addActivityRecord(ActivityRecordInsertOptions activityRecordInsertOptions) Inserts a specified activity record and corresponding data to the Health platform. |

**Parameters**

| Name | Description |
| --- | --- |
| activityRecordInsertOptions | Request for inserting activity records and corresponding data, including activity record details and sampling datasets. |
  The sample code for inserting a specified activity record and corresponding data is as follows:
```cpp
Java
HiHealthOptions hihealthOptions = HiHealthOptions.builder().build(); 
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hihealthOptions); 
ActivityRecordsController activityRecordsController = HuaweiHiHealth.getActivityRecordsController(this, signInHuaweiId); 
 
// 1. Build the time range of the request object: start time and end time.
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

// 3. Create a data collector for the step count data.
DataCollector dataCollector2 = new com.huawei.hms.hihealth.data.DataCollector.Builder()
    .setDataType(DataType.DT_CONTINUOUS_STEPS_TOTAL)
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .setPackageName(context)
    .setDataCollectorName("test1")
    .build();
// 4. Build sampling points for statistical data based on the data collector and add the sampling points to the DataSummary object.
// DataSummary in ActivitySummary is used to carry statistical data.
SamplePoint samplePoint = new SamplePoint.Builder(dataCollector2).build();
samplePoint.setTimeInterval(startTime + 1L, startTime + 300000L, TimeUnit.MILLISECONDS);
samplePoint.getFieldValue(Field.FIELD_STEPS).setIntValue(352);
activitySummary.setDataSummary(Arrays.asList(samplePoint));

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
    .build(); 
 
// 6. Create a data collector for detailed data.
DataCollector dataCollector = new com.huawei.hms.hihealth.data.DataCollector.Builder() 
    .setDataType(DataType.DT_CONTINUOUS_STEPS_DELTA) 
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW) 
    .setPackageName(context) 
    .setDataCollectorName("AddActivityRecord") 
    .build(); 
// 7. Build the sampling dataset based on the detailed data collector.
SampleSet sampleSet = SampleSet.create(dataCollector); 
 
// 8. Build a sampling point object for the detailed incremental step count data (DT_CONTINUOUS_STEPS_DELTA) and add it to the detailed sampling dataset sampleSet.
SamplePoint samplePoint = sampleSet.createSamplePoint().setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS); 
samplePoint.getFieldValue(Field.FIELD_STEPS_DELTA).setIntValue(1024); 
sampleSet.addSample(samplePoint); 
 
// 9. Build an activity record request and set the activityRecord object and the associated detailed sampling dataset sampleSet.
ActivityRecordInsertOptions insertRequest = 
    new ActivityRecordInsertOptions.Builder().setActivityRecord(activityRecord).addSampleSet(sampleSet).build(); 
 
// 10. Call the addActivityRecord method to add an activity record.
Task<Void> addTask = activityRecordsController.addActivityRecord(insertRequest); 
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
 
```cpp
Kotlin
val hiHealthOptions = HiHealthOptions.builder().build()
val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions)
activityRecordsController = HuaweiHiHealth.getActivityRecordsController(this, signInHuaweiId)

// 1. Build the time range of the request object: start time and end time.
val cal = Calendar.getInstance()
val now = Date()
cal.time = now
val endTime = cal.timeInMillis
cal.add(Calendar.HOUR_OF_DAY, -1)
val startTime = cal.timeInMillis

// 2. Build the PaceSummary object.
// PaceSummary in ActivitySummary is used to carry pace statistical data.
val activitySummary = ActivitySummary()
val paceSummary = PaceSummary()
paceSummary.avgPace = 247.27626
paceSummary.bestPace = 212.0
paceSummary.britishPaceMap.put("50001893", 365.0)
paceSummary.partTimeMap.put("1.0",456.0)
paceSummary.paceMap.put("1.0",263.0)
paceSummary.partTimeMap.put("1.0",263.0)
paceSummary.sportHealthPaceMap.put("102802480",535.0)
activitySummary.setPaceSummary(paceSummary)

// 3. Create a data collector for the total step count data.
val dataCollector2: DataCollector = DataCollector.Builder()
    .setDataType(DataType.DT_CONTINUOUS_STEPS_TOTAL)
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .setPackageName(applicationContext)
    .setDataCollectorName("test1")
    .build()
// 4. Build sampling points for statistical data based on the data collector and add the sampling points to the DataSummary object.
// DataSummary in ActivitySummary is used to carry statistical data.
val samplePoint1 = SamplePoint.Builder(dataCollector2).build()
    .setTimeInterval(startTime + 1L, startTime + 300000L, TimeUnit.MILLISECONDS)
samplePoint1.getFieldValue(Field.FIELD_STEPS).setIntValue(352)
activitySummary.dataSummary = Arrays.asList(samplePoint1)

// 5. Build the activity record and set the ActivitySummary object of the statistical data.
val activityRecord = ActivityRecord.Builder().setName("AddActivityRecord")
    .setDesc("This is ActivityRecord add test!")
    .setId("MyAddActivityRecordId")
    .setActivityTypeId(HiHealthActivities.RUNNING)
    .setStartTime(startTime, TimeUnit.MILLISECONDS)
    .setEndTime(endTime, TimeUnit.MILLISECONDS)
    .setActivitySummary(activitySummary)
    .setTimeZone("+0800")
    .build()

// 6. Create a data collector for detailed data.
val dataCollector = DataCollector.Builder().setDataType(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .setPackageName(context)
    .setDataCollectorName("AddActivityRecord")
    .build()

// 7. Build the sampling dataset based on the detailed data collector.
val sampleSet = SampleSet.create(dataCollector)

// 8. Build a sampling point object for the detailed incremental step count data (DT_CONTINUOUS_STEPS_DELTA) and add it to the detailed sampling dataset sampleSet.
val samplePoint =
    sampleSet.createSamplePoint().setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
samplePoint.getFieldValue(Field.FIELD_STEPS_DELTA).setIntValue(1024)
sampleSet.addSample(samplePoint)

// 9. Build an activity record request and set the activityRecord object and the associated detailed sampling dataset sampleSet.
val insertRequest = ActivityRecordInsertOptions.Builder().setActivityRecord(activityRecord)
    .addSampleSet(sampleSet).build()

// 10. Call the addActivityRecord method to add an activity record.
val addTask = activityRecordsController!!.addActivityRecord(insertRequest)
addTask.addOnSuccessListener { Log.i("ActivityRecords","ActivityRecord add was successful!") }
    .addOnFailureListener { e -> Log.i("ActivityRecords", e.toString()) }
```

## beginActivityRecord(ActivityRecord activityRecord)

| Method |
| --- |
| public Task<Void> beginActivityRecord(ActivityRecord activityRecord) Starts a new activity record for the current app. |

**Parameters**

| Name | Description |
| --- | --- |
| activityRecord | Activity record object to be started. |
  The sample code for starting a new activity record is as follows:
```cpp
Java
HiHealthOptions hihealthOptions = HiHealthOptions.builder().build(); 
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hihealthOptions); 
ActivityRecordsController activityRecordsController = HuaweiHiHealth.getActivityRecordsController(this, signInHuaweiId); 
 
// 1. Build the start time of a new activity record.
long startTime = Calendar.getInstance().getTimeInMillis(); 
// 2. Build the ActivityRecord object and set the start time of the activity record.
ActivityRecord activityRecord = new ActivityRecord.Builder() 
    .setId("MyBeginActivityRecordId") 
    .setName("BeginActivityRecord") 
    .setDesc("This is ActivityRecord begin test!") 
    .setActivityTypeId(HiHealthActivities.RUNNING) 
    .setStartTime(startTime, TimeUnit.MILLISECONDS) 
    .build(); 
 
// 3. Call beginActivityRecord.
Task<Void> task1 = activityRecordsController.beginActivityRecord(activityRecord); 
// 4. Add a listener for the ActivityRecord start success.
task1.addOnSuccessListener(new OnSuccessListener<Void>() { 
    @Override 
    public void onSuccess(Void aVoid) { 
        Log.i("ActivityRecords","MyActivityRecord begin success"); 
    } 
// 5. Add a listener for the ActivityRecord start failure.
}).addOnFailureListener(new OnFailureListener() { 
    @Override 
    public void onFailure(Exception e) { 
        String errorCode = e.getMessage(); 
        String errorMsg = HiHealthStatusCodes.getStatusCodeMessage(Integer.parseInt(errorCode)); 
        Log.i("ActivityRecords",errorCode + ": " + errorMsg); 
    } 
});
```
 
```cpp
Kotlin
val hiHealthOptions = HiHealthOptions.builder().build()
val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions)
activityRecordsController = HuaweiHiHealth.getActivityRecordsController(this, signInHuaweiId)

// 1. Build the start time of a new activity record.
val startTime = Calendar.getInstance().timeInMillis
// 2. Build the ActivityRecord object and set the start time of the activity record.
val activityRecord = ActivityRecord.Builder()
    .setId("MyBeginActivityRecordId")
    .setName("BeginActivityRecord")
    .setDesc("This is ActivityRecord begin test!")
    .setActivityTypeId(HiHealthActivities.RUNNING)
    .setStartTime(startTime, TimeUnit.MILLISECONDS)
    .build()

// 3. Call beginActivityRecord.
val beginTask = activityRecordsController!!.beginActivityRecord(activityRecord)

// 4. Add listeners for the ActivityRecord start success and start failure.
beginTask.addOnSuccessListener { logger("MyActivityRecord begin success") }
    .addOnFailureListener { e -> Log.e("beginActivityRecord", e.toString()) }
```

## endActivityRecord(String activityRecordId)

| Method |
| --- |
| public Task<List<ActivityRecord>> endActivityRecord(String activityRecordId) Stops the **ActivityRecord** of a specific ID. |

**Parameters**

| Name | Description |
| --- | --- |
| activityRecordId | Unique identifier of the activity record. If the value is **null**, all active activity records of the app will be stopped. |

**Return****s**

| Type | Description |
| --- | --- |
| Task<List<ActivityRecord>> | A list of stopped activity records. |
  The sample code for stopping a specified activity record is as follows:
```cpp
Java
HiHealthOptions hihealthOptions = HiHealthOptions.builder().build(); 
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hihealthOptions); 
ActivityRecordsController activityRecordsController = HuaweiHiHealth.getActivityRecordsController(this, signInHuaweiId); 
  
// Call the endActivityRecord method to stop the activity record. The input parameter can be the ID string of ActivityRecord or null.
// Stop an activity record of the current app by specifying the ID string as the input parameter.
// Stop activity records of the current app by specifying null as the input parameter.
Task<List<ActivityRecord>> endTask = activityRecordsController.endActivityRecord("MyBeginActivityRecordId"); 
endTask.addOnSuccessListener(new OnSuccessListener<List<ActivityRecord>>() { 
    @Override 
    public void onSuccess(List<ActivityRecord> activityRecords) { 
        Log.i("ActivityRecords","MyActivityRecord End success"); 
	// Return the list of activity records that have stopped.
        if (activityRecords.size() > 0) { 
            for (ActivityRecord activityRecord : activityRecords) { 
                DateFormat dateFormat = DateFormat.getDateInstance();
                DateFormat timeFormat = DateFormat.getTimeInstance();
                Log.i("ActivityRecords", "Returned for ActivityRecord: " + activityRecord.getName() + "\n\tActivityRecord Identifier is "
                    + activityRecord.getId() + "\n\tActivityRecord created by app is " + activityRecord.getPackageName()
                    + "\n\tDescription: " + activityRecord.getDesc() + "\n\tStart: "
                    + dateFormat.format(activityRecord.getStartTime(TimeUnit.MILLISECONDS)) + " "
                    + timeFormat.format(activityRecord.getStartTime(TimeUnit.MILLISECONDS)) + "\n\tEnd: "
                    + dateFormat.format(activityRecord.getEndTime(TimeUnit.MILLISECONDS)) + " "
                    + timeFormat.format(activityRecord.getEndTime(TimeUnit.MILLISECONDS)) + "\n\tActivity:"
                    + activityRecord.getActivityType());
            } 
        } else { 
	    // null will be returned if none of the activity records has stopped.
            Log.i("ActivityRecords","MyActivityRecord End response is null"); 
        } 
    }}).addOnFailureListener(new OnFailureListener() { 
    @Override 
    public void onFailure(Exception e) { 
        String errorCode = e.getMessage(); 
        String errorMsg = HiHealthStatusCodes.getStatusCodeMessage(Integer.parseInt(errorCode)); 
        Log.i("ActivityRecords",errorCode + ": " + errorMsg); 
    } 
});
```
 
```cpp
Kotlin
val hiHealthOptions = HiHealthOptions.builder().build()
val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions)
activityRecordsController = HuaweiHiHealth.getActivityRecordsController(this, signInHuaweiId)

// Call the endActivityRecord method to stop the activity record. The input parameter can be the ID string of ActivityRecord or null.
// Stop an activity record of the current app by specifying the ID string as the input parameter.
// Stop activity records of the current app by specifying null as the input parameter.
val endTask = activityRecordsController!!.endActivityRecord("MyBeginActivityRecordId")
endTask.addOnSuccessListener { activityRecords ->
    Log.i("ActivityRecords", "MyActivityRecord End success")
    // Return the list of activity records that have stopped.
    if (activityRecords.size > 0) {
        for (activityRecord in activityRecords) {
            val dateFormat = DateFormat.getDateInstance()
            val timeFormat = DateFormat.getTimeInstance()
            Log.i(
                "ActivityRecords",
                "Returned for ActivityRecord: " + activityRecord.name + "\n\tActivityRecord Identifier is "
                    + activityRecord.id + "\n\tActivityRecord created by app is " + activityRecord.packageName
                    + "\n\tDescription: " + activityRecord.desc + "\n\tStart: "
                    + dateFormat.format(activityRecord.getStartTime(TimeUnit.MILLISECONDS)) + " "
                    + timeFormat.format(activityRecord.getStartTime(TimeUnit.MILLISECONDS)) + "\n\tEnd: "
                    + dateFormat.format(activityRecord.getEndTime(TimeUnit.MILLISECONDS)) + " "
                    + timeFormat.format(activityRecord.getEndTime(TimeUnit.MILLISECONDS)) + "\n\tActivity:"
                    + activityRecord.activityType
            )
        }
    } else {
        // null will be returned if none of the activity records has stopped.
        Log.i("ActivityRecords", "MyActivityRecord End response is null")
    }
}.addOnFailureListener { e -> Log.i("ActivityRecords", e.toString()) }
```

## getActivityRecord(ActivityRecordReadOptions activityRecordReadOptions)

| Method |
| --- |
| public Task<ActivityRecordReply> getActivityRecord(ActivityRecordReadOptions activityRecordReadOptions) Reads data from the Health platform by specifying the activity record and type. |

**Parameters**

| Name | Description |
| --- | --- |
| activityRecordReadOptions | Created request for the activity record query, with parameters including the time interval and data type specified. |

**Return****s**

| Type | Description |
| --- | --- |
| Task<ActivityRecordReply> | Returned result, including the activity record list and dataset list. |
  The sample code for reading activity records is as follows:
```cpp
Java
HiHealthOptions hihealthOptions = HiHealthOptions.builder().build();
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hihealthOptions);
ActivityRecordsController activityRecordsController =
    HuaweiHiHealth.getActivityRecordsController(this, signInHuaweiId);

// 1. Build the time range of the request object: start time and end time.
Calendar cal = Calendar.getInstance();
Date now = new Date();
cal.setTime(now);
long endTime = cal.getTimeInMillis();
cal.add(Calendar.DAY_OF_YEAR, -1);
long startTime = cal.getTimeInMillis();

// 2. Build the request body for reading activity records and set the query time range.
ActivityRecordReadOptions readRequest =
    new ActivityRecordReadOptions.Builder().setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
        .readActivityRecordsFromAllApps()
        .build();

// 3. Call the getActivityRecord method to obtain the activity records on the Health platform based on the request body.
Task<ActivityRecordReply> getTask = activityRecordsController.getActivityRecord(readRequest);
getTask.addOnSuccessListener(new OnSuccessListener<ActivityRecordReply>() {
    @Override
    public void onSuccess(ActivityRecordReply activityRecordReply) {
        Log.i("ActivityRecords", "Get ActivityRecord was successful!");
        // Print the obtained activity records.
        List<ActivityRecord> activityRecordList = activityRecordReply.getActivityRecords();
        for (ActivityRecord activityRecord : activityRecordList) {
            if (activityRecord == null) {
                continue;
            }
            DateFormat dateFormat = DateFormat.getDateInstance();
            DateFormat timeFormat = DateFormat.getTimeInstance();
            Log.i("ActivityRecordSample",
                "Returned for ActivityRecord: " + activityRecord.getName() + "\n\tActivityRecord Identifier is "
                + activityRecord.getId() + "\n\tActivityRecord created by app is "
                + activityRecord.getPackageName() + "\n\tDescription: " + activityRecord.getDesc()
                + "\n\tStart: " + dateFormat.format(activityRecord.getStartTime(TimeUnit.MILLISECONDS))
                + " " + timeFormat.format(activityRecord.getStartTime(TimeUnit.MILLISECONDS)) + "\n\tEnd: "
                + dateFormat.format(activityRecord.getEndTime(TimeUnit.MILLISECONDS)) + " "
                + timeFormat.format(activityRecord.getEndTime(TimeUnit.MILLISECONDS)) + "\n\tActivity:"
                + activityRecord.getActivityType());
            // Print ActivitySummary in each activity record. printActivitySummary is a customized output function.
            if (activityRecord.getActivitySummary() != null) {
                printActivitySummary(activityRecord.getActivitySummary());
            }
            // Print the detailed data point corresponding to each activity record.
            for (SampleSet sampleSet : activityRecordReply.getSampleSet(activityRecord)) {
                Log.i("ActivityRecordSample",
                    "Returned for SamplePoint and Data type: " + sampleSet.getDataType().getName());
                for (SamplePoint dp : sampleSet.getSamplePoints()) {
                    Log.i("ActivityRecordSample", "SamplePoint:");
                    Log.i("ActivityRecordSample", "DataCollector:" + dp.getDataCollector().toString());
                    Log.i("ActivityRecordSample", "\tType: " + dp.getDataType().getName());
                    Log.i("ActivityRecordSample",
                        "\tStart: " + dateFormat.format(dp.getStartTime(TimeUnit.MILLISECONDS)));
                    Log.i("ActivityRecordSample",
                        "\tEnd: " + dateFormat.format(dp.getEndTime(TimeUnit.MILLISECONDS)));
                    for (Field field : dp.getDataType().getFields()) {
                        Log.i("ActivityRecordSample",
                            "\tField: " + field.toString() + " Value: " + dp.getFieldValue(field));
                    }
                }
            }
        }
    }
}).addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(Exception e) {
        String errorCode = e.getMessage();
        String errorMsg = HiHealthStatusCodes.getStatusCodeMessage(Integer.parseInt(errorCode));
        Log.i("ActivityRecords", errorCode + ": " + errorMsg);
    }
});
// Customize the ActivitySummary output function.
public void printActivitySummary(ActivitySummary activitySummary) {
    List<SamplePoint> dataSummary = activitySummary.getDataSummary();
    Log.i("ActivityRecords", "\nPrint statistical data: ");
    Log.i("ActivityRecords", "\nActivitySummary\n\t DataSummary: ");
    // Print statistical data points.
    for (SamplePoint samplePoint : dataSummary) {
        Log.i(""ActivityRecords"", "\n\t samplePoint: \n\t DataCollector" + samplePoint.getDataCollector() + "\n\t DataType" 
            + samplePoint.getDataType() + "\n\t StartTime" + samplePoint.getStartTime(TimeUnit.MILLISECONDS) + "\n\t EndTime"
            + samplePoint.getEndTime(TimeUnit.MILLISECONDS) + "\n\t SamplingTime" + samplePoint.getSamplingTime(TimeUnit.MILLISECONDS)
            + "\n\t FieldValues" + samplePoint.getFieldValues());
    }
    // Print the pace information.
    PaceSummary paceSummary = activitySummary.getPaceSummary();
    Log.i("ActivityRecords", "\n\t PaceSummary: \n\t AvgPace" + paceSummary.getAvgPace() + "\n\t BestPace" + paceSummary.getBestPace() 
        + "\n\t PaceMap" + paceSummary.getPaceMap() + "\n\t PartTimeMap" + paceSummary.getPartTimeMap() + "\n\t BritishPaceMap"
        + paceSummary.getBritishPaceMap() + "\n\t BritishPartTimeMap" + paceSummary.getBritishPartTimeMap()
        + "\n\t SportHealthPaceMap" + paceSummary.getSportHealthPaceMap());
}
```
 
```cpp
Kotlin
val hiHealthOptions = HiHealthOptions.builder().build()
val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions)
activityRecordsController = HuaweiHiHealth.getActivityRecordsController(this, signInHuaweiId)

// 1. Build the time range of the request object: start time and end time.
val cal = Calendar.getInstance()
val now = Date()
cal.time = now
val endTime = cal.timeInMillis
cal.add(Calendar.DAY_OF_YEAR, -1)
val startTime = cal.timeInMillis

// 2. Build the request body for reading activity records and set the query time range.
val readRequest = ActivityRecordReadOptions.Builder()
    .setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
    .readActivityRecordsFromAllApps()
    .build()

// 3. Call the getActivityRecord method to obtain the activity records on the Health platform based on the request body.
val getTask = activityRecordsController!!.getActivityRecord(readRequest)
getTask.addOnSuccessListener { activityRecordReply ->
    logger("Get ActivityRecord was successful!")
    // Print the obtained activity records.
    val activityRecordList = activityRecordReply.activityRecords
    for (activityRecord in activityRecordList) {
        if (activityRecord == null) {
            continue;
        }
        val dateFormat = DateFormat.getDateInstance()
        val timeFormat = DateFormat.getTimeInstance()
        Log.i("ActivityRecordSample", "Returned for ActivityRecord: " + activityRecord.name + "\n\tActivityRecord Identifier is "
            + activityRecord.id + "\n\tActivityRecord created by app is "
            + activityRecord.packageName + "\n\tDescription: " + activityRecord.desc
            + "\n\tStart: " + dateFormat.format(activityRecord.getStartTime(TimeUnit.MILLISECONDS))
            + " " + timeFormat.format(activityRecord.getStartTime(TimeUnit.MILLISECONDS)) + "\n\tEnd: "
            + dateFormat.format(activityRecord.getEndTime(TimeUnit.MILLISECONDS)) + " "
            + timeFormat.format(activityRecord.getEndTime(TimeUnit.MILLISECONDS)) + "\n\tActivity:"
            + activityRecord.activityType)
            // Print ActivitySummary in each activity record. printActivitySummary is a customized output function.
            if (activityRecord.getActivitySummary() != null) {
                 printActivitySummary(activityRecord.getActivitySummary());
            }
            // Print the detailed data point corresponding to each activity record.
            for (sampleSet in activityRecordReply.getSampleSet(activityRecord)) {
                Log.i("ActivityRecordSample","Returned for SamplePoint and Data type: " + sampleSet.dataType.name)
                for (dp in sampleSet.samplePoints) {
                    Log.i("ActivityRecordSample", "SamplePoint:")
                    Log.i("ActivityRecordSample", "DataCollector:" + dp.dataCollector.toString())
                    Log.i("ActivityRecordSample", "\tType: " + dp.dataType.name)
                    Log.i("ActivityRecordSample","\tStart: " + dateFormat.format(dp.getStartTime(TimeUnit.MILLISECONDS)))
                    Log.i("ActivityRecordSample","\tEnd: " + dateFormat.format(dp.getEndTime(TimeUnit.MILLISECONDS)))
                    for (field in dp.dataType.fields) {
                        Log.i("ActivityRecordSample","\tField: " + field.toString() + " Value: " + dp.getFieldValue(field))
                    }
                }
            }
    }
}}.addOnFailureListener { e -> Log.i("getActivityRecord", e.toString()) }
```
