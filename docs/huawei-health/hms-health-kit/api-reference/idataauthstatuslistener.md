<!--
  Title: IDataAuthStatusListener
  Catalog: HMSCore-References-V5
  Document ID: idataauthstatuslistener-0000001071321473-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/idataauthstatuslistener-0000001071321473-V5
-->
# IDataAuthStatusListener

| 
```
public interface IDataAuthStatusListener
```
 |
| --- |
 Callback for the authorization result.
#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| void | [onResult](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/idataauthstatuslistener-0000001071321473-V5#EN-US_TOPIC_0000001090122422__sb5bca8e06d234a2aa74d007b7f1296f6)(int errCode, java.lang.String errMsg, int[] writeList, int[] readList) Callback method. |

#### Method Detail

## onResult

void onResult(int errCode, java.lang.String errMsg, int[] writeList, int[] readList)
Callback methods.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| errCode | Result code. |
| errMsg | Error message. |
| writeList | Callback result for write permission authorization. |
| readList | Callback result for read permission authorization. |
