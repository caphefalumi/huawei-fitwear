<!--
  Title: AutoRecorderController
  Catalog: HMSCore-References-V5
  Document ID: autorecordercontroller-0000001050091345-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/autorecordercontroller-0000001050091345-V5
-->
# AutoRecorderController

| Class Info |
| --- |
| public class AutoRecorderController Provides the capabilities to read data in real time and cancels the reading. |

> **Note:** **AutoRecorderController** supports real-time data reading and stopping real-time data reading only for **DT_CONTINUOUS_STEPS_TOTAL**.
The following describes how to create and use **AutoRecorderController**. Starting data reading by specifying the data type is used as an example. The sample code is as follows:
```cpp
Java
HiHealthOptions options = HiHealthOptions.builder().build();
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(options);
AutoRecorderController controller = HuaweiHiHealth.getAutoRecorderController(context, signInHuaweiId);
// Create the data callback object onSamplePointListener to print the step count data.
private OnSamplePointListener onSamplePointListener = new OnSamplePointListener() {
    @Override
    public void onSamplePoint(SamplePoint samplePoint) {
        for (Field field : samplePoint.getDataType().getFields()) {
            Log.i("AutoRecorderTest","Field: " + field.getName() + " Value: " + samplePoint.getFieldValue(field));
        }
    }
};
// Take DT_CONTINUOUS_STEPS_TOTAL as an example. Start real-time reading of the total number of steps which starts from 0. An updated value will be returned.
// When the phone moves with the user, the total number of steps is returned to the user in real time at a fixed interval until the user finishes reading the data. The callback of total step count will then stop.
DataType dataType = DataType.DT_CONTINUOUS_STEPS_TOTAL;
controller.startRecord(dataType, onSamplePointListener).
addOnSuccessListener(new OnSuccessListener<Void>() {
    @Override
    public void onSuccess(Void result) {
        Log.i("AutoRecorderTest","onSuccess startRecordByType Successful");
    }
}).addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(Exception e) {
        Log.i("AutoRecorderTest","onFailure startRecordByType Failed: " + e.getMessage());
    }
});
```
 
