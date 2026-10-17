<!--
  Title: HiHealthData
  Catalog: HMSCore-References-V5
  Document ID: hihealthdata-0000001071819173-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5
-->
# HiHealthData

| java.lang.Object \|---com.huawei.hihealthkit.data.HiHealthData 
```
public class HiHealthData
extends java.lang.Object
```
 |
| --- |
 Health Kit data.
#### Constructor Summary

| Constructor and Description |
| --- |
| [HiHealthData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__HiHealthData--)() |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| long | [getEndTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__getEndTime--)() Obtains the end time of the object. |
| [HiHealthDeviceInfo](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdeviceinfo-0000001071819167-V5) | [getSourceDevice](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__getSourceDevice--)() Obtains the device information of the object. |
| long | [getStartTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__getStartTime--)() Obtains the start time of the current object. |
| int | [getType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__getType--)() Obtains the type of the current object. |
| void | [setEndTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__setEndTime-long-)(long endTime) Sets the end time of the current object. |
| void | [setSourceDevice](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__s53839adbd8ad4492bc74c187fd56c069)([HiHealthDeviceInfo](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdeviceinfo-0000001071819167-V5) device) Sets the device information of the current object. |
| void | [setStartTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__setStartTime-long-)(long startTime) Sets the start time of the current object. |
| void | [setType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__setType-int-)(int type) Sets the type of the current object. |

#### Constructor Detail

## HiHealthData

public HiHealthData()

#### Method Detail

## setStartTime

public void setStartTime(long startTime)
Sets the start time of the current object.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| startTime | Start time. |

## setEndTime

public void setEndTime(long endTime)
Sets the end time of the current object.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| endTime | End time. |

## getStartTime

public long getStartTime()
Obtains the start time of the current object.
**Returns:**

Start time of the current object.

## getEndTime

public long getEndTime()
Obtains the end time of the current object.
**Returns:**

End time of the current object.

## setType

public void setType(int type)
Sets the type of the current object.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| type | Type. |

## getType

public int getType()
Obtains the type of the current object.
**Returns:**

Type of the current object.

## getSourceDevice

public [HiHealthDeviceInfo](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdeviceinfo-0000001071819167-V5) getSourceDevice()
Obtains the device information of the current object.
**Returns:**

Device information of the current object.

## setSourceDevice

public void setSourceDevice([HiHealthDeviceInfo](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdeviceinfo-0000001071819167-V5) device)
Sets the device information of the current object.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| device | Device information. |
