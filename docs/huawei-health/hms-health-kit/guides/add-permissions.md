<!--
  Title: Signing In and Applying for Permissions
  Catalog: HMSCore-Guides-V5
  Document ID: add-permissions-0000001050069726-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/add-permissions-0000001050069726-V5
-->
# Signing In and Applying for Permissions

Your app calls to enable the authorization process. When the HUAWEI ID sign-in and authorization page is displayed, the user can grant the corresponding data access permissions. The user can select the data types to be authorized and grant only some data permissions. The data that your app can access is within the range of data approved by the Health app and also within the scope granted by the user.

If you want to access the Health app data, enable the Health app authorization process and guide the user to complete HUAWEI ID and Health app authorizations.

- Initialize [SettingController](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/settingcontroller-0000001050089660-V5) in the **onCreate** method of the main activity of the app and start the authorization process.
```cpp
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    initService();
    // Step 2 Authorization process, which is called each time the process is started.
    requestAuth();
}

/**
 * Initialize SettingController.
 */
private void initService() {
    HiHealthOptions fitnessOptions = HiHealthOptions.builder().build();
    AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(fitnessOptions);
    mSettingController = HuaweiHiHealth.getSettingController(this, signInHuaweiId);
}
```
 The variable defined here is as follows: 
```cpp
// SettingController object.
private SettingController mSettingController;
```

- Add the scope permission that needs to be applied for first. Use the [requestAuthorizationIntent](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/settingcontroller-0000001050089660-V5#EN-US_TOPIC_0000001053248363__section1098413278513) of **SettingController** to obtain the intent that integrates the scope authorization of the HUAWEI ID and the Health app authorization. Different scopes require different permissions. You can apply for permissions based on service requirements. For details about the mapping between scopes and permissions, see [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) in the *API Reference*. 
```cpp
/**
 * Declare the scope to be applied for and obtain the intent to start the authorization process. This method must be used in the activity.
 */
private void requestAuth() {
    // Add scopes to apply for. The following only shows an example. You need to add scopes according to your specific needs.
    String[] scopes = new String[] {
        // View and store the step count in Health Kit.
        Scopes.HEALTHKIT_STEP_READ, Scopes.HEALTHKIT_STEP_WRITE,
        // View and store the height and weight in Health Kit.
        Scopes.HEALTHKIT_HEIGHTWEIGHT_READ, Scopes.HEALTHKIT_HEIGHTWEIGHT_WRITE,
        // View and store the heart rate data in Health Kit.
        Scopes.HEALTHKIT_HEARTRATE_READ, Scopes.HEALTHKIT_HEARTRATE_WRITE};

    // Obtain the intent of the authorization process. The value true indicates that the authorization process of the Health app is enabled, and false indicates that the authorization process is disabled.
    Intent intent = mSettingController.requestAuthorizationIntent(scopes, true);

    // Open the authorization process screen.
    Log.i(TAG, "start authorization activity");
    startActivityForResult(intent, REQUEST_AUTH);
}
```
 The following constants are used: 
```cpp
// Request code for displaying the authorization screen using the startActivityForResult method. The value can be customized.
private static final int REQUEST_AUTH = 1002;
private static final String TAG = "HealthKitAuthActivity";
```

- Override the **onActivityResult** method to process the authorization process response result.
```cpp
@Override
protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
    super.onActivityResult(requestCode, resultCode, data);

    // Process only the response result of the authorization process.
    if (requestCode == REQUEST_AUTH) {
        // Obtain the authorization response result from the intent.
        HealthKitAuthResult result = mSettingController.parseHealthKitAuthResultFromIntent(data);
        if (result == null) {
            Log.w(TAG, "authorization fail");
            return;
        }

        if (result.isSuccess()) {
            Log.i(TAG, "authorization success");
        } else {
            Log.w(TAG, "authorization fail, errorCode:" + result.getErrorCode());
        }
    }
}
```
