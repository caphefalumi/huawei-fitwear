<!--
  Title: MonitorListener
  Catalog: connectivity-References
  Document ID: monitorlistener-0000001059850655
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/monitorlistener-0000001059850655
-->
# MonitorListener

| 
```
public interface MonitorListener
```
 |
| --- |

It is used to listen for event reporting.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| void | [onChanged](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitorlistener-0000001059850655#EN-US_TOPIC_0000001873951362__onChanged-int-com_huawei_wearengine_monitor_MonitorItem-com_huawei_wearengine_monitor_MonitorData-)(int errorCode, [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) monitorItem, [MonitorData](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitordata-0000001060779124) monitorData) Indicates the callback functions of the API used for listening for event reporting. |

#### Method Detail

## onChanged

void onChanged(int errorCode, [MonitorItem](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitoritem-0000001059433013) monitorItem, [MonitorData](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitordata-0000001060779124) monitorData)

It indicates the callback function of the API used for listening for event reporting.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| errorCode | Result codes. **0**: normal; Other values: abnormal. |
| monitorItem | Event information to be listened for. |
| monitorData | Returned data of the listened event. |

**Since:**

API level 0 (SDK 5.0.0.301)
