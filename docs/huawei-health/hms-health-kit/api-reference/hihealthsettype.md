<!--
  Title: HiHealthSetType
  Catalog: HMSCore-References-V5
  Document ID: hihealthsettype-0000001071859324-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5
-->
# HiHealthSetType

| java.lang.Object \|---[com.huawei.hihealthkit.data.type.HiHealthDataType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5) \|---\|---com.huawei.hihealthkit.data.type.HiHealthSetType 
```
public class HiHealthSetType
extends HiHealthDataType
```
 |
| --- |

Set data type.

#### Field Summary

| Modifier and Type | Field and Description |
| --- | --- |
| static java.util.Map<java.lang.Integer,java.lang.String> | [BLOOD_PRESSURE_CONTENT](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__BLOOD_PRESSURE_CONTENT) Key value of the detailed information in the blood glucose data. |
| static java.util.Map<java.lang.Integer,java.lang.String> | [BLOOD_SUGAR_CONTENT](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__BLOOD_SUGAR_CONTENT) Key value of the detailed information in the blood glucose data. |
| static int | [CONTENT_HEART_RATE_MAX](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_HEART_RATE_MAX) Heart rate details: maximum heart rate by day. |
| static int | [CONTENT_HEART_RATE_MIN](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_HEART_RATE_MIN) Heart rate details: minimum heart rate by day. |
| static int | [CONTENT_HEART_RATE_REST](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_HEART_RATE_REST) Heart rate details: resting heart rate by day. |
| static int | [CONTENT_SLEEP_AWAKE_TIMES](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_AWAKE_TIMES) Sleep details: waking hours. |
| static int | [CONTENT_SLEEP_BED_TIME](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_BED_TIME) Sleep details: bed time |
| static int | [CONTENT_SLEEP_DEEP](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_DEEP) Sleep details: deep sleep. |
| static int | [CONTENT_SLEEP_DEEP_CONTINUITY](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_DEEP_CONTINUITY) Sleep Details: deep sleep continuity. |
| static int | [CONTENT_SLEEP_LIGHT](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_LIGHT) Sleep details: light sleep. |
| static int | [CONTENT_SLEEP_NIGHT_SLEEP_AMOUNT](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_NIGHT_SLEEP_AMOUNT) Sleep details: sleep amount at night. |
| static int | [CONTENT_SLEEP_REM](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_REM) Sleep details: REM sleep. |
| static int | [CONTENT_SLEEP_RISE_TIME](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_RISE_TIME) Sleep details: wake up time. |
| static int | [CONTENT_SLEEP_SCORE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_SCORE) Sleep details: score. |
| static int | [CONTENT_SLEEP_WHOLE_DAY_AMOUNT](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CONTENT_SLEEP_WHOLE_DAY_AMOUNT) Sleep details: total sleep amount. |
| static java.util.Map<java.lang.Integer,java.lang.String> | [CORE_SLEEP_CONTENT](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__CORE_SLEEP_CONTENT) Key value of the detailed information in the core sleep data. |
| static int | [DATA_SET_BLOOD_PRESSURE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__DATA_SET_BLOOD_PRESSURE) Blood pressure dataset. |
| static int | [DATA_SET_BLOOD_SUGAR](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__DATA_SET_BLOOD_SUGAR) Blood glucose dataset. |
| static int | [DATA_SET_CORE_SLEEP](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__DATA_SET_CORE_SLEEP) HUAWEI TruSleepTM dataset. |
| static int | [DATA_SET_HEART](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__DATA_SET_HEART) Heart rate dataset. |
| static int | [DATA_SET_RIDE_METADATA](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__DATA_SET_RIDE_METADATA) Cycling dataset. |
| static int | [DATA_SET_RUN_METADATA](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__DATA_SET_RUN_METADATA) Running dataset. |
| static int | [DATA_SET_WALK_METADATA](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__DATA_SET_WALK_METADATA) Walking dataset. |
| static int | [DATA_SET_WEIGHT_EX](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__DATA_SET_WEIGHT_EX) Weight scale dataset. |
| static java.util.Map<java.lang.Integer,java.lang.String> | [HEART_CONTENT](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__HEART_CONTENT) Key value of detailed information in cardiac measurement. |
| static int | [STAT_DAY_SLEEP_MIN](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__STAT_DAY_SLEEP_MIN) Regular sleep information. |
| static java.util.Map<java.lang.Integer,java.lang.String> | [WEIGHT_EX_CONTENT](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__WEIGHT_EX_CONTENT) Key value of the detailed information in the weight scale measurement. |
   
| Fields inherited from class com.huawei.hihealthkit.data.type.[HiHealthDataType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5) |
| --- |
| [DATA_POINT_MIN](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5#EN-US_TOPIC_0000001137088203__DATA_POINT_MIN), [DATA_SET_MIN](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5#EN-US_TOPIC_0000001137088203__DATA_SET_MIN) |

#### Constructor Summary

| Constructor and Description |
| --- |
| [HiHealthSetType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsettype-0000001071859324-V5#EN-US_TOPIC_0000001137088197__HiHealthSetType--)() |

#### Method Summary

| Methods inherited from class com.huawei.hihealthkit.data.type.[HiHealthDataType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5) |
| --- |
| [getCategory](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5#EN-US_TOPIC_0000001137088203__getCategory-int-), [getType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5#EN-US_TOPIC_0000001137088203__getType--), [init](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5#EN-US_TOPIC_0000001137088203__init-int-), [setType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5#EN-US_TOPIC_0000001137088203__setType-int-) |

#### Field Detail

## DATA_SET_WALK_METADATA

public static final int DATA_SET_WALK_METADATA

Walking dataset.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__ae20393b7717f46d7b09d28ebde958a79)

## DATA_SET_RUN_METADATA

public static final int DATA_SET_RUN_METADATA

Running dataset.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a282059689fc44987bbb5ff7edbdfac34)

## DATA_SET_RIDE_METADATA

public static final int DATA_SET_RIDE_METADATA

Cycling dataset.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a9d2c275352d5492cba8aee115961c148)

