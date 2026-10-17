<!--
  Title: DataController
  Catalog: HMSCore-References-V5
  Document ID: datacontroller-0000001050089472-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacontroller-0000001050089472-V5
-->
# DataController

| Class Info |
| --- |
| public class DataController Determines the API for data management. The user can use this API to insert, delete, update, and read data, as well as query the data statistics of the current day and past days. You can obtain the **DataController** via the **HuaweiHiHealth** class. |
  The sample code for obtaining the **DataController** instance object is as follows:
```cpp
Java
// Obtain and set the read & write permissions for DT_CONTINUOUS_STEPS_DELTA and DT_INSTANTANEOUS_HEIGHT.
// Use the permissions to obtain the dataController object.
HiHealthOptions hiHealthOptions = HiHealthOptions.builder()
    .addDataType(DataType.DT_CONTINUOUS_STEPS_DELTA, HiHealthOptions.ACCESS_READ)
    .addDataType(DataType.DT_CONTINUOUS_STEPS_DELTA, HiHealthOptions.ACCESS_WRITE)
    .addDataType(DataType.DT_INSTANTANEOUS_HEIGHT, HiHealthOptions.ACCESS_READ)
    .addDataType(DataType.DT_INSTANTANEOUS_HEIGHT, HiHealthOptions.ACCESS_WRITE)
    .build();
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions);
DataController dataController = HuaweiHiHealth.getDataController(context, signInHuaweiId);
```
 
