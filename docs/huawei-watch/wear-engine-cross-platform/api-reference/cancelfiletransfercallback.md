<!--
  Title: CancelFileTransferCallBack
  Catalog: connectivity-References
  Document ID: cancelfiletransfercallback-0000001093458245
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/cancelfiletransfercallback-0000001093458245
-->
# CancelFileTransferCallBack

| 
```
public interface CancelFileTransferCallBack
```
 |
| --- |

It is the callback API for canceling sending files.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| void | [onCancelFileTransferResult](#section19719193003813)(int errCode) Callback function for canceling sending files. |

#### Method Detail

## onCancelFileTransferResult

void onCancelFileTransferResult(int errCode)

It is the callback function for sending messages.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| errCode | Result code. For details, see [WearEngineErrorCode](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969). |

**Since:**

API level 5 (SDK 5.0.1.301)