## DATA_SET_BLOOD_SUGAR

public static final int DATA_SET_BLOOD_SUGAR

Blood glucose dataset.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a0aafb5f89a3b4998adc9a15bb097c44f)

## DATA_SET_BLOOD_PRESSURE

public static final int DATA_SET_BLOOD_PRESSURE

Blood pressure dataset.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__ad7589ba803604cfbbef5dbb678ddd578)

## DATA_SET_WEIGHT_EX

public static final int DATA_SET_WEIGHT_EX

Weight scale dataset.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__afc30d7718f3a484b9dc69e5f7a517607)

## DATA_SET_CORE_SLEEP

public static final int DATA_SET_CORE_SLEEP

HUAWEI TruSleepTM dataset.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__ae47e59710b3b4e08b50cee677e3b288e)

## DATA_SET_HEART

public static final int DATA_SET_HEART

Heart rate dataset.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__ab667d0116464423cbfd0c89981dee3d3)

## STAT_DAY_SLEEP_MIN

public static final int STAT_DAY_SLEEP_MIN

Regular sleep information.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__ae529f9d49ed746259cbb4ce99cc65592)

## CONTENT_SLEEP_REM

public static final int CONTENT_SLEEP_REM

Sleep details: REM sleep.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a1e4fd0905a2c4bdaae07f2845c6f1b93)

## CONTENT_SLEEP_DEEP

public static final int CONTENT_SLEEP_DEEP

Sleep details: deep sleep.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a720722ca09324d78955332d535c7e970)

## CONTENT_SLEEP_LIGHT

public static final int CONTENT_SLEEP_LIGHT

Sleep details: light sleep.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a6f8187bd25d14046827cff6f3c2c61f9)

## CONTENT_SLEEP_NIGHT_SLEEP_AMOUNT

public static final int CONTENT_SLEEP_NIGHT_SLEEP_AMOUNT

Sleep details: sleep amount at night.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a63cdcfcf651a474dbbed159ee5b8e29d)

## CONTENT_SLEEP_DEEP_CONTINUITY

public static final int CONTENT_SLEEP_DEEP_CONTINUITY

Sleep details: deep sleep continuity.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a528e919fbc244bf0b3631c6afb23087c)

## CONTENT_SLEEP_AWAKE_TIMES

public static final int CONTENT_SLEEP_AWAKE_TIMES

Sleep details: waking hours.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__ad5a2bee8c6114fbc84359c2ee5daebf3)

## CONTENT_SLEEP_BED_TIME

public static final int CONTENT_SLEEP_BED_TIME

Sleep details: bed time.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a924d2e4e2b9f434d874d0c1823dc442c)

## CONTENT_SLEEP_RISE_TIME

public static final int CONTENT_SLEEP_RISE_TIME

Sleep details: wake up time.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a63cc809bf9614ef9ab8f284383013163)

## CONTENT_SLEEP_SCORE

public static final int CONTENT_SLEEP_SCORE

Sleep details: score.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a87a946d2aca149bd8677ff2d3908afa0)

## CONTENT_SLEEP_WHOLE_DAY_AMOUNT

public static final int CONTENT_SLEEP_WHOLE_DAY_AMOUNT

Sleep details: full-day sleep amount.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a3eb10ad05c6e41c1b9f04cf020e102cd)

## CONTENT_HEART_RATE_MAX

public static final int CONTENT_HEART_RATE_MAX

Heart rate details: maximum heart rate by day.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a32606eff89d3446eadcf7fab87aa2375)

## CONTENT_HEART_RATE_MIN

public static final int CONTENT_HEART_RATE_MIN

Heart rate details: minimum heart rate by day.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__aab53e8f9fe3240c7b33877dc74b3d0a7)

## CONTENT_HEART_RATE_REST

public static final int CONTENT_HEART_RATE_REST

Heart rate details: resting heart rate by day.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__a0a33238d99104597a3411570cebc81e4)

## BLOOD_PRESSURE_CONTENT

public static final java.util.Map<java.lang.Integer,java.lang.String> BLOOD_PRESSURE_CONTENT

Key value of the detailed information in the blood glucose data.

## BLOOD_SUGAR_CONTENT

public static final java.util.Map<java.lang.Integer,java.lang.String> BLOOD_SUGAR_CONTENT

Key value of the detailed information in the blood glucose data.

## WEIGHT_EX_CONTENT

public static final java.util.Map<java.lang.Integer,java.lang.String> WEIGHT_EX_CONTENT

Key value of the detailed information in the weight scale measurement.

## CORE_SLEEP_CONTENT

public static final java.util.Map<java.lang.Integer,java.lang.String> CORE_SLEEP_CONTENT

Key value of the detailed information in the core sleep data.

## HEART_CONTENT

public static final java.util.Map<java.lang.Integer,java.lang.String> HEART_CONTENT

Key value of detailed information in cardiac measurement.

#### Constructor Detail

## HiHealthSetType

public HiHealthSetType()
