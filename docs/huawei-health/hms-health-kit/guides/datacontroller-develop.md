<!--
  Title: DataController
  Catalog: HMSCore-Guides-V5
  Document ID: datacontroller-develop-0000001050071677-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/datacontroller-develop-0000001050071677-V5
-->
# DataController

After integrating Health Kit, the app is able to call methods in **DataController** to perform operations on the fitness and health data. The methods include:

- **insert**: inserts data.
- **delete**: deletes data.
- **update**: updates data.
- **read**: reads data.
- **readTodaySummation**: queries the statistical data of the current day.
- **readDailySummation**: queries the statistical data of multiple days.
- **clearAll**: clears data of the app from the device and cloud.

Before calling the preceding APIs, you need to initialize a **DataController **object such as **dataController **and call the API of the **dataController **object to handle user data. The sample code for initializing a **DataController** object is as follows:

```cpp
HiHealthOptions hiHealthOptions = HiHealthOptions.builder()
    .addDataType(DataType.DT_CONTINUOUS_STEPS_DELTA, HiHealthOptions.ACCESS_READ)
    .addDataType(DataType.DT_CONTINUOUS_STEPS_DELTA, HiHealthOptions.ACCESS_WRITE)
    .addDataType(DataType.DT_INSTANTANEOUS_HEIGHT, HiHealthOptions.ACCESS_READ)
    .addDataType(DataType.DT_INSTANTANEOUS_HEIGHT, HiHealthOptions.ACCESS_WRITE)
    .build();
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions);
DataController dataController = HuaweiHiHealth.getDataController(getApplicationContext(), signInHuaweiId);
```

