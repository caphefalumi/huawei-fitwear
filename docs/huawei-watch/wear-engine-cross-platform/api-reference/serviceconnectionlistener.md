<!--
  Title: ServiceConnectionListener
  Catalog: connectivity-References
  Document ID: serviceconnectionlistener-0000001060460910
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/serviceconnectionlistener-0000001060460910
-->
# ServiceConnectionListener

| 
```
public interface ServiceConnectionListener
```
 |
| --- |

API for listening for service connection status.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| void | [onServiceConnect](https://developer.huawei.com/consumer/en/doc/connectivity-References/serviceconnectionlistener-0000001060460910#EN-US_TOPIC_0000001873951326__onServiceConnect--)() Callback function of successful connection. |
| void | [onServiceDisconnect](https://developer.huawei.com/consumer/en/doc/connectivity-References/serviceconnectionlistener-0000001060460910#EN-US_TOPIC_0000001873951326__onServiceDisconnect--)() Callback function of disconnection. |

#### Method Detail

## onServiceConnect

void onServiceConnect()

Callback function of successful connection.

**Since:**

API level 0 (SDK 5.0.0.301)

## onServiceDisconnect

void onServiceDisconnect()

Callback function of disconnection.

**Since:**

API level 0 (SDK 5.0.0.301)
