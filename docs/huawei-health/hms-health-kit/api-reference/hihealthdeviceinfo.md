<!--
  Title: HiHealthDeviceInfo
  Catalog: HMSCore-References-V5
  Document ID: hihealthdeviceinfo-0000001071819167-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdeviceinfo-0000001071819167-V5
-->
# HiHealthDeviceInfo

| java.lang.Object \|---com.huawei.hihealth.device.HiHealthDeviceInfo 
```
public class HiHealthDeviceInfo
extends java.lang.Object
```
 |
| --- |
 Device information class.
#### Constructor Summary

| Constructor and Description |
| --- |
| [HiHealthDeviceInfo](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdeviceinfo-0000001071819167-V5#EN-US_TOPIC_0000001136869917__s1b442720a5524be2b2661433aa28baf9)(java.lang.String deviceUniqueCode, java.lang.String deviceName, java.lang.String deviceModel) Constructor with three parameters: **deviceUniqueCode**, **deviceName**, and **deviceModel**. |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| java.lang.String | [getDeviceModel](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdeviceinfo-0000001071819167-V5#EN-US_TOPIC_0000001136869917__getDeviceModel--)() Obtains the device mode. |
| java.lang.String | [getDeviceName](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdeviceinfo-0000001071819167-V5#EN-US_TOPIC_0000001136869917__getDeviceName--)() Obtains the device name. |
| java.lang.String | [getDeviceUniqueCode](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdeviceinfo-0000001071819167-V5#EN-US_TOPIC_0000001136869917__getDeviceUniqueCode--)() Obtains the device unique ID. |

#### Constructor Detail

## HiHealthDeviceInfo

public HiHealthDeviceInfo(java.lang.String deviceUniqueCode, java.lang.String deviceName, java.lang.String deviceModel)
Constructor of three parameters: **deviceUniqueCode**, **deviceName**, and **deviceModel**.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| deviceUniqueCode | Device unique ID. |
| deviceName | Device name. |
| deviceModel | Device mode. |

#### Method Detail

## getDeviceUniqueCode

public java.lang.String getDeviceUniqueCode()
Obtains the device unique ID.
**Returns:**

Device unique ID.

## getDeviceName

public java.lang.String getDeviceName()
Obtains the device name.
**Returns:**

Device name.

## getDeviceModel

public java.lang.String getDeviceModel()
Obtains the device mode.
**Returns:**

Device mode.
