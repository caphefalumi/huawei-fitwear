<!--
  Title: HiHealthOpenPermissionType
  Catalog: HMSCore-References-V5
  Document ID: hihealthopenpermissiontype-0000001072467384-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5
-->
# HiHealthOpenPermissionType

| java.lang.Object \|---com.huawei.hihealthkit.auth.HiHealthOpenPermissionType 
```
public class HiHealthOpenPermissionType
extends java.lang.Object
```
 |
| --- |

This class is deprecated. Use the account authentication method instead.

Sets of permissions opened by Health Kit, including the read and write permission sets. Constructs the **userAllowTypesToWrite** and **userAllowTypesToRead** parameters of the **com.huawei.hihealthkit.auth.HiHealthAuth#requestAuthorization** API.

#### Field Summary

| Modifier and Type | Field and Description |
| --- | --- |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_BLOODPRESSURE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__sa606ddb958814812925c9e50423c5ce5) Blood pressure read permission. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_BLOODSUGAR](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__sf28b52a28a054042916e222f75e454f9) Read permission on blood glucose. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_LAST_OXYGEN_SATURATION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s22dcdda561f54faeafed48d396850bd4) Read permission on the last measured blood oxygen level of the day. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_POINT_BODY_THERMOMETER](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s941c52c8e7614456880e3c4194f520ec) Read permission on the body temperature data. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_POINT_CALORIES_SUM](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s2d8f0a6e18dd40cabb97ee35c11aac56) Read permission on the calorie data. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_POINT_DISTANCE_SUM](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__sa25c6ef6184c420182ce7954897b5bdd) Read permission on the distance data. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_POINT_INTENSITY](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__saa823aa0140f4f148de3b2b3c72057eb) Read permission on the medium- and high-intensity activities. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_POINT_STEP_SUM](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s14230f0eb4834697954805f5a4d201db) Read permission on the step count data. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_REAL_TIME_SPORT](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__sb508efd1e5c944b898017045cb20778b) Read permission on real-time workout data. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_CORE_SLEEP](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s12e59a3ac63a49da8ecd59c049ab0881) Read permission on sleep data (sleep data tracked by a traditional method not included). |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_HEART](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s52e24b15780c41ec8493237d5f5ec9e2) Read permission on daily heart statistics (including the heart rate range and resting heart rate). |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_RIDE_METADATA](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s8ab2dac180c7447baa2aab102deeadcb) Read permission on the cycling trajectory data. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_RUN_METADATA](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__sfe03e25a70d2457090f737822e41fd6b) Read permission on the running trajectory data. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_SLEEP](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s86a13af1150d4b96a588186991b3ac80) Read permission on sleep data (including sleep data recorded by a traditional sleep method and not including HUAWEI TruSleep data) |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_WALK_METADATA](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s3d59881ca29e41b2a1afedaae114b56d) Read permission on the walking trajectory data. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_WEIGHT](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s69c0a2bfc7ac4594bea0f70714e3ff08) Read permission on the weight data (including weight, BMI, and body fat rate measured by a body fat scale) |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_STAT_AVG_OXYGEN_SATURATION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__sce096fc242d643368414dd5fd47684c8) Read permission on the average blood oxygen level of the day. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_STAT_MAX_OXYGEN_SATURATION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s51c0674ed583438d80ecf4817651202c) Read permission on the maximum blood oxygen level of the day. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_STAT_MIN_OXYGEN_SATURATION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__sdd18361d6fcd4459b895e26349e80516) Read permission on the minimum blood oxygen level of the day. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_STRESS](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s3d086795e57a47df978b8f3ac7c81cb0) Read permission on the stress data. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DEVICE_DATA](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s72814261699944b69804b652b54303d1) Read permission on the device data. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_DEVICE_INFORMATION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s72a1682fa73143adaa4d8b7422ec8b78) Read permission on the device information (including the device ID, device name, and device status). |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_REALTIME_HEARTRATE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__sa7e966e5ef2a445ba3325d4a652e6ba1) Read permission on real-time heart rate measurement data (including real-time heart rate and heart RR interval) |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_USER_PROFILE_FEATURE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s80b200784bbd4e6f8bb5dcb92f5475b9) Read permission on basic personal features (such as height and weight). |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_READ_USER_PROFILE_INFORMATION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s888eccf97ab64fee9eaad874b949b476) Read permission on the basic personal information (including gender and age). |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_WRITE_DATA_BLOODPRESSURE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s6eb67f29fa93448e909bac7cd0c09eff) Read permission on the blood pressure data. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_WRITE_DATA_BLOODSUGAR](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s472599a896514073b686914dab4f8a1b) Read permission on the blood glucose data. |
| static int | [HEALTH_OPEN_PERMISSION_TYPE_WRITE_DATA_SET_WEIGHT](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthopenpermissiontype-0000001072467384-V5#EN-US_TOPIC_0000001137088193__s8ae1aa3386de4200be31e1248578110d) Read permission on the weight data (including weight, BMI, and body fat rate measured by a body fat scale) |

#### Field Detail

## HEALTH_OPEN_PERMISSION_TYPE_READ_USER_PROFILE_INFORMATION

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_USER_PROFILE_INFORMATION

Basic personal information (including gender and age).

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a0597854934724ecf8a4568658fd10bac)

## HEALTH_OPEN_PERMISSION_TYPE_READ_USER_PROFILE_FEATURE

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_USER_PROFILE_FEATURE

