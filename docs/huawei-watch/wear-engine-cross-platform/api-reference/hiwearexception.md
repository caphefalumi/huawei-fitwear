<!--
  Title: HiWearException
  Catalog: connectivity-References
  Document ID: hiwearexception-0000001059517248
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/hiwearexception-0000001059517248
-->
# HiWearException

java.lang.Object

|---java.lang.Throwable

|---|---java.lang.Exception

|---|---|---java.lang.RuntimeException

|---|---|---|---com.huawei.watch.kit.hiwear.HiWearException

```
public class HiWearException
extends java.lang.RuntimeException
```

It is the Wear Engine exception description class.

#### Constructor Summary

| Constructor and Description |
| --- |
| [HiWearException](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearexception-0000001059517248#EN-US_TOPIC_0000001920110357__HiWearException-int-)(int code) Indicates a constructor function of Wear Engine exceptions. |
| [HiWearException](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearexception-0000001059517248#EN-US_TOPIC_0000001920110357__HiWearException-java_lang_String-)(java.lang.String message) Indicates a constructor function of Wear Engine exceptions. |

#### Method Summary

| Methods inherited from class java.lang.Throwable |
| --- |
| addSuppressed, fillInStackTrace, getCause, getLocalizedMessage, getMessage, getStackTrace, getSuppressed, initCause, printStackTrace, printStackTrace, printStackTrace, setStackTrace, toString |
   
| Methods inherited from class java.lang.Object |
| --- |
| clone, equals, finalize, getClass, hashCode, notify, notifyAll, wait, wait, wait |

#### Constructor Detail

## HiWearException

public HiWearException(java.lang.String message)

It is a constructor function of Wear Engine exceptions.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| message | Exception description. |

## HiWearException

public HiWearException(int code)

It is a constructor function of Wear Engine exceptions.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| code | Exception code. |
