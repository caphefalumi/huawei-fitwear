<!--
  Title: Adding Permissions
  Catalog: huaweihealth-Guides
  Document ID: add-permission-0000002338138528
  Updated: 2026-08-05 02:10:09
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/add-permission-0000002338138528
-->
# Adding Permissions

- Open the **AndroidManifest.xml** file and add permissions in the **application** section. 
```cpp
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.BLUETOOTH"
    tools:remove="android:maxSdkVersion" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN"
    tools:remove="android:maxSdkVersion" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```
 If your industry app needs to use the features of [Sending a File](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/send-file-0000002342776776) and [Adding Music to a Wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/add-music-to-device-0000002383970222), and read files from external storage, a read permission statement must be added. If the permission is not added, files will fail to be sent or music will fail to be added. (In Android 11 or later, this permission statement supports only access to shared media files in the external storage, including images, audio files, and video files.) 
```cpp
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```
 Note: In Android versions later than 13, the **READ_EXTERNAL_STORAGE** permission has expired. To read media files in external storage, you need to add the following three media permissions: 
```cpp
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
```
 If the target device of your industry app runs Android 10, and requires the [Sending a File](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/send-file-0000002342776776) and [Adding Music to a Wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/add-music-to-device-0000002383970222) features to read files from external storage, you are advised to add the following configuration: 
```cpp
android:requestLegacyExternalStorage="true"
```

- Dynamically apply for the location permissions **Manifest.permission.ACCESS_FINE_LOCATION** and **Manifest.permission.ACCESS_COARSE_LOCATION** in the project to ensure normal use of the Health Industry SDK's capabilities. The following is an example: 
```cpp
// Dynamically apply for ACCESS_FINE_LOCATION and ACCESS_COARSE_LOCATION.
String[] permissions = new String[] {Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}

// Check whether any required permission is lacking.
boolean isLackPermission = false;
for (String permission : permissions) {
    if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
        isLackPermission = true;
        break;
    }
}

// Apply for the permissions.
int permissionRequestCode = 10008;
if (isLackPermission) {
    ActivityCompat.requestPermissions(this, permissions, permissionRequestCode);
}
```
 If you wish to run your industry app on Android versions later than 12, dynamically apply for the Bluetooth permissions **Manifest.permission.BLUETOOTH_SCAN** and **Manifest.permission.BLUETOOTH_CONNECT** as well. If you need to use the features of [Sending a File](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/send-file-0000002342776776) and [Adding Music to a Wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/add-music-to-device-0000002383970222), and read files from external storage, the **Manifest.permission.READ_EXTERNAL_STORAGE** permission is also needed. (Note: In Android 11 or later, this permission statement supports only access to shared media files in the external storage, including images, audio files, and video files. In Android 13 or later, this permission is replaced by the **Manifest.permission.READ_MEDIA_IMAGES**, **Manifest.permission.READ_MEDIA_VIDEO**, **Manifest.permission.READ_MEDIA_AUDIO** permissions, and you need to dynamically apply for these permissions in the code.) If the permission is not obtained, files will fail to be sent or music will fail to be added.
- Apply for the **notification bar access** permission for your app to use the **notification push** feature. The following is an example: 
```cpp
private void checkStatusBarNotificationPermission(Context context) {
    if (checkStatusBarPermission()) {
        return;
    }
    // Apply for the notification bar access permission.
    try {
        Intent intent = new Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS");
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    } catch (ActivityNotFoundException e) {
        try {
            Intent intent = new Intent();
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            ComponentName cn = new ComponentName("com.android.settings",
                    "com.android.settings.Settings$NotificationAccessSettingsActivity");
            intent.setComponent(cn);
            intent.putExtra(":settings:show_fragment", "NotificationAccessSettings");
            context.startActivity(intent);
        } catch (Exception ex) {
            LogUtil.e(TAG, "request StatusBar Notification permission error." + ex);
        }
    }
}

// Check whether the current app has the permission to access the notification bar.
private boolean checkStatusBarPermission() {
    String pkgName = getPackageName();
    final String flat = Settings.Secure.getString(getContentResolver(), "enabled_notification_listeners");
    if (TextUtils.isEmpty(flat)) {
        return false;
    }
    final String[] names = flat.split(":");
    for (String name : names) {
        final ComponentName cn = ComponentName.unflattenFromString(name);
        if (cn != null && TextUtils.equals(pkgName, cn.getPackageName())) {
            return true;
        }
    }
    return false;
}
```

- Dynamically apply for the **calendar read and write** permissions and add them to **application** in the **AndroidManifest.xml** file, to use the **calendar synchronization** feature. The following is an example: 
```cpp
<!-- Add the permissions to application in the AndroidManifest.xml file. -->
<uses-permission android:name="android.permission.READ_CALENDAR" />
<uses-permission android:name="android.permission.WRITE_CALENDAR" />

// Dynamically apply for the READ_CALENDAR and WRITE_CALENDAR permissions.
// Add Manifest.permission.READ_CALENDAR and Manifest.permission.WRITE_CALENDAR to permissions by referring to the example in Step 2.
```
