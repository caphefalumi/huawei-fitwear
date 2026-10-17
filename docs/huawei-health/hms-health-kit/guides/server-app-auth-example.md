<!--
  Title: Example of the Health App Authorization
  Catalog: HMSCore-Guides-V5
  Document ID: server-app-auth-example-0000001071757151-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/server-app-auth-example-0000001071757151-V5
-->
# Example of the Health App Authorization

You can only access the data in the Health app, after the user has authorized the app to open data to Health Kit. (Skip this section if you do not need to access the data in the Health app.)

To obtain data from the Health app, you can call the HTML5 page provided by the Health Kit cloud and ask for user authorization.

- Obtain the HTML5 authorization page. The user's browser (or the browser component in the mobile/desktop app) is redirected to the URL **https://h5hosting.dbankcdn.com/cch5/healthkit/privacy/link.html** with the following parameters: 
| Parameter Name | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- |
| lang | O | Text language. American English is used by default. |
| access_token | M | User token obtained during [authentication](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/auth-example-0000001054581058-V5) and is coded in URLEncode. |
 For example, if an app whose **client_id** is **101489619** wants to access the data of the Health app after obtaining the user token through authentication, the app needs to redirect the user's browser to the following URL: 
```cpp
https://h5hosting.dbankcdn.com/cch5/healthkit/privacy/link.html?lang=zh-cn&access_token=CgB6e3x9zh1Wfk343mub4BdL%2Bo5Jji2uw4AAjfQglwlsYOdaNWtg5v3uRDuOQYkqIcPzHKh3ddBvIqkStrf2OBE9pAmZWnTp%2BDF52SXrUYyDccYaPoQjzEkuh0XPcS2BciTCehT%2Bsey8sk7li5%2F62YUr5VJjvPDTtaVC4ozb618V
```
 If the request is successfully responded, the authorization screen is displayed, as shown in the following figure.
- Touch **LINK** to link the Health app with Health Kit (Huawei Health Service). After the linking is successful, the return code and **OPENID** of the user are carried in the authentication callback address registered by the third-party app. For example, if **client_id** is set to **101489619** and the registered callback address is "https://www.example.com", the following information will be returned:
```cpp
https://www.example.com/?privacyLink_code=0&open_id=MDFAMTAxNTI0MzcxQGE2MzQ3ODdiaMzVhMzAwMzBlMmFlYjNkMmI5NDVjODM4QDk1NDI1NGQ1NGI0MzAwOTNjYzcyZDAyY2JmYjljMjVhMDExZjViaMmU5YWUxYmM2NGVjZTQ1NzdmMGU
```
 Return parameters: 
| Parameter Name | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- |
| privacyLink_code | M | Return code. The value **0** indicates that the authorization is successful. Other values indicate failure. |
| error_description | O | Error description, returned when **privacyLink_code** is not **0**. |
| OPENID | O | Unique user ID, returned after successful authorization. |
 > **Note:** If the user has linked the Health app with Health Kit (Huawei Health Service), the HTML5 authorization page will be redirected to the callback address. If the access token is invalid, the callback address cannot be parsed. In this case, the request is redirected to the local address https://localhost, and the following content is returned: **https://localhost/?privacyLink_code=401&error_description=Invalid_Token**. The path for canceling authorization is different in the iOS and Android versions of the Health app. The Android version is used as an example.
