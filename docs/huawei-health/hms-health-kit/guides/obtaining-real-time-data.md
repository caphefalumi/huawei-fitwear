<!--
  Title: Obtaining Real-time Data
  Catalog: HMSCore-Guides-V5
  Document ID: obtaining-real-time-data-0000001050163997-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/obtaining-real-time-data-0000001050163997-V5
-->
# Obtaining Real-time Data

The following describes how to obtain the real-time heart rate, RRI, and work data of the users.

- Obtain real-time workout data: After the user connects a wearable device, or a Huawei-certified treadmill, elliptical machine, rowing machine, or spinning bike, using the HUAWEI Health app, and starts a single workout session, you can obtain the real-time workout data from the devices.
- Obtain real-time heart rate and RRI: You can obtain the real-time data when the user is measuring the heart rate using a Huawei wearable device or an applicable device listed in **Devices** > **Add** in the HUAWEI Health app.

> **Note:** When Huawei wearable devices and heart rate devices are connected to the HUAWEI Health app, real-time data on the devices will be automatically synced to the HUAWEI Health app and your app can read the data in real time. Only certain Huawei wearable devices support the RRI measurement. Running form data can be obtained only from devices that are capable of detecting running forms, such as the HUAWEI Band 3e.

Before querying the data, make sure that you have obtained the related permissions from Huawei. Otherwise, the API calling will fail. If the user has not authorized the related permission, the API calling will also fail.

