<!--
  Title: HiHealthStatusCodes
  Catalog: HMSCore-References-V5
  Document ID: hihealthstatuscodes-0000001050089560-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthstatuscodes-0000001050089560-V5
-->
# HiHealthStatusCodes

| Class Info |
| --- |
| public class HiHealthStatusCodes extends CommonStatusCodes Defines the HiHealth result codes derived from the common HMS Core result codes. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [HiHealthStatusCodes](#EN-US_TOPIC_0000001053487071__section1161718529259)() Builder for **HiHealthStatusCodes**. |

#### Constant Summary

| Name | Description | Value | Solution |
| --- | --- | --- | --- |
| NO_MONITOR_ERROR | Listener not registered. | -50003 | Check whether the listener has been registered. |
| NO_SAVED_DEVICE_ERROR | Saved device not found. | -50002 | Check whether the device information is correct. |
| EXISTED_RECORDER_ERROR | The record already exists. | -50001 | Check whether the record is correct. |
| NO_DATA_COLLECTOR_ERROR | No data available from the data collector. | -50000 | Make sure to add a data collector before using it. |
| NETWORK_ERROR | Network error. | 7 | Make sure that the device is connected to the Internet. |
| INTERNAL_ERROR | Internal error. | 8 | Internal error, such as database error. Unlock the screen and try again. |
| NO_AUTHORITY_ERROR | User authorization required. | 50000 | Check whether the user has authorized the permissions. Request user authorization whenever needed. |
| DUPLICATED_DATA_TYPE_ERROR | Conflicting data type detected during data insertion. | 50001 | The name of the data type to be inserted already exists. Check whether the data type name is correct. |
| MISMATCH_DATA_TYPE_ERROR | Name of the inserted data type not matching the app package name. | 50002 | Make sure that the prefix of the data type name is the same as the package name of the app. |
| NOT_EXIST_DATA_TYPE_ERROR | The data type does not exist. | 50003 | No corresponding data type is found based on the name. Check the data type name. |
| APP_MISMATCH_ERROR | App mismatch detected during data insertion. | 50004 | Make sure that the information of the app that attempts to insert data is the same as that of the app you have registered. |
| UNKNOWN_AUTH_ERROR | Unknown authentication error. | 50005 | Grant the corresponding authorization on the device for the requested operation. |
| NO_BLE_PERMISSION_ERROR | Bluetooth permission not yet granted. | 50006 | Check whether the Bluetooth permission has been granted. |
| UNSUPPORTED_PLATFORM_ERROR | Platform not supported. | 50007 | Check whether the device supports this platform. |
| TRY_AGAIN_ERROR | A transient error occurred. Please try again. | 50008 | Please try again. |
| ACTIVITY_RECORD_ENDED_ERROR | The same activity has ended and cannot be started again. | 50009 | Make sure that the activity to be started is correct. |
| APP_NOT_ENABLED_ERROR | An unauthorized app request. | 50010 | Make sure that the app authorizations are correct. |
| API_EXCEPTION_ERROR | API call error. | 50011 | Check whether there is any parameter error in the called API. |
| POLYMERIZED_NOT_SUPPORTED_ERROR | Aggregation not supported by the data type. | 50012 | Only the following data types support aggregation: • **DataType.DT_CONTINUOUS_CALORIES_BURNT**: calories burnt within a period of time (unit: kcal). • **DataType.DT_CONTINUOUS_DISTANCE_DELTA**: distance covered since the last reading (unit: meter). • **DataType.DT_INSTANTANEOUS_HEART_RATE**: heart rate (unit: heartbeats per minute). • **DataType.DT_CONTINUOUS_STEPS_DELTA**: steps taken since the last reading. • **DataType.DT_INSTANTANEOUS_BODY_WEIGHT**: weight (unit: kg). • **DataType.DT_CONTINUOUS_SLEEP**: sleep details. • **DataType.DT_INSTANTANEOUS_STRESS**: stress. • **DataType.DT_CONTINUOUS_EXERCISE_INTENSITY_V2**: medium- and high-intensity. • **DataType.DT_INSTANTANEOUS_RESTING_HEART_RATE**: resting heart rate. • **DataType.DT_CONTINUOUS_JUMP**: jump. • **HealthDataTypes.DT_INSTANTANEOUS_BODY_TEMPERATURE**: body temperature. • **DataType.DT_INSTANTANEOUS_EXERCISE_HEART_RATE**: heart rate during workout. |
| UNSUPPORTED_ACCOUNT_ERROR | Account not supported. | 50013 | Check whether the account is supported. |
| BLUETOOTH_FORBIDDEN_ERROR | Bluetooth disabled. | 50014 | Make sure that Bluetooth is enabled. |
| MISMATCH_PACKAGE_NAME_ERROR | Inconsistent app package name detected when inserting a data collector. | 50015 | Make sure that the package names are the same. |
| NONEXISTENT_DATA_COLLECTOR_ERROR | No available data collector found. | 50018 | Make sure that the data collector is connected. |
| SAMPLE_SET_TIMESTAMP_ERROR | Timestamp of the sampling dataset inconsistent with the update time range. | 50019 | The time for the data update request is inconsistent with the time of the data in the update request. Check whether the time is correct. |
| ACTIVITY_RECORD_TIMESTAMPS_ERROR | Incorrect timestamp when adding an activity record. | 50020 | Check whether the timestamp is correct. |
| USELESS_SAMPLE_POINT_ERROR | Invalid sampling point data. | 50021 | Check whether the sampling point data is correct. If this result code is returned, troubleshoot as follows: Scenario 1: Check whether the value range of the field corresponding to the sampling point data is correct. For details, see [Public Atomic Data Types](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5#EN-US_TOPIC_0000001051066438__section59321052711). Scenario 2: Ensure that the end time of the sampling point data is later than the UNIX timestamp of January 1, 2014. |
| USELESS_TIMESTAMP_ERROR | Incorrect timestamp input for query. | 50022 | The start time must not be later than the end time. Check whether the time is correct. |
| UNSUPPORTED_DATA_TYPE_ERROR | Record update or automatic data recording not supported by the data type. | 50023 | This result code applies to the following scenarios: Real-time data query for the **DT_CONTINUOUS_STEPS_TOTAL** data type. |
| NEED_APP_TRUSTLIST_ERROR | Before using this data type, ensure that the app is in the trustlist. | 50024 | Check whether the app is in the trustlist. |
| DATA_IS_TOO_LARGE | The amount of data to be queried exceeds the maximum serialization size. | 50025 | Adjust the query time range to reduce the data volume to be queried. |
| SYSTEM_VERSION_IS_INVALID | Not supported by the system version. | 50026 | Check the system version. A phone running a version later than Android 6.0 (API level: 23) or HarmonyOS is required. |
| AGGREGATION_DATA_TYPE_NOT_ALLOWED | Raw data cannot be directly inserted into grouped data types. | 50027 | For grouped data types (which are the ones that start with "POLYMERIZE_"), for example, **POLYMERIZE_CONTINUOUS_HEART_RATE_STATISTICS**, raw data is not allowed to be directly inserted. |
| DATA_FIELD_MUST_FILLED | There are mandatory fields that are not specified in the sampling point. | 50028 | Each data type contains multiple fields, which are either mandatory or optional. For details, see the data types section in the Development Guide. This result code will be returned when calling a Health Kit API to insert data, if any mandatory field is not specified. |
| UNUSED_DATA_TYPE_NOT_ALLOWED | Unused customized data types in the Setting module are not allowed to be used. | 50029 | When calling the related API to add or query customized data types in the Setting module, if an internal error occurs, this result code will be returned. |
| NO_NETWORK | No network or network error. | 50030 | Check whether the phone is connected to the Internet. |
| INPUT_PARAM_MISSING | Parameter loss during API calling. | 50031 | Check whether the input parameters for calling the API are correct. |
| API_FUNCTION_UNAVAILABLE | API function not yet supported. | 50032 | Please stay tuned for future updates. |
| APP_HEALTH_NOT_INSTALLED | Dependent Health app not installed. | 50033 | Install the latest version of Health, grant authorizations, and try again. |
| APP_HEALTH_NOT_MATCH | Version mismatch of dependent Health app. | 50034 | Install the latest version of Health and try again. |
| LISTENER_ALREADY_EXIST | Dependent listener already exists when calling the real-time data query API. | 50035 | Currently, each app can only call the real-time data query API once at any given time. This exception occurs if the API is called repeatedly. You can call the API for ending real-time data query and then try again. |
| LISTENER_NOT_EXIST | Dependent listener does not exist when calling the API for ending real-time data query. | 50036 | To call the API for ending real-time data query, make sure that the real-time data query API has been called. Otherwise, this result code will be returned. |
| HEALTH_APP_NOT_AUTHORISED | The user has not authorized the Health app to open data to Health Kit. | 50037 | This exception will be thrown if the user has not authorized the Health app to open data to Health Kit. To authorize, the user needs to open Health, and go to **Me** > **Privacy management** and enable **Link Huawei Health Kit**. |
| NON_HEALTH_USER | The user is not a Health app user. | 50038 | The user has to be a Health app user. |
| UNTRUST_COUNTRY_CODE | The country/region in which your account was registered is not on the list of supported locations. | 50040 | Switch to an account that was registered in a location listed in [Supported Countries/Regions](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/countries-regions-0000001058740695-V5). |
| ERROR_APP_PACKAGE_NAME | The app package name is incorrect. | 50041 | Ensure that the app package name contained in the input information of the API call is the same as the package name you have registered. |
| NO_ACTIVITY_PERMISSION | The Physical activity permission is not enabled. | 50042 | Enable the Physical activity permission in the HMS Core app. Huawei phones running Android 10.0 or later: Enable the Physical activity permission by going to **HMS Core** > **Permissions**. |
| DATA_MIGRATION_ING | Data migration is in progress. Operations related to data points are temporarily prohibited. | 50043 | Unlock the phone and wait until the data migration is complete. During the migration, do not write, delete, or modify the original data points. |
| READ_LATEST_NOT_SUPPORTED_ERROR | The data type does not support querying the latest data points. | 50044 | The following data types support querying the latest data points: Height: **DataType.DT_INSTANTANEOUS_HEIGHT** Weight: **DataType.DT_INSTANTANEOUS_BODY_WEIGHT** Heart rate: **DataType.DT_INSTANTANEOUS_HEART_RATE** Resting heart rate: **DataType.DT_INSTANTANEOUS_RESTING_HEART_RATE** Stress: **DataType.DT_INSTANTANEOUS_STRESS** Blood pressure: **HealthDataTypes.DT_INSTANTANEOUS_BLOOD_PRESSURE** Blood glucose: **HealthDataTypes.DT_INSTANTANEOUS_BLOOD_GLUCOSE** Blood oxygen: **HealthDataTypes.DT_INSTANTANEOUS_SPO2** |
| HUAWEIID_NOT_LOGGED_IN | The user has not signed in with their HUAWEI ID and the account registration location information is not obtained from the **AIDL** API. | 50045 | Make sure to sign in with a HUAWEI ID. |
| HUAWEI_ID_SIGNIN_ERROR | Unable to call the account sign-in API. | 50047 | Sign in with a HUAWEI ID later. |
| USER_OF_BETA_APP_EXCEED_RANGE | The number of users of the beta app exceeds the preset value. | 50048 | The user's application for the beta version has been rejected. Complete the app acceptance process in the console. |
| INVALID_CONTEXT | Invalid context. HMS Core does not support forced updates triggered by the context of services passed by a third-party app. | 50049 | The user needs to pass the activity context in the app to trigger forced updates of HMS Core. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| static String | [getStatusCodeMessage](#EN-US_TOPIC_0000001053487071__section16304131511)(int statusCode) Returns the error description according to the result code. |

#### Public Constructors

## HiHealthStatusCodes()

| Constructor |
| --- |
| Public HiHealthStatusCodes() Constructor for **HiHealthStatusCodes**. |

#### Public Methods

## getStatusCodeMessage(int statusCode)

| Method |
| --- |
| public static String getStatusCodeMessage(int statusCode) Returns the error description according to the result code. |

**Parameters**

| Name | Description |
| --- | --- |
| statusCode | Result code. |

**Return****s**

| Type | Description |
| --- | --- |
| String | Error description. |
