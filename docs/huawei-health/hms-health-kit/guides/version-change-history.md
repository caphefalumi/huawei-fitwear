<!--
  Title: Version Change History
  Catalog: HMSCore-Guides-V5
  Document ID: version-change-history-0000001057072287-V5
  Updated: 2021-06-07 01:00:34
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/version-change-history-0000001057072287-V5
-->
# Version Change History

#### 5.3.0.301 (2021-05-31)

| SDK version for Android: com.huawei.hms:health:5.3.0.301 **Modified Features** • Fixed an issue with the login and authorization process. |
| --- |

#### About SDK Dependencies

- The SDK of the latest version can be used only on mobile phones running HMS Core (APK) 4.0.2.300 or later. If using a mobile phone without HMS Core (APK) 4.0.2.300 or later, your user will be directed to install it when being called by your app.
- Basic features of this Kit are available on most Huawei devices, whereas some advanced features are available only on Huawei devices running specific EMUI versions. For details, please refer to [EMUI Version-Dependent Features](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/emui-version-dependent-0000001050042515-V5).

Tips: If you have any questions about integrating the HMS Core SDK or releasing your app on HUAWEI AppGallery, [submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/).

#### Earlier Versions

## 5.3.0.300 (2021-04-27)

| SDK version for Android: com.huawei.hms:health:5.3.0.300 **Modified Features** • Added the following data types: Jump, Heart rate during workout, ECG measurement record, and ECG measurement details. For details, see [Public Atomic Data Types](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5#EN-US_TOPIC_0000001051066438__section59321052711). • Added the following statistical data types: Jump, Body temperature, and Heart rate during workout. For details, see [Public Statistical Data Types](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5#EN-US_TOPIC_0000001051066438__section12310165610234). • Added the health record API. For details, see [Uploading Health Records](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/health-record-create-0000001096044054-V5). • Add the [requestAuthorizationIntent](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/settingcontroller-0000001050089660-V5#EN-US_TOPIC_0000001053248363__section1098413278513) API to **SettingController** to integrate the HUAWEI ID sign-in authorization process and Health app authorization process, and also the [parseHealthKitAuthResultFromIntent](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/settingcontroller-0000001050089660-V5#EN-US_TOPIC_0000001053248363__section034571712111) API to parse the authorization result [HealthKitAuthResult](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/auth-result-0000001098318552-V5). • The **BleDeviceInfo** API has been deprecated. • The **SportDataTypes** API has been deprecated. • The **SportFields** API has been deprecated. • The **ActivityRecordResult** API has been deprecated. • The **ActivityRecordStopResult** API has been deprecated. • The **BleDeviceInfosResult** API has been deprecated. • The **DailyStatisticsResult** API has been deprecated. • The **DataCollectorsResult** API has been deprecated. • The **DataTypeResult** API has been deprecated. • The **ReadDetailResult** API has been deprecated. • The **ActivityRecord.ACTION_ACTIVITY_RECORD_START** constant has been deprecated. • The **ActivityRecord.ACTION_ACTIVITY_RECORD_END** constant has been deprecated. • The **BleCommandOptions** API has been deprecated. • The **BleScanCallback** API has been deprecated. • The **StartBleScanOptions** API has been deprecated. |
| --- |

## 5.2.0.301 (2021-02-27)

| SDK version for Android: com.huawei.hms:health:5.2.0.301 **Modified Features** • Added the resting health rate statistical data types. For details, see [Public Atomic Data Types](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5#EN-US_TOPIC_0000001051066438__section59321052711) and [Public Statistical Data Types](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5#EN-US_TOPIC_0000001051066438__section12310165610234). • Added the data subscription notification mechanism to notify apps of user data changes in a timely manner. For details, see [Registering or Updating a Subscriber](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/subscriber-update-0000001088731561-V5). • Added the [AppInfo](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/appinfo-0000001088333871-V5) API for describing app information. • Added the [readLatestData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacontroller-0000001050089472-V5#EN-US_TOPIC_0000001053208304__section783193232513) API to the [DataController](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacontroller-0000001050089472-V5) class to read the latest data point of a specified data type list. NOTE: If the 5.2.0.301 version is integrated, add the following dependency to the **build.gradle** file in the **app** directory: 1. Add the build dependency in the **dependencies** block.
```cpp
implementation 'com.huawei.hms:base:5.2.0.300'
```
 2. Click **Sync Now** in the upper right corner. After the synchronization is complete, debug the API. |
| --- |

## 5.1.0.302 (2021-01-12)

| SDK version for Android: com.huawei.hms:health:5.1.0.302 **Modified Features** Added the details and statistical data type for medium- and high-intensity activities. For details, see [Public Atomic Data Types](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5#EN-US_TOPIC_0000001051066438__section59321052711) and [Public Statistical Data Types](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5#EN-US_TOPIC_0000001051066438__section12310165610234). The **BleController** API has been deprecated and is not recommended for use. |
| --- |

## 5.0.5.300 (2020-11-27)

| SDK version for Android: com.huawei.hms:health:5.0.5.300 **Modified Features** • Added the [ConsentsController](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/consentscontroller-0000001060039068-V5) class and [ScopeLangItem](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopelangitem-0000001059430984-V5) class to view and revoke permissions that have granted to Health Kit. • Added the stress and stress statistical data types. For details, see [Public Atomic Data Types](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5#EN-US_TOPIC_0000001051066438__section59321052711) and [Public Statistical Data Types](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5#EN-US_TOPIC_0000001051066438__section12310165610234). |
| --- |

## 5.0.4.300 (2020-10-27)

| SDK version for Android: com.huawei.hms:health:5.0.4.300 **Modified Features** • Added the [checkHealthAppAuthorization](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/settingcontroller-0000001050089660-V5#EN-US_TOPIC_0000001053248363__section1794720584164) and [getHealthAppAuthorization](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/settingcontroller-0000001050089660-V5#EN-US_TOPIC_0000001053248363__section153731436162416) APIs to the [SettingController](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/settingcontroller-0000001050089660-V5) class. They can be used to check whether the user has granted the Health app to open data to Health Kit. • The **addActivityRecordsMonitor** and **removeActivityRecordsMonitor** APIs in the [ActivityRecordsController](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/activityrecordscontroller-0000001050091295-V5) class have been deprecated and are not recommended for use. |
| --- |

## 5.0.3.300 (2020-09-27)

| SDK version for Android: com.huawei.hms:health:5.0.3.300 **Modified Features** • Changed the Maven coordinates of the version. For details, see the Android version path. • Added the Scope permission. For details, see "Workout record data" and "Real-time data reading" in [What Data Does the SDK Collect?](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/sdk-data-security-0000001050071699-V5#EN-US_TOPIC_0000001050986537__section16209411162). • Optimized workout records and sleep data.Added the [setActivitySummary](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/activityrecord_builder-0000001050163685-V5#EN-US_TOPIC_0000001052927057__section562819572226) and [setTimeZone](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/activityrecord_builder-0000001050163685-V5#EN-US_TOPIC_0000001052927057__section15145325112418) methods to the [ActivityRecord.Builder](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/activityrecord_builder-0000001050163685-V5) class to extend activity records. • Added the [ActivitySummary](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/activity-summary-0000001055215648-V5), [PaceSummary](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/pacesummary-0000001055375624-V5), [SleepFragmentCategory](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/sleepfragmentcategory-0000001055067754-V5), and [SleepState](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/sleepstate-0000001055295669-V5) classes, so that the summary data related to workout and sleep can be obtained via activity records. • Added the [readDailySummation](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacontroller-0000001050089472-V5#EN-US_TOPIC_0000001053208304__section295981925017) API to the [DataController](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacontroller-0000001050089472-V5) class, to query statistical data of multiple days based on the specific data type. • The **syncAll**, **readTodaySummationFromDevice**, **registerModifyDataMonitor**, and **unregisterModifyDataMonitor** APIs in the [DataController](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacontroller-0000001050089472-V5) class have been deprecated and are not recommended for use. • The **Record** API has been deprecated and is not recommended for use. • The **SensorsController** API has been deprecated and is not recommended for use. • The **ModifyDataMonitorOptions** API has been deprecated and is not recommended for use. • The **ListRecordsResult** API has been deprecated and is not recommended for use. • The **DataModifyInfo** API has been deprecated and is not recommended for use. |
| --- |

## 5.0.1.300 (2020-07-27)

| SDK version for Android: com.huawei.hms:hihealth-base:5.0.1.300 **Modified Features** Added quality control for top 7 data types. |
| --- |

## 5.0.0.300 (2020-06-15)

| SDK version for Android: com.huawei.hms:hihealth-base:5.0.0.300 **Modified Features** • Enhanced the DFX capability to cover more service scenarios. • Allowed access to data in the Health app. The data includes the step count, sleep data, blood glucose, blood pressure, heart rate, and weight. |
| --- |

## 4.0.4.300 (2020-05-15)

| Android version: com.huawei.hms:hihealth-base:4.0.4.300 **Modified Features** • Optimized CRUD operations for the **SampleSet** data within a time range. • Added a determination mechanism for the validity of data types. • Optimized the verification rules of some fields on the server so that more characters are allowed for some string values and special characters can be passed for some parameters. |
| --- |

## 4.0.3.300 (2020-04-15)

| SDK version for Android: com.huawei.hms:hihealth-base:4.0.3.300 **Modified Features** Optimized the log information to improve security and performance. |
| --- |

## 4.0.2.301 (2020-03-13)

| SDK version for Android: com.huawei.hms:hihealth-base:4.0.2.301 **Modified Features** Added the function related to customized data types at the client.• Added the methods Task<DataType> [addDataType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/settingcontroller-0000001050089660-V5#EN-US_TOPIC_0000001053248363__section11286159181819) and Task<DataType> [readDataType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/settingcontroller-0000001050089660-V5#EN-US_TOPIC_0000001053248363__section14289189131815) to the [SettingController](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/settingcontroller-0000001050089660-V5) class. • Added the [DataTypeAddOptions](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/dtao_class-0000001050093107-V5) class. Added methods to integrate Health Kit using **React Native** at the client. • Allowed the sign-in authorization API to be called via **React Native**. • Allowed the API for querying the total step count of the current day to be called via **React Native**. For details about the parameters and usage, see the [API Reference](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealth_overview-0000001050091291-V5) and [Client Development (React Native)](https://developer.huawei.com/consumer/en/doc/development/HMS-Plugin-Guides/introduction-0000001050155802). NOTE: Only the English version is available for documents of **React Native**. |
| --- |

## 4.0.0 (2020-01-15)

| Health Kit was first released in the version of 4.0.0. |
| --- |

## Documents of Earlier Versions

[Health Kit 4.0 documents](https://developer.huawei.com/consumer/en/doc/development/HMS-Guides/service_introduction-0000001050071661)
