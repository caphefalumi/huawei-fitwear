<!--
  Title: ArkTS API Error Codes
  Catalog: harmonyos-references
  Document ID: errorcode-wearengine
  Updated: 2026-10-14 09:41:37
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-wearengine
-->
# ArkTS API Error Codes

> **Note:** This section describes only module-specific error codes. For details about universal error codes, please refer to [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

#### 1008500001 Network Error

**Error Message**

Network error. The network is unavailable.

**Error Description**

Network error.

**Possible Causes**

The network is not connected.

**Solution**

- Check the network configurations.
- [Submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/). Huawei will get back to you as soon as possible.

#### 1008500002 No Linked Device

**Error Message**

No device is bound.

**Error Description**

No device is linked.

**Possible Causes**

No wearable device is connected to the phone.

**Solution**

- Check whether the device is correctly connected to the phone.
- [Submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/). Huawei will get back to you as soon as possible.

#### 1008500003 Device Not Connected

**Error Message**

Device disconnected.

**Error Description**

The device is not connected.

**Possible Causes**

- The Bluetooth connection between the phone and the device is disconnected.
- The device disconnects from the Huawei Health app.

**Solution**

- Check whether Bluetooth is enabled on both the phone and the device.
- Check whether the device has been linked and connected via the Huawei Health app.
- [Submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/). Huawei will get back to you as soon as possible.

#### 1008500004 Wear Engine Service Not Applied For

**Error Message**

App has not applied for the Wear Engine service.

**Error Description**

The phone-side app has not applied for the Wear Engine service.

**Possible Causes**

- The compatibility option is not enabled during the Wear Engine service application process.
- You have not applied for the Wear Engine service on HUAWEI Developers.

**Solution**

- Sign in to HUAWEI Developers and [apply for integrating Wear Engine](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply). Select the compatibility option.
- [Submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/). Huawei will get back to you as soon as possible.

#### 1008500005 User Authorization Not Granted

**Error Message**

The HUAWEI ID is not authorized.

**Error Description**

The HUAWEI ID fails to be authenticated.

**Possible Causes**

The permission required by the API is not granted by the user.

**Solution**

Ensure that the user has granted related permissions. For details, please refer to [Requesting User Authorization](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/request_user_authorization).

#### 1008500006 Privacy Statement Not Agreed To

**Error Message**

User privacy is not agreed.

**Error Description**

The user does not agree to the privacy statement of the Huawei Health app.

**Possible Causes**

The user has never started the Huawei Health app.

**Solution**

Instruct the user to start the Huawei Health app and agree to the privacy statement.

#### 1008500007 Capability Not Supported on the Wearable Device

**Error Message**

The device capability is not supported.

**Error Description**

Capability not supported on the wearable device.

**Possible Causes**

The wearable device does not support the capabilities required to successfully call the current API.

**Solution**

Check the supported device capabilities.

#### 1008500008 Account Not Signed In

**Error Message**

Account error. The user has not logged in with HUAWEI ID.

**Error Description**

The account is not signed in.

**Possible Causes**

The account is not signed in.

**Solution**

Call the API again after the user signs in to their HUAWEI ID.

#### 1008500009 Account Error

**Error Message**

Account error. Failed to obtain account information with HUAWEI ID.

**Error Description**

Account error.

**Possible Causes**

The HUAWEI ID is registered outside the Chinese mainland.

**Solution**

Guide users to sign in with a HUAWEI ID registered in the Chinese mainland and try again.

#### 1008500010 Invalid Device ID

**Error Message**

Device ID is invalid.

**Error Description**

Invalid device ID.

**Possible Causes**

- An incorrect device ID is passed.
- An expired device ID is passed.

**Solution**

Call [getConnectedDevices](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#getconnecteddevices) to obtain the device ID again.

#### 1008500011 Invalid File

**Error Message**

File is invalid.

**Error Description**

Invalid file.

**Possible Causes**

The input file is invalid.

**Solution**

- Check whether the file path is valid.
- Check whether the file exists.

#### 1008500012 Too Many Callbacks

**Error Message**

Too many callbacks of the same type.

**Error Description**

Too many callbacks.

**Possible Causes**

Too many callbacks of the same type are registered.

**Solution**

Unsubscribe from events that you no longer need to subscribe to.

#### 1008509999 Internal Error

**Error Message**

Internal error.

**Error Description**

Internal error.

**Possible Causes**

- The app information, such as the signature certificate, does not match that on the cloud.
- Incorrect [randomId](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#device).
- **clientId** has not been configured in the app's metadata.
- The certificate fingerprint has not been uploaded to AppGallery Connect, the uploaded fingerprint is incorrect, or the uploaded fingerprint has not taken effect.
- An unknown error has occurred in the Wear Engine service.

**Solution**

- Verify that the app information such as the signature certificate matches that on HUAWEI Developers.
- Disconnect and then reconnect the device.
- Configure [clientId](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/configuration_client_id) in metadata.
- Ensure that the official certificate fingerprint is uploaded to AppGallery Connect. The fingerprint will take effect within 24 hours after being uploaded.
- [Submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/). Huawei will get back to you as soon as possible.
