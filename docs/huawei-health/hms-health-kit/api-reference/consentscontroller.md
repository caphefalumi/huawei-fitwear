<!--
  Title: ConsentsController
  Catalog: HMSCore-References-V5
  Document ID: consentscontroller-0000001060039068-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/consentscontroller-0000001060039068-V5
-->
# ConsentsController

| Class Info |
| --- |
| public class ConsentsController Provides authorization management APIs that can be used to view and revoke the granted permissions. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| Task<ScopeLangItem> | [get](#EN-US_TOPIC_0000001060039068__section158651848112016)(String lang, String appId) Queries the list of permissions granted to your app. |
| Task<Void> | [revoke](#EN-US_TOPIC_0000001060039068__section16105144222818)(String appId) Revokes all permissions granted to your app. |
| Task<Void> | [revoke](#EN-US_TOPIC_0000001060039068__section792964302815)(String appId, List<String> scopes) Revokes certain Health Kit related permissions granted to your app. |

#### Public Methods

## get(String lang, String appId)

| Method |
| --- |
| public Task<ScopeLangItem> get(String lang, String appId) Queries the list of permissions granted to your app. |

**Parameters**

| Name | Description |
| --- | --- |
| lang | Language code. If the specified value is invalid, **en-us** will be used. |
| appId | ID of your app. |

**Return****s**

| Type | Description |
| --- | --- |
| Task<ScopeLangItem> | List of permissions that have been granted to your app. |
  The sample code for querying the list of permissions granted to your app is as follows:
```cpp
Java
// Log tag
private static final String TAG = "HealthKitConsents";

// Save the obtained list of the granted permissions.
private ScopeLangItem scopeLangItem;

public void getAppScopes() {
    // 1. Obtain the ConsentsController object.
    HiHealthOptions fitnessOptions = HiHealthOptions.builder().build();
    AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(fitnessOptions);
    ConsentsController consentsController = HuaweiHiHealth.getConsentsController(this, signInHuaweiId);

    // 2. Query the list of permissions that have been granted to your app.
    // Replace APP ID with your app ID.
    Task<ScopeLangItem> task = consentsController.get("zh-cn", "APP ID");
    // 3. Add a listener for the task result.
    task.addOnSuccessListener(new OnSuccessListener<ScopeLangItem>() {
        @Override
        public void onSuccess(ScopeLangItem result) {
            Log.i(TAG, "getAppScopes success");
            scopeLangItem = result;
        }
    }).addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
            Log.e(TAG, "getAppScopes exception");
        }
    });
}
```
 
```cpp
Kotlin
// Save the obtained list of the granted permissions.
private var scopeLangItem: ScopeLangItem? = null
fun getAppScopes() {
    // 1. Obtain the ConsentsController object.
    val fitnessOptions = HiHealthOptions.builder().build()
    val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(fitnessOptions)
    val consentsController = HuaweiHiHealth.getConsentsController(this, signInHuaweiId)

    // 2. Query the list of permissions that have been granted to your app.
    // Replace APP ID with your app ID.
    val task = consentsController.get("zh-cn", "APP ID")
    // 3. Add a listener for the task result.
    task.addOnSuccessListener { result ->
        Log.i(TAG, "getAppScopes success")
        scopeLangItem = result
    }.addOnFailureListener { Log.e(TAG, "getAppScopes exception") }
}

companion object {
    // Log tag
    private val TAG = "HealthKitConsents"
}
```

## revoke(String appId)

| Method |
| --- |
| public Task<Void> revoke(String appId) Revokes all permissions granted to your app. |

**Parameters**

| Name | Description |
| --- | --- |
| appId | ID of your app. |
  The sample code for revoking all permissions granted to your app is as follows:
```cpp
Java
// Log tag
private static final String TAG = "HealthKitConsents";

public void revokeApp() {
    // 1. Obtain the ConsentsController object.
    HiHealthOptions fitnessOptions = HiHealthOptions.builder().build();
    AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(fitnessOptions);
    ConsentsController consentsController = HuaweiHiHealth.getConsentsController(this, signInHuaweiId);

    // 2. Revoke all permissions granted to your app.
    // Replace APP ID with your app ID.
    Task<Void> task = consentsController.revoke("APP ID");
    // 3. Add a listener for the task result.
    task.addOnSuccessListener(new OnSuccessListener<Void>() {
        @Override
        public void onSuccess(Void aVoid) {
            Log.i(TAG, "revokeApp success");
        }
    }).addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
            Log.e(TAG, "revokeApp exception");
        }
    });
}
```
 
```cpp
Kotlin
// Save the obtained list of the granted permissions.
private var scopeLangItem: ScopeLangItem? = null
fun revokeApp() {
    // 1. Obtain the ConsentsController object.
    val fitnessOptions = HiHealthOptions.builder().build()
    val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(fitnessOptions)
    val consentsController = HuaweiHiHealth.getConsentsController(this, signInHuaweiId)

    // 2. Revoke all permissions granted to your app.
    // Replace APP ID with your app ID.
    val task = consentsController.revoke("APP ID")
    // 3. Add a listener for the task result.
    task.addOnSuccessListener { Log.i(TAG, "revokeApp success") }
        .addOnFailureListener { Log.e(TAG, "revokeApp exception") }
}

companion object {
    // Log tag
    private val TAG = "HealthKitConsents"
}
```

## revoke(String appId, List<String> scopes)

| Method |
| --- |
| public Task<Void> revoke(String appId, List<String> scopes) Revokes certain Health Kit related permissions granted to your app. |

**Parameters**

| Name | Description |
| --- | --- |
| appId | ID of your app. |
| scopes | List of Health Kit related permissions to be revoked. The value is the key value of **url2Desc** in **ScopeLangItem**. |
  The sample code for revoking certain permissions granted to your app is as follows:
```cpp
Java
// Log tag
private static final String TAG = "HealthKitConsents";

// Save the obtained list of the granted permissions.
private ScopeLangItem scopeLangItem;

public void revokeScopes(View view) {
    // 1. Obtain the ConsentsController object.
    HiHealthOptions fitnessOptions = HiHealthOptions.builder().build();
    AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(fitnessOptions);
    ConsentsController consentsController = HuaweiHiHealth.getConsentsController(this, signInHuaweiId);

    // 2. Revoke certain permissions granted to your app.
    // Replace APP ID with your app ID.
    Task<Void> task = consentsController.revoke("APP ID", getRevokeScopes());
    task.addOnSuccessListener(new OnSuccessListener<Void>() {
        @Override
        public void onSuccess(Void aVoid) {
            Log.i(TAG, "revokeScopes success");
        }
    }).addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
            Log.e(TAG, "revokeApp exception");
        }
    });
}

/**
* Obtain the list of permissions to be revoked. In this example, the last permission returned by getAppScopes is returned.
 *
 * @return List of permissions to be revoked.
 */
private List<String> getRevokeScopes() {
    List<String> scopeUrls = new ArrayList<>(Optional.ofNullable(scopeLangItem)
            .map(ScopeLangItem::getUrl2Desc)
            .map(Map::keySet)
            .orElse(Collections.emptySet()));

    if (scopeUrls.isEmpty()) {
        return scopeUrls;
    }

    Collections.sort(scopeUrls);
    List<String> revokeScopeUrls = scopeUrls.subList(scopeUrls.size() - 1, scopeUrls.size());

    return revokeScopeUrls;
}
```
 
```cpp
Kotlin
// Save the obtained list of the granted permissions.
private val scopeLangItem: ScopeLangItem? = null

fun revokeScopes(view: View) {
    // 1. Obtain the ConsentsController object.
    val fitnessOptions = HiHealthOptions.builder().build()
    val signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(fitnessOptions)
    val consentsController = HuaweiHiHealth.getConsentsController(this, signInHuaweiId)

    // 2. Revoke certain permissions granted to your app.
    // Replace APP ID with your app ID.
    val task = consentsController.revoke("APP ID", getRevokeScopes())
    task.addOnSuccessListener { Log.i(TAG, "revokeScopes success") }
        .addOnFailureListener { Log.e(TAG, "revokeApp exception") }
}

/**
* Obtain the list of permissions to be revoked. In this example, the ID of the last permission returned by getAppScopes is used. You need to customize the logic.
 *
 * @return List of permissions to be revoked.
 */
private fun getRevokeScopes(): List<String> {
    val scopeUrls = ArrayList(
        Optional.ofNullable(scopeLangItem)
            .map { scopeLangItem -> scopeLangItem.url2Desc }
            .map { url2Desc -> url2Desc.keys }
            .orElse(Collections.emptySet())
    )

    if (scopeUrls.isEmpty()) {
        return scopeUrls
    }

    scopeUrls.sort()
    return scopeUrls.subList(scopeUrls.size - 1, scopeUrls.size)
}

companion object {
    // Log tag
    private val TAG = "HealthKitConsents"
}
```
