<!--
  Title: Vibrator Error Codes
  Catalog: harmonyos-references
  Document ID: errorcode-vibrator
  Updated: 2026-10-14 09:42:34
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-vibrator
-->
# Vibrator Error Codes

> **Note:** This topic describes only module-specific error codes. For details about universal error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

#### 14600101 Device operation failed.

**Error Message**

Device operation failed.

**Description**

This error code is reported if the HDI service is abnormal or the device is occupied when the **startVibration** interface of the vibrator module is called.

**Possible Causes**

1.The HDI service is abnormal.

2.The device is occupied.

3.The system's haptic management switches are disabled when vibration is triggered.

**Solution**

1.Retry the operation at specified intervals or with exponentially increasing intervals. If the operation fails three consecutive times, stop retrying. You can also retrieve the vibrator list to verify device availability.

2.Set a higher priority for the vibrator.

3.Check whether the system's haptic switch is disabled or the three-state switch is in mute mode, and ensure that the usage field of the switch is correctly configured.
