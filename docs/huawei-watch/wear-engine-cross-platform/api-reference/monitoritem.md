<!--
  Title: MonitorItem
  Catalog: connectivity-References
  Document ID: monitoritem-0000001059433013
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/monitoritem-0000001059433013
-->
# MonitorItem

| java.lang.Object \|---com.huawei.wearengine.monitor.MonitorItem 
```
public class MonitorItem
extends java.lang.Object
implements android.os.Parcelable
```
 |
| --- |

It listens for the indicator objects of the device, such as the connection status between the device and the Huawei Health app.

#### Field Summary

| Modifier and Type | Field and Description |
| --- | --- |
| static [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) | [MONITOR_CHARGE_STATUS](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_CHARGE_STATUS) Indicates charging status. |
| static [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) | [MONITOR_ITEM_CONNECTION](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_ITEM_CONNECTION) Indicates the device connection status. |
| static [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) | [MONITOR_ITEM_HEART_RATE_ALARM](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_ITEM_HEART_RATE_ALARM) Indicates heart rate alarm. |
| static [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) | [MONITOR_ITEM_LOW_POWER](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_ITEM_LOW_POWER) Indicates low battery alarm which is reported once every 1% of the battery level is consumed. |
| static [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) | [MONITOR_ITEM_WEAR](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_ITEM_WEAR) Indicates wearing status. |
| static [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) | [MONITOR_POWER_STATUS](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__MONITOR_POWER_STATUS) Indicates battery level. |
| static [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) | [MONITOR_ITEM_POWER_MODE](#section1932264143916) Indicates the device mode. |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| java.lang.String | [getName](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__getName--)() Obtains the name of the indicator to be listened for. |
| void | [setName](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013#EN-US_TOPIC_0000001919950717__setName-java_lang_String-)(java.lang.String name) Sets name of the indicator to be listened for. |

#### Field Detail

## MONITOR_ITEM_CONNECTION

public static final [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) MONITOR_ITEM_CONNECTION

It indicates the connection state of a device.

When the status is monitored, the monitoring callback is returned. **2**: The connection is successful. **3**: The connection is disconnected. **4**: The connection fails. **5**: A wearable device has been unbound.

**Since:**

API level 0 (SDK 5.0.0.301)

## MONITOR_ITEM_WEAR

public static final [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) MONITOR_ITEM_WEAR

It indicates wearing status.

It supports query and result reporting. **1**: The user is wearing it. **2**: The user is not wearing it.

**Since:**

API level 2 (SDK 5.0.1.300)

## MONITOR_ITEM_LOW_POWER

public static final [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) MONITOR_ITEM_LOW_POWER

It indicates low battery alarm which is reported once every 1% of the battery level is consumed.

Only reporting is supported. For details, see [MONITOR_POWER_STATUS](#EN-US_TOPIC_0000001919950717__MONITOR_POWER_STATUS).

**Since:**

API level 2 (SDK 5.0.1.300)

## MONITOR_POWER_STATUS

public static final [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) MONITOR_POWER_STATUS

It indicates battery level.

Only the current battery level can be queried.

**Since:**

API level 2 (SDK 5.0.1.300)

## MONITOR_CHARGE_STATUS

public static final [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) MONITOR_CHARGE_STATUS

It indicates charging status.

It supports query and result reporting. **1**: Charging starts. **2**: Charging ends. **3**: Charging completes.

**Since:**

API level 2 (SDK 5.0.1.300)

## MONITOR_ITEM_HEART_RATE_ALARM

public static final [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) MONITOR_ITEM_HEART_RATE_ALARM

It indicates heart rate alarm.

Only reporting is supported. **1**: The resting heart rate is too high; **2**: The resting heart rate is too low; **3**: The heart rate is too high during exercise; **4**: The heart rate is too low during exercise; **5**: The heart rate during exercise exceeds the upper limit set on the wearable device and that set in the Huawei Health app. (**5** is reported if the upper limit set on the wearable device is lower than that set in the Huawei Health app.)

**Since:**

API level 2 (SDK 5.0.1.300)

## MONITOR_ITEM_POWER_MODE

public static final [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) MONITOR_ITEM_POWER_MODE

It indicates the device mode.

It supports query and result reporting. **–1**: The device does not support mode switching (this value is returned only when the device is queried). **0**: The device is in smart mode. **1**: The device is in ultra-long battery life mode.

**Since:**

API level 12 (SDK 5.0.3.301)

#### Method Detail

## setName

public void setName(java.lang.String name)

It is used to set the name of the indicator to be listened for.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| name | Name of the indicator to be listened for. |

**Since:**

API level 0 (SDK 5.0.0.301)

## getName

public java.lang.String getName()

It is used to obtain the name of the indicator to be listened for.

**Returns:**

Name of the indicator to be listened for.

**Since:**

API level 0 (SDK 5.0.0.301)
