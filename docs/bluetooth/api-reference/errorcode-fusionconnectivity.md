<!--
  Title: Error Codes of the Converged Short-Range Service Subsystem
  Catalog: harmonyos-references
  Document ID: errorcode-fusionconnectivity
  Updated: 2026-10-14 09:42:49
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-fusionconnectivity
-->
# Error Codes of the Converged Short-Range Service Subsystem

> **Note:** This topic describes only module-specific error codes. For details about universal error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

#### 34900001 Device Not Registered

**Error Message**

The device is not bound.

**Description**

The device is not registered.

**Possible Causes**

The application does not call [bindDevice](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-partneragent#partneragentbinddevice) to register the device.

**Solution**

Call [bindDevice](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-partneragent#partneragentbinddevice) to register the device.

#### 34900003 Device Not Paired

**Error Message**

The device is not paired.

**Description**

The device is not paired.

**Possible Causes**

The device registered by the application is not paired via Bluetooth.

**Solution**

Perform the Bluetooth pairing process.

#### 34900004 Device Address Registered

**Error Message**

The device address has already been bound with PartnerAgentExtensionAbility.

**Description**

The device address has been bound to a [PartnerAgentExtensionAbility](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-partneragentextensionability).

**Possible Causes**

The application registers the same address again.

**Solution**

Call [unbindDevice](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-partneragent#partneragentunbinddevice) to deregister the current device and then registers the new ability of [bindDevice](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-partneragent#partneragentbinddevice).

#### 34900005 Bluetooth Disabled

**Error Message**

Bluetooth disabled.

**Description**

Bluetooth is disabled.

**Possible Causes**

Bluetooth is disabled.

**Solution**

Enable Bluetooth.

#### 34900050 Device Has Not Initiated Ranging

**Error Message**

The device has not initiated ranging.

**Description**

The device has not initiated ranging.

**Possible causes**

The device has not initiated ranging. For example, [stopRanging](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-ranging#rangingstopranging) is called without [startRanging](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-ranging#rangingstartranging) being called first.

**Solution**

You are advised to call [startRanging](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-ranging#rangingstartranging) to start ranging before performing subsequent operations.

#### 34900051 Device Has Initiated Ranging

**Error Message**

The device has already initiated ranging.

**Description**

The device has initiated ranging.

**Possible causes**

The device has initiated ranging. For example, [startRanging](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-ranging#rangingstartranging) is called repeatedly for the same device without calling [stopRanging](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-ranging#rangingstopranging) to stop the previous ranging first.

**Solution**

You are advised not to initiate ranging repeatedly. You can call [stopRanging](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-ranging#rangingstopranging) to stop the ranging and then call [startRanging](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-ranging#rangingstartranging) again to initiate ranging.

#### 34900052 Specified Ranging Service Unsupported

**Error Message**

The specified ranging service is not supported.

**Description**

The specified type of ranging service is not supported.

**Possible causes**

The specified ranging service is not supported. For example, the input ranging type is not within the specified range, or the specified ranging type is not supported on the device.

**Solution**

This type of service does not support ranging. Use a valid ranging type by referring to [RangingTypes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-ranging#rangingtypes).

#### 34900053 Ranging Service Disabled

**Error Message**

The ranging service is disabled.

**Description**

The ranging service is disabled.

**Possible causes**

The ranging service is disabled. For example, the ranging service is not enabled or has been disabled, and the ranging operation cannot be started.

**Solution**

It is recommended that the user enable the service before starting ranging.

#### 34900054 Invalid Parameters

**Error Message**

The parameter value does not meet specifications.

**Description**

The parameters do not meet the service specifications.

**Possible causes**

The parameters do not meet the service specifications. For example, the device ID is not in the format of xx:xx:xx:xx:xx:xx (hexadecimal).

**Solution**

Check whether the input parameters meet the service requirements.

#### 34900099 Operation Failed

**Error Message**

Operation failed.

**Description**

The operation fails.

**Possible Causes**

The current operation fails due to system reasons.

**Solution**

Retry the operation.
