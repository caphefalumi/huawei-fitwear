<!--
  Title: WearEngineException
  Catalog: connectivity-References
  Document ID: wearengineexception-0000001060099081
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/wearengineexception-0000001060099081
-->
# WearEngineException

| java.lang.Object \|---java.lang.Throwable \|---\|---java.lang.Exception \|---\|---\|---java.lang.RuntimeException \|---\|---\|---\|---com.huawei.wearengine.WearEngineException 
```
public class WearEngineException
extends java.lang.RuntimeException
```
 |
| --- |

It is the Wear Engine exception description class.

#### Constructor Summary

| Constructor and Description |
| --- |
| [WearEngineException](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineexception-0000001060099081#EN-US_TOPIC_0000001919950761__WearEngineException-int-)(int errorCode) Indicates Wear Engine exception constructor function. |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| int | [getErrorCode](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineexception-0000001060099081#EN-US_TOPIC_0000001919950761__getErrorCode--)() Obtains the error code. |

#### Constructor Detail

## WearEngineException

public WearEngineException(int errorCode)

It indicates Wear Engine exception constructor function.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| errorCode | Wear Engine error code. For details, see [WearEngineErrorCode](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969). |

**Since:**

API level 0 (SDK 5.0.0.301)

#### Method Detail

## getErrorCode

public int getErrorCode()

It obtains the error code.

**Returns:**

Wear Engine error code. For details, see [WearEngineErrorCode](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969).

**Since:**

API level 0 (SDK 5.0.0.301)
