<!--
  Title: PeerDeviceCallback
  Catalog: connectivity-References
  Document ID: peerdevicecallback-0000001192748042
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/peerdevicecallback-0000001192748042
-->
# PeerDeviceCallback

| 
```
public interface PeerDeviceCallback
```
 |
| --- |

Callback API for obtaining phone information.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| void | [onResult](#EN-US_TOPIC_0000001919950669__onResult-int-com_huawei_watch_kit_hiwear_peerdevice_PeerDevice-)(int errorCode, [PeerDevice](https://developer.huawei.com/consumer/en/doc/connectivity-References/peerdevice-0000001237467975) peerDevice) Returns the phone information object. |

#### Method Detail

## onResult

void onResult(int errorCode, [PeerDevice](https://developer.huawei.com/consumer/en/doc/connectivity-References/peerdevice-0000001237467975) peerDevice)

It is used to return the phone information object.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| errorCode | Result code. For details, refer to [HiWearErrorCode](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearerrorcode-0000001058717345). |
| peerDevice | Phone information object. |
