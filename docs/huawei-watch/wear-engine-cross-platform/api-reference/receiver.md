<!--
  Title: Receiver
  Catalog: connectivity-References
  Document ID: receiver-0000001060460920
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/receiver-0000001060460920
-->
# Receiver

| 
```
public interface Receiver
```
 |
| --- |

It is the monitoring API for P2P communication.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| void | [onReceiveMessage](https://developer.huawei.com/consumer/en/doc/connectivity-References/receiver-0000001060460920#EN-US_TOPIC_0000001874111202__onReceiveMessage-com_huawei_wearengine_p2p_Message-)([Message](https://developer.huawei.com/consumer/en/doc/connectivity-References/message-0000001059781033) message) Indicates the callback function for monitoring P2P communication. |

#### Method Detail

## onReceiveMessage

void onReceiveMessage([Message](https://developer.huawei.com/consumer/en/doc/connectivity-References/message-0000001059781033) message)

It is the callback function for monitoring P2P communication.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| message | Message object sent from the phone |

**Since:**

API level 2 (SDK 5.0.1.300)