```cpp
Kotlin
val hiHealthOptions = HiHealthOptions.builder().build()
val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions)
autoRecorderController = context?.let { HuaweiHiHealth.getAutoRecorderController(it, signInHuaweiId) }
// Create the data callback object onSamplePointListener to print the step count data.
private val onSamplePointListener = OnSamplePointListener { samplePoint ->
    for (field in samplePoint.dataType.fields) {
        Log.i("AutoRecorderTest","Field: " + field.name , " Value: " +samplePoint.getFieldValue(field))
    }
}
// Take DT_CONTINUOUS_STEPS_TOTAL as an example. Start real-time reading of the total number of steps which starts from 0. An updated value will be returned.
// When the phone moves with the user, the total number of steps is returned to the user in real time at a fixed interval until the user finishes reading the data. The callback of total step count will then stop.
val dataType = DataType.DT_CONTINUOUS_STEPS_TOTAL
autoRecorderController!!.startRecord(dataType, onSamplePointListener).
addOnSuccessListener(new OnSuccessListener<Void>() {
    @Override
    public void onSuccess(Void result) {
        Log.i("AutoRecorderTest","onSuccess startRecordByType Successful");
    }
}).addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(Exception e) {
        Log.i("AutoRecorderTest","onFailure startRecordByType Failed: " + e.getMessage());
    }
});
```

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| Task<Void> | [startRecord](#EN-US_TOPIC_0000001053727029__section35051641993)(DataType dataType, OnSamplePointListener onSamplePointListener) Starts real-time data reading by specifying the data type. |
| Task<Void> | [stopRecord](#EN-US_TOPIC_0000001053727029__section109711928194718)(DataType dataType, OnSamplePointListener onSamplePointListener) Stops real-time data reading by specifying the data type. |

#### Public Methods

## startRecord(DataType dataType, OnSamplePointListener onSamplePointListener)

| Method |
| --- |
| public Task<Void> startRecord(DataType dataType, OnSamplePointListener onSamplePointListener) Starts real-time data reading by specifying the data type. |

**Parameters**

| Name | Description |
| --- | --- |
| dataType | Data type specified for starting real-time data reading. |
| onSamplePointListener | Listener for real-time data returning. |
  The sample code for starting real-time data reading is as follows:
```cpp
Java
HiHealthOptions options = HiHealthOptions.builder().build(); 
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(options); 
AutoRecorderController controller = HuaweiHiHealth.getAutoRecorderController(context, signInHuaweiId); 
// Create the data callback object onSamplePointListener to print the step count data.
private OnSamplePointListener onSamplePointListener = new OnSamplePointListener() {
    @Override
    public void onSamplePoint(SamplePoint samplePoint) {
        for (Field field : samplePoint.getDataType().getFields()) {
            Log.i("AutoRecorderTest","Field: " + field.getName() + " Value: " + samplePoint.getFieldValue(field));
        }
    }
};
// Take starting real-time reading of the step count as an example. The data type and real-time data callback listener need to be passed.
DataType dataType = DataType.DT_CONTINUOUS_STEPS_TOTAL;
controller.startRecord(dataType, onSamplePointListener) 
    .addOnCompleteListener(new OnCompleteListener<Void>() { 
        @Override 
        public void onComplete(Task<Void> taskResult) { 
            // Handling of callback exceptions needs to be added for the case that the calling fails due to the app not being authorized or type not being supported.
            if (taskResult.isSuccessful()) { 
                Log.i("AutoRecorderTest","onComplete stopRecordByType Successful"); 
            } else { 
                Log.i("AutoRecorderTest","onComplete stopRecordByType Failed"); 
            } 
        } 
    }) 
    .addOnSuccessListener(new OnSuccessListener<Void>() { 
        @Override 
        public void onSuccess(Void result) { 
            Log.i("AutoRecorderTest","onSuccess stopRecordByType Successful"); 
        } 
    }) 
    .addOnFailureListener(new OnFailureListener() { 
        @Override 
        public void onFailure(Exception e) { 
            Log.i("AutoRecorderTest","onFailure stopRecordByType Failed: " + e.getMessage()); 
        } 
    });
```
 
```cpp
Kotlin
val hiHealthOptions = HiHealthOptions.builder().build()
val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions)
autoRecorderController = context?.let { HuaweiHiHealth.getAutoRecorderController(it, signInHuaweiId) }
// Create the data callback object onSamplePointListener to print the step count data.
private val onSamplePointListener = OnSamplePointListener { samplePoint ->
    for (field in samplePoint.dataType.fields) {
        Log.i("AutoRecorderTest","Field: " + field.name , " Value: " +samplePoint.getFieldValue(field))
    }
}
// Take starting real-time reading of the step count as an example. The data type and real-time data callback listener need to be passed.
val dataType = DataType.DT_CONTINUOUS_STEPS_TOTAL
autoRecorderController!!.startRecord(dataType, onSamplePointListener)
    .addOnSuccessListener(OnSuccessListener<Void> { Log.i("AutoRecorderTest", "record steps success... ") })
    .addOnFailureListener(OnFailureListener { Log.i("AutoRecorderTest", "report steps failed... ") })
```

## stopRecord(DataType dataType, OnSamplePointListener onSamplePointListener)

| Method |
| --- |
| public Task<Void> stopRecord(DataType dataType, OnSamplePointListener onSamplePointListener) Stops real-time data reading by specifying the data type. |

**Parameters**

| Name | Description |
| --- | --- |
| dataType | Data type specified for stopping data reading. |
| onSamplePointListener | Listener for real-time data returning. |
  The sample code for stopping real-time data reading is as follows:
```cpp
Java
HiHealthOptions options = HiHealthOptions.builder().build(); 
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(options); 
AutoRecorderController controller = HuaweiHiHealth.getAutoRecorderController(context, signInHuaweiId); 
// Create the callback object onSamplePointListener.
private OnSamplePointListener onSamplePointListener = new OnSamplePointListener() {
    @Override
    public void onSamplePoint(SamplePoint samplePoint) {
    }
};
// Take stopping real-time reading of the step count as an example. The data type and real-time data callback listener need to be passed.
DataType dataType = DataType.DT_CONTINUOUS_STEPS_TOTAL;
controller.stopRecord(dataType, onSamplePointListener) 
    .addOnCompleteListener(new OnCompleteListener<Void>() { 
        @Override 
        public void onComplete(Task<Void> taskResult) { 
            // Handling of callback exceptions needs to be added for the case that the calling fails due to the app not being authorized or type not being supported.
            if (taskResult.isSuccessful()) { 
                Log.i("AutoRecorderTest","onComplete stopRecordByType Successful"); 
            } else { 
                Log.i("AutoRecorderTest","onComplete stopRecordByType Failed"); 
            } 
        } 
    }) 
    .addOnSuccessListener(new OnSuccessListener<Void>() { 
        @Override 
        public void onSuccess(Void result) { 
            Log.i("AutoRecorderTest","onSuccess stopRecordByType Successful"); 
        } 
    }) 
    .addOnFailureListener(new OnFailureListener() { 
        @Override 
        public void onFailure(Exception e) { 
            Log.i("AutoRecorderTest","onFailure stopRecordByType Failed: " + e.getMessage()); 
        } 
    });
```
 
```cpp
Kotlin
val hiHealthOptions = HiHealthOptions.builder().build()
val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions)
autoRecorderController = context?.let { HuaweiHiHealth.getAutoRecorderController(it, signInHuaweiId) }
private val onSamplePointListener = OnSamplePointListener { }
// Take stopping real-time reading of the step count as an example. The data type and real-time data callback listener need to be passed.
val dataType = DataType.DT_CONTINUOUS_STEPS_TOTAL
autoRecorderController!!.stopRecord(DataType.DT_CONTINUOUS_STEPS_TOTAL, onSamplePointListener)
    .addOnCompleteListener { taskResult ->
        // Handling of callback exceptions needs to be added for the case that the calling fails due to the app not being authorized or type not being supported.
        if (taskResult.isSuccessful) {
            Log.i("AutoRecorderTest","onComplete stopRecordByType Successful")
        } else {
            Log.i("AutoRecorderTest","onComplete stopRecordByType Failed")
        }
    }.addOnSuccessListener {
        Log.i("AutoRecorderTest","onSuccess stopRecordByType Successful")
    }.addOnFailureListener { e ->
        Log.i("AutoRecorderTest","onFailure stopRecordByType Failed: " + e.message)
    }
```
