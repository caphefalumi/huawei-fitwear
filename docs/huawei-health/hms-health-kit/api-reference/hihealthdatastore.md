<!--
  Title: HiHealthDataStore
  Catalog: HMSCore-References-V5
  Document ID: hihealthdatastore-0000001071549459-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5
-->
# HiHealthDataStore

| java.lang.Object \|---com.huawei.hihealthkit.data.store.HiHealthDataStore 
```
public class HiHealthDataStore
extends java.lang.Object
```
 |
| --- |

Data query class.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| static void | [deleteSample](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s91b22ea938f848c799268751676108ad)(android.content.Context context, [HiHealthData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5) hiHealthData, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) callback) Deletes data written through the **saveSample** API. |
| static void | [deleteSamples](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sa4e9cb1612ef49a292c72f59d99a03f4)(android.content.Context context, java.util.List<[HiHealthData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5)> hiHealthDataList, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) callback) Deletes data samples (not more than 20) written through the **saveSample** API. |
| static void | [execQuery](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s491f47becc70431e8a89b2f0dc649715)(android.content.Context context, HiHealthDataQuery hiHealthDataQuery, int timeout, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) callback) Queries data. |
| static void | [getApiLevel](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s948cd57ee22e434dbf32dfb54161a96e)(android.content.Context context, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) callback) Obtains the server version number. |
| static void | [getBirthday](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s37372eca888e4eb39fa301abf2d8480c)(android.content.Context context, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) birthdayCallback) Obtains the date of birth. |
| static void | [getCount](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s679e1e2aa392468b92918d2337086104)(android.content.Context context, HiHealthDataQuery hiHealthDataQuery, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) callback) Queries the number of data items. |
| static void | [getGender](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sa6ad114860df4ab6beb8aecc6a2387d3)(android.content.Context context, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) genderCallback) Obtains the gender. |
| static void | [getHeight](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s7981a72568fa4949911e49cec0ab4da8)(android.content.Context context, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) heightCallback) Obtains the height. |
| static void | [getWeight](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sc8eabfe062a642418cb4ff4927afe850)(android.content.Context context, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) weightCallback) Obtains the weight. |
| static void | [registerSportData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__scb01992a55f24689a1e72380189ac579)(android.content.Context context, [HiSportDataCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hisportdatacallback-0000001072149462-V5) sportDataCallback) Registers a callback for the real-time workout data. |
| static void | [saveSample](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s2a5f1547aacd4663813943a33700f0f2)(android.content.Context context, [HiHealthData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5) hiHealthData, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) callback) Stores data to the HUAWEI Health app. |
| static void | [saveSamples](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s8018bb89ff8b40ba96048e9451c25a66)(android.content.Context context, java.util.List<[HiHealthData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5)> hiHealthDataList, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) callback) Stores data samples (not more than 20) to the HUAWEI Health app. |
| static void | [startReadingHeartRate](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s531d92f31cc743e78d6e6deb75ba6beb)(android.content.Context context, [HiRealTimeListener](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hirealtimelistener-0000001072307792-V5) hiRealTimeListener) Enables real-time heart rate monitoring. |
| static void | [startReadingRri](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sed97406ea08f465bbd1b3087fc80bf3d)(android.content.Context context, [HiRealTimeListener](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hirealtimelistener-0000001072307792-V5) hiRealTimeListener) Enables real-time RRI monitoring. |
| static void | [startRealTimeSportData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s8a910ac9a3de413ea96980838aa1c42e)(android.content.Context context, [HiSportDataCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hisportdatacallback-0000001072149462-V5) sportDataCallback) Starts to obtain the real-time workout data. |
| static void | [startSport](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sa6094df425024422be8fa2c8116e52b3)(android.content.Context context, int sportType, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) callback) Starts a workout from the background. |
| static void | [stopReadingHeartRate](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sce702f474b4948529abda984886da287)(android.content.Context context, [HiRealTimeListener](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hirealtimelistener-0000001072307792-V5) hiRealTimeListener) Disables real-time heart rate monitoring. |
| static void | [stopReadingRri](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__see0c04d1cc9642f59c6382f0bad4a2bc)(android.content.Context context, [HiRealTimeListener](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hirealtimelistener-0000001072307792-V5) hiRealTimeListener) Disables real-time RRI monitoring. |
| static void | [stopRealTimeSportData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s5c9a4a55c278431a8132407118ef587e)(android.content.Context context, [HiSportDataCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hisportdatacallback-0000001072149462-V5) sportDataCallback) Stops obtainning the real-time workout data. |
| static void | [stopSport](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s9419351ba32b4ef39763cd2fb9e727ba)(android.content.Context context, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) callback) Ends a workout from the background. |
| static void | [unregisterSportData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s1ba61e9d4aef4781ba40702706c2ba6d)(android.content.Context context, [HiSportDataCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hisportdatacallback-0000001072149462-V5) sportDataCallback) Deregisters the callback from the real-time workout data. |

#### Method Detail

## getGender

public static void getGender(android.content.Context context, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) genderCallback)

Obtains the gender.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| genderCallback | Gender callback. The callback parameter is forcibly reverted from an object to an int. The options are **0** (female), **1** (male), **2** (confidential), and **-1** (not set). |

**Since:**

API level 0

## getBirthday

public static void getBirthday(android.content.Context context, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) birthdayCallback)

