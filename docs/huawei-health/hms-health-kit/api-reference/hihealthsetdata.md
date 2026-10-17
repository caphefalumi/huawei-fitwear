<!--
  Title: HiHealthSetData
  Catalog: HMSCore-References-V5
  Document ID: hihealthsetdata-0000001071859320-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsetdata-0000001071859320-V5
-->
# HiHealthSetData

| java.lang.Object \|---[com.huawei.hihealthkit.data.HiHealthData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5) \|---\|---com.huawei.hihealthkit.data.HiHealthSetData 
```
public class HiHealthSetData
extends HiHealthData
```
 |
| --- |
 Grouped data type class.
#### Constructor Summary

| Constructor and Description |
| --- |
| [HiHealthSetData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsetdata-0000001071859320-V5#EN-US_TOPIC_0000001136869907__s6daa78fb033f40b3b3adc4291b5003b7)(int type, java.util.Map map, long startTime, long endTime) Argument constructor. |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| java.util.Map | [getMap](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsetdata-0000001071859320-V5#EN-US_TOPIC_0000001136869907__getMap--)() Obtains the map of the current object. |
| void | [setMap](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthsetdata-0000001071859320-V5#EN-US_TOPIC_0000001136869907__setMap-java_util_Map-)(java.util.Map map) Sets the map of the current object. |
   
| Methods inherited from class com.huawei.hihealthkit.data.[HiHealthData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5) |
| --- |
| [getEndTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__getEndTime--), [getSourceDevice](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__getSourceDevice--), [getStartTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__getStartTime--), [getType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__getType--), [setEndTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__setEndTime-long-), [setSourceDevice](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__s53839adbd8ad4492bc74c187fd56c069), [setStartTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__setStartTime-long-), [setType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__setType-int-) |

#### Constructor Detail

## HiHealthSetData

public HiHealthSetData(int type, java.util.Map map, long startTime, long endTime)
Argument constructor.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| type | Data type. |
| map | Map (elements in a set). |
| startTime | Start time. |
| endTime | End time. |

#### Method Detail

## getMap

public java.util.Map getMap()
Obtains the map of the current object.
**Returns:**

Map of the current object.

## setMap

public void setMap(java.util.Map map)
Sets the map of the current object.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| map | Map value. |
