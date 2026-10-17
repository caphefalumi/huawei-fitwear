<!--
  Title: MonitorData
  Catalog: connectivity-References
  Document ID: monitordata-0000001060779124
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/monitordata-0000001060779124
-->
# MonitorData

| java.lang.Object \|---com.huawei.wearengine.monitor.MonitorData 
```
public class MonitorData
extends java.lang.Object
implements android.os.Parcelable
```
 |
| --- |

It is used to convert the listened indicators to operable data, such as boolean, integer, string, and HashMap data.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| boolean | [asBool](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitordata-0000001060779124#EN-US_TOPIC_0000001920110433__asBool--)() Obtains boolean data. |
| int | [asInt](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitordata-0000001060779124#EN-US_TOPIC_0000001920110433__asInt--)() Obtains integer data |
| java.util.HashMap<java.lang.String,[MonitorData](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitordata-0000001060779124)> | [asMap](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitordata-0000001060779124#EN-US_TOPIC_0000001920110433__asMap--)() Obtains key-value pair data. |
| java.lang.String | [asString](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitordata-0000001060779124#EN-US_TOPIC_0000001920110433__asString--)() Obtains character data. |

#### Method Detail

## asBool

public boolean asBool()

It is used to obtain boolean data.

**Returns:**

Boolean value.

**Since:**

API level 0 (SDK 5.0.0.301)

## asInt

public int asInt()

It is used to obtain integer data.

**Returns:**

Integer value.

**Since:**

API level 0 (SDK 5.0.0.301)

## asString

public java.lang.String asString()

It is used to obtain string data.

**Returns:**

String value.

**Since:**

API level 0 (SDK 5.0.0.301)

## asMap

public java.util.HashMap<java.lang.String,[MonitorData](https://developer.huawei.com/consumer/en/doc/connectivity-References/monitordata-0000001060779124)> asMap()

It is used to obtain key-value pair data.

**Returns:**

Key-value pair.

**Since:**

API level 0 (SDK 5.0.0.301)