Obtains the date of birth.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| birthdayCallback | Date of birth callback. The callback parameter is forcibly reverted from an object to an int. For example, "19900801" refers to "August, 1st, 1990". |

**Since:**

API level 0

## getHeight

public static void getHeight(android.content.Context context, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) heightCallback)

Obtains the height.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| heightCallback | Height callback. The callback parameter is forcibly reverted from an object to an int. Unit: cm. |

**Since:**

API level 0

## getWeight

public static void getWeight(android.content.Context context, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) weightCallback)

Obtains the weight.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| weightCallback | Weight callback. The callback parameter is forcibly reverted from an object to an int. Unit: kg. |

**Since:**

API level 0

## execQuery

public static void execQuery(android.content.Context context, HiHealthDataQuery hiHealthDataQuery, int timeout, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) callback)

Queries data.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| hiHealthDataQuery | Query criteria. |
| timeout | Timeout. This parameter is currently not used. Fill in 0. |
| callback | Data query callback. The callback parameter is forcibly reverted from an object to an ArrayList. The Array elements include: HiHealthPointData and HiHealthSetData. |

**Since:**

API level 0

## getCount

public static void getCount(android.content.Context context, HiHealthDataQuery hiHealthDataQuery, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) callback)

Queries the number of data items.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| hiHealthDataQuery | Query criteria. |
| callback | Data query callback. |

**Since:**

API level 0

## saveSample

public static void saveSample(android.content.Context context, [HiHealthData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5) hiHealthData, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) callback)

Stores data to the HUAWEI Health app.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| hiHealthData | Data to be stored. |
| callback | Data query callback. |

**Since:**

API level 0

## saveSamples

public static void saveSamples(android.content.Context context, java.util.List<[HiHealthData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5)> hiHealthDataList, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) callback)

Stores data samples (not more than 20) to the HUAWEI Health app.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| hiHealthDataList | Data samples to be stored. |
| callback | Data query callback. |

**Since:**

API level 0

## deleteSamples

public static void deleteSamples(android.content.Context context, java.util.List<[HiHealthData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5)> hiHealthDataList, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) callback)

Deletes data samples (not more than 20) written through the **saveSample** API.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| hiHealthDataList | Data samples to be deleted. |
| callback | Data deletion callback. |

**Since:**

API level 0

## deleteSample

public static void deleteSample(android.content.Context context, [HiHealthData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5) hiHealthData, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) callback)

Deletes the data written through the **saveSample** API.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| hiHealthData | Data to be deleted. |
| callback | Data deletion callback. |

**Since:**

API level 0

## startReadingHeartRate

public static void startReadingHeartRate(android.content.Context context, [HiRealTimeListener](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hirealtimelistener-0000001072307792-V5) hiRealTimeListener)

Enables real-time heart rate monitoring.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| hiRealTimeListener | Callback. |

**Since:**

API level 0

## stopReadingHeartRate

public static void stopReadingHeartRate(android.content.Context context, [HiRealTimeListener](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hirealtimelistener-0000001072307792-V5) hiRealTimeListener)

Disables real-time heart rate monitoring.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| hiRealTimeListener | Callback. |

**Since:**

API level 0

## startReadingRri

public static void startReadingRri(android.content.Context context, [HiRealTimeListener](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hirealtimelistener-0000001072307792-V5) hiRealTimeListener)

Enables real-time RRI monitoring.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| hiRealTimeListener | Callback. |

**Since:**

API level 0

## stopReadingRri

public static void stopReadingRri(android.content.Context context, [HiRealTimeListener](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hirealtimelistener-0000001072307792-V5) hiRealTimeListener)

Disables real-time RRI monitoring.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| hiRealTimeListener | Callback. |

**Since:**

API level 0

## startRealTimeSportData

public static void startRealTimeSportData(android.content.Context context, [HiSportDataCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hisportdatacallback-0000001072149462-V5) sportDataCallback)

Starts to obtain the real-time workout data.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| sportDataCallback | Result callback. |

**Since:**

API level 0

## registerSportData

public static void registerSportData(android.content.Context context, [HiSportDataCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hisportdatacallback-0000001072149462-V5) sportDataCallback)

Registers a callback for the real-time workout data.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| sportDataCallback | Callback. |

**Since:**

API level 0

## stopRealTimeSportData

public static void stopRealTimeSportData(android.content.Context context, [HiSportDataCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hisportdatacallback-0000001072149462-V5) sportDataCallback)

Stops obtaining the real-time workout data.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| sportDataCallback | Result callback. |

**Since:**

API level 0

## unregisterSportData

public static void unregisterSportData(android.content.Context context, [HiSportDataCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hisportdatacallback-0000001072149462-V5) sportDataCallback)

Deregisters the callback from the real-time workout data.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| sportDataCallback | Callback. |

**Since:**

API level 0

## startSport

public static void startSport(android.content.Context context, int sportType, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) callback)

Starts a workout from the background.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| sportType | Workout type. |
| callback | Callback object. |

**Since:**

API level 0

## stopSport

public static void stopSport(android.content.Context context, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) callback)

Ends a workout from the background.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| callback | Callback object. |

**Since:**

API level 0

## getApiLevel

public static void getApiLevel(android.content.Context context, [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) callback)

Obtains the server version number.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context. |
| callback | Callback object. |

**Since:**

API level 1