| Data Openness Type | API | Requesting Permissions from User (See Signing In and Applying for Permissions) | Scope URL | Requesting Permissions from Huawei (See [Applying for Health Kit](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/apply-kitservice-0000001071254802-V5)) |
| --- | --- | --- | --- | --- |
| Starts obtaining the real-time workout data. | [registerSportData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s512ed23831a84b2599f373fcba5a0edf) | [HEALTHKIT_EXTEND_SPORT_READ](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthextendscope-0000001071609519-V5#EN-US_TOPIC_0000001136869919__HEALTHKIT_EXTEND_SPORT_READ) Read permission for basic workout management (including real-time workout data) | https://www.huawei.com/healthkit/extend/sport.read Read the basic workout information in the Health app via Health Kit. | Basic workout management |
| Stops obtaining the real-time workout data. | [unregisterSportData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s7fbc2f62cbfc4c79804033c9a152ef27) |  |  |  |
| Starts obtaining the real-time heart rate data. | [startReadingHeartRate](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s75299ad8ee2b4092a59fc3f3faabdeaa) | [HEALTHKIT_EXTEND_HEARTHEALTHSLEEP_READ](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthextendscope-0000001071609519-V5#EN-US_TOPIC_0000001136869919__sc2c008c30f8e4b3da9767e3bb1cf0760) Read permission for heart health/sleep management (including real-time RRI data) | https://www.huawei.com/healthkit/extend/hearthealthsleep.read Read the heart health/sleep information in the Health app via Health Kit. | Heart health/Sleep management |
| Stops obtaining the real-time heart rate data. | [stopReadingHeartRate](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sc5011d37b68a4a88b85ee9f2da914b5e) |  |  |  |
| Starts obtaining the real-time RRI data. | [startReadingRri](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s6ec695b6f0374dafa2f635a5e4df268b) |  |  |  |
| Stops obtaining the real-time RRI data. | [stopReadingRri](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s98ee46b13dae47b392abe388d5de4b27) |  |  |  |

#### Starts obtaining the real-time workout data.

- Call the [registerSportData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s512ed23831a84b2599f373fcba5a0edf) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to start obtaining the real-time workout data.
- The result will be returned via the [HiSportDataCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hisportdatacallback-0000001072149462-V5) object defined as an input parameter.
**Sample code**
```cpp
HiHealthDataStore.registerSportData(context, new HiSportDataCallback() {    
    JSONObject jsonResult = new JSONObject();    
    @Override    
    public void onResult(int resultCode) {
        // API callback result.
        Log.i(TAG, "registerSportData onResult resultCode:" + resultCode);   
    }
    @Override    
    public void onDataChanged(int state, Bundle bundle) {
        // Real-time data change callback        
        Log.i(TAG, "registerSportData onChange state: " + state);        
        StringBuffer stringBuffer = new StringBuffer("");              
        if (state == 2) {
            Log.i(TAG, "distance : " + 
            String.valueOf(bundle.get(HiHealthKitConstant.BUNDLE_KEY_DISTANCE)));
            Log.i(TAG, "duration : " +
            String.valueOf(bundle.get(HiHealthKitConstant.BUNDLE_KEY_DURATION)));
            Log.i(TAG, "calorie : " + 
            String.valueOf(bundle.get(HiHealthKitConstant.BUNDLE_KEY_CALORIE)));
            Log.i(TAG, "totalSteps : " + 
            String.valueOf(bundle.get(HiHealthKitConstant.BUNDLE_KEY_TOTAL_STEPS)));
            Log.i(TAG, "speed : " + 
            String.valueOf(bundle.get(HiHealthKitConstant.BUNDLE_KEY_SPEED)));
            Log.i(TAG, "totalCreep : " + 
            String.valueOf(bundle.get(HiHealthKitConstant.BUNDLE_KEY_TOTAL_CREEP)));
            Log.i(TAG, "totalDescent : " + 
            String.valueOf(bundle.get(HiHealthKitConstant.BUNDLE_KEY_TOTAL_DESCENT)));
        }    
    }
});
```
   
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| sportDataCallback | HiSportDataCallback | Real-time workout data callback. | M |
   
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). | M |
| state | int | Workout status. • 0: workout started • 1: workout paused • 2: workout in progress • 3: workout resumed • 4: workout stopped | M |
| value | Bundle | Bundle objects of Android. For details, please refer to [Bundle Keys for Real-time Workout](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/bundle-key-0000001054330104-V5). | M |

#### Stops obtaining the real-time workout data.

- Call the [unregisterSportData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s7fbc2f62cbfc4c79804033c9a152ef27) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to stop obtaining the real-time workout data.
- The result will be returned via the [HiSportDataCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hisportdatacallback-0000001072149462-V5) object defined as an input parameter.
**Sample code**
```cpp
HiHealthDataStore.unregisterSportData(context, new HiSportDataCallback() {    
    JSONObject jsonResult = new JSONObject();    
    @Override    
    public void onResult(int resultCode) {
        // API callback result.
        Log.i(TAG, "unregisterSportData onResult resultCode:" + resultCode);   
    }
    @Override    
    public void onDataChanged(int state, Bundle bundle) {
        // The API is not called at the moment.     
    }
});
```
   
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| sportDataCallback | HiSportDataCallback | Real-time workout data callback. | M |
   
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| resultCode | int | // API callback result. | M |

#### Starting Obtaining the Real-time Heart Rate Data

- Call the [startReadingHeartRate](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s75299ad8ee2b4092a59fc3f3faabdeaa) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to start obtaining the real-time heart rate data.
- The query result will be returned via the [HiRealTimeListener](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hirealtimelistener-0000001072307792-V5) object defined as an input parameter. **Sample code** 
```cpp
HiHealthDataStore.startReadingHeartRate(context, new HiRealTimeListener() {
    @Override  
    public void onResult(int state) { 
        // Obtain the real-time heart rate data result.   
        Log.i(TAG,"ReadingHeartRate onResult state:"+state);    
    }
    @Override
    public void onChange(int resultCode, String value) { 
        // Obtain the real-time heart rate change callback.   
    Log.i(TAG,"startReadingHeartRate onChange resultCode: "+ resultCode +" value: "+value);     
        if (resultCode == HiHealthError.SUCCESS) {
            try {            
                JSONObject jsonObject = new JSONObject(value);            
                Log.i(TAG, "hri_info : " + jsonObject.getInt("hri_info"));            
                Log.i(TAG, "hr_info : " + jsonObject.getInt("hr_info"));            
                Log.i(TAG, "hrsqi_info : " + jsonObject.getInt("hrsqi_info"));            
                Log.i(TAG, "time_info : " + jsonObject.getLong("time_info"));        
            } catch (JSONException e) {            
                Log.e(TAG, "JSONException e" + e.getMessage());       
            }    
        }
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| hiRealTimeListener | HiRealTimeListener | Object for obtaining the real-time heart rate data. | M |
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). | M |
| state | int | Result of data obtaining. • 0: success • Other values: failed | M |
| value | String | Real-time heart rate data, in a JSON string. • int hri_info (signal quality index) • int hrsqi_info (heart rate interval) • int hr_info (heart rate, in the unit of bpm) • int time_info (time when the heart rate value is measured) Example: {"hri_info":0,"hr_info":69,"hrsqi_info":0,"time_info":1591361991000} | M |

#### Stopping Obtaining the Real-time Heart Rate Data

- Call the [stopReadingHeartRate](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sc5011d37b68a4a88b85ee9f2da914b5e) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to stop obtaining the real-time heart rate data.
- The query result will be returned via the [HiRealTimeListener](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hirealtimelistener-0000001072307792-V5) object defined as an input parameter.
```cpp
HiHealthDataStore.stopReadingHeartRate(context, new HiRealTimeListener() {
    @Override  
    public void onResult(int state) { 
        // Stop obtaining the real-time heart rate result.
        Log.i(TAG,"stopReadingHeartRate onResult state:"+state);    
    }
    @Override
    public void onChange(int resultCode, String value) { 
        // The API is not called at the moment.         
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| hiRealTimeListener | HiRealTimeListener | Object for obtaining the real-time heart rate data. | M |
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| state | int | Stop obtaining results. • 0: Succeeded • Other values: Failed | M |

#### Starting Obtaining the Real-time RRI Data

- Call the [startReadingRri](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s6ec695b6f0374dafa2f635a5e4df268b) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to start obtaining the real-time RRI data.
- The query result will be returned via the [HiRealTimeListener](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hirealtimelistener-0000001072307792-V5) object defined as an input parameter. **Sample code** 
```cpp
HiHealthDataStore.startReadingRri(context, new HiRealTimeListener() {
    @Override
    public void onResult(int state) { 
       // Obtain the real-time RRI result.   
        Log.i(TAG, "startReadingRRI onResult state:" + state);    
    }
    @Override
    public void onChange(int resultCode, String value) {    
        // Obtain the real-time RRI change data callback.
        Log.i(TAG, "startReadingRRI onChange resultCode: " + resultCode + " value: " + value.toString());
        if (resultCode == HiHealthError.SUCCESS) {
            try {        
                JSONObject jsonObject = new JSONObject(value);        
                Log.i(TAG, "rri_time : " + jsonObject.getString("rri_time"));        
                Log.i(TAG, "rri_intensity : " + jsonObject.getString("rri_intensity"));        
                Log.i(TAG, "rri_acc_state : " + jsonObject.getString("rri_acc_state"));        
                Log.i(TAG, "rri_motion_state : " + jsonObject.getString("rri_motion_state"));  
                JSONArray valueJsonArray = jsonObject.getJSONArray("rri_list");        
                for (int i = 0; i < valueJsonArray.length(); i++) {            
                    JSONObject jsonObject1 = (JSONObject) valueJsonArray.get(i) ;           
                    Log.i(TAG, "rri_value : " + jsonObject1.getString("rri_value"));       
                    Log.i(TAG, "rri_sqi : " + jsonObject1.getString("rri_sqi"));        
                 }    
             } catch (JSONException e) {        
                 Log.e(TAG, "JSONException e" + e.getMessage());    
             }
        }
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| hiRealTimeListener | HiRealTimeListener | Object for obtaining the real-time RRI data. | M |
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). | M |
| state | int | Result of data obtaining. • 0: success • Other values: failed | M |
| value | String | Real-time RRI data, in a JSON string. • long rri_time (time when the device starts to report the RRI heart rate sampling point) • int rri_intensity (report type identifier of the RRI heart rate sampling signal reported by the device) • int rri_acc_state (ACC flag of the action status of the RRI heart rate sampling signal reported by the device) • int rri_motion_state (workout amount identifier of the RRI heart rate sampling signal reported by the device)JSONArray rri_list[{},{}] • int rri_value (identifier of the RRI heart rate sampling interval reported by the device) • int rri_sqi (quality index identifier of the RRI heart rate sampling signal reported by the device) | M |

#### Stopping Obtaining the Real-time RRI Data

- Call the [stopReadingRri](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s98ee46b13dae47b392abe388d5de4b27) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to stop obtaining the real-time RRI data.
- The query result will be returned via the [HiRealTimeListener](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hirealtimelistener-0000001072307792-V5) object defined as an input parameter. **Sample code** 
```cpp
HiHealthDataStore.stopReadingRri(context, new HiRealTimeListener() {
    @Override
    public void onResult(int state) { 
       // Stop obtaining the RRI data result.  
        Log.i(TAG, "stopReadingRRI onResult state:" + state);    
    }
    @Override
    public void onChange(int resultCode, String value) {    
        // The API is not called at the moment.         
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| hiRealTimeListener | HiRealTimeListener | Object for obtaining the real-time RRI data. | M |
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| state | int | Stop obtaining results. • 0: Succeeded • Other values: Failed | M |
