<!--
  Title: SendCallback
  Catalog: connectivity-References
  Document ID: sendcallback-0000001059290639
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/sendcallback-0000001059290639
-->
# SendCallback

| 
```
public interface SendCallback
```
 |
| --- |

It is the callback API used for sending messages.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| void | [onSendProgress](https://developer.huawei.com/consumer/en/doc/connectivity-References/sendcallback-0000001059290639#EN-US_TOPIC_0000001874111262__onSendProgress-long-)(long count) Indicates the callback function for the message sending progress. |
| void | [onSendResult](https://developer.huawei.com/consumer/en/doc/connectivity-References/sendcallback-0000001059290639#EN-US_TOPIC_0000001874111262__onSendResult-int-)(int errCode) Indicates the callback function for the message sending result. |

#### Method Detail

## onSendResult

void onSendResult(int errCode)

It indicates the callback function for the message sending result.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| errCode | Result code. For details, see [WearEngineErrorCode](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969). |

**Since:**

API level 0 (SDK 5.0.0.301)

## onSendProgress

void onSendProgress(long count)

It indicates the callback function for the message sending progress.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| count | Progress value |

**Since:**

API level 0 (SDK 5.0.0.301)