```cpp
Kotlin
// Obtain and set the read & write permissions for DT_CONTINUOUS_STEPS_DELTA and DT_INSTANTANEOUS_HEIGHT.
// Use the permissions to obtain the dataController object.
val hiHealthOptions = HiHealthOptions.builder()
    .addDataType(DataType.DT_CONTINUOUS_STEPS_DELTA, HiHealthOptions.ACCESS_READ)
    .addDataType(DataType.DT_CONTINUOUS_STEPS_DELTA, HiHealthOptions.ACCESS_WRITE)
    .addDataType(DataType.DT_INSTANTANEOUS_HEIGHT, HiHealthOptions.ACCESS_READ)
    .addDataType(DataType.DT_INSTANTANEOUS_HEIGHT, HiHealthOptions.ACCESS_WRITE)
    .build()
val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions)
dataController = context!!.let { HuaweiHiHealth.getDataController(it, signInHuaweiId) }
```

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| Task<Void> | [clearAll](#EN-US_TOPIC_0000001053208304__section172200211248)() Clears all data inserted by the app from the device and cloud. |
| Task<Void> | [delete](#EN-US_TOPIC_0000001053208304__section8421540145419)(DeleteOptions options) Deletes inserted sampling datasets by specifying a time range or deletes them all. It can also be used to delete activity records. |
| Task<Void> | [insert](#EN-US_TOPIC_0000001053208304__section10704529103014)(SampleSet sampleSet) Inserts the sampling dataset into the Health platform. |
| Task<ReadReply> | [read](#EN-US_TOPIC_0000001053208304__section0447440145418)(ReadOptions readOptions) Reads user data. You can read data by time, device, data collector, and more by specifying the related parameters in **ReadOptions**. |
| Task<SampleSet> | [readDailySummation](#EN-US_TOPIC_0000001053208304__section295981925017)(DataType dataType, int startTime, int endTime) Reads the daily statistics of a specified data type. You can set the data type, start time, and end time to read the daily statistics in the specified period. If the related data type does not support aggregation statistics, an exception will be thrown. |
| Task<SampleSet> | [readTodaySummation](#EN-US_TOPIC_0000001053208304__section9463154045415)(DataType dataType) Reads the summary data of a specified data type of the current day. If the related data type does not support aggregation statistics, an exception will be thrown. |
| Task<Void> | [update](#EN-US_TOPIC_0000001053208304__section356393833817)(UpdateOptions options) Updates existing data. If the update target does not exist, a new entry of data will be inserted. |
| Task<Map<DataType, SamplePoint>> | [readLatestData](#EN-US_TOPIC_0000001053208304__section783193232513)(List<DataType> dataTypes) Reads the latest data points of the specified data type. If the data type is not supported, an exception will be thrown. |

#### Public Methods

## clearAll()

| Method |
| --- |
| public Task<Void> clearAll() Clears all data inserted by the app from the device and cloud. |
  The sample code is as follows:
```cpp
Java
// 1. Call clearAll to delete all the data inserted by the app from the device and cloud.
Task<Void> clearTask = dataController.clearAll(); 
 
// 2. Calling clearAll to clear user data from the device and cloud is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the clearance is successful or not.
clearTask.addOnSuccessListener(new OnSuccessListener<Void>() { 
    @Override 
    public void onSuccess(Void result) { 
        logger("clearAll success"); 
    } 
}).addOnFailureListener(new OnFailureListener() { 
    @Override 
    public void onFailure(Exception e) { 
        String errorCode = e.getMessage(); 
        Pattern pattern = Pattern.compile("[0-9]*"); 
        Matcher isNum = pattern.matcher(errorCode); 
        if (isNum.matches()) { 
            String errorMsg = HiHealthStatusCodes.getStatusCodeMessage(Integer.parseInt(errorCode)); 
            logger("clearAll failure " + errorCode + ":" + errorMsg); 
        } else { 
            logger("clearAll failure " + errorCode); 
        } 
    } 
});
```
 
```cpp
Kotlin
// 1. Call clearAll to delete all the data inserted by the app from the device and cloud.
val clearTask = dataController!!.clearAll()

// 2. Calling clearAll to clear user data from the device and cloud is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the clearance is successful or not.
clearTask!!.addOnSuccessListener {
    logger("clearAll success")
    logger(SPLIT)
}.addOnFailureListener { e -> logger(e.toString()) }
```

> **Note:** If you directly copy and use the preceding sample code, the following three errors will be reported. The related solutions are provided as follows: **dataController** is not defined. Solution: **dataController** is an instance object of the **DataController** class. You can obtain the **DataController** via the** HuaweiHiHealth** class. 
```cpp
Java
HiHealthOptions hiHealthOptions = HiHealthOptions.builder()
    .addDataType(DataType.DT_CONTINUOUS_STEPS_DELTA, HiHealthOptions.ACCESS_READ)
    .addDataType(DataType.DT_CONTINUOUS_STEPS_DELTA, HiHealthOptions.ACCESS_WRITE)
    .addDataType(DataType.DT_INSTANTANEOUS_HEIGHT, HiHealthOptions.ACCESS_READ)
    .addDataType(DataType.DT_INSTANTANEOUS_HEIGHT, HiHealthOptions.ACCESS_WRITE)
    .build();
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions);
DataController dataController = HuaweiHiHealth.getDataController(context, signInHuaweiId);
```
 
```cpp
Kotlin
val hiHealthOptions = HiHealthOptions.builder()
    .addDataType(DataType.DT_CONTINUOUS_STEPS_DELTA, HiHealthOptions.ACCESS_READ)
    .addDataType(DataType.DT_CONTINUOUS_STEPS_DELTA, HiHealthOptions.ACCESS_WRITE)
    .addDataType(DataType.DT_INSTANTANEOUS_HEIGHT, HiHealthOptions.ACCESS_READ)
    .addDataType(DataType.DT_INSTANTANEOUS_HEIGHT, HiHealthOptions.ACCESS_WRITE)
    .build()
val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions)
dataController = context!!.let { HuaweiHiHealth.getDataController(it, signInHuaweiId) }
```
 The helper function **showSampleSet** is not defined. Solution: Define an empty **showSampleSet** function and do not perform any operation. Refer to the following sample code: 
```cpp
Java
/** 
  * Print the SamplePoint in the SampleSet object as an output.
  * 
  * @param sampleSet Sampling dataset.
  */ 
private void showSampleSet(SampleSet sampleSet) { 
    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 

    for (SamplePoint samplePoint : sampleSet.getSamplePoints()) { 
        logger("Sample point type: " + samplePoint.getDataType().getName()); 
        logger("Start: " + dateFormat.format(new Date(samplePoint.getStartTime(TimeUnit.MILLISECONDS)))); 
        logger("End: " + dateFormat.format(new Date(samplePoint.getEndTime(TimeUnit.MILLISECONDS)))); 
        for (Field field : samplePoint.getDataType().getFields()) { 
            logger("Field: " + field.getName() + " Value: " + samplePoint.getFieldValue(field)); 
        } 
    } 
}
```
 
```cpp
Kotlin
/**
 * Print the SamplePoint in the SampleSet object as an output.
 *
  * @param sampleSet Sampling dataset.
 */
private fun showSampleSet(sampleSet: SampleSet) {
    val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.SIMPLIFIED_CHINESE)

    for (samplePoint in sampleSet.samplePoints) {
        logger("Sample point type: " + samplePoint.dataType.name)
        logger("Start: " + dateFormat.format(Date(samplePoint.getStartTime(TimeUnit.MILLISECONDS))))
        logger("End: " + dateFormat.format(Date(samplePoint.getEndTime(TimeUnit.MILLISECONDS))))
        for (field in samplePoint.dataType.fields) {
            logger("Field: " + field.name + " Value: " + samplePoint.getFieldValue(field))
        }
    }
}
```
 The helper function **logger** is not defined. Solution: Define an empty **logger** function and do not perform any operation. Refer to the following sample code: 
```cpp
Java
private static final String TAG = "DataController";

/** 
  * Also send operation result logs to the logcat.
 * 
  * @param string Log string.
 */ 
private void logger(String string) { 
    Log.i(TAG, string); 
}
```
 
```cpp
Kotlin
private val TAG = "DataController"

/**
 * Also send operation result logs to the logcat.
 *
 * @param string Log string.
 */
private fun logger(string: String) {
    Log.i(TAG, string)
}
```

## delete(DeleteOptions options)

| Method |
| --- |
| public Task<Void> delete(DeleteOptions options) Deletes inserted sampling datasets by specifying a time range or deletes them all. It can also be used to delete workout records. |

**Parameters**

| Name | Description |
| --- | --- |
| options | **DeleteOptions** type, used to specify the data collector, data type, and time range of data to be deleted. |
  The sample code for deleting inserted sampling datasets is as follows:
```cpp
Java
// Build the condition for data deletion: a DataCollector object.
DataCollector dataCollector = new DataCollector.Builder().setPackageName(context) 
    .setDataType(DataType.DT_CONTINUOUS_STEPS_DELTA) 
    .setDataStreamName("STEPS_DELTA") 
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW) 
    .build(); 
 
// Build the time range for the deletion: start time and end time.
SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss"); 
Date startDate = null;
Date endDate = null;
try {
    // Enter the start time and end time. The standard UNIX timestamp is used for storage, without considering the time zone differences. Data points within the specified timestamp range will be deleted.
    startDate = dateFormat.parse("2020-03-17 09:00:00");
    endDate = dateFormat.parse("2020-03-17 09:05:00");
} catch (ParseException exception) {
    logger("Time parsing error");
}
 
// Build a parameter object as the conditions for the deletion.
DeleteOptions deleteOptions = new DeleteOptions.Builder().addDataCollector(dataCollector) 
    .setTimeInterval(startDate.getTime(), endDate.getTime(), TimeUnit.MILLISECONDS) 
    .build(); 
 
// Use the specified deletion object to call the delete API to delete the sampling dataset.
Task<Void> deleteTask = dataController.delete(deleteOptions); 
 
// Calling the delete API to delete the sampling dataset is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the data deletion is successful or not.
deleteTask.addOnSuccessListener(new OnSuccessListener<Void>() { 
    @Override 
    public void onSuccess(Void result) { 
        logger("Success delete sample data from HMS core"); 
    } 
}).addOnFailureListener(new OnFailureListener() { 
    @Override 
    public void onFailure(Exception e) { 
        String errorCode = e.getMessage(); 
        String errorMsg = HiHealthStatusCodes.getStatusCodeMessage(Integer.parseInt(errorCode)); 
        logger(errorCode + ": " + errorMsg); 
    } 
});
```
 
```cpp
Kotlin
// Build the condition for data deletion: a DataCollector object.
val dataCollector = DataCollector.Builder().setPackageName(context)
    .setDataType(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .setDataStreamName("STEPS_DELTA")
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .build()

// Build the time range for the deletion: start time and end time.
val dateFormat = SimpleDateFormat("yyyy-MM-dd hh:mm:ss", Locale.SIMPLIFIED_CHINESE)
var startDate: Date? = null
var endDate: Date? = null
try {
    startDate = dateFormat.parse("2020-08-27 09:00:00")
    endDate = dateFormat.parse("2020-08-27 09:05:00")
} catch (e: ParseException) {
    logger("Time parsing error")
}

// Build a parameter object as the conditions for the deletion.
val deleteOptions = DeleteOptions.Builder().addDataCollector(dataCollector)
    .setTimeInterval(startDate.time, endDate.time, TimeUnit.MILLISECONDS)
    .build()

// Use the specified deletion object to call the delete API to delete the sampling dataset.
val deleteTask = dataController!!.delete(deleteOptions)

// Calling the delete API to delete the sampling dataset is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the data deletion is successful or not.
deleteTask!!.addOnSuccessListener {
    logger("Success delete sample data from HMS core")
}!!.addOnFailureListener { e -> logger(e.toString()) }
```

> **Note:** If you directly copy and use the preceding sample code, the following two errors will be reported. The related solutions are provided as follows: **dataController** is not defined. Solution: See [dataController is not defined](#EN-US_TOPIC_0000001053208304__li87671323217). The helper function **logger** is not defined. Solution: See [The helper function logger is not defined](#EN-US_TOPIC_0000001053208304__li17397557337).

## insert(SampleSet sampleSet)

| Method |
| --- |
| public Task<Void> insert(SampleSet sampleSet) Inserts the sampling dataset into the Health platform. |

**Parameters**

| Name | Description |
| --- | --- |
| sampleSet | Sampling dataset to be inserted to the Health platform. |
  The sample code for inserting a sampling dataset is as follows:
```cpp
Java
// 1. Build a DataCollector object.
DataCollector dataCollector = new DataCollector.Builder().setPackageName(context) 
    .setDataType(DataType.DT_CONTINUOUS_STEPS_DELTA) 
    .setDataStreamName("STEPS_DELTA") 
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW) 
    .build(); 
 
// 2. Create a sampling dataset based on the data collector.
final SampleSet sampleSet = SampleSet.create(dataCollector); 
 
// 3. Build the start time and end time for a DT_CONTINUOUS_STEPS_DELTA sampling point.
SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss"); 
Date startDate = null;
Date endDate = null;
try {
    // Enter the start time and end time. The standard UNIX timestamp is used for storage, without considering the time zone differences.
    // Note that the end time of the inserted fitness and health sampling point data must be later than the UNIX timestamp corresponding to January 1, 2014.
    startDate = dateFormat.parse("2020-03-17 09:00:00");
    endDate = dateFormat.parse("2020-03-17 09:05:00");
} catch (ParseException exception) {
    logger("Time parsing error");
}
int stepsDelta = 1000; 
 
// 4. Build a DT_CONTINUOUS_STEPS_DELTA sampling point.
SamplePoint samplePoint = sampleSet.createSamplePoint() 
    .setTimeInterval(startDate.getTime(), endDate.getTime(), TimeUnit.MILLISECONDS); 
samplePoint.getFieldValue(Field.FIELD_STEPS_DELTA).setIntValue(stepsDelta); 
 
// 5. Add a DT_CONTINUOUS_STEPS_DELTA sampling point to the sampling dataset. Repeat steps 3 through 5 to add more sampling points to the sampling dataset, if needed.
sampleSet.addSample(samplePoint); 
 
// 6. Call the insert API to insert the sampling dataset into the Health platform.
Task<Void> insertTask = dataController.insert(sampleSet); 
 
// 7. Calling the insert API to insert the sampling dataset is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the data insertion is successful or not.
insertTask.addOnSuccessListener(new OnSuccessListener<Void>() { 
    @Override 
    public void onSuccess(Void result) { 
        logger("Success insert a SampleSet into HMS core"); 
        showSampleSet(sampleSet); 
    } 
}).addOnFailureListener(new OnFailureListener() { 
    @Override 
    public void onFailure(Exception e) { 
        String errorCode = e.getMessage(); 
        String errorMsg = HiHealthStatusCodes.getStatusCodeMessage(Integer.parseInt(errorCode)); 
        logger(errorCode + ": " + errorMsg); 
    } 
});
```
 
```cpp
Kotlin
// 1. Build a DataCollector object.
val dataCollector = DataCollector.Builder().setPackageName(context)
    .setDataType(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .setDataStreamName("STEPS_DELTA")
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .build()

// 2. Create a sampling dataset based on the data collector.
val sampleSet = SampleSet.create(dataCollector)

// 3. Build the start time and end time for a DT_CONTINUOUS_STEPS_DELTA sampling point.
val dateFormat = SimpleDateFormat("yyyy-MM-dd hh:mm:ss", Locale.SIMPLIFIED_CHINESE)
var startDate: Date? = null
var endDate: Date? = null
try {
    startDate = dateFormat.parse("2020-08-27 09:00:00")
    endDate = dateFormat.parse("2020-08-27 09:05:00")
} catch (e: ParseException) {
    logger("Time parsing error")
}
val stepsDelta = 1000

// 4. Build a DT_CONTINUOUS_STEPS_DELTA sampling point.
val samplePoint = sampleSet.createSamplePoint()
    .setTimeInterval(startDate!!.time, endDate!!.time, TimeUnit.MILLISECONDS)
samplePoint.getFieldValue(Field.FIELD_STEPS_DELTA).setIntValue(stepsDelta)

// 5. Add a DT_CONTINUOUS_STEPS_DELTA sampling point to the sampling dataset. Repeat steps 3 through 5 to add more sampling points to the sampling dataset, if needed.
sampleSet.addSample(samplePoint)

// 6. Call the insert API to insert the sampling dataset into the Health platform.
val insertTask = dataController!!.insert(sampleSet)

// 7. Calling the insert API to insert the sampling dataset is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the data insertion is successful or not.
insertTask!!.addOnSuccessListener {
    logger("Success insert an SampleSet into HMS core")
    showSampleSet(sampleSet)
}!!.addOnFailureListener { e -> logger(e.toString()) }
```

> **Note:** If you directly copy and use the preceding sample code, the following three errors will be reported. The related solutions are provided as follows: **dataController** is not defined. Solution: See [dataController is not defined](#EN-US_TOPIC_0000001053208304__li87671323217). The helper function **showSampleSet** is not defined. Solution: See [The helper function showSampleSet is not defined](#EN-US_TOPIC_0000001053208304__li3141239121616). The helper function **logger** is not defined. Solution: See [The helper function logger is not defined](#EN-US_TOPIC_0000001053208304__li17397557337).

## read(ReadOptions readOptions)

| Method |
| --- |
| public Task<ReadReply> read(ReadOptions readOptions) Reads user data. You can read data by time, device, data collector, and more by specifying the related parameters in **ReadOptions**. |

**Parameters**

| Name | Description |
| --- | --- |
| readOptions | **ReadOptions** class, for specifying parameters in the data reading request. It is used to specify the data collector, data type, the time range for the requested data, and more. For details, see the definition of [ReadOptions](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/ro_class-0000001050091216-V5). |

**Return****s**

| Type | Description |
| --- | --- |
| Task<ReadReply> | Read data. The start time or end time of the returned data points is within the specified time range. |
  The sample code for reading user data is as follows:
```cpp
Java
// 1. Build the condition for data query: a DataCollector object.
DataCollector dataCollector = new DataCollector.Builder().setPackageName(context) 
    .setDataType(DataType.DT_CONTINUOUS_STEPS_DELTA) 
    .setDataStreamName("STEPS_DELTA") 
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW) 
    .build(); 
 
// 2. Build the time range for the query: start time and end time.
SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss"); 
Date startDate = null;
Date endDate = null;
try {
    // Enter the start time and end time. The standard UNIX timestamp is used for storage, without considering the time zone differences. Data points within the specified timestamp range will be queried.
    startDate = dateFormat.parse("2020-03-17 09:00:00");
    endDate = dateFormat.parse("2020-03-17 09:05:00");
} catch (ParseException exception) {
    logger("Time parsing error");
}
 
// 3. Build the condition-based query object.
ReadOptions readOptions = new ReadOptions.Builder().read(dataCollector) 
    .setTimeRange(startDate.getTime(), endDate.getTime(), TimeUnit.MILLISECONDS) 
    .build(); 
 
// 4. Use the specified condition query object to call the read API to query the sampling dataset.
Task<ReadReply> readReplyTask = dataController.read(readOptions); 
 
// 5. Calling the read API to query the sampling dataset is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the data query is successful or not.
readReplyTask.addOnSuccessListener(new OnSuccessListener<ReadReply>() { 
    @Override 
    public void onSuccess(ReadReply readReply) { 
        logger("Success read a SampleSets from HMS core"); 
        for (SampleSet sampleSet : readReply.getSampleSets()) { 
            showSampleSet(sampleSet); 
        } 
    } 
}).addOnFailureListener(new OnFailureListener() { 
    @Override 
    public void onFailure(Exception e) { 
        String errorCode = e.getMessage(); 
        String errorMsg = HiHealthStatusCodes.getStatusCodeMessage(Integer.parseInt(errorCode)); 
        logger(errorCode + ": " + errorMsg); 
    } 
});
```
 
```cpp
Kotlin
// 1. Build the condition for data query: a DataCollector object.
val dataCollector = DataCollector.Builder().setPackageName(context)
    .setDataType(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .setDataStreamName("STEPS_DELTA")
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .build()

// 2. Build the time range for the query: start time and end time.
val dateFormat = SimpleDateFormat("yyyy-MM-dd hh:mm:ss", Locale.SIMPLIFIED_CHINESE)
var startDate: Date? = null
var endDate: Date? = null
try {
    // Enter the start time and end time. The standard UNIX timestamp is used for storage, without considering the time zone differences. Data points within the specified timestamp range will be queried.
    startDate = dateFormat.parse("2020-08-27 09:00:00")
    endDate = dateFormat.parse("2020-08-27 09:05:00")
} catch (e: ParseException) {
    logger("Time parsing error")
}

// 3. Build the condition-based query object.
val readOptions = ReadOptions.Builder().read(dataCollector)
    .setTimeRange(startDate!!.time, endDate!!.time, TimeUnit.MILLISECONDS)
    .build()

// 4. Use the specified condition query object to call the read API to query the sampling dataset.
val readReplyTask = dataController!!.read(readOptions)

// 5. Calling the read API to query the sampling dataset is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the data query is successful or not.
readReplyTask!!.addOnSuccessListener { readReply ->
    logger("Success read an SampleSets from HMS core")
    for (sampleSet in readReply.sampleSets) {
        showSampleSet(sampleSet)
    }
}!!.addOnFailureListener { e -> logger(e.toString()) }
```

> **Note:** If you directly copy and use the preceding sample code, the following three errors will be reported. The related solutions are provided as follows: **dataController** is not defined. Solution: See [dataController is not defined](#EN-US_TOPIC_0000001053208304__li87671323217). The helper function **showSampleSet** is not defined. Solution: See [The helper function showSampleSet is not defined](#EN-US_TOPIC_0000001053208304__li3141239121616). The helper function **logger** is not defined. Solution: See [The helper function logger is not defined](#EN-US_TOPIC_0000001053208304__li17397557337).

## readDailySummation(DataType dataType, int startTime, int endTime)

| Method |
| --- |
| public Task<SampleSet> readDailySummation(DataType dataType, int startTime, int endTime) Reads the daily statistics of a specified data type. You can set the data type, start time, and end time to read the daily statistics in the specified period. If the related data type does not support aggregation statistics, an exception will be thrown. |

**Parameters**

| Name | Description |
| --- | --- |
| dataType | Data type to be read. Currently, only the following data types can be read: Calories: **DataType.DT_CONTINUOUS_CALORIES_BURNT** Distance: **DataType.DT_CONTINUOUS_DISTANCE_DELTA** Heart rate: **DataType.DT_INSTANTANEOUS_HEART_RATE** Incremental step count: **DataType.DT_CONTINUOUS_STEPS_DELTA** Weight: **DataType.DT_INSTANTANEOUS_BODY_WEIGHT** Sleep: **DataType.DT_CONTINUOUS_SLEEP** Stress: **DataType.DT_INSTANTANEOUS_STRESS** Medium- and high-intensity: **DataType.DT_CONTINUOUS_EXERCISE_INTENSITY_V2** Resting heart rate: **DataType.DT_INSTANTANEOUS_RESTING_HEART_RATE** Body temperature: **HealthDataTypes.DT_INSTANTANEOUS_BODY_TEMPERATURE** Jump: **DataType.DT_CONTINUOUS_JUMP** Heart rate during workout: **DataType.DT_INSTANTANEOUS_EXERCISE_HEART_RATE** |
| startTime | Start time. An 8-digit integer in the format of YYYYMMDD, for example, 20200803. |
| endTime | End time. An 8-digit integer in the format of YYYYMMDD, for example, 20200903. |

**Return****s**

| Type | Description |
| --- | --- |
| Task<SampleSet> | Statistical value of the data type. All data points with the start time or end time being in the specified time range will be queried. The sum value of the queried data points will be returned. Different from the [readTodaySummation](#EN-US_TOPIC_0000001053208304__section9463154045415) API, the **readDailySummation** API can be used to query the data of multiple days, with a statistical value provided for each day. |
  The sample code for reading the daily statistics of a specified data type is as follows:
```cpp
Java
// 1. Initialize the start time and end time, in the format of YYYYMMDD.
int startTime = 20200818;
int endTime = 20200827;

// 2. Use the specified data type (DT_CONTINUOUS_STEPS_DELTA), start time, and end time to call readDailySummation.
// Query the statistical data of multiple days of the data type.
Task<SampleSet> daliySummationTask =
    dataController.readDailySummation(DataType.DT_CONTINUOUS_STEPS_DELTA, startTime, endTime);

daliySummationTask.addOnSuccessListener(new OnSuccessListener<SampleSet>() {
    @Override
    public void onSuccess(SampleSet sampleSet) {
        logger("Success read daily summation from HMS core");
        if (sampleSet != null) {
            showSampleSet(sampleSet);
        }
    }
});
daliySummationTask.addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(Exception e) {
        logger("readTodaySummation" + e.toString());
    }
});
```
 
```cpp
Kotlin
// 1. Initialize the start time and end time, in the format of YYYYMMDD.
val endTime = 20200827
val startTime = 20200818

// 2. Use the specified data type (DT_CONTINUOUS_STEPS_DELTA), start time, and end time to call readDailySummation.
// Query the statistical data of multiple days of the data type.
val daliySummationTask =
    dataController!!.readDailySummation(DataType.DT_CONTINUOUS_STEPS_DELTA, startTime, endTime)

daliySummationTask.addOnSuccessListener { sampleSet ->
    logger("Success read daily summation from HMS core")
    if (sampleSet != null) {
        showSampleSet(sampleSet)
    }
}
daliySummationTask.addOnFailureListener { e -> logger(e.toString()) }
```

> **Note:** If you directly copy and use the preceding sample code, the following three errors will be reported. The related solutions are provided as follows: **dataController** is not defined. Solution: See [dataController is not defined](#EN-US_TOPIC_0000001053208304__li87671323217). The helper function **showSampleSet** is not defined. Solution: See [The helper function showSampleSet is not defined](#EN-US_TOPIC_0000001053208304__li3141239121616). The helper function **logger** is not defined. Solution: See [The helper function logger is not defined](#EN-US_TOPIC_0000001053208304__li17397557337).

## readTodaySummation(DataType dataType)

| Method |
| --- |
| public Task<SampleSet> readTodaySummation(DataType dataType) Reads the summary data of a specified data type of the current day. If the related data type does not support aggregation statistics, an exception will be thrown. |

**Parameters**

| Name | Description |
| --- | --- |
| dataType | Currently, only the following data types can be read: Calories: **DataType.DT_CONTINUOUS_CALORIES_BURNT** Distance: **DataType.DT_CONTINUOUS_DISTANCE_DELTA** Heart rate: **DataType.DT_INSTANTANEOUS_HEART_RATE** Incremental step count: **DataType.DT_CONTINUOUS_STEPS_DELTA** Weight: **DataType.DT_INSTANTANEOUS_BODY_WEIGHT** Sleep: **DataType.DT_CONTINUOUS_SLEEP** Stress: **DataType.DT_INSTANTANEOUS_STRESS** Medium- and high-intensity: **DataType.DT_CONTINUOUS_EXERCISE_INTENSITY_V2** Resting heart rate: **DataType.DT_INSTANTANEOUS_RESTING_HEART_RATE** Body temperature: **HealthDataTypes.DT_INSTANTANEOUS_BODY_TEMPERATURE** Jump: **DataType.DT_CONTINUOUS_JUMP** Heart rate during workout: **DataType.DT_INSTANTANEOUS_EXERCISE_HEART_RATE** |

**Return****s**

| Type | Description |
| --- | --- |
| Task<SampleSet> | Statistical value of the data type. Calculation will be performed on the all queried data points with the start time or end time being in the specified time range, and the statistical results will be returned. Only the preceding data types are supported. |
  The sample code for reading the summary data of a specified data type of the current day is as follows:
```cpp
Java
 // 1. Use the specified data type (Incremental step count: DT_CONTINUOUS_STEPS_DELTA) and call readTodaySummation to query the statistics of the data type on the current day.
Task<SampleSet> todaySummationTask = dataController.readTodaySummation(DataType.DT_CONTINUOUS_STEPS_DELTA); 
 
// 2. Call readTodaySummation to query the statistics of the current day in asynchronous mode. A listener needs to be configured to return the data query result (success or failure).
// Note: This API is used to query the statistics of a certain data type on the current day. The query time range starts from 00:00:00 of the day and ends at the system timestamp when the API is called.
// Calling this API will query all data points with the start time or end time being in the specified time range. The sum value of the queried data points will be returned.
todaySummationTask.addOnSuccessListener(new OnSuccessListener<SampleSet>() { 
    @Override 
    public void onSuccess(SampleSet sampleSet) { 
        logger("Success read today summation from HMS core"); 
        if (sampleSet != null) { 
            showSampleSet(sampleSet); 
        } 
    } 
}); 
todaySummationTask.addOnFailureListener(new OnFailureListener() { 
    @Override 
    public void onFailure(Exception e) { 
        String errorCode = e.getMessage(); 
        String errorMsg = HiHealthStatusCodes.getStatusCodeMessage(Integer.parseInt(errorCode)); 
        logger(errorCode + ": " + errorMsg); 
    } 
});
```
 
```cpp
Kotlin
// 1. Use the specified data type (DT_CONTINUOUS_STEPS_DELTA) to call the data controller to query the statistical data of this data type of the current day.
val todaySummationTask =
    dataController!!.readTodaySummation(DataType.DT_CONTINUOUS_STEPS_DELTA)

// 2. Call readTodaySummation to query the statistics of the current day in asynchronous mode. A listener needs to be configured to return the data query result (success or failure).
// Note: This API is used to query the statistics of a certain data type on the current day. The query time range starts from 00:00:00 of the day and ends at the system timestamp when the API is called.
// Calling this API will query all data points with the start time or end time being in the specified time range. The sum value of the queried data points will be returned.
todaySummationTask!!.addOnSuccessListener { sampleSet ->
    logger("Success read today summation from HMS core")
    if (sampleSet != null) {
        showSampleSet(sampleSet)
    }
}
todaySummationTask.addOnFailureListener { e ->
    logger(e.toString())
}
```

> **Note:** If you directly copy and use the preceding sample code, the following three errors will be reported. The related solutions are provided as follows: **dataController** is not defined. Solution: See [dataController is not defined](#EN-US_TOPIC_0000001053208304__li87671323217). The helper function **showSampleSet** is not defined. Solution: See [The helper function showSampleSet is not defined](#EN-US_TOPIC_0000001053208304__li3141239121616). The helper function **logger** is not defined. Solution: See [The helper function logger is not defined](#EN-US_TOPIC_0000001053208304__li17397557337).

## update(UpdateOptions options)

| Method |
| --- |
| public Task<Void> update(UpdateOptions options) Updates existing data. If the update target does not exist, a new entry of data will be inserted. |

**Parameters**

| Name | Description |
| --- | --- |
| options | **UpdateOptions** type, used to specify the time range of the data to be updated and the updated values. |
  The sample code for updating data is as follows:
```cpp
Java
// 1. Build the condition for data update: a DataCollector object.
DataCollector dataCollector = new DataCollector.Builder().setPackageName(context) 
    .setDataType(DataType.DT_CONTINUOUS_STEPS_DELTA) 
    .setDataStreamName("STEPS_DELTA") 
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW) 
    .build(); 
 
 // 2. Build the sampling dataset for the update: create a sampling dataset for the update based on the data collector.
SampleSet sampleSet = SampleSet.create(dataCollector); 
 
// 3. Build the start time and end time for a DT_CONTINUOUS_STEPS_DELTA sampling point for the update.
SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss"); 
Date startDate = null;
Date endDate = null;
try {
    // Enter the start time and end time. The standard UNIX timestamp is used for storage, without considering the time zone differences. Data points within the specified timestamp range will be updated.
    startDate = dateFormat.parse("2020-03-17 09:00:00");
    endDate = dateFormat.parse("2020-03-17 09:05:00");
} catch (ParseException exception) {
    logger("Time parsing error");
}
int stepsDelta = 2000; 
 
// 4. Build a DT_CONTINUOUS_STEPS_DELTA sampling point for the update.
SamplePoint samplePoint = sampleSet.createSamplePoint() 
    .setTimeInterval(startDate.getTime(), endDate.getTime(), TimeUnit.MILLISECONDS); 
samplePoint.getFieldValue(Field.FIELD_STEPS_DELTA).setIntValue(stepsDelta); 
 
// 5. Add a DT_CONTINUOUS_STEPS_DELTA sampling point to the update sampling dataset. Repeat steps 3 through 5 to add more update sampling points to the update sampling dataset, if needed.
sampleSet.addSample(samplePoint); 
 
 // 6. Build a parameter object for the update.
// (1) The start time for the update object updateOption must not be later than the earliest time of any sampling point of the sampling dataset to be updated.
// (2) The end time for the update object updateOption must not be earlier than the latest time of any sampling point of the sampling dataset to be updated.
UpdateOptions updateOption = 
    new UpdateOptions.Builder().setTimeInterval(startDate.getTime(), endDate.getTime(), TimeUnit.MILLISECONDS) 
        .setSampleSet(sampleSet) 
        .build(); 
 
// 7. Use the specified parameter object for the update to call the update API to modify the sampling dataset.
Task<Void> updateTask = dataController.update(updateOption); 
 
// 8. Calling the update API to modify the sampling dataset is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the data update is successful or not.
updateTask.addOnSuccessListener(new OnSuccessListener<Void>() { 
    @Override 
    public void onSuccess(Void result) { 
        logger("Success update sample data from HMS core"); 
    } 
}).addOnFailureListener(new OnFailureListener() { 
    @Override 
    public void onFailure(Exception e) { 
        String errorCode = e.getMessage(); 
        String errorMsg = HiHealthStatusCodes.getStatusCodeMessage(Integer.parseInt(errorCode)); 
        logger(errorCode + ": " + errorMsg); 
    } 
});
```
 
```cpp
Kotlin
// 1. Build the condition for data update: a DataCollector object.
val dataCollector = DataCollector.Builder().setPackageName(context)
    .setDataType(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .setDataStreamName("STEPS_DELTA")
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .build()

// 2. Build the sampling dataset for the update: create a sampling dataset for the update based on the data collector.
val sampleSet = SampleSet.create(dataCollector)

// 3. Build the start time and end time for a DT_CONTINUOUS_STEPS_DELTA sampling point for the update.
val dateFormat = SimpleDateFormat("yyyy-MM-dd hh:mm:ss", Locale.SIMPLIFIED_CHINESE)
var startDate: Date? = null
var endDate: Date? = null
try {
    // Enter the start time and end time. The standard UNIX timestamp is used for storage, without considering the time zone differences. Data points within the specified timestamp range will be updated.
    startDate = dateFormat.parse("2020-08-27 09:00:00")
    endDate = dateFormat.parse("2020-08-27 09:05:00")
} catch (e: ParseException) {
    logger("Time parsing error")
}
val stepsDelta = 2000

// 4. Build a DT_CONTINUOUS_STEPS_DELTA sampling point for the update.
val samplePoint = sampleSet.createSamplePoint()
    .setTimeInterval(startDate!!.time, endDate!!.time, TimeUnit.MILLISECONDS)
samplePoint.getFieldValue(Field.FIELD_STEPS_DELTA).setIntValue(stepsDelta)

// 5. Add a DT_CONTINUOUS_STEPS_DELTA sampling point to the update sampling dataset. Repeat steps 3 through 5 to add more update sampling points to the update sampling dataset, if needed.
sampleSet.addSample(samplePoint)

// 6. Build a parameter object for the update.
// (1) The start time for the update object updateOption must not be later than the earliest time of any sampling point of the sampling dataset to be updated.
// (2) The end time for the update object updateOption must not be earlier than the latest time of any sampling point of the sampling dataset to be updated.
val updateOptions = UpdateOptions.Builder()
    .setTimeInterval(startDate.time, endDate.time, TimeUnit.MILLISECONDS)
    .setSampleSet(sampleSet)
    .build()

// 7. Use the specified parameter object for the update to call the update API to modify the sampling dataset.
val updateTask = dataController!!.update(updateOptions)

// 8. Calling the update API to modify the sampling dataset is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the data update is successful or not.
updateTask!!.addOnSuccessListener {
    logger("Success update sample data from HMS core")
}!!.addOnFailureListener { e -> logger(e.toString()) }
```

> **Note:** If you directly copy and use the preceding sample code, the following three errors will be reported. The related solutions are provided as follows: **dataController** is not defined. Solution: See [dataController is not defined](#EN-US_TOPIC_0000001053208304__li87671323217). The helper function **showSampleSet** is not defined. Solution: See [The helper function showSampleSet is not defined](#EN-US_TOPIC_0000001053208304__li3141239121616). The helper function **logger** is not defined. Solution: See [The helper function logger is not defined](#EN-US_TOPIC_0000001053208304__li17397557337).

## readLatestData(List<DataType> dataTypes)

| Method |
| --- |
| public Task<Map<DataType, SamplePoint>> readLatestData(List<DataType> dataTypes) Reads the latest data points of the specified data type. |

**Parameters**

| Name | Description |
| --- | --- |
| dataTypes | Data types to be read. Currently, only the following data types can be read: Height: **DataType.DT_INSTANTANEOUS_HEIGHT** Weight: **DataType.DT_INSTANTANEOUS_BODY_WEIGHT** Heart rate: **DataType.DT_INSTANTANEOUS_HEART_RATE** Resting heart rate: **DataType.DT_INSTANTANEOUS_RESTING_HEART_RATE** Stress: **DataType.DT_INSTANTANEOUS_STRESS** Blood pressure: **HealthDataTypes.DT_INSTANTANEOUS_BLOOD_PRESSURE** Blood glucose: **HealthDataTypes.DT_INSTANTANEOUS_BLOOD_GLUCOSE** Blood oxygen: **HealthDataTypes.DT_INSTANTANEOUS_SPO2** |

**Return****s**

| Type | Description |
| --- | --- |
| Task<Map<DataType, SamplePoint>> | The latest data points of the specified data type. The latest data points are returned in the Map form. If they are not available for the corresponding data type, the key value of the data type won't be contained in the Map. |
  The sample code for reading the latest data points of a specified data type is as follows:
```cpp
Java
// 1. Use the specified data type (DT_INSTANTANEOUS_HEIGHT) to query the latest data points.
List<DataType> dataTypes = new ArrayList<>();
dataTypes.add(DataType.DT_INSTANTANEOUS_HEIGHT);
Task<Map<DataType, SamplePoint>> readLatestDatas = dataController.readLatestData(dataTypes);

// 2. Calling the API to query the latest data points is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the query is successful or not.
readLatestDatas.addOnSuccessListener(new OnSuccessListener<Map<DataType, SamplePoint>>() {
    @Override
    public void onSuccess(Map<DataType, SamplePoint> samplePointMap) {
        logger("Success read latest data from HMS core");
        if (samplePointMap != null) {
            for (DataType dataType : dataTypes) {
                if (samplePointMap.containsKey(dataType)) {
                    showSamplePoint(samplePointMap.get(dataType));
                } else {
                    logger("The DataType " + dataType.getName() + " has no latest data");
                }
            }
        }
    }
});
readLatestDatas.addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(Exception e) {
        String errorCode = e.getMessage();
        String errorMsg = HiHealthStatusCodes.getStatusCodeMessage(Integer.parseInt(errorCode));
        logger(errorCode + ": " + errorMsg);
    }
});
```
 
```cpp
Kotlin
// 1. Use the specified data type (DT_INSTANTANEOUS_HEIGHT) to query the latest data points.
val dataTypes = ArrayList<DataType>()
dataTypes.add(DataType.DT_INSTANTANEOUS_HEIGHT)
val readLatestDatas = dataController!!.readLatestData(dataTypes)

// 2. Calling the API to query the latest data points is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the query is successful or not.
readLatestDatas.addOnSuccessListener(OnSuccessListener<Map<DataType, SamplePoint>> { samplePointMap ->
    logger("Success read latest data from HMS core")
    if (samplePointMap != null) {
        for (dataType in dataTypes) {
            if (samplePointMap.containsKey(dataType)) {
                showSamplePoint(samplePointMap[dataType]!!)
            } else {
                logger("The DataType " + dataType.name + " has no latest data")
            }
        }
    }
})
readLatestDatas.addOnFailureListener(OnFailureListener { e ->
    val errorCode = e.message
    val errorMsg = HiHealthStatusCodes.getStatusCodeMessage(Integer.parseInt(errorCode!!))
    logger("$errorCode: $errorMsg")
})
```

> **Note:** If you directly copy and use the preceding sample code, the following three errors will be reported. The related solutions are provided as follows: **dataController** is not defined. Solution: See [dataController is not defined](#EN-US_TOPIC_0000001053208304__li87671323217). The helper function **logger** is not defined. Solution: See [The helper function logger is not defined](#EN-US_TOPIC_0000001053208304__li17397557337). The helper function **showSamplePoint** is not defined. Solution: Define an empty **showSampleSet** function. Refer to the following sample code: 
```cpp
Java
/**
 * Print the SamplePoint as an output.
 *
 * @param samplePoint Data point
 */
private void showSamplePoint(SamplePoint samplePoint) {
    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    logger("Sample point type: " + samplePoint.getDataType().getName());
    logger("Start: " + dateFormat.format(new Date(samplePoint.getStartTime(TimeUnit.MILLISECONDS))));
    logger("End: " + dateFormat.format(new Date(samplePoint.getEndTime(TimeUnit.MILLISECONDS))));
    for (Field field : samplePoint.getDataType().getFields()) {
        logger("Field: " + field.getName() + " Value: " + samplePoint.getFieldValue(field));
    }
    logger(System.lineSeparator());
}
```
 
```cpp
Kotlin
/**
 * Print the SamplePoint as an output.
 *
 * @param samplePoint Data point
 */
private fun showSamplePoint(samplePoint: SamplePoint) {
    val dateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.SIMPLIFIED_CHINESE)

    logger("Sample point type: " + samplePoint.dataType.name)
    logger("Start: " + dateFormat.format(Date(samplePoint.getStartTime(TimeUnit.MILLISECONDS))))
    logger("End: " + dateFormat.format(Date(samplePoint.getEndTime(TimeUnit.MILLISECONDS))))
    for (field in samplePoint.dataType.fields) {
        logger("Field: " + field.name + " Value: " + samplePoint.getFieldValue(field))
    }
    logger(System.lineSeparator())
}
```
