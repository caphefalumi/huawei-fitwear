<!--
  Title: Signing In and Applying for Permissions
  Catalog: HMSCore-Guides-V5
  Document ID: requesting-user-authorization-0000001071733944-V5
  Updated: 2021-06-25 09:20:14
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/requesting-user-authorization-0000001071733944-V5
-->
# Signing In and Applying for Permissions

Your app calls the related APIs to display the HUAWEI ID sign-in screen and authorization screen. Your app can only access data upon user authorization. The user can select the data types to be authorized and grant only some data permissions. The data that your app can access is within the range of data approved by the Health app and also within the scope granted by the user.

- Sign in via HMS Core SDK and apply for the scope to obtain the permissions to access the Health Kit APIs. Different scopes require different permissions. You can apply for permissions based on service requirements. For details about the mapping between scopes and permissions, see the [scope list](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/scope-0000001053805684-V5). 
```cpp
/**
 * Sign-in and authorization method. The authorization screen will display if the current account has not granted authorization.
 */
private void signIn() {
    Log.i(TAG, "begin sign in");
    List<Scope> scopeList = new ArrayList<>();

    // Add scopes to apply for. The following only shows an example. You need to add scopes according to your specific needs.
    // Includes step count (statistics and details), distance, calories, and medium- and high-intensity activities.
    scopeList.add(new Scope(HiHealthExtendScope.HEALTHKIT_EXTEND_SPORT_READ));

    // Includes the gender, date of birth, height, and weight.
    scopeList.add(new Scope(HiHealthExtendScope.HEALTHKIT_EXTEND_HEALTHBEHAVIOR_READ));

     // Includes TruSleep data such as sleep scores and sleep durations, as well as regular sleep data. Includes daily heart statistics and real-time heart measurement data.
    // Daily heart statistics include the heart rate range, resting heart rate, and heart rate details.
    // Real-time heart rate measurement data includes real-time heart rate and heart RR interval (RRI).
    scopeList.add(new Scope(HiHealthExtendScope.HEALTHKIT_EXTEND_HEARTHEALTHSLEEP_READ));

    // Configure authorization parameters.
    HuaweiIdAuthParamsHelper authParamsHelper = new HuaweiIdAuthParamsHelper(
        HuaweiIdAuthParams.DEFAULT_AUTH_REQUEST_PARAM);
    HuaweiIdAuthParams authParams = authParamsHelper.setIdToken()
        .setAccessToken()
        .setScopeList(scopeList)
        .createParams();

    // Initialize the HuaweiIdAuthService object.
    final HuaweiIdAuthService authService = HuaweiIdAuthManager.getService(this.getApplicationContext(),
        authParams);

    // Silent sign-in. If authorization has been granted by the current account, the authorization screen will not display. This is an asynchronous method.
    Task<AuthHuaweiId> authHuaweiIdTask = authService.silentSignIn();

    // Add the callback for the call result.
    authHuaweiIdTask.addOnSuccessListener(new OnSuccessListener<AuthHuaweiId>() {
        @Override
        public void onSuccess(AuthHuaweiId huaweiId) {
            // The silent sign-in is successful.
            Log.i(TAG, "silentSignIn success");
        }
    }).addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception exception) {
            // The silent sign-in fails. This indicates that the authorization has not been granted by the current account.
            if (exception instanceof ApiException) {
                ApiException apiException = (ApiException) exception;
                Log.i(TAG, "sign failed status:" + apiException.getStatusCode());
                Log.i(TAG, "begin sign in by intent");

                // Call the sign-in API using the getSignInIntent() method.
                Intent signInIntent = authService.getSignInIntent();

                // Display the authorization screen by using the startActivityForResult() method of the activity.
                // You can change HihealthKitMainActivity to the actual activity.
                HihealthKitMainActivity.this.startActivityForResult(signInIntent, REQUEST_SIGN_IN_LOGIN);
            }
        }
    });
}
```
 The following constants are used: 
```cpp
// Request code for displaying the authorization screen using the startActivityForResult method. The value can be customized.
private static final int REQUEST_SIGN_IN_LOGIN = 1002;
private static final String TAG = "HihealthKitMainActivity";
```

- Overwrite the **onActivityResult** method to handle the sign-in authorization result response.
```cpp
@Override
protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
    super.onActivityResult(requestCode, resultCode, data);

    // Handle the sign-in response.
    handleSignInResult(requestCode, data);
}

/**
 * Method of handling authorization result responses
 * 
 * @param requestCode Request code for displaying the authorization screen.
 * @param data Authorization result response.
 */
private void handleSignInResult(int requestCode, Intent data) {
    // Handle only the authorized responses.
    if (requestCode != REQUEST_SIGN_IN_LOGIN) {
        return;
    }

    // Obtain the authorization response from the intent.
    HuaweiIdAuthResult result = HuaweiIdAuthAPIManager.HuaweiIdAuthAPIService.parseHuaweiIdFromIntent(data);
    Log.d(TAG, "handleSignInResult status = " + result.getStatus() + ", result = " + result.isSuccess());
    if (result.isSuccess()) {
        Log.d(TAG, "sign in is success");
    }
}
```

- The authorization and sign-in method can be called using the **onCreate** method of the primary activity of the app. The method is called each time the app is stared to update the authorization information.
```cpp
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // The authorization and sign-in API is called each time the app is started.
    signIn();
}
```

- For details about the sign-in process, see [HUAWEI Account Kit Development Guide](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides/dev-guide-account-0000001050048888).
