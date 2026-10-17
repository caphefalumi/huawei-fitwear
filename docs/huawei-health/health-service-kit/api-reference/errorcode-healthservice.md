<!--
  Title: ArkTS API Error Codes
  Catalog: harmonyos-references
  Document ID: errorcode-healthservice
  Updated: 2026-10-14 09:35:27
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice
-->
# ArkTS API Error Codes

For details about the following authorization-related error codes, please refer to [Account Kit ArkTS Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-account-kit).

| **Name** | **Value** | **Description** |
| --- | --- | --- |
| PACKAGE_FINGERPRINT_CHECK_ERROR | [1001500001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-account-kit#section1001500001-app-certificate-fingerprint-verification-failure) | The certificate fingerprint of the app fails to be verified. |
| DUPLICATE_REQUEST_REJECTED | [1001500002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-account-kit#section1001500002-repeated-request) | Repeated request. No operation is needed to address this error code. Your app needs to implement tap control to prevent consecutive taps from initiating the same request. |
| ACCOUNT_NOT_LOGGED_IN | [1001502001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-account-kit#section1001502001-user-has-not-signed-in-to-huawei-id) | No HUAWEI ID is signed in. |
| APP_NOT_AUTHORIZED | [1001502002](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-account-kit#section1001502002-app-not-authorized) | The app is not authorized. |
| PARAMETER_INVALID | [1001502003](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-account-kit#section1001502003-invalid-input-parameter-value) | Invalid parameters. |
| NETWORK_ERROR | [1001502005](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-account-kit#section1001502005-network-error) | Network error. |
| INTERNAL_ERROR | [1001502009](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-account-kit#section1001502009-internal-error) | Internal errors, such as Account Kit server errors. |
| USER_CANCELED | [1001502012](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-account-kit#section1001502012-authorization-revoked) | The user revokes authorization. |
| SCOPE_OR_PERMISSION_NOT_REQUESTED | [1001502014](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-account-kit#section1001502014-required-scopes-or-permissions-not-requested) | The app does not have the required scopes or permissions. |

#### 1002700001 Internal System Error

**Error Message**

System internal error.

**Error Description**

Internal system error.

**Possible Causes**

Unknown.

**Solution**

Resolve the issue for the specific scenario based on the actual error message. If the error persists, [submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/). Huawei will get back to you as soon as possible.

#### 1002700002 Database Error

**Error Message**

Database processing error.

**Error Description**

The database is abnormal.

**Possible Causes**

Unknown.

**Solution**

Restart the device and try again. If the error persists, [submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/). Huawei will get back to you as soon as possible.

#### 1002701001 Network Error

**Error Message**

Network error. The network is unavailable.

**Error Description**

A network error occurs.

**Possible Causes**

The network is not connected.

**Solution**

- Check the network configurations.
- [Submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/). Huawei will get back to you as soon as possible.

#### 1002702001 Not Signed In

**Error Message**

Account error. The user has not logged in with HUAWEI ID.

**Error Description**

You have not signed in with an account.

**Possible Causes**

You have not signed in with an account.

**Solution**

- Start sign-in authorization by referring to [Managing User Authorization](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-add-permissions). After signing in, call the API again.
- [Submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/). Huawei will get back to you as soon as possible.

#### 1002702002 Account Exception

**Error Message**

Account error. Failed to obtain account information with HUAWEI ID.

**Error Description**

Account exception.

**Possible Causes**

Account exception.

**Solution**

Restart the device and try again. If the error persists, [submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/). Huawei will get back to you as soon as possible.

#### 1002703001 Privacy Agreement Not Agreed To

**Error Message**

User privacy is not agreed.

**Error Description**

The user does not agree to the privacy agreement.

**Possible Causes**

The user has never started the Huawei Health app.

**Solution**

Instruct the user to start the Huawei Health app. For details, please refer to [FAQs](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-faqs).

#### 1009104001 Linking Service Enabled

**Error Message**

Sport service busy. Workout is already started by other application.

**Error Description**

The linking service is enabled.

**Possible Causes**

The app or other apps have called **start** to enable the linking service.

**Solution**

- Check whether the linking service is repeatedly enabled in the service process.
- Capture exception handling scenarios where the linking service is enabled for other apps.

#### 1009104002 Workout Type Not Supported

**Error Message**

Unsupported sport type.

**Error Description**

The workout type is not supported.

**Possible Causes**

An unsupported workout type is passed.

**Solution**

Check the passed workout type. For details, please refer to [Exercise Record Type Constant](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-exercisesequencehelper).

#### 1009104003 Illegal Command

**Error Message**

Illegal command.

**Error Description**

The command is illegal in the current state.

**Possible Causes**

- The API is called at a wrong time. The linking service has been enabled for other apps.
- The API is called at a wrong time. The linking service is not enabled.
- The API is called at a wrong time. The linking service is not complete.

**Solution**

- Check the service process of the app.
- Capture exception handling scenarios where the linking service is enabled for other apps.
- Select a proper time to call the API.

#### 1009104004 Permission Verification Error

**Error Message**

Permission verification error. Application has no permission, such as Motion Permission.

**Error Description**

The app does not have the required permissions, for example, the physical activity permission.

**Possible Causes**

The app does not have the required permissions.

**Solution**

Check whether the app has the required permission to call the API.

#### 1009104005 Failed to Load the Dynamic Library

**Error Message**

Failed to load the dynamic library.

**Error Description**

Failed to load the dynamic library.

**Possible Causes**

The dynamic library file does not exist or a dynamic library has been loaded.

**Solution**

- Check whether the input path for loading is correct.
- Call the [load](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutload) function and check whether this error code is returned. If so, the dynamic library has been loaded. In this case, call the [unload](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutunload) function to uninstall the dynamic library.

#### 1009104006 Failed to Uninstall the Dynamic Library

**Error Message**

Failed to unload the dynamic library.

**Error Description**

Failed to uninstall the dynamic library.

**Possible Causes**

The dynamic library has been uninstalled.

**Solution**

- Check whether the input path for **unload** is correct.
- Call the [unload](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutunload) function and check whether this error code is returned. If so, the dynamic library has been uninstalled. If not, the dynamic library is successfully uninstalled.

#### 1009104999 Universal Error Code

**Error Message**

System internal error.

**Error Description**

An unknown exception occurred.

**Possible Causes**

Others.

**Solution**

Resolve the issue for the specific scenario based on the actual error message. If the error persists, [submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/). Huawei will get back to you as soon as possible.

#### 14500101 Service Exception

**Error Message**

Service exception.

**Error Description**

Service exception.

**Possible Causes**

Unknown.

**Solution**

Restart the device and try again. [Submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/). Huawei will get back to you as soon as possible.

#### Health Service Kit Call Failure with Error Code 201

Error code 201 is a [universal error code](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal#section201-permission-denied), indicating that the parameter check fails.

Error code 201 returned by Health Service Kit indicates an authentication failure, which may be caused by the following:

**Possible Causes**

- The app fingerprint is incorrectly configured.
- Insufficient permission.
- Some APIs can be called only by users in the trustlist.
- The number of test users has reached the upper limit.

**Solution**

- Check the fingerprint certificate of the app in AppGallery Connect. For details, please refer to [Adding a Public Key Fingerprint](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/application-dev-overview#conditionally-mandatory-adding-a-public-key-fingerprint).
- Ensure that the user has been granted related permissions. For details, please refer to [Managing User Authorization](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-add-permissions).
- Complete the app acceptance process in the console by referring to [Applying for Verification](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-verification) if the user's application for being a test user failed.
- [Submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/). Huawei will get back to you as soon as possible.
