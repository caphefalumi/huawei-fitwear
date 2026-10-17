<!--
  Title: ResultCallback
  Catalog: HMSCore-References-V5
  Document ID: resultcallback-0000001071549451-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5
-->
# ResultCallback

| 
```
public interface ResultCallback
```
 |
| --- |

General callback.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| void | [onResult](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5#EN-US_TOPIC_0000001137232739__onResult-int-java_lang_Object-)(int resultCode, java.lang.Object detailInfo) General callback. |

#### Method Detail

## onResult

void onResult(int resultCode, java.lang.Object detailInfo)

General callback.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| resultCode | Status code (0: success; other values: failure) |
| detailInfo | Detailed description of the error. |
