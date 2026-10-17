<!--
  Title: HiRealTimeListener
  Catalog: HMSCore-References-V5
  Document ID: hirealtimelistener-0000001072307792-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hirealtimelistener-0000001072307792-V5
-->
# HiRealTimeListener

| 
```
public interface HiRealTimeListener
```
 |
| --- |
 Real-time data callback.
#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| void | [onChange](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hirealtimelistener-0000001072307792-V5#EN-US_TOPIC_0000001090410570__onChange-int-java_lang_String-)(int errCode, java.lang.String value) Callback for real-time data changes. |
| void | [onResult](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hirealtimelistener-0000001072307792-V5#EN-US_TOPIC_0000001090410570__onResult-int-)(int errCode) Result callback method. |

#### Method Detail

## onResult

void onResult(int errCode)
Result callback.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| errCode | 0: success; other values: failure. |

## onChange

void onChange(int errCode, java.lang.String value)
Real-time workout data callback.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| errCode | 0: success; other values: failure. |
| value | Real-time heart rate data, in a JSON string. |
