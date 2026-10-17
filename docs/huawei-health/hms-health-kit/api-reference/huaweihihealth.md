<!--
  Title: HuaweiHiHealth
  Catalog: HMSCore-References-V5
  Document ID: huaweihihealth-0000001050091513-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/huaweihihealth-0000001050091513-V5
-->
# HuaweiHiHealth

| Class Info |
| --- |
| public class HuaweiHiHealth Provides APIs for obtaining various **Controller** instances. |

#### Public Field Summary

| Qualifier and Type | Field and Description |
| --- | --- |
| static final Scope | [SCOPE_HEALTHKIT_HEIGHTWEIGHT_READ](#EN-US_TOPIC_0000001053727031__section14691458122214) Views the height and weight in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_HEIGHTWEIGHT_WRITE](#EN-US_TOPIC_0000001053727031__section174931351102418) Stores the height and weight in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_HEIGHTWEIGHT_BOTH](#EN-US_TOPIC_0000001053727031__section209079557243) Views and stores the height and weight in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_STEP_READ](#EN-US_TOPIC_0000001053727031__section10866427266) Views the step count in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_STEP_WRITE](#EN-US_TOPIC_0000001053727031__section97652122261) Stores the step count in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_STEP_BOTH](#EN-US_TOPIC_0000001053727031__section139595138269) Views and stores the step count in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_LOCATION_READ](#EN-US_TOPIC_0000001053727031__section99911044152711) Views the location data (including the trajectory) in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_LOCATION_WRITE](#EN-US_TOPIC_0000001053727031__section15232757152720) Stores the location data (including the trajectory) in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_LOCATION_BOTH](#EN-US_TOPIC_0000001053727031__section071558172710) Views and stores the location data (including the trajectory) in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_HEARTRATE_READ](#EN-US_TOPIC_0000001053727031__section081135318283) Views the heart rate data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_HEARTRATE_WRITE](#EN-US_TOPIC_0000001053727031__section44441744294) Stores the heart rate data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_HEARTRATE_BOTH](#EN-US_TOPIC_0000001053727031__section482315512295) Views and stores the heart rate data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_BLOODGLUCOSE_READ](#EN-US_TOPIC_0000001053727031__section967116112918) Views the blood glucose data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_BLOODGLUCOSE_WRITE](#EN-US_TOPIC_0000001053727031__section1990201516306) Stores the blood glucose data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_BLOODGLUCOSE_BOTH](#EN-US_TOPIC_0000001053727031__section1194715153303) Views and stores the blood glucose data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_DISTANCE_READ](#EN-US_TOPIC_0000001053727031__section8170128123115) Views the distance and climbing height in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_DISTANCE_WRITE](#EN-US_TOPIC_0000001053727031__section623122653111) Stores the distance and climbing height in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_DISTANCE_BOTH](#EN-US_TOPIC_0000001053727031__section1197416264316) Views and stores the distance and climbing height in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_SPEED_READ](#EN-US_TOPIC_0000001053727031__section1138214217327) Views the speed in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_SPEED_WRITE](#EN-US_TOPIC_0000001053727031__section64621622103210) Stores the speed in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_SPEED_BOTH](#EN-US_TOPIC_0000001053727031__section1774015429326) Views and stores the speed in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_CALORIES_READ](#EN-US_TOPIC_0000001053727031__section1187912783313) Views the calories (including the BMR) in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_CALORIES_WRITE](#EN-US_TOPIC_0000001053727031__section19800162863315) Stores calories (including the BMR) in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_CALORIES_BOTH](#EN-US_TOPIC_0000001053727031__section1789312472338) Views and stores calories (including the BMR) in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_PULMONARY_READ](#EN-US_TOPIC_0000001053727031__section1761817568340) Views the pulmonary function data (e.g. VO2 Max) in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_PULMONARY_WRITE](#EN-US_TOPIC_0000001053727031__section8569134812352) Stores the pulmonary function data (e.g. VO2 Max) in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_PULMONARY_BOTH](#EN-US_TOPIC_0000001053727031__section10497124911358) Views and stores the pulmonary function data (e.g. VO2 Max) in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_STRENGTH_READ](#EN-US_TOPIC_0000001053727031__section830895016354) Views medium- and high-intensity data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_STRENGTH_WRITE](#EN-US_TOPIC_0000001053727031__section94419510358) Stores medium- and high-intensity data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_STRENGTH_BOTH](#EN-US_TOPIC_0000001053727031__section2679175113352) Views and stores medium- and high-intensity data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_ACTIVITY_READ](#EN-US_TOPIC_0000001053727031__section1138095213353) Views the activity data (such as activity points, workout, strength, jump, running posture, cycling, and activity duration) in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_ACTIVITY_WRITE](#EN-US_TOPIC_0000001053727031__section1821245383510) Stores the activity data (such as activity points, workout, strength, running posture, cycling, jump, and activity duration) in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_ACTIVITY_BOTH](#EN-US_TOPIC_0000001053727031__section1696112536357) Views and stores the activity data (such as activity points, workout, jump, strength, running posture, cycling, and activity duration) in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_SLEEP_READ](#EN-US_TOPIC_0000001053727031__section46853575352) Views the sleep data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_SLEEP_WRITE](#EN-US_TOPIC_0000001053727031__section63271586351) Stores the sleep data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_SLEEP_BOTH](#EN-US_TOPIC_0000001053727031__section9412597351) Views and stores the sleep data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_NUTRITION_READ](#EN-US_TOPIC_0000001053727031__section167101759173519) Views the nutrition data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_NUTRITION_WRITE](#EN-US_TOPIC_0000001053727031__section1188616543614) Stores the nutrition data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_NUTRITION_BOTH](#EN-US_TOPIC_0000001053727031__section1758320619368) Views and stores the nutrition data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_BLOODPRESSURE_READ](#EN-US_TOPIC_0000001053727031__section4307971368) Views the blood pressure data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_BLOODPRESSURE_WRITE](#EN-US_TOPIC_0000001053727031__section123738203619) Stores the blood pressure data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_BLOODPRESSURE_BOTH](#EN-US_TOPIC_0000001053727031__section973413833616) Views and stores the blood pressure data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_OXYGENSTATURATION_READ](#EN-US_TOPIC_0000001053727031__section13584917362) Views the blood oxygen data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_OXYGENSTATURATION_WRITE](#EN-US_TOPIC_0000001053727031__section1398813918362) Stores the blood oxygen data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_OXYGENSTATURATION_BOTH](#EN-US_TOPIC_0000001053727031__section0609141017363) Views and stores the oxygen saturation in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_BODYTEMPERATURE_READ](#EN-US_TOPIC_0000001053727031__section1824814118366) Views the body temperature data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_BODYTEMPERATURE_WRITE](#EN-US_TOPIC_0000001053727031__section158508111362) Stores the body temperature data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_BODYTEMPERATURE_BOTH](#EN-US_TOPIC_0000001053727031__section1854315129368) Views and stores the body temperature data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_REPRODUCTIVE_READ](#EN-US_TOPIC_0000001053727031__section6285513163611) Views the reproductive data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_REPRODUCTIVE_WRITE](#EN-US_TOPIC_0000001053727031__section8920191319361) Stores the reproductive data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_REPRODUCTIVE_BOTH](#EN-US_TOPIC_0000001053727031__section37281314193611) Views and stores the reproductive data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_ACTIVITY_RECORD_READ](#EN-US_TOPIC_0000001053727031__section490144918301) Views the activity data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_ACTIVITY_RECORD_WRITE](#EN-US_TOPIC_0000001053727031__section5902149113020) Stores the activity data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_ACTIVITY_RECORD_BOTH](#EN-US_TOPIC_0000001053727031__section169031649113016) Views and stores the activity data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_STRESS_READ](#EN-US_TOPIC_0000001053727031__section74331954123910) Views the stress data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_STRESS_WRITE](#EN-US_TOPIC_0000001053727031__section1214116252423) Stores the stress data in Health Kit. |
| static final Scope | [SCOPE_HEALTHKIT_STRESS_BOTH](#EN-US_TOPIC_0000001053727031__section109641274425) Views and stores the stress data in Health Kit. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| static ActivityRecordsController | [getActivityRecordsController](#EN-US_TOPIC_0000001053727031__section1889717537365)(Activity activity, AuthHuaweiId huaweiId) Creates and obtains an instance of the **ActivityRecordsController** object by passing the **Activity** and **AuthHuaweiId** objects. |
| static ActivityRecordsController | [getActivityRecordsController](#EN-US_TOPIC_0000001053727031__section861123215374)(Context context, AuthHuaweiId huaweiId) Creates and obtains an instance of the **ActivityRecordsController** object by passing the **Context** and **AuthHuaweiId** objects. |
| static AutoRecorderController | [getAutoRecorderController](#EN-US_TOPIC_0000001053727031__section783652411323)(Activity activity, AuthHuaweiId huaweiId) Creates and obtains an instance of the **AutoRecorderController** object by passing the **Activity** and **AuthHuaweiId** objects. |
| static AutoRecorderController | [getAutoRecorderController](#EN-US_TOPIC_0000001053727031__section7302850153217)(Context context, AuthHuaweiId huaweiId) Creates and obtains an instance of the **AutoRecorderController** object by passing the **Context** and **AuthHuaweiId** objects. |
| static DataController | [getDataController](#EN-US_TOPIC_0000001053727031__section01581328114010)(Activity activity, AuthHuaweiId huaweiId) Creates and obtains an instance of the **DataController** object by passing the **Activity** and **AuthHuaweiId** objects. |
| static DataController | [getDataController](#EN-US_TOPIC_0000001053727031__section19140194494011)(Context context, AuthHuaweiId huaweiId) Creates and obtains an instance of the **DataController** object by passing the **Context** and **AuthHuaweiId** objects. |
| static SettingController | [getSettingController](#EN-US_TOPIC_0000001053727031__section112555185012)(Activity activity, AuthHuaweiId huaweiId) Creates and obtains an instance of the **SettingController** object by passing the **Activity** and **AuthHuaweiId** objects. |
| static SettingController | [getSettingController](#EN-US_TOPIC_0000001053727031__section1393017617142)(Context context, AuthHuaweiId huaweiId) Creates and obtains an instance of the **SettingController** object by passing the **Context** and **AuthHuaweiId** objects. |
| static ConsentsController | [getConsentsController](#EN-US_TOPIC_0000001053727031__section531561314261)(Activity activity, AuthHuaweiId huaweiId) Creates and obtains an instance of the **ConsentsController** object by passing the **Activity** and **AuthHuaweiId** objects. |
| static ConsentsController | [getConsentsController](#EN-US_TOPIC_0000001053727031__section53181113102611)(Context context, AuthHuaweiId huaweiId) Creates and obtains an instance of the **ConsentsController** object by passing the **Context** and **AuthHuaweiId** objects. |

#### Public Fields

## SCOPE_HEALTHKIT_HEIGHTWEIGHT_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_HEIGHTWEIGHT_READ Permission to view the height and weight in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_HEIGHTWEIGHT_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_HEIGHTWEIGHT_WRITE Permission to store the height and weight in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_HEIGHTWEIGHT_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_HEIGHTWEIGHT_BOTH Permissions to view and store the height and weight in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_STEP_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_STEP_READ Permission to view the step count in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_STEP_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_STEP_WRITE Permission to store the step count in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_STEP_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_STEP_BOTH Permissions to view and store the step count in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_LOCATION_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_LOCATION_READ Permission to view the location data (including the trajectory) in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_LOCATION_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_LOCATION_WRITE Permission to store the location data (including the trajectory) in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_LOCATION_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_LOCATION_BOTH Permissions to view and store the location data (including the trajectory) in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_HEARTRATE_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_HEARTRATE_READ Permission to view the heart rate data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_HEARTRATE_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_HEARTRATE_WRITE Permission to store the heart rate data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_HEARTRATE_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_HEARTRATE_BOTH Permissions to view and store the heart rate data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_BLOODGLUCOSE_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_BLOODGLUCOSE_READ Permission to view the blood glucose data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_BLOODGLUCOSE_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_BLOODGLUCOSE_WRITE Permission to store the blood glucose data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_BLOODGLUCOSE_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_BLOODGLUCOSE_BOTH Permissions to view and store the blood glucose data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_DISTANCE_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_DISTANCE_READ Permission to view the distance and climbing height in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_DISTANCE_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_DISTANCE_WRITE Permission to store the distance and climbing height in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_DISTANCE_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_DISTANCE_BOTH Permissions to view and store the distance and climbing height in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_SPEED_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_SPEED_READ Permission to view the speed in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_SPEED_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_SPEED_WRITE Permission to store the speed in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_SPEED_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_SPEED_BOTH Permissions to view and store the speed in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_CALORIES_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_CALORIES_READ Permission to view the calories (including the BMR) in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_CALORIES_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_CALORIES_WRITE Permission to store calories (including the BMR) in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_CALORIES_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_CALORIES_BOTH Permissions to view and store calories (including the BMR) in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_PULMONARY_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_PULMONARY_READ Permission to view the pulmonary function data (e.g. VO2 Max) in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_PULMONARY_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_PULMONARY_WRITE Permission to store the pulmonary function data (e.g. VO2 Max) in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_PULMONARY_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_PULMONARY_BOTH Permissions to view and store the pulmonary function data (e.g. VO2 Max) in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_STRENGTH_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_STRENGTH_READ Permission to view medium- and high-intensity data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_STRENGTH_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_STRENGTH_WRITE Permission to store medium- and high-intensity data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_STRENGTH_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_STRENGTH_BOTH Permissions to view and store medium- and high-intensity data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_ACTIVITY_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_ACTIVITY_READ Permission to view the activity data (such as activity points, workout, strength, jump, running posture, cycling, and activity duration) in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_ACTIVITY_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_ACTIVITY_WRITE Permission to store the activity data (such as activity points, workout, strength, jump, running posture, cycling, and activity duration) in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_ACTIVITY_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_ACTIVITY_BOTH Permissions to view and store the activity data (such as activity points, workout, strength, jump, running posture, cycling, and activity duration) in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_SLEEP_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_SLEEP_READ Permission to view the sleep data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_SLEEP_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_SLEEP_WRITE Permission to store the sleep data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_SLEEP_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_SLEEP_BOTH Permissions to view and store the sleep data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_NUTRITION_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_NUTRITION_READ Permission to view the nutrition data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_NUTRITION_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_NUTRITION_WRITE Permission to store the nutrition data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_NUTRITION_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_NUTRITION_BOTH Permissions to view and store the nutrition data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_BLOODPRESSURE_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_BLOODPRESSURE_READ Permission to view the blood pressure data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_BLOODPRESSURE_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_BLOODPRESSURE_WRITE Permission to store the blood pressure data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_BLOODPRESSURE_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_BLOODPRESSURE_BOTH Permissions to view and store the blood pressure data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_OXYGENSTATURATION_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_OXYGENSTATURATION_READ Permission to view the blood oxygen data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_OXYGENSTATURATION_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_OXYGENSTATURATION_WRITE Permission to store the blood oxygen data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_OXYGENSTATURATION_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_OXYGENSTATURATION_BOTH Permissions to view and store the oxygen saturation in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_BODYTEMPERATURE_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_BODYTEMPERATURE_READ Permission to view the body temperature data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_BODYTEMPERATURE_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_BODYTEMPERATURE_WRITE Permission to store the body temperature data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_BODYTEMPERATURE_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_BODYTEMPERATURE_BOTH Permissions to view and store the body temperature data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_REPRODUCTIVE_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_REPRODUCTIVE_READ Permission to view the reproductive data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_REPRODUCTIVE_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_REPRODUCTIVE_WRITE Permission to store the reproductive data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_REPRODUCTIVE_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_REPRODUCTIVE_BOTH Permissions to view and store the reproductive data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_ACTIVITY_RECORD_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_ACTIVITY_RECORD_READ Permission to view the activity data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_ACTIVITY_RECORD_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_ACTIVITY_RECORD_WRITE Permission to store the activity data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_ACTIVITY_RECORD_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_ACTIVITY_RECORD_BOTH Permissions to view and store the activity data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_STRESS_READ

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_STRESS_READ Permission to view the pressure data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_STRESS_WRITE

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_STRESS_WRITE Permission to store the pressure data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

## SCOPE_HEALTHKIT_STRESS_BOTH

| Field |
| --- |
| public static final Scope SCOPE_HEALTHKIT_STRESS_BOTH Permissions to view and store the pressure data in Health Kit. See [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) for more information. |

#### Public Methods

## getActivityRecordsController(Activity activity, AuthHuaweiId huaweiId)

| Method |
| --- |
| public static ActivityRecordsController** **getActivityRecordsController(Activity activity, AuthHuaweiId huaweiId) Creates and obtains an instance of the **ActivityRecordsController** object by passing the **Activity** and **AuthHuaweiId** objects. |

**Parameters**

| Name | Description |
| --- | --- |
| activity | **Activity** object (called in scenarios where app UIs are included), with support for triggering forced updates of HMS Core. |
| huaweiId | HUAWEI ID, used to obtain the related scope authorization information. |

**Return****s**

| Type | Description |
| --- | --- |
| ActivityRecordsController | An object instance for managing user activity records. |

## getActivityRecordsController(Context context, AuthHuaweiId huaweiId)

| Method |
| --- |
| public static ActivityRecordsController** **getActivityRecordsController(Context context, AuthHuaweiId huaweiId) Creates and obtains an instance of the **ActivityRecordsController** object by passing the **Context** and **AuthHuaweiId** objects. |

**Parameters**

| Name | Description |
| --- | --- |
| context | **Context** object (called in scenarios where app UIs are not included), without support for triggering forced updates of HMS Core. |
| huaweiId | HUAWEI ID, used to obtain the related scope authorization information. |

**Returns**

| Type | Description |
| --- | --- |
| ActivityRecordsController | Creates an instance for managing user activity records. |

## getAutoRecorderController(Activity activity, AuthHuaweiId huaweiId)

| Method |
| --- |
| public static** **AutoRecorderController getAutoRecorderController(Activity activity, AuthHuaweiId huaweiId) Creates and obtains an instance of the **AutoRecorderController** object by passing the **Activity** and **AuthHuaweiId** objects. |

**Parameters**

| Name | Description |
| --- | --- |
| activity | **Activity** object (called in scenarios where app UIs are included), with support for triggering forced updates of HMS Core. |
| huaweiId | HUAWEI ID, used to obtain the related scope authorization information. |

**Return****s**

| Type | Description |
| --- | --- |
| AutoRecorderController | An instance of a data object that is used to manage self-created records of the user. |

## getAutoRecorderController(Context context, AuthHuaweiId huaweiId)

| Method |
| --- |
| public static** **AutoRecorderController getAutoRecorderController(Context context, AuthHuaweiId huaweiId) Creates and obtains an instance of the **AutoRecorderController** object by passing the **Context** and **AuthHuaweiId** objects. |

**Parameters**

| Name | Description |
| --- | --- |
| context | **Context** object (called in scenarios where app UIs are not included), without support for triggering forced updates of HMS Core. |
| huaweiId | HUAWEI ID, used to obtain the related scope authorization information. |

**Return****s**

| Type | Description |
| --- | --- |
| AutoRecorderController | An instance of a data object that is used to manage self-created records of the user. |

## getDataController(Activity activity, AuthHuaweiId huaweiId)

| Method |
| --- |
| public static DataController getDataController(Activity activity, AuthHuaweiId huaweiId) Creates and obtains an instance of the **DataController** object by passing the **Activity** and **AuthHuaweiId** objects. |

**Parameters**

| Name | Description |
| --- | --- |
| activity | **Activity** object (called in scenarios where app UIs are included), with support for triggering forced updates of HMS Core. |
| authHuaweiId | HUAWEI ID, used to obtain the related scope authorization information. |

**Return****s**

| Type | Description |
| --- | --- |
| DataController | An object instance that is used to manage the fitness and health data. |

## getDataController(Context context, AuthHuaweiId huaweiId)

| Method |
| --- |
| public static DataController getDataController(Context context, AuthHuaweiId huaweiId) Creates and obtains an instance of the **DataController** object by passing the **Context** and **AuthHuaweiId** objects. |

**Parameters**

| Name | Description |
| --- | --- |
| context | **Context** object (called in scenarios where app UIs are not included), without support for triggering forced updates of HMS Core. |
| huaweiId | HUAWEI ID, used to obtain the related scope authorization information. |

**Return****s**

| Type | Description |
| --- | --- |
| DataController | An object instance that is used to manage the fitness and health data. |

## getSettingController(Activity activity, AuthHuaweiId huaweiId)

| Method |
| --- |
| public static SettingController getSettingController(Activity activity, AuthHuaweiId huaweiId) Creates and obtains an instance of the **SettingController** object by passing the **Activity** and **AuthHuaweiId** objects. |

**Parameters**

| Name | Description |
| --- | --- |
| activity | **Activity** object (called in scenarios where app UIs are included), with support for triggering forced updates of HMS Core. |
| huaweiId | HUAWEI ID, used to obtain the related scope authorization information. |

**Return****s**

| Type | Description |
| --- | --- |
| SettingController | An object instance that is used to manage user settings. |

## getSettingController(Context context, AuthHuaweiId huaweiId)

| Method |
| --- |
| public static SettingController getSettingController(Context context, AuthHuaweiId huaweiId) Creates and obtains an instance of the **SettingController** object by passing the **Context** and **AuthHuaweiId** objects. |

**Parameters**

| Name | Description |
| --- | --- |
| context | **Context** object (called in scenarios where app UIs are not included), without support for triggering forced updates of HMS Core. |
| huaweiId | HUAWEI ID, used to obtain the related scope authorization information. |

**Return****s**

| Type | Description |
| --- | --- |
| SettingController | An object instance that is used to manage user settings. |

## getConsentsController(Activity activity, AuthHuaweiId huaweiId)

| Method |
| --- |
| public static ConsentsController getConsentsController(Activity activity, AuthHuaweiId huaweiId) Creates and obtains an instance of the **ConsentsController** object by passing the **Activity** and **AuthHuaweiId** objects. |

**Parameters**

| Name | Description |
| --- | --- |
| activity | **Activity** object (called in scenarios where app UIs are included), with support for triggering forced updates of HMS Core. |
| huaweiId | HUAWEI ID, used to obtain the related scope authorization information. |

**Return****s**

| Type | Description |
| --- | --- |
| ConsentsController | An object instance that is used to manage user authorization information. |

## getConsentsController(Context context, AuthHuaweiId huaweiId)

| Method |
| --- |
| public static ConsentsController getConsentsController(Context context, AuthHuaweiId huaweiId) Creates and obtains an instance of the **ConsentsController** object by passing the **Context** and **AuthHuaweiId** objects. |

**Parameters**

| Name | Description |
| --- | --- |
| context | **Context** object (called in scenarios where app UIs are not included), without support for triggering forced updates of HMS Core. |
| huaweiId | HUAWEI ID, used to obtain the related scope authorization information. |

**Return****s**

| Type | Description |
| --- | --- |
| ConsentsController | An object instance that is used to manage user authorization information. |