> **Note:** 1. When calling the APIs in the Health Kit SDK, make sure that the screen of the phone is on. Otherwise, the API may fail to be called. For details, see the [result code](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthstatuscodes-0000001050089560-V5#EN-US_TOPIC_0000001053487071__section10673269124) **INTERNAL_ERROR**. 2. In this development guide, data types **DataType.DT_CONTINUOUS_STEPS_DELTA** (number of steps taken since the last reading) and **DataType.DT_INSTANTANEOUS_HEIGHT** (height) are used as examples. Only the read & write permissions of these two data types are obtained for the initialized **DataController** object. In the following descriptions, the context variable is the **android.content.Context** object, which is an abstract implementation class provided by the Android system. In the specific code, the corresponding object needs to be obtained based on the specific scenario. 3. If the **Activity** object (called in scenarios where app UIs are included) is passed when **HuaweiHiHealth.getDataController()** is used to obtain the **DataController** object, force updating HMS Core is supported. If the **Context** object (called in scenarios where app UIs are not included) is passed, force updating HMS Core is not supported.

#### Inserting the User's Fitness and Health Data

> **Note:** Note that the start time and end time of the sampling point data of the inserted fitness and health data must be later than the UNIX timestamp corresponding to January 1, 2014.

- Build a **DataCollector **object.
```cpp
DataCollector dataCollector = new DataCollector.Builder().setPackageName(getApplicationContext())
    .setDataType(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .setDataStreamName("STEPS_DELTA")
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .build();
```

- Create a sampling dataset based on the data collector.
```cpp
final SampleSet sampleSet = SampleSet.create(dataCollector);
```

- Build the start time, end time, and incremental step count for a **DT_CONTINUOUS_STEPS_DELTA** sampling point.
```cpp
SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
Date startDate = null;
Date endDate = null;
try {
    // Enter the start time and end time. The standard UNIX timestamp is used for storage, without considering the time zone differences.
     // Note that the start time and end time of the sampling point data of the inserted fitness and health data must be later than the UNIX timestamp corresponding to January 1, 2014.
    startDate = dateFormat.parse("2020-03-17 09:00:00");
    endDate = dateFormat.parse("2020-03-17 09:05:00");
} catch (ParseException e) {
    logger("Time parsing error");
}
int stepsDelta = 1000;
```

- Build a **DT_CONTINUOUS_STEPS_DELTA** sampling point.
```cpp
SamplePoint samplePoint = sampleSet.createSamplePoint()
    .setTimeInterval(startDate.getTime(), endDate.getTime(), TimeUnit.MILLISECONDS);
samplePoint.getFieldValue(Field.FIELD_STEPS_DELTA).setIntValue(stepsDelta);
```

- Save a **DT_CONTINUOUS_STEPS_DELTA** sampling point to the sampling dataset. You can repeat steps [3](#EN-US_TOPIC_0000001051066446__li112027449483) through [5](#EN-US_TOPIC_0000001051066446__li188539215495) to add more sampling points to the sampling dataset.
```cpp
sampleSet.addSample(samplePoint);
```

- Call the **insert** API to insert the sampling dataset into the Health platform.
```cpp
Task<Void> insertTask = dataController.insert(sampleSet);
```

- Calling the **insert** API to insert the sampling dataset is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the data insertion is successful or not.
```cpp
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

> **Note:** In the preceding code snippet, two helper functions are used: **showSampleSet (SampleSet sampleSet)** and **logger(String string)**. The former is used to display data returned by the Health platform, and the latter is used to save the results to the log as an output and display the results on the UI. The sample code for these two functions is as follows: 
```cpp
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

/**
 * Send operation result logs to the logcat.
 *
 * @param string Log string.
 */
private void logger(String string) {
    Log.i("DataController", string);
}
```

#### Deleting the User's Fitness and Health Data

Only historical data that has been inserted by the current app can be deleted from the Health platform.

- Build the condition for data deletion: a **DataCollector **object.
```cpp
DataCollector dataCollector = new DataCollector.Builder().setPackageName(getApplicationContext())
    .setDataType(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .setDataStreamName("STEPS_DELTA")
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .build();
```

- Build the time range for the deletion: start time and end time.
```cpp
SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
Date startDate = null;
Date endDate = null;
try {
    // Enter the start time and end time. The standard UNIX timestamp is used for storage, without considering the time zone differences. Data points within the specified timestamp range will be deleted.
    startDate = dateFormat.parse("2020-03-17 09:00:00");
    endDate = dateFormat.parse("2020-03-17 09:05:00");
} catch (ParseException e) {
    logger("Time parsing error");
}
```

- Build a parameter object for the deletion.
```cpp
DeleteOptions deleteOptions = new DeleteOptions.Builder().addDataCollector(dataCollector)
    .setTimeInterval(startDate.getTime(), endDate.getTime(), TimeUnit.MILLISECONDS)
    .build();
```

- Use the specified condition deletion object to call the **delete** API to delete the sampling dataset.
```cpp
Task<Void> deleteTask = dataController.delete(deleteOptions);
```

- Calling the **delete** API to delete the sampling dataset is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the data deletion is successful or not.
```cpp
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

> **Note:** In the preceding code, a helper function is used: **logger(String string)**, which stores the output results. The sample code for the function is as follows: 
```cpp
/**
 * Send operation result logs to the logcat.
 *
 * @param string Log string.
 */
private void logger(String string) {
    Log.i("DataController", string);
}
```

#### Updating the User's Fitness and Health Data

Note that the start time and end time of the range for updating the fitness and health data must be later than the UNIX timestamp corresponding to January 1, 2014.

- Build the condition for data update: a **DataCollector **object.
```cpp
DataCollector dataCollector = new DataCollector.Builder().setPackageName(getApplicationContext())
    .setDataType(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .setDataStreamName("STEPS_DELTA")
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .build();
```

- Build the sampling dataset for the update: create a sampling dataset for the update based on the data collector.
```cpp
SampleSet sampleSet = SampleSet.create(dataCollector);
```

- Build the start time, end time, and incremental step count for a **DT_CONTINUOUS_STEPS_DELTA** sampling point for the update.
```cpp
SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
Date startDate = null;
Date endDate = null;
try {
    // Enter the start time and end time. The standard UNIX timestamp is used for storage, without considering the time zone differences. Data points within the specified timestamp range will be updated.
    // Note that the start time and end time of the range for updating the fitness and health data must be later than the UNIX timestamp corresponding to January 1, 2014.
    startDate = dateFormat.parse("2020-03-17 09:00:00");
    endDate = dateFormat.parse("2020-03-17 09:05:00");
} catch (ParseException exception) {
    logger("Time parsing error");
}
int stepsDelta = 2000;
```

- Build a **DT_CONTINUOUS_STEPS_DELTA** sampling point for the update.
```cpp
SamplePoint samplePoint = sampleSet.createSamplePoint()
    .setTimeInterval(startDate.getTime(), endDate.getTime(), TimeUnit.MILLISECONDS);
samplePoint.getFieldValue(Field.FIELD_STEPS_DELTA).setIntValue(stepsDelta);
```

- Add an updated **DT_CONTINUOUS_STEPS_DELTA** sampling point to the sampling dataset for the update. You can repeat steps [3](#EN-US_TOPIC_0000001051066446__li353011335013) through [5](#EN-US_TOPIC_0000001051066446__li16381211115013) to add more updated sampling points to the sampling dataset for the update.
```cpp
sampleSet.addSample(samplePoint);
```

- Build a parameter object for the update.
```cpp
UpdateOptions updateOption = new UpdateOptions.Builder()
    .setTimeInterval(startDate.getTime(), endDate.getTime(), TimeUnit.MILLISECONDS)
    .setSampleSet(sampleSet)
    .build();
```

- Use the specified parameter object for the update to call the **update** API to modify the sampling dataset.
```cpp
Task<Void> updateTask = dataController.update(updateOption);
```

- Calling the **update** API to modify the sampling dataset is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the data update is successful or not.
```cpp
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

> **Note:** In the preceding code, a helper function is used: **logger(String string)**, which stores the output results. The sample code for the function is as follows: 
```cpp
/**
 * Send operation result logs to the logcat.
 *
 * @param string Log string.
 */
private void logger(String string) {
    Log.i("DataController", string);
}
```

#### Querying the User's Fitness and Health Data

To read historical data from the Health platform, for example, to read the number of steps taken within a period of time, you can specify the read conditions in **ReadOptions**. For example, you can specify the data collector, data type, and detailed data. The dataset that matches the query criteria will be returned. The start time or end time of data points in the dataset is within the specified time range.

Note that the start time and end time of the time range for querying fitness and health data must be later than the UNIX timestamp corresponding to January 1, 2014.

- Build the time range for the query: start time and end time.
```cpp
SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
Date startDate = null;
Date endDate = null;
try {
    // Enter the start time and end time. The standard UNIX timestamp is used for storage, without considering the time zone differences. Data points within the specified timestamp range will be queried.
    // Note that the start time and end time of the range for querying the fitness and health data must be later than the UNIX timestamp corresponding to January 1, 2014.
    startDate = dateFormat.parse("2020-03-17 09:00:00");
    endDate = dateFormat.parse("2020-03-17 09:05:00");
} catch (ParseException exception) {
    logger("Time parsing error");
}
```

- Build the condition-based query object.
```cpp
// The DataType.DT_CONTINUOUS_STEPS_DELTA specified here can be used to query the user's step count.
ReadOptions readOptions = new ReadOptions.Builder().read(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .setTimeRange(startDate.getTime(), endDate.getTime(), TimeUnit.MILLISECONDS)
    .build();
```

- Use the specified condition query object to call the **read** API to query the sampling dataset.
```cpp
Task<ReadReply> readReplyTask = dataController.read(readOptions);
```

- Calling the **read** API to query the sampling dataset is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the data query is successful or not.
```cpp
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

> **Note:** In the preceding code snippet, two helper functions are used: **showSampleSet (SampleSet sampleSet)** and **logger(String string)**. The former is used to display data returned by the Health platform, and the latter is used to save the results to the log as an output and display the results on the UI. The sample code for these two functions is as follows: 
```cpp
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

/**
 * Send operation result logs to the logcat.
 *
 * @param string Log string.
 */
private void logger(String string) {
    Log.i("DataController", string);
}
```

#### Querying the Statistical Fitness and Health Data of the User of the Day

> **Note:** The following data types (values of the input parameter **DataType**) are supported for the query of statistical data of the day: Step count: **DataType.DT_CONTINUOUS_STEPS_DELTA** Distance: **DataType.DT_CONTINUOUS_DISTANCE_DELTA** Heart rate: **DataType.DT_INSTANTANEOUS_HEART_RATE** Weight: **DataType.DT_INSTANTANEOUS_BODY_WEIGHT** Sleep: **DataType.DT_CONTINUOUS_SLEEP** Stress: **DataType.DT_INSTANTANEOUS_STRESS** Calories: **DataType.DT_CONTINUOUS_CALORIES_BURNT** Medium- and high-intensity: **DataType.DT_CONTINUOUS_EXERCISE_INTENSITY_V2** Resting heart rate: **DataType.DT_INSTANTANEOUS_RESTING_HEART_RATE** Body temperature: **HealthDataTypes.DT_INSTANTANEOUS_BODY_TEMPERATURE** Jump: **DataType.DT_CONTINUOUS_JUMP** Heart rate during workout: **DataType.DT_INSTANTANEOUS_EXERCISE_HEART_RATE**

- Call **readTodaySummation **to query the statistical data of the date type **DT_CONTINUOUS_STEPS_DELTA** (incremental step count) of the current day. For details about the supported data types, see the atomic data types in [Mapping Between Statistical Data Types and Atomic Data Types](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5#EN-US_TOPIC_0000001051066438__section1319045413231).
```cpp
Task<SampleSet> todaySummationTask = dataController.readTodaySummation(DataType.DT_CONTINUOUS_STEPS_DELTA);
```

- Calling the **readTodaySummation** API to query the statistical data of the current day is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the data query is successful or not. This API is used to query the statistics of a certain data type on the current day. The query time range starts from 00:00:00 of the day and ends at the system timestamp when the API is called. Calculation will be performed on the all queried data points with the start time or end time being in the specified time range, and the statistical results will be returned. Only the preceding data types are supported. 
```cpp
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

> **Note:** In the preceding code snippet, two helper functions are used: **showSampleSet (SampleSet sampleSet)** and **logger(String string)**. The former is used to display data returned by the Health platform, and the latter is used to save the results to the log as an output and display the results on the UI. The sample code for these two functions is as follows: 
```cpp
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

/**
 * Send operation result logs to the logcat.
 *
 * @param string Log string.
 */
private void logger(String string) {
    Log.i("DataController", string);
}
```

#### Querying the Statistical Fitness and Health Data of the User of Multiple Days

> **Note:** 1. The start time and end time in the request for invoking the **DataController.readDailySummation** API to query the fitness and health data of multiple days must be later than January 1, 2014. 2. The following data types (values of the input parameter **DataType**) are supported for the query of statistical data of multiple days: Step count: **DataType.DT_CONTINUOUS_STEPS_DELTA** Distance: **DataType.DT_CONTINUOUS_DISTANCE_DELTA** Heart rate: **DataType.DT_INSTANTANEOUS_HEART_RATE** Weight: **DataType.DT_INSTANTANEOUS_BODY_WEIGHT** Sleep: **DataType.DT_CONTINUOUS_SLEEP** Stress: **DataType.DT_INSTANTANEOUS_STRESS** Calories: **DataType.DT_CONTINUOUS_CALORIES_BURNT** Medium- and high-intensity: **DataType.DT_CONTINUOUS_EXERCISE_INTENSITY_V2** Resting heart rate: **DataType.DT_INSTANTANEOUS_RESTING_HEART_RATE** Body temperature: **HealthDataTypes.DT_INSTANTANEOUS_BODY_TEMPERATURE** Jump: **DataType.DT_CONTINUOUS_JUMP** Heart rate during workout: **DataType.DT_INSTANTANEOUS_EXERCISE_HEART_RATE**

- Initialize the start time and end time, in the format of YYYYMMDD.
```cpp
// Note that the start time and end time must be later than January 1, 2014.
int startTime = 20200818;
int endTime = 20200827;
```

- Call **readDailySummation **to query the statistical data of the date type **DT_CONTINUOUS_STEPS_DELTA** (incremental step count) of multiple days, by specifying the start time and end time. For details about the supported data types, see the atomic data types in [Mapping Between Statistical Data Types and Atomic Data Types](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5#EN-US_TOPIC_0000001051066438__section1319045413231).
```cpp
Task<SampleSet> daliySummationTask = dataController.readDailySummation(DataType.DT_CONTINUOUS_STEPS_DELTA, startTime, endTime);
```

- Calling the **readDailySummation** API to query the statistical data of multiple days is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the data query is successful or not. The API is used to query the statistical data types of multiple days of a specified data time. The query time range is specified by the start time and end time (unit: day) passed as input parameters. All queried data points within the specified time range will be grouped by day. The statistical calculation will be performed on each data group (for each day), and the statistical results of the involved days will be returned. Currently, only the preceding data types are supported. 
```cpp
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

> **Note:** In the preceding code snippet, two helper functions are used: **showSampleSet (SampleSet sampleSet)** and **logger(String string)**. The former is used to display data returned by the Health platform, and the latter is used to save the results to the log as an output and display the results on the UI. The sample code for these two functions is as follows: 
```cpp
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

/**
 * Send operation result logs to the logcat.
 *
 * @param string Log string.
 */
private void logger(String string) {
    Log.i("DataController", string);
}
```

#### Querying the Latest Data Points of a User's Fitness and Health Data

> **Note:** The following data types (values of the input parameter **DataType**) are supported for the query of latest sampling points: Height: **DataType.DT_INSTANTANEOUS_HEIGHT** Weight: **DataType.DT_INSTANTANEOUS_BODY_WEIGHT** Heart rate: **DataType.DT_INSTANTANEOUS_HEART_RATE** Resting heart rate: **DataType.DT_INSTANTANEOUS_RESTING_HEART_RATE** Stress: **DataType.DT_INSTANTANEOUS_STRESS** Blood pressure: **HealthDataTypes.DT_INSTANTANEOUS_BLOOD_PRESSURE** Blood glucose: **HealthDataTypes.DT_INSTANTANEOUS_BLOOD_GLUCOSE** Blood oxygen: **HealthDataTypes.DT_INSTANTANEOUS_SPO2**

- Use the specified data type (such as height: **DT_INSTANTANEOUS_HEIGHT**) to call the **readLatestData** API to query the latest sampling point.
```cpp
List<DataType> dataTypes = new ArrayList<>();
dataTypes.add(DataType.DT_INSTANTANEOUS_HEIGHT);
Task<Map<DataType, SamplePoint>> readLatestDatas = dataController.readLatestData(dataTypes);
```

- Calling the **readLatestData** API to query the latest sampling point is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the data query is successful or not.
```cpp
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

> **Note:** In the preceding code snippet, two helper functions are used: **showSamplePoint(SamplePoint samplePoint)** and **logger(String string)**. The former is used to display data returned by the Health platform, and the latter is used to save the results to the log as an output and display the results on the UI. The sample code for these two functions is as follows: 
```cpp
/**
 * Print the SamplePoint as an output.
 *
 * @param samplePoint Sampling dataset.
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

/**
* Send operation result logs to the logcat.
 *
 * @param string Log string.
 */
private void logger(String string) {
    Log.i("DataController", string);
}
```

#### Clearing the User's Fitness and Health Data from the Device and Cloud

- Call **clearAll** to delete all the data inserted by the app from the device and cloud.
```cpp
Task<Void> clearAllTask = dataController.clearAll();
```

- Calling **clearAll** to clear user data from the device and cloud is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the clearance is successful or not.
```cpp
clearAllTask.addOnSuccessListener(new OnSuccessListener<Void>() {
    @Override
    public void onSuccess(Void result) {
        logger("clearAll success");
    }
}).addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(Exception e) {
        String errorCode = e.getMessage();
        String errorMsg = HiHealthStatusCodes.getStatusCodeMessage(Integer.parseInt(errorCode));
        logger("clearAll failure" + errorCode + ":" + errorMsg);
    }
});
```
 > **Note:** In the preceding code snippet, a helper function is used: **logger(String string)**. This is a **TextView** function used to save the results to the log as an output and display the results on the UI. The sample code for the function is as follows: 
```cpp
/**
 * TextView to send the operation result logs to the logcat and to the UI
 *
 * @param string Log string.
 */
private void logger(String string) {
    Log.i("DataController", string);
}
```