Basic personal features (such as height and weight).

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a3b5917ab4ac941a1a10c35027faa0200)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DEVICE_INFORMATION

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DEVICE_INFORMATION

Read permission on the device information (including the device ID, device name, and device status).

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__af71d47677e0a4420b6da5faed23aff5d)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_POINT_STEP_SUM

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_POINT_STEP_SUM

Read permission on the step count data

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a7f39cae329b94511bee1411a25459eb5)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_POINT_DISTANCE_SUM

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_POINT_DISTANCE_SUM

Read permission on the distance covered.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a3bdce02c90c84312a501a077c8e2a7f6)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_POINT_CALORIES_SUM

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_POINT_CALORIES_SUM

Read permission on the calorie data.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__ad5070e9581964ee788160611b51e4ef2)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_POINT_INTENSITY

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_POINT_INTENSITY

Read permission on the medium- and high-intensity activities.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a75c0b4a67b1a4d699dfcdc88a150ab23)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_CORE_SLEEP

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_CORE_SLEEP

Read permission on sleep data (including sleep data recorded by HUAWEI TruSleep and not including data recorded by a traditional sleep method).

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__afa5afef1952c4b46bc63dbd3025fa9f1)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_SLEEP

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_SLEEP

Read permission on sleep data (including sleep data recorded by tradional sleep and not including HUAWEI TruSleep data).

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a32888ef596c24a1abe023815b99d8097)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_HEART

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_HEART

Read permission on daily heart statistics (including the heart rate range and resting heart rate)

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a7044007b29ab4bb8bfed6b245d0163c2)

## HEALTH_OPEN_PERMISSION_TYPE_READ_REALTIME_HEARTRATE

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_REALTIME_HEARTRATE

Read permission on real-time heart rate measurement data (including real-time heart rate and heart RR interval).

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__aa1bd0abe6dbd40c29c98f55f846b18b1)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_BLOODSUGAR

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_BLOODSUGAR

Read permission on the blood glucose data.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a71023c5a4a3e44bfac5940ccbaae24f7)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_WALK_METADATA

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_WALK_METADATA

Read permission on the walking trajectory data.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a802dfb12668948a78dedc8d4d37a936b)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_RUN_METADATA

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_RUN_METADATA

Read permission on the running trajectory data.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__ac746006b7c6e49e69e0003c3bc0835e4)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_RIDE_METADATA

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_RIDE_METADATA

Read permission on the cycling trajectory data.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a23362b4073364a13a82bfa691f78c4cf)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_STAT_MAX_OXYGEN_SATURATION

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_STAT_MAX_OXYGEN_SATURATION

Read permission on the maximum blood oxygen level of the day.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__aa68eacf9e32c4706a2e4d2e327c74d40)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_STAT_MIN_OXYGEN_SATURATION

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_STAT_MIN_OXYGEN_SATURATION

Read permission on the minimum blood oxygen level of the day.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__ab221c823e18f4911af8b493741fa7cc7)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_STAT_AVG_OXYGEN_SATURATION

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_STAT_AVG_OXYGEN_SATURATION

Read permission on the average blood oxygen level of the day

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a3fde1acaee1944a0a8056069734abe9a)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_LAST_OXYGEN_SATURATION

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_LAST_OXYGEN_SATURATION

Read permission on the last measured blood oxygen level of the day.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__ad9ceb1b0fef34acea9c4737ce87887dc)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_REAL_TIME_SPORT

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_REAL_TIME_SPORT

Read permission on real-time workout data

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a39e10cfa114e44238c373b5feb004a57)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_BLOODPRESSURE

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_BLOODPRESSURE

Read permission on the blood pressure data.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__acb74ba367b124d9598cd512ab2b30ca7)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DEVICE_DATA

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DEVICE_DATA

Read permission on the device data

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__abb64788ac1a5472c981026f91619787a)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_WEIGHT

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_SET_WEIGHT

Read permission on the weight data (including weight, BMI, and body fat rate measured by a body fat scale).

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__af5855a3ddfc44c5889dc7d99699e580b)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_POINT_BODY_THERMOMETER

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_POINT_BODY_THERMOMETER

Read permission on the body temperature data

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a2020a15e472f4b13a71c9e7ebeb2ad69)

## HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_STRESS

public static final int HEALTH_OPEN_PERMISSION_TYPE_READ_DATA_STRESS

Read permission on the stress data.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a8d708a14c39843488d798d6cbc9e4b4c)

## HEALTH_OPEN_PERMISSION_TYPE_WRITE_DATA_BLOODSUGAR

public static final int HEALTH_OPEN_PERMISSION_TYPE_WRITE_DATA_BLOODSUGAR

Write permission on the blood glucose data.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__ad29c7f56671d4dcd98b6e7f8cbbba60b)

## HEALTH_OPEN_PERMISSION_TYPE_WRITE_DATA_BLOODPRESSURE

public static final int HEALTH_OPEN_PERMISSION_TYPE_WRITE_DATA_BLOODPRESSURE

Write permission on the blood pressure data.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a9f61db1ff39f4cd590ff6bfba66579c3)

## HEALTH_OPEN_PERMISSION_TYPE_WRITE_DATA_SET_WEIGHT

public static final int HEALTH_OPEN_PERMISSION_TYPE_WRITE_DATA_SET_WEIGHT

Write permission on the weight data (including weight, BMI, and body fat rate measured by a body fat scale).

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a72747c9b31d3478b8bb5c891692dba9d)
