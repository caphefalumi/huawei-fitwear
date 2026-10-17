<!--
  Title: Requesting User Authorization
  Catalog: connectivity-Guides
  Document ID: request-user-authorization-ios-0000001920933293
  Updated: 2026-05-29 06:10:05
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/request-user-authorization-ios-0000001920933293
-->
# Requesting User Authorization

To protect user privacy, the Wear Engine APIs need user authorization to work. It is recommended that you perform the operations in this section when users call the Wear Engine open capabilities for the first time.

#### Verifying User Authorization Results

Call any API for [querying available wearable devices](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/check-availabla-dev-ios-0000001921237861) or [starting app-to-app message communications](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/phone-send-message-ios-0000001875158886). If your app has not been authorized, error code **WESErrorCodeUserUnauthorizedWearEngine(9)** will be returned. If your app has been authorized, the API will return results as normal.

#### Applying for Wearable Device Permissions

- Call the [getAuthClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-class-0000001898103106#section612419344112) method of [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-hiwear-0000001897479338) to obtain the [WESAuthClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesauthclient-0000001897479350) object.
- Call [authWithClientId](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesauthclient-class-0000001897943254#section12194195011300) to redirect to the Huawei Health app for users to grant the authorization.
- Display the authorization screen and prompt users to grant the corresponding permissions. Method 1: scheme-based redirection for Huawei Health app authorization 
```cpp
HiWear.getAuthClient().auth(withClientId:"xxx",  // Client ID on HUAWEI Developers.
                            scheme:"test://healthkitdemo/comeback",  // Used for redirecting users from the Huawei Health app back to your app after the authorization is complete.
                            schemeSecret:"xxx", // schemeSecret on HUAWEI Developers.
                            clientSecret:"xxx",  // clientSecret on HUAWEI Developers.
                            srcPkgName:"xx.xx.xx",  // Your app bundle name on iOS phones.
                            destPkgName:"xx.xx.xx"  // Your app bundle name on wearable devices.
                            ) { (isSuccess, errorCode) in
    // errorCode returned after redirecting users to the Huawei Health app.
}
```
 Client ID: Your app ID on HUAWEI Developers. Enter the correct app ID by referring to [Step 6](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-ios-0000001935664117#EN-US_TOPIC_0000001935664117__li16957258104517) in "Applying for the Wear Engine Service".
- Scheme: Used for redirecting users from the Huawei Health app back to your app after the authorization is complete. Check and enter the correct callback scheme URL and configure URL scheme for the project by referring to [Step 3](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-ios-0000001935664117#EN-US_TOPIC_0000001935664117__li88131112548) in "Applying for the Wear Engine Service".
- Scheme secret: **schemeSecret** on HUAWEI Developers. Check and enter the correct scheme secret by referring to [Step 6](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-ios-0000001935664117#EN-US_TOPIC_0000001935664117__li16957258104517) in "Applying for the Wear Engine Service".
- Client secret: **clientSecret** on HUAWEI Developers. Check and enter the correct client secret by referring to [Step 7](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/registering-applying-account-ios-0000001893544118#EN-US_TOPIC_0000001893544118__li1582134618509) in "Registering a HUAWEI ID and Applying for the HUAWEI ID Service".

- Method 2: universal link-based redirection for Huawei Health app authorization, applicable to scenarios where the scheme limit specified in section "4.3.1 Integrating the SDK" is reached 
```cpp
HiWear.getAuthClient().auth(withClientId:"xxx",  // Client ID on HUAWEI Developers.
                            scheme:"test://healthkitdemo/comeback",  // Used for redirecting users from the Huawei Health app back to your app after the authorization is complete.
                            schemeSecret:"xxx", // schemeSecret on HUAWEI Developers.
                            clientSecret:"xxx",  // clientSecret on HUAWEI Developers.
                            srcPkgName:"xx.xx.xx",  // Your app bundle name on iOS phones.
                            destPkgName:"xx.xx.xx"  // Your app bundle name on wearable devices.
                            ulinkType: .global) { (isSuccess, errorCode) in
    // errorCode returned after redirecting users to the Huawei Health app.
}
```
 Compared with method 1, method 2 introduces a new parameter **ulinkType**. The data type of **ulinkType** is WESULinkType. You can determine which option to use based on your app's operational region. The options of **WESULinkType** are as follows: **WESULinkGlobal**: Uses the universal link authorization process, applicable globally.
- **WESULinkNone**: Uses the regular authorization process.
- **WESULinkCn**: Uses the universal link authorization process, applicable to China.
- **WESULinkEu**: Uses the universal link authorization process, applicable to Europe.
- **WESULinkRu**: Uses the universal link authorization process, applicable to Russia.

> **Note:** The universal link authorization API is applicable only to Huawei Health app must be version 14.1.6.305 or later.

- Redirect from the Huawei Health app back to your app after users complete the authorization. You'll need to add the callback in **AppDelegate.swift** or **SceneDelegate.swift** depending on project settings. In the callback, call [processAuthResultWith](https://developer.huawei.com/consumer/en/doc/connectivity-References/we-ios-wesauthclient-class-0000001897943254#section6464173116407) to parse the authorization result. **AppDelegate.swift** file: 
```cpp
// AppDelegate.swift file
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    if url.absoluteString.contains("wearenginesdk://") {
        HiWear.getAuthClient().processAuthResult(with: url)
    }
    return true
}
```
 **SceneDelegate.swift** file: 
```cpp
// SceneDelegate.swift file
func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    guard let url = URLContexts.first?.url else {
        return
    }
    if url.absoluteString.contains("wearenginesdk://") {
        HiWear.getAuthClient().processAuthResult(with: url)
    }
}
```

- Once the authorization result parsing is complete, the callback function of the authorization API in "Step 3" will be called. You need to process the authorization result. 
```cpp
HiWear.getAuthClient().auth(...){ (isSuccess, errorCode) in
    // Respond to and process the authorization result.
}
```
 If the value of **isSuccess** is **true**, the authorization is successful and the service can be processed normally.
- If the value of **isSuccess** is **false**, the authorization fails. In this case, you need to check **errorCode**. and handle it correctly. > **Note:** If the authorization fails and the value of **errorCode** is **WESErrorCodeUserNotSelectDeviceManager(223)**, it indicates that the user has tapped the allow button on the authorization screen but did not select any device permissions. In this scenario, it is recommended to display a text prompt to the user and call the authorization API again.
