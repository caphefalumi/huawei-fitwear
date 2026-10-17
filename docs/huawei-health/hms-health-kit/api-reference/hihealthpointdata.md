<!--
  Title: HiHealthPointData
  Catalog: HMSCore-References-V5
  Document ID: hihealthpointdata-0000001071707429-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointdata-0000001071707429-V5
-->
# HiHealthPointData

| java.lang.Object \|---[com.huawei.hihealthkit.data.HiHealthData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5) \|---\|---com.huawei.hihealthkit.data.HiHealthPointData 
```
public final class HiHealthPointData
extends HiHealthData
```
 |
| --- |
 Point values.
#### Constructor Summary

| Constructor and Description |
| --- |
| [HiHealthPointData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointdata-0000001071707429-V5#EN-US_TOPIC_0000001136987081__HiHealthPointData--)() No-argument constructor. |
| [HiHealthPointData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointdata-0000001071707429-V5#EN-US_TOPIC_0000001136987081__s1053953193824a628bd498472a491bbf)(int hiHealthDataType, long startTime, long endTime, double value, int hiHealthUnit) Argument constructor. |
| [HiHealthPointData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointdata-0000001071707429-V5#EN-US_TOPIC_0000001136987081__se3f006537ec046aa80d20fcb74afb2d6)(int hiHealthDataType, long startTime, long endTime, int value, int hiHealthUnit) Argument constructor. |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| double | [getDoubleValue](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointdata-0000001071707429-V5#EN-US_TOPIC_0000001136987081__getDoubleValue--)() Obtains the double-precision value. |
| int | [getPointUnit](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointdata-0000001071707429-V5#EN-US_TOPIC_0000001136987081__getPointUnit--)() Obtains the point data unit (int). |
| int | [getValue](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointdata-0000001071707429-V5#EN-US_TOPIC_0000001136987081__getValue--)() Obtains the point data value. |
| void | [setPointUnit](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointdata-0000001071707429-V5#EN-US_TOPIC_0000001136987081__setPointUnit-int-)(int unit) Sets the point data unit. |
| void | [setValue](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointdata-0000001071707429-V5#EN-US_TOPIC_0000001136987081__setValue-double-)(double value) Sets the point value. |
| void | [setValue](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointdata-0000001071707429-V5#EN-US_TOPIC_0000001136987081__setValue-float-)(float value) Sets the point value. |
| void | [setValue](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointdata-0000001071707429-V5#EN-US_TOPIC_0000001136987081__setValue-int-)(int value) Sets the point value. |
   
| Methods inherited from class com.huawei.hihealthkit.data.[HiHealthData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5) |
| --- |
| [getEndTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__getEndTime--), [getSourceDevice](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__getSourceDevice--), [getStartTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__getStartTime--), [getType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__getType--), [setEndTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__setEndTime-long-), [setSourceDevice](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__s53839adbd8ad4492bc74c187fd56c069), [setStartTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__setStartTime-long-), [setType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__setType-int-) |

#### Constructor Detail

## HiHealthPointData

public HiHealthPointData()
No-argument constructor.
## HiHealthPointData

public HiHealthPointData(int hiHealthDataType, long startTime, long endTime, int value, int hiHealthUnit)
Argument constructor.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| hiHealthDataType | Data type. |
| startTime | Start time. |
| endTime | End time. |
| value | Object value. |
| hiHealthUnit | Object unit. |

## HiHealthPointData

public HiHealthPointData(int hiHealthDataType, long startTime, long endTime, double value, int hiHealthUnit)
Argument constructor.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| hiHealthDataType | Data type. |
| startTime | Start time. |
| endTime | End time. |
| value | Object value (double type). |
| hiHealthUnit | Object unit. |

#### Method Detail

## setValue

public void setValue(double value)
Sets the point data value.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| value | Data value. |

## setValue

public void setValue(int value)
Sets the point data value.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| value | Data value. |

## setValue

public void setValue(float value)
Sets the point data value.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| value | Data value. |

## getValue

public int getValue()
Obtains the point data value.
**Returns:**

Point data value.

## getDoubleValue

public double getDoubleValue()
Obtains the double-precision value.
**Returns:**

Point data value.

## setPointUnit

public void setPointUnit(int unit)
Obtains the point data unit.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| unit | Data unit. |

## getPointUnit

public int getPointUnit()
Obtains the point data unit int.
**Returns:**

Data unit.
