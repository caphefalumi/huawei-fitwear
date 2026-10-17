<!--
  Title: (Optional) Adding Permissions
  Catalog: connectivity-Guides
  Document ID: adding-permissions-0000001064141094
  Updated: 2025-10-13 02:54:14
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/adding-permissions-0000001064141094
-->
**
# (Optional) Adding Permissions

When [sending files during app-to-app message communications](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/phone-send-message-0000001051059209#section17422551112517), the targetSdkVersion of your app is greater than or equal to 19 and meanwhile less than or equal to 29, and the files to be sent are not in the directory dedicated to the external storage app, you need to obtain the READ_EXTERNAL_STORAGE permission.

- Open the AndroidManifest.xml file. Figure 1 **The **AndroidManifest.xml** file**
- Add the read external storage permission for the app. 
```cpp
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```
 Figure 2 **Adding the read external storage permission** Note: In Android versions later than 13, the READ_EXTERNAL_STORAGE permission has expired. To read media files in external storage, you need to add the following three media permissions, and apply for the corresponding permissions: 
```cpp
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
```

- Open the code Java file and apply for the external storage permission in the code. For details, refer to the following example: 
```cpp
String[] permissionsStorage = {Manifest.permission.READ_EXTERNAL_STORAGE};
int requestExternalStorage = 1;
int permission = ActivityCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE);
if (permission != PackageManager.PERMISSION_GRANTED) {
    ActivityCompat.requestPermissions(this, permissionsStorage, requestExternalStorage);
}
```
 Figure 3 **Applying for the external storage permission
