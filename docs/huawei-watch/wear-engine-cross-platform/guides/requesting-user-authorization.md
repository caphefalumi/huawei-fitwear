<!--
  Title: Requesting User Authorization
  Catalog: connectivity-Guides
  Document ID: requesting-user-authorization-0000001050819181
  Updated: 2025-10-31 01:20:05
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/requesting-user-authorization-0000001050819181
-->
**
# Requesting User Authorization

To protect user privacy, the Wear Engine APIs need user authorization to work. It is recommended that you perform the operations in this section when users call the Wear Engine open capabilities for the first time.

#### Querying User Authorization Results

Check whether a user has granted permissions for your app. If not, request authorization from the user again by referring to [Applying for Wearable Device Permissions](#section7157142771512).

If the user is using the HUAWEI Health app version 11.0.3.512 or later and has not granted permissions for your app, your app will be granted the [NOTIFY](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#EN-US_TOPIC_0000001874111234__NOTIFY) (message notification) and [DEVICE_MANAGER](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#EN-US_TOPIC_0000001874111234__DEVICE_MANAGER) (basic device information) permissions by default. You are advised to use this API to check whether the required permissions have been granted before requesting user authorization.

> **Note:** Ensure that the permissions requested have been approved after you [apply for the Wear Engine service](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982). Otherwise, error code 8 will be returned.

- Call the [getAuthClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getAuthClient-android_content_Context-) method of [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [AuthClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/authclient-0000001059980967) object.
- Call the [checkPermission](https://developer.huawei.com/consumer/en/doc/connectivity-References/authclient-0000001059980967#EN-US_TOPIC_0000001919950749__checkPermission-com_huawei_wearengine_auth_Permission-) method to check whether the permission is granted, or call the [checkPermissions](https://developer.huawei.com/consumer/en/doc/connectivity-References/authclient-0000001059980967#EN-US_TOPIC_0000001919950749__checkPermissions-com_huawei_wearengine_auth_Permission:A-) method to check whether a group of permissions are granted. 
```cpp
// Step 1: Obtain the AuthClient object.
AuthClient authClient = HiWear.getAuthClient(this);

// Step 2: Call the checkPermission method to check whether the permission is granted.
authClient.checkPermission(Permission.DEVICE_MANAGER).addOnSuccessListener(new OnSuccessListener<Boolean>() {
    @Override
    public void onSuccess(Boolean aBoolean) {
        // Return whether the permission is granted. The value true indicates that the permission is granted, and the value false indicates that the permission is not granted.
    }
}).addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(Exception e) {
        // Failed to call the API.
    }
});

// Call the checkPermissions method to check whether a group of permissions are granted.
Permission[] permissions = {Permission.DEVICE_MANAGER,Permission.NOTIFY};
authClient.checkPermissions(permissions).addOnSuccessListener(new OnSuccessListener<Boolean[]>() {
    @Override
    public void onSuccess(Boolean[] booleans) {
        // Return whether the group of permissions are granted. The value true indicates that the permissions are granted, and the value false indicates that the permissions are not granted. The value will be returned based on the query sequence.
    }
}).addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(Exception e) {
        // Failed to call the API.
    }
});
```

#### Applying for Wearable Device Permissions
Figure 1 **Requesting user authorization

- Call the [getAuthClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getAuthClient-android_content_Context-) method of [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [AuthClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/authclient-0000001059980967) object.
- Define the callback object **authCallback** authorized by the user.
- Call the [requestPermission](https://developer.huawei.com/consumer/en/doc/connectivity-References/authclient-0000001059980967#EN-US_TOPIC_0000001919950749__requestPermission-com_huawei_wearengine_auth_AuthCallback-com_huawei_wearengine_auth_Permission___-) method to request permissions from the user. After this API is called, the user will be prompted with the authorization screen and asked to grant the corresponding permissions. The API can be used only after the user permission is granted. Otherwise, error code **9** will be returned. > **Note:** Ensure that the permissions requested have been approved after you [apply for the Wear Engine service](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982). Otherwise, error code **8** will be returned. This function can be called for multiple times. If a requested permission has been granted, the authorization screen will not be displayed and the API will return the granted permission. Obtain the permission required by your app based on the [Permission](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005) object in the input parameter. For details about the types of permissions to be applied for, refer to [Required Permissions](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982#EN-US_TOPIC_0000001873951218__table99191256194614). Use the [AuthCallback](https://developer.huawei.com/consumer/en/doc/connectivity-References/authcallback-0000001059850647) object to return the user authorization result. **onOk** indicates that callback function returns a list of permissions granted by the user. **onCancel** indicates that the authorization is canceled. 
```cpp
// Step 1: Obtain the AuthClient object.
// "this" indicates the Context object of the app.
AuthClient authClient = HiWear.getAuthClient(this);

// Step 2: Define the callback object for user authorization.
AuthCallback authCallback = new AuthCallback() {
    @Override
    public void onOk(Permission[] permissions) {
        // Return a list of permissions granted by the user.
    }
    @Override
    public void onCancel() {
        // User cancels the authorization.
    }
};

// Step 3: Request the user to grant specified permissions (for example, DEVICE_MANAGER).
authClient.requestPermission(authCallback, Permission.DEVICE_MANAGER)
    .addOnSuccessListener(new OnSuccessListener<Void>() {
        @Override
        public void onSuccess(Void successVoid) {
           // The request authorization task is successfully executed.
        }
    })
    .addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
             // The request authorization task fails to be executed.
        }
    });

// Note: You can apply for multiple permissions at a time. Use commas (,) to separate multiple permissions, for example, authClient.requestPermission(authCallback, Permission.DEVICE_MANAGER, Permission.NOTIFY, other permissions).
// Note: After this API is called, the user will be prompted with the authorization screen and asked to grant the corresponding permissions.
```
