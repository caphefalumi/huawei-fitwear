<!--
  Title: SettingController
  Catalog: HMSCore-References-V5
  Document ID: settingcontroller-0000001050089660-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/settingcontroller-0000001050089660-V5
-->
# SettingController

| Class Info |
| --- |
| public class SettingController Provides the setting-related functions. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| Task<DataType> | [addDataType](#EN-US_TOPIC_0000001053248363__section11286159181819)(DataTypeAddOptions options) Creates and adds a customized data type. |
| Task<Void> | [disableHiHealth](#EN-US_TOPIC_0000001053248363__section1514910116102)() Disables the Health Kit function. |
| Task<DataType> | [readDataType](#EN-US_TOPIC_0000001053248363__section14289189131815)(String dataTypeName) Reads the corresponding customized data type based on the data type name. |
| Task<Void> | [checkHealthAppAuthorization](#EN-US_TOPIC_0000001053248363__section1794720584164)() Checks the user's privacy authorization to Health Kit. If the authorization has not been granted, the user will be redirected to the authorization screen where they can authorize the Health app to open data to Health Kit. |
| Task<Boolean> | [getHealthAppAuthorization](#EN-US_TOPIC_0000001053248363__section153731436162416)() Checks the user privacy authorization to Health Kit. |
| Intent | [requestAuthorizationIntent](#EN-US_TOPIC_0000001053248363__section1098413278513)(String[] scopes, boolean enableHealthAuth) Obtains the intent of integrating the HUAWEI ID sign-in authorization process and Health app authorization process, and uses **startActivityForResult** to initiate the integrated authorization process. |
| HealthKitAuthResult | [parseHealthKitAuthResultFromIntent](#EN-US_TOPIC_0000001053248363__section034571712111)(Intent intent) Parses the authorization result from the intent returned in the sign-in authorization process. |

#### Public Methods

## addDataType(DataTypeAddOptions options)

| Method |
| --- |
| public Task<DataType> addDataType(DataTypeAddOptions options) Creates a customized data type. The name of the created data type must be prefixed with the package name of the app. Otherwise, the creation fails. |

**Parameters**

| Name | Description |
| --- | --- |
| options | Request options for creating the data type. |

**Return****s**

| Type | Description |
| --- | --- |
| Task<DataType> | Data type that is successfully created and added. |
  The sample code for creating and adding a customized data type is as follows:
```cpp
Java
public void addNewDataType(View view) {
    // Obtain the name of the new data type from the text box.
    // The new name must start with the package name and end with a customized name.
    String dataTypeName = dataTypeNameView.getText().toString();
    // Create a DataTypeAddOptions. The options to be added must be specified.
    // You can add multiple options.
    HiHealthOptions options = HiHealthOptions.builder().build();
    AuthHuaweiId mSignInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(options);
    Context context = CoreApplication.getCoreBaseContext().getApplicationContext();
    // Create a field to be added.
    Filed selectedField = Field.newFloatField("myField");
    DataTypeAddOptions dataTypeAddOptions =
        new DataTypeAddOptions.Builder().setName(dataTypeName).addField(selectedField).build();

    // Add a new data type.
    // Display the returned result on the phone screen.
    HuaweiHiHealth.getSettingController(getApplicationContext(), mSignInHuaweiId)
        .addDataType(dataTypeAddOptions)
        .addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(Exception e) {
                Log.i("TAG", "Add dataType failed");
            }
        })
        .addOnCompleteListener(new OnCompleteListener<DataType>() {
            @Override
            public void onComplete(Task<DataType> task) {
                String res = task.isSuccessful() ? "success" : "failed";
                Log.i("TAG", "Add dataType " + res);
                if (task.getException() != null) {
                    Log.i("TAG", "GetException is " + task.getException().toString();
                }
            }
        });
}
```
 
```cpp
Kotlin
fun addNewDataType(view: View) {
    // Obtain the name of the new data type from the text box.
    // The new name must start with the package name and end with a customized name.
    val dataTypeName = dataTypeNameView!!.text.toString()
    // Create a DataTypeAddOptions. The options to be added must be specified.
    // You can add multiple options.
    val dataTypeAddOptions =
        DataTypeAddOptions.Builder().setName(dataTypeName).addField(selectedField).build()

    // Create a domain to be added and add a new data type.
    // Display the returned result on the phone screen.
    val hiHealthOptions = HiHealthOptions.builder().build()
    val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions)
    context!!.let { 
        HuaweiHiHealth.getSettingController(it, signInHuaweiId )!!.addDataType(dataTypeAddOptions)
        .addOnFailureListener { e -> printFailureMessage(e, "addNewDataType") }
        .addOnCompleteListener { task ->
            val res = if (task.isSuccessful) "success" else "failed"
            Log.i("TAG","add dataType of $selectedFieldStr is $res")
            if (task.exception != null) {
                Log.i("TAG","getException is " + task.exception.toString())
            }
        }
    }
}
```

> **Note:** If you directly copy and use the preceding sample code, the following error will be reported. The related solutions are provided as follows: **dataTypeNameView** is not defined. Solution: **dataTypeNameView** is the **EditText** control defined in the activity. **data_type_name_text** is the ID of the **EditText** control. You can define **dataTypeNameView** as follows: 
```cpp
Java
// Define the dataTypeNameView variable in the activity implementation class.
private EditText dataTypeNameView;
// Initialize the dataTypeNameView variable in the onCreate method of the activity.
dataTypeNameView = (EditText) findViewById(R.id.data_type_name_text);
```
 
```cpp
Kotlin
// Define the dataTypeNameView variable in the activity implementation class.
private var dataTypeNameView: EditText? = null
// Initialize the dataTypeNameView variable in the onCreate method of the activity.
dataTypeNameView = findViewById(R.id.data_type_name_text)
```

## disableHiHealth()

| Method |
| --- |
| public Task<Void> disableHiHealth() Disables the Health Kit function, cancels the user authorization to Health Kit (which takes effect 24 hours later), and deletes all data records. |
  The sample code for disabling the Health Kit function is as follows:
```cpp
Java
public void disableHiHealth(View view) {
    // Cancel all records.
    // Display the returned result on the phone screen.
    HiHealthOptions options = HiHealthOptions.builder().build();
    AuthHuaweiId mSignInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(options);
    Context context = CoreApplication.getCoreBaseContext().getApplicationContext();
    HuaweiHiHealth.getSettingController(getApplicationContext(), mSignInHuaweiId)
        .disableHiHealth()
        .addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(Exception e) {
                Log.i("TAG", "Disable AutoRecorder failed");
            }
        })
        .addOnCompleteListener(new OnCompleteListener<Void>() {
            @Override
            public void onComplete(Task<Void> task) {
                String res = task.isSuccessful() ? "success" : "failed";
                Log.i("TAG", "Disable AutoRecorde is " + res);
            }
        });
}
```
 
```cpp
Kotlin
fun disableHiHealth(view: View) {
    // Cancel all records.
    // Display the returned result on the phone screen.
    val hiHealthOptions = HiHealthOptions.builder().build()
    val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions)
    context!!.let {
        HuaweiHiHealth.getSettingController(it, signInHuaweiId )!!.disableHiHealth()
        .addOnFailureListener { e -> printFailureMessage(e, "readTodaySummationFromDevice") }
        .addOnCompleteListener { task ->
            val res = if (task.isSuccessful) "success" else "failed"
            Log.i("TAG","disableHiHealth is $res")
        }
    }
}
```

## readDataType(String dataTypeName)

| Method |
| --- |
| public Task<DataType> readDataType(String dataTypeName) Reads the data type based on the data type name. This method is used to read the customized data types of the app. |

**Parameters**

| Name | Description |
| --- | --- |
| dataTypeName | Data type name. |

**Return****s**

| Type | Description |
| --- | --- |
| Task<DataType> | Data type that has been read based on the data type name. |
  The sample code for reading the data type based on the data type name is as follows:
```cpp
Java
public void readDataType(View view) {
    // Obtain the name of the data type from the text box.
    String dataTypeName = dataTypeNameView.getText().toString();
    HiHealthOptions options = HiHealthOptions.builder().build();
    AuthHuaweiId mSignInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(options);
    Context context = CoreApplication.getCoreBaseContext().getApplicationContext();
    // Obtain the data type of the specified name.
    // Display the returned result on the phone screen.
    HuaweiHiHealth.getSettingController(getApplicationContext(), mSignInHuaweiId)
        .readDataType(dataTypeName)
        .addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(Exception e) {
                Log.i("TAG", "Read dataType failed");
            }
        })
        .addOnCompleteListener(new OnCompleteListener<DataType>() {
            @Override
            public void onComplete(Task<DataType> task) {
                Log.i("TAG", "DataType : " + task.getResult());
            }
        });
}
```
 
```cpp
Kotlin
fun readDataType(view: View) {
    // Obtain the name of the data type from the text box.
    val dataTypeName = dataTypeNameView!!.text.toString()
    // Obtain the data type of the specified name.
    // Display the returned result on the phone screen.
    val hiHealthOptions = HiHealthOptions.builder().build()
    val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions)
    context!!.let { 
        HuaweiHiHealth.getSettingController(it, signInHuaweiId )!!.readDataType(dataTypeName)
        .addOnFailureListener { e -> printFailureMessage(e, "readDataType") }
        .addOnCompleteListener { task -> Log.i("TAG","DataType : " + task.result) }
    }
}
```

## checkHealthAppAuthorization()

| Method |
| --- |
| public Task<Void> checkHealthAppAuthorization() Checks the user privacy authorization to Health Kit. If the authorization has not been granted, the user will be redirected to the authorization screen where they can authorize the Health app to open data to Health Kit. |
  The sample code for checking the user privacy authorization to Health Kit is as follows:
```cpp
Java
public void checkHealthAppAuthorization(View view) {
    // Check the user's privacy authorization to Health Kit. If the authorization has not been granted, the user will be redirected to the authorization screen where they can authorize the Health app to open data to Health Kit.
    // Display the returned result on the phone screen.
    HiHealthOptions options = HiHealthOptions.builder().build();
    AuthHuaweiId mSignInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(options);
    Context context = CoreApplication.getCoreBaseContext().getApplicationContext();
    HuaweiHiHealth.getSettingController(getApplicationContext(), mSignInHuaweiId)
        .checkHealthAppAuthorization()
        .addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(Exception e) {
                Log.i("TAG", "checkHealthAppAuthorization failed");
            }
        })
        .addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                Log.i("TAG", "checkHealthAppAuthorization is " + "success");
            }
        });
}
```
 
```cpp
Kotlin
fun checkHealthAppAuthorization(view: View) {
    // Check the user's privacy authorization to Health Kit. If the authorization has not been granted, the user will be redirected to the authorization screen where they can authorize the Health app to open data to Health Kit.
    // Display the returned result on the phone screen.
    val hiHealthOptions = HiHealthOptions.builder().build()
    val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions)
    context!!.let {
        HuaweiHiHealth.getSettingController(it, signInHuaweiId )!!
        .checkHealthAppAuthorization()        
        .addOnFailureListener { e -> printFailureMessage(e, "checkHealthAppAuthorization") }
        .addOnSuccessListener{ 
            Log.i("TAG","checkHealthAppAuthorization is success")
        }
    }
}
```

## getHealthAppAuthorization()

| Method |
| --- |
| public Task<Boolean> getHealthAppAuthorization() Checks the user privacy authorization to Health Kit. |

**Return****s**

| Type | Description |
| --- | --- |
| Task<Boolean> | Whether the user privacy authorization has been granted to Health Kit. • **true**: yes • **false**: no |
  The sample code for checking the user privacy authorization to Health Kit is as follows:
```cpp
Java
public void getHealthAppAuthorization(View view) {
    // Check the user privacy authorization to Health Kit.
    // Display the returned result on the phone screen.
    HiHealthOptions options = HiHealthOptions.builder().build();
    AuthHuaweiId mSignInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(options);
    Context context = CoreApplication.getCoreBaseContext().getApplicationContext();
    HuaweiHiHealth.getSettingController(getApplicationContext(), mSignInHuaweiId)
        .getHealthAppAuthorization()
        .addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(Exception e) {
                Log.i("TAG", "getHealthAppAuthorization failed");
            }
        })
        .addOnSuccessListener(new OnSuccessListener<Boolean>() {
            @Override
            public void onSuccess(Boolean result) {
                String res = result ? "success" : "failed";
                Log.i("TAG", "getHealthAppAuthorization is " + res);
            }
        });
}
```
 
```cpp
Kotlin
fun getHealthAppAuthorization(view: View) {
    // Check the user privacy authorization to Health Kit.
    // Display the returned result on the phone screen.
    val hiHealthOptions = HiHealthOptions.builder().build()
    val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions)
    context!!.let {
        HuaweiHiHealth.getSettingController(it, signInHuaweiId )!!
        .checkHealthAppAuthorization()        
        .addOnFailureListener { e -> printFailureMessage(e, "getHealthAppAuthorization") }
        .addOnSuccessListener { result ->
            val res = if (result) "success" else "failed"
            Log.i("TAG","getHealthAppAuthorization is $res")
        }
    }
}
```

## requestAuthorizationIntent(String[] scopes, boolean enableHealthAuth)

| Method |
| --- |
| public Intent requestAuthorizationIntent(String[] scopes, boolean enableHealthAuth) Obtains the intent of integrating the HUAWEI ID sign-in authorization process and Health app authorization process, and uses **startActivityForResult** to initiate the integrated authorization process. |

**Parameters**

| Name | Description |
| --- | --- |
| scopes | Scope permission array for scope application. |
| enableHealthAuth | Switch of the Health app authorization. The value **true** indicates that the authorization process is enabled, and the value **false** indicates that the authorization process is disabled. |

**Return****s**

| Type | Description |
| --- | --- |
| Intent | Intent of starting the authorization process activity, which can be initiated through **startActivityForResult**. |
  
```cpp
Java
// Log tag
private static final String TAG = "HealthKitAuthActivity";

// Request code for displaying the authorization screen using the startActivityForResult method. The value can be customized.
private static final int REQUEST_AUTH = 1000;

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
    HiHealthOptions options = HiHealthOptions.builder().build();
    AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(options);
    Intent intent = HuaweiHiHealth.getSettingController(this, signInHuaweiId).requestAuthorizationIntent(scopes, true);

    // Open the authorization process page. This method must be used in the activity.
    Log.i(TAG, "start authorization activity");
    startActivityForResult(intent, REQUEST_AUTH);
}
```
 
```cpp
Kotlin
private fun requestAuth() {
    // Add scopes to apply for. The following only shows an example. You need to add scopes according to your specific needs.
    val scopes = arrayOf(
        // View and store the step count in Health Kit.
        Scopes.HEALTHKIT_STEP_READ, Scopes.HEALTHKIT_STEP_WRITE,
        // View and store the height and weight in Health Kit.
        Scopes.HEALTHKIT_HEIGHTWEIGHT_READ, Scopes.HEALTHKIT_HEIGHTWEIGHT_WRITE,
        // View and store the heart rate data in Health Kit.
        Scopes.HEALTHKIT_HEARTRATE_READ, Scopes.HEALTHKIT_HEARTRATE_WRITE
    )

    // Obtain the intent of the authorization process.
    val options = HiHealthOptions.builder().build()
    val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(options)
    val intent = HuaweiHiHealth.getSettingController(this, signInHuaweiId).requestAuthorizationIntent(scopes, true)

    // Open the authorization process screen.
    Log.i(TAG, "start authorization activity");
    startActivityForResult(intent, REQUEST_AUTH)
}

companion object {
    // Log tag
    private val TAG = "HealthKitAuthActivity"

    // Request code for displaying the authorization screen using the startActivityForResult method. The value can be customized.
    private val REQUEST_AUTH = 1000
}
```

## parseHealthKitAuthResultFromIntent(Intent intent)

| Method |
| --- |
| public HealthKitAuthResult parseHealthKitAuthResultFromIntent(Intent intent) Parses the authorization result from the intent returned in the sign-in authorization process. |

**Parameters**

| Name | Description |
| --- | --- |
| Intent | Intent returned in the sign-in authorization process. |

**Return****s**

| Type | Description |
| --- | --- |
| HealthKitAuthResult | Authorization result parsed from the intent. |
  
```cpp
Java
// Log tag
private static final String TAG = "HealthKitAuthActivity";

// Request code for displaying the authorization screen using the startActivityForResult method. The value can be customized.
private static final int REQUEST_AUTH = 1000;

@Override
protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
    super.onActivityResult(requestCode, resultCode, data);

    // Process only the response result of the authorization process.
    if (requestCode == REQUEST_AUTH) {
        // Obtain the authorization response result from the intent.
        HiHealthOptions options = HiHealthOptions.builder().build();
        AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(options);
        HealthKitAuthResult result = HuaweiHiHealth.getSettingController(this, signInHuaweiId).parseHealthKitAuthResultFromIntent(data);
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
 
```cpp
Kotlin
override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)

    // Process only the response result of the authorization process.
    if (requestCode == REQUEST_AUTH) {
        // Obtain the authorization response result from the intent.
        val options = HiHealthOptions.builder().build()
        val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(options)
        val result = HuaweiHiHealth.getSettingController(this, signInHuaweiId).parseHealthKitAuthResultFromIntent(data)
        if (result == null) {
            Log.w(TAG, "authorization fail")
            return
        }

        if (result.isSuccess) {
            Log.i(TAG, "authorization success")
        } else {
            Log.w(TAG, "authorization fail, errorCode:" + result.errorCode)
        }
    }
}

companion object {
    // Log tag
    private val TAG = "HealthKitAuthActivity"

    // Request code for displaying the authorization screen using the startActivityForResult method. The value can be customized.
    private val REQUEST_AUTH = 1000
}
```
