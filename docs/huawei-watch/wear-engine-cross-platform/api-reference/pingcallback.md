<!--
  Title: PingCallback
  Catalog: connectivity-References
  Document ID: pingcallback-0000001060938728
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/pingcallback-0000001060938728
-->
# PingCallback

| 
```
public interface PingCallback
```
 |
| --- |

It is the callback API of ping messages.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| void | [onPingResult](https://developer.huawei.com/consumer/en/doc/connectivity-References/pingcallback-0000001060938728#EN-US_TOPIC_0000001874111258__onPingResult-int-)(int errCode) Indicates the callback function of the result of the ping message. |

#### Method Detail

## onPingResult

void onPingResult(int errCode)

It indicates the callback function of the result of the ping message.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| errCode | Ping result. For details, see [WearEngineErrorCode](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969). |

**Since:**

API level 0 (SDK 5.0.0.301)
