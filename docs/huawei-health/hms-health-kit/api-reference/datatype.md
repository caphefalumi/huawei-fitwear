<!--
  Title: DataType
  Catalog: HMSCore-References-V5
  Document ID: datatype-0000001050089916-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datatype-0000001050089916-V5
-->
# DataType

| Class Info |
| --- |
| public class DataType extends EnhanceParcelable Data types defined by Health Kit. Each data type has a unique name. Each data type has its own meaning. For example, **DT_CONTINUOUS_STEPS_DELTA** indicates the number of steps taken since the last reading. For details about the data type names, attributes, and value ranges, see [Public Data Types](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5). |

#### Public Field Summary

| Qualifier and Type | Field and Description |
| --- | --- |
| static final DataType | [DT_CONTINUOUS_STEPS_DELTA](#EN-US_TOPIC_0000001053208308__section185941927562) Steps taken since the last reading. |
| static final DataType | [DT_CONTINUOUS_STEPS_TOTAL](#EN-US_TOPIC_0000001053208308__section32912131568) Total number of steps. This data type applies only to data query scenarios. |
| static final DataType | [DT_INSTANTANEOUS_STEPS_RATE](#EN-US_TOPIC_0000001053208308__section17350141415810) Step cadence. |
| static final DataType | [DT_CONTINUOUS_STEPS_RATE_STATISTIC](#EN-US_TOPIC_0000001053208308__section28561874215) Step cadence statistics. |
| static final DataType | [DT_CONTINUOUS_ACTIVITY_SEGMENT](#EN-US_TOPIC_0000001053208308__section15138114322817) Activity fragments within a period of time. |
| static final DataType | [DT_CONTINUOUS_CALORIES_BURNT](#EN-US_TOPIC_0000001053208308__section2109113243112) Total calories burned within a period of time. |
| static final DataType | [DT_INSTANTANEOUS_POWER_SAMPLE](#EN-US_TOPIC_0000001053208308__section17160161918337) Instantaneous power generated when performing an activity. |
| static final DataType | [DT_INSTANTANEOUS_HEART_RATE](#EN-US_TOPIC_0000001053208308__section145441438143518) Heart rate. |
| static final DataType | [DT_INSTANTANEOUS_LOCATION_SAMPLE](#EN-US_TOPIC_0000001053208308__section6731101953618) Location information. |
| static final DataType | [DT_CONTINUOUS_DISTANCE_DELTA](#EN-US_TOPIC_0000001053208308__section46971440133813) Distance covered since the last reading. |
| static final DataType | [DT_CONTINUOUS_DISTANCE_TOTAL](#EN-US_TOPIC_0000001053208308__section8572430203918) Total distance covered. |
| static final DataType | [DT_CONTINUOUS_CALORIES_BURNT_TOTAL](#EN-US_TOPIC_0000001053208308__section18552184213454) Total calories. |
| static final DataType | [DT_INSTANTANEOUS_SPEED](#EN-US_TOPIC_0000001053208308__section0441616204012) Instantaneous speed. |
| static final DataType | [DT_INSTANTANEOUS_BIKING_WHEEL_ROTATION](#EN-US_TOPIC_0000001053208308__section87401858134110) Instantaneous measurement of the rotational speed of the bicycle wheel per minute. |
| static final DataType | [DT_INSTANTANEOUS_BIKING_PEDALING_RATE](#EN-US_TOPIC_0000001053208308__section996419108437) Bike riding speed at a given time. |
| static final DataType | [DT_INSTANTANEOUS_HEIGHT](#EN-US_TOPIC_0000001053208308__section16298192019470) Height. |
| static final DataType | [DT_INSTANTANEOUS_BODY_WEIGHT](#EN-US_TOPIC_0000001053208308__section552416517476) Weight. |
| static final DataType | [DT_INSTANTANEOUS_NUTRITION_FACTS](#EN-US_TOPIC_0000001053208308__section620010567500) Nutrient intake over a meal. |
| static final DataType | [DT_INSTANTANEOUS_HYDRATE](#EN-US_TOPIC_0000001053208308__section13286114414517) Water taken over a single drink. |
| static final DataType | [DT_STATISTICS_SLEEP](#EN-US_TOPIC_0000001053208308__section3596115612518) Sleep statistics type. |
| static final DataType | [DT_CONTINUOUS_SLEEP](#EN-US_TOPIC_0000001053208308__section13188165935111) Sleep details. |
| static final DataType | [DT_INSTANTANEOUS_STRESS](#EN-US_TOPIC_0000001053208308__section87941272266) Stress details. |
| static final DataType | [DT_INSTANTANEOUS_STRESS_STATISTICS](#EN-US_TOPIC_0000001053208308__section473603210262) Stress statistics type. |
| static final DataType | [DT_CONTINUOUS_EXERCISE_INTENSITY_V2](#EN-US_TOPIC_0000001053208308__section137813293818) Medium- and high-intensity details. |
| static final DataType | [DT_STATISTICS_EXERCISE_INTENSITY_V2](#EN-US_TOPIC_0000001053208308__section179221114014) Medium- and high-intensity statistics type. |
| static final DataType | [DT_INSTANTANEOUS_RESTING_HEART_RATE](#EN-US_TOPIC_0000001053208308__section370721175316) Resting heart rate details. |
| static final DataType | [DT_RESTING_HEART_RATE_STATISTICS](#EN-US_TOPIC_0000001053208308__section123461515312) Resting heart rate statistics type. |
| static final DataType | [DT_CONTINUOUS_JUMP](#EN-US_TOPIC_0000001053208308__section7220354104316) Jump details. |
| static final DataType | [DT_CONTINUOUS_JUMP_STATISTICS](#EN-US_TOPIC_0000001053208308__section16221254114313) Type of jump data statistics. |
| static final DataType | [DT_INSTANTANEOUS_EXERCISE_HEART_RATE](#EN-US_TOPIC_0000001053208308__section178219424612) Details of the heart rate during workout. |
| static final DataType | [DT_CONTINUOUS_EXERCISE_HEART_RATE_STATISTICS](#EN-US_TOPIC_0000001053208308__section14999101113349) Type of statistics for heart rate during workout. |
| static final DataType | [POLYMERIZE_CONTINUOUS_HEART_RATE_STATISTICS](#EN-US_TOPIC_0000001053208308__section442335185818) Average, maximum, and minimum heartbeats per minute within a period of time. |
| static final DataType | [POLYMERIZE_CONTINUOUS_SPEED_STATISTICS](#EN-US_TOPIC_0000001053208308__section1249744415595) Ground speed (including the maximum, minimum, and average values). |
| static final DataType | [POLYMERIZE_CONTINUOUS_BODY_FAT_RATE_STATISTICS](#EN-US_TOPIC_0000001053208308__section62131743102816) Body fat rate over a period of time (including the maximum, minimum, and average values). |
| static final DataType | [POLYMERIZE_CONTINUOUS_BODY_WEIGHT_STATISTICS](#EN-US_TOPIC_0000001053208308__section9215843162814) Weight over a period of time (including the maximum, minimum, and average values). |
| static final DataType | [POLYMERIZE_CONTINUOUS_HEIGHT_STATISTICS](#EN-US_TOPIC_0000001053208308__section142252436281) Height over a period of time (including the maximum, minimum, and average values). |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [DataType](#EN-US_TOPIC_0000001053208308__section2249143172814)(String name, String scopeNameRead, String scopeNameWrite, String scopeNameBoth, List<Field> fieldsList) Constructor for **DataType**. |
| [DataType](#EN-US_TOPIC_0000001053208308__section575514918572)(String name, String scopeNameRead, String scopeNameWrite, String scopeNameBoth, List<Field> fieldsList, boolean isPolymerizedFlag) Constructor for **DataType**. |
| [DataType](#EN-US_TOPIC_0000001053208308__section8627161105716)(String name, String scopeNameRead, String scopeNameWrite, String scopeNameBoth, List<Field> fieldsList, boolean isPolymerizedFlag, boolean isSelfDefined, String packageName) Constructor for **DataType**. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| List<Field> | [getFields](#EN-US_TOPIC_0000001053208308__section126314313284)() Obtains the attribute list for the data type. |
| static String | [getMimeType](#EN-US_TOPIC_0000001053208308__section1979520195413)(DataType dataType) Adds a header name to the type. |
| String | [getName](#EN-US_TOPIC_0000001053208308__section112671543182820)() Obtains the name that uniquely identifies this data type. |
| String | [getPackageName](#EN-US_TOPIC_0000001053208308__section9722144365512)() Obtains the package name of the app as the calling party. |
| static List<DataType> | [getPolymerizesForInput](#EN-US_TOPIC_0000001053208308__section72941342155613)(DataType dataType) Obtains the grouped data types of the specified data type. |
| String | [getScopeNameBoth](#EN-US_TOPIC_0000001053208308__section1500327195719)() Obtains the read and write permissions of the data type. |
| String | [getScopeNameRead](#EN-US_TOPIC_0000001053208308__section0272543172818)() Obtains the read permission of the data type. |
| String | [getScopeNameWrite](#EN-US_TOPIC_0000001053208308__section10276164332819)() Obtains the write permission of the data type. |
| final int | [indexOf](#EN-US_TOPIC_0000001053208308__section326516202594)(Field field) Obtains the index value of an attribute. |
| boolean | [isFromSelfDefined](#EN-US_TOPIC_0000001053208308__section1564817071111)() Checks whether the current data type is a customized one. |
| boolean | [isPolymerized](#EN-US_TOPIC_0000001053208308__section1985517801319)() Indicates whether data is aggregated. |
| void | [setFromSelfDefined](#EN-US_TOPIC_0000001053208308__section1288120411142)(boolean isSelfDefined) Sets whether the data type is a customized one. |
| void | [setPackageName](#EN-US_TOPIC_0000001053208308__section347122961610)(String packageName) Sets the package name of the app as the calling party. |

#### Public Fields

## DT_CONTINUOUS_STEPS_DELTA

| Field |
| --- |
| public static final DataType DT_CONTINUOUS_STEPS_DELTA Steps taken since the last reading. Related data type: com.huawei.continuous.steps.delta |

## DT_CONTINUOUS_STEPS_TOTAL

| Field |
| --- |
| public static final DataType DT_CONTINUOUS_STEPS_TOTAL Total number of steps. This data type applies only to data query scenarios. Related data type: com.huawei.continuous.steps.total |

## DT_INSTANTANEOUS_STEPS_RATE

| Field |
| --- |
| public static final DataType DT_INSTANTANEOUS_STEPS_RATE Step cadence. Related data type: com.huawei.instantaneous.steps.rate |

## DT_CONTINUOUS_STEPS_RATE_STATISTIC

| Field |
| --- |
| public static final DataType DT_CONTINUOUS_STEPS_RATE_STATISTIC Step cadence statistics. Related data type: com.huawei.continuous.steps.rate.statistics |

## DT_CONTINUOUS_ACTIVITY_SEGMENT

| Field |
| --- |
| public static final DataType DT_CONTINUOUS_ACTIVITY_SEGMENT Activity fragments within a period of time. Related data type: com.huawei.continuous.activity.fragment |

## DT_CONTINUOUS_CALORIES_BURNT

| Field |
| --- |
| public static final DataType DT_CONTINUOUS_CALORIES_BURNT Total calories burned within a period of time. Related data type: com.huawei.continuous.calories.burnt |

## DT_INSTANTANEOUS_POWER_SAMPLE

| Field |
| --- |
| public static final DataType DT_INSTANTANEOUS_POWER_SAMPLE Instantaneous power generated when performing an activity. Related data type: com.huawei.instantaneous.power.sample |

## DT_INSTANTANEOUS_HEART_RATE

| Field |
| --- |
| public static final DataType DT_INSTANTANEOUS_HEART_RATE Heart rate. Related data type: com.huawei.instantaneous.heart_rate |

## DT_INSTANTANEOUS_LOCATION_SAMPLE

| Field |
| --- |
| public static final DataType DT_INSTANTANEOUS_LOCATION_SAMPLE Location information. Related data type: com.huawei.instantaneous.location.sample |

## DT_CONTINUOUS_DISTANCE_DELTA

| Field |
| --- |
| public static final DataType DT_CONTINUOUS_DISTANCE_DELTA Distance covered since the last reading. Related data type: com.huawei.continuous.distance.delta |

## DT_CONTINUOUS_DISTANCE_TOTAL

| Field |
| --- |
| public static final DataType DT_CONTINUOUS_DISTANCE_TOTAL Total distance covered. Related data type: com.huawei.continuous.distance.total |

## DT_CONTINUOUS_CALORIES_BURNT_TOTAL

| Field |
| --- |
| public static final DataType DT_CONTINUOUS_CALORIES_BURNT_TOTAL Total calories. Related data type: com.huawei.continuous.distance.total |

## DT_INSTANTANEOUS_SPEED

| Field |
| --- |
| public static final DataType DT_INSTANTANEOUS_SPEED Instantaneous speed. Related data type: com.huawei.instantaneous.speed |

## DT_INSTANTANEOUS_BIKING_WHEEL_ROTATION

| Field |
| --- |
| public static final DataType DT_INSTANTANEOUS_BIKING_WHEEL_ROTATION Instantaneous measurement of the rotational speed of the bicycle wheel per minute. Related data type: com.huawei.instantaneous.biking.wheel_rotation |

## DT_INSTANTANEOUS_BIKING_PEDALING_RATE

| Field |
| --- |
| public static final DataType DT_INSTANTANEOUS_BIKING_PEDALING_RATE Bike riding speed at a given time. Related data type: com.huawei.instantaneous.biking.pedaling.rate |

## DT_INSTANTANEOUS_HEIGHT

| Field |
| --- |
| public static final DataType DT_INSTANTANEOUS_HEIGHT Height. Related data type: com.huawei.instantaneous.height |

## DT_INSTANTANEOUS_BODY_WEIGHT

| Field |
| --- |
| public static final DataType DT_INSTANTANEOUS_BODY_WEIGHT Weight. Related data type: com.huawei.instantaneous.body_weight |

## DT_INSTANTANEOUS_NUTRITION_FACTS

| Field |
| --- |
| public static final DataType DT_INSTANTANEOUS_NUTRITION_FACTS Nutrient intake over a meal. Related data type: com.huawei.instantaneous.nutrition_facts |

## DT_INSTANTANEOUS_HYDRATE

| Field |
| --- |
| public static final DataType DT_INSTANTANEOUS_HYDRATE Water taken over a single drink. Related data type: com.huawei.instantaneous.hydrate |

## DT_STATISTICS_SLEEP

| Field |
| --- |
| public static final DataType DT_STATISTICS_SLEEP Sleep statistics. Related data type: com.huawei.continuous.sleep.statistics |

## DT_CONTINUOUS_SLEEP

| Field |
| --- |
| public static final DataType DT_CONTINUOUS_SLEEP Sleep details. For information about the input values of this data type, see [SleepFragmentCategory](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/sleepfragmentcategory-0000001055067754-V5). Related data type: com.huawei.continuous.sleep.fragment |

## DT_INSTANTANEOUS_STRESS

| Field |
| --- |
| public static final DataType DT_INSTANTANEOUS_STRESS Stress details. Related data type: com.huawei.instantaneous.stress |

## DT_INSTANTANEOUS_STRESS_STATISTICS

| Field |
| --- |
| public static final DataType DT_INSTANTANEOUS_STRESS_STATISTICS Stress statistics. Related data type: com.huawei.instantaneous.stress.statistics |

## DT_CONTINUOUS_EXERCISE_INTENSITY_V2

| Field |
| --- |
| public static final DataType DT_CONTINUOUS_EXERCISE_INTENSITY_V2 Medium- and high-intensity details. Related data type: com.huawei.continuous.exercise_intensity.v2 |

## DT_STATISTICS_EXERCISE_INTENSITY_V2

| Field |
| --- |
| public static final DataType DT_STATISTICS_EXERCISE_INTENSITY_V2 Medium- and high-intensity statistics type. Related data type: com.huawei.continuous.exercise_intensity.v2.statistics |

## DT_INSTANTANEOUS_RESTING_HEART_RATE

| Field |
| --- |
| public static final DataType DT_INSTANTANEOUS_RESTING_HEART_RATE Resting heart rate details. Related data type: com.huawei.instantaneous.resting_heart_rate |

## DT_RESTING_HEART_RATE_STATISTICS

| Field |
| --- |
| public static final DataType DT_RESTING_HEART_RATE_STATISTICS Resting heart rate statistics type. Related data type: com.huawei.continuous.resting_heart_rate.statistics |

## DT_CONTINUOUS_JUMP

| Field |
| --- |
| public static final DataType DT_CONTINUOUS_JUMP Jump data details. Related data type: com.huawei.continuous.jump |

## DT_CONTINUOUS_JUMP_STATISTICS

| Field |
| --- |
| public static final DataType DT_CONTINUOUS_JUMP_STATISTICS Type of jump data statistics. Related data type: com.huawei.continuous.jump.statistics |

## DT_INSTANTANEOUS_EXERCISE_HEART_RATE

| Field |
| --- |
| public static final DataType DT_INSTANTANEOUS_EXERCISE_HEART_RATE Type of details for heart rate during workout. Related data type: com.huawei.instantaneous.exercise_heart_rate |

## DT_CONTINUOUS_EXERCISE_HEART_RATE_STATISTICS

| Field |
| --- |
| public static final DataType DT_CONTINUOUS_EXERCISE_HEART_RATE_STATISTICS Type of statistics for heart rate during workout. Related data type: com.huawei.continuous.exercise_heart_rate.statistics |

## POLYMERIZE_CONTINUOUS_HEART_RATE_STATISTICS

| Field |
| --- |
| public static final DataType POLYMERIZE_CONTINUOUS_HEART_RATE_STATISTICS Average, maximum, and minimum heartbeats per minute within a period of time. Related data type: com.huawei.continuous.heart_rate.statistics |

## POLYMERIZE_CONTINUOUS_SPEED_STATISTICS

| Field |
| --- |
| public static final DataType POLYMERIZE_CONTINUOUS_SPEED_STATISTICS Ground speed (including the maximum, minimum, and average values). Related data type: com.huawei.continuous.speed.statistics |

## POLYMERIZE_CONTINUOUS_BODY_FAT_RATE_STATISTICS

| Field |
| --- |
| public static final DataType POLYMERIZE_CONTINUOUS_BODY_FAT_RATE_STATISTICS Body fat rate over a period of time (including the maximum, minimum, and average values). Related data type: com.huawei.continuous.body.fat.rate.statistics |

## POLYMERIZE_CONTINUOUS_BODY_WEIGHT_STATISTICS

| Field |
| --- |
| public static final DataType POLYMERIZE_CONTINUOUS_BODY_WEIGHT_STATISTICS Weight over a period of time (including the maximum, minimum, and average values). Related data type: com.huawei.continuous.body_weight.statistics |

## POLYMERIZE_CONTINUOUS_HEIGHT_STATISTICS

| Field |
| --- |
| public static final DataType POLYMERIZE_CONTINUOUS_HEIGHT_STATISTICS Height over a period of time (including the maximum, minimum, and average values). Related data type: com.huawei.continuous.height.statistics |

#### Public Constructors

## DataType(String name, String scopeNameRead, String scopeNameWrite, String scopeNameBoth, List<Field> fieldsList)

| Constructor |
| --- |
| public DataType(String name, String scopeNameRead, String scopeNameWrite, String scopeNameBoth, List<Field> fieldsList) Constructor for **DataType**. |

**Parameters**

| Name | Description |
| --- | --- |
| name | Name. The value must be a string of 1 to 300 characters. |
| scopeNameRead | Read permission of the data type. The value can be an empty string or a string of 1 to 1000 characters. |
| scopeNameWrite | Write permission of the data type. The value can be an empty string or a string of 1 to 1000 characters. |
| scopeNameBoth | Read and write permissions of the data type. The value can be an empty string or a string of 1 to 1000 characters. |
| fieldsList | Attribute list. |

## DataType(String name, String scopeNameRead, String scopeNameWrite, String scopeNameBoth, List<Field> fieldsList, boolean isPolymerizedFlag)

| Constructor Name |
| --- |
| public DataType(String name, String scopeNameRead, String scopeNameWrite, String scopeNameBoth, List<Field> fieldsList, boolean isPolymerizedFlag) |
| Constructor for **DataType**. |

**Parameters**

| Name | Description |
| --- | --- |
| name | Name. The value must be a string of 1 to 300 characters. |
| scopeNameRead | Read permission of the data type. The value can be an empty string or a string of 1 to 1000 characters. |
| scopeNameWrite | Write permission of the data type. The value can be an empty string or a string of 1 to 1000 characters. |
| scopeNameBoth | Read and write permissions of the data type. The value can be an empty string or a string of 1 to 1000 characters. |
| fieldsList | Attribute list. |
| isPolymerizedFlag | Indicates whether it is a grouped data type. |

## DataType(String name, String scopeNameRead, String scopeNameWrite, String scopeNameBoth, List<Field> fieldsList, boolean isPolymerizedFlag, boolean isSelfDefined, String packageName)

| Constructor Name |
| --- |
| public DataType(String name, String scopeNameRead, String scopeNameWrite, String scopeNameBoth, List<Field> fieldsList, boolean isPolymerizedFlag, boolean isSelfDefined, String packageName) Constructor for **DataType**. |

**Parameters**

| Name | Description |
| --- | --- |
| name | Name. The value must be a string of 1 to 300 characters. |
| scopeNameRead | Read permission of the data type. The value can be an empty string or a string of 1 to 1000 characters. |
| scopeNameWrite | Write permission of the data type. The value can be an empty string or a string of 1 to 1000 characters. |
| scopeNameBoth | Read and write permissions of the data type. The value can be an empty string or a string of 1 to 1000 characters. |
| fieldsList | Attribute list. |
| isPolymerizedFlag | Indicates whether it is a grouped data type. |
| isSelfDefined | Whether the data type is a customized one. |
| packageName | App package name. |

#### Public Methods

## getFields()

| Method |
| --- |
| public List<Field> getFields() Obtains the attribute list for the data type. |

**Returns**

| Type | Description |
| --- | --- |
| List<Field> | Attribute list. |

## getMimeType(DataType dataType)

| Method |
| --- |
| public static String getMimeType(DataType dataType) Adds a header name to the type. |

**Parameters**

| Name | Description |
| --- | --- |
| dataType | Data type. |

**Returns**

| Type | Description |
| --- | --- |
| String | Header name. |

## getName()

| Method |
| --- |
| public String getName() Obtains the name that uniquely identifies this data type. |

**Returns**

| Type | Description |
| --- | --- |
| String | Data type name. |

## getPackageName()

| Method |
| --- |
| public String getPackageName() Obtains the package name of the app as the calling party. |

**Returns**

| Type | Description |
| --- | --- |
| String | Package name of the app as the calling party. |

## getPolymerizesForInput(DataType dataType)

| Method |
| --- |
| public static List<DataType> getPolymerizesForInput(DataType dataType) Obtains the grouped data types of the specified data type. |

**Parameters**

| Name | Description |
| --- | --- |
| dataType | Data type. |

**Returns**

| Type | Description |
| --- | --- |
| List<DataType> | Grouped data type list. |

## getScopeNameBoth()

| Method |
| --- |
| public String getScopeNameBoth() Obtains the read and write permissions of the data type. |

**Returns**

| Type | Description |
| --- | --- |
| String | Read and write permissions. |

## getScopeNameRead()

| Method |
| --- |
| public String getScopeNameRead() Obtains the read permission of the data type. |

**Returns**

| Type | Description |
| --- | --- |
| String | Read permission. |

## getScopeNameWrite()

| Method |
| --- |
| public String getScopeNameWrite() Obtains the write permission of the data type. |

**Returns**

| Type | Description |
| --- | --- |
| String | Write permission. |

## indexOf(Field field)

| Method |
| --- |
| public final int indexOf(Field field) Obtains the index value of an attribute. |

**Parameters**

| Name | Description |
| --- | --- |
| field | Attribute. |

**Returns**

| Type | Description |
| --- | --- |
| int | Index. |

## isFromSelfDefined()

| Method |
| --- |
| public boolean isFromSelfDefined() Checks whether the current data type is a customized one. |

**Returns**

| Type | Description |
| --- | --- |
| boolean | Whether the data type is a customized one. |

## isPolymerized()

| Method |
| --- |
| public boolean isPolymerized() Checks whether the current data is aggregated data. |

**Returns**

| Type | Description |
| --- | --- |
| boolean | Whether the current data is aggregated data. |

## setFromSelfDefined(boolean isSelfDefined)

| Method |
| --- |
| public void setFromSelfDefined(boolean isSelfDefined) Sets whether the data type is a customized one. |

**Parameters**

| Name | Description |
| --- | --- |
| isSelfDefined | Sets whether the data type is a customized one. |

## setPackageName(String packageName)

| Method |
| --- |
| public void setPackageName(String packageName) Sets the package name of the app as the calling party. |

**Parameters**

| Name | Description |
| --- | --- |
| packageName | Package name of the app as the calling party. |
