<!--
  Title: Checking Permissions and Obtaining Authorization
  Catalog: HMSCore-Guides-V5
  Document ID: get-access-token-0000001050322650-V5
  Updated: 2021-05-27 00:46:54
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/get-access-token-0000001050322650-V5
-->
**
# Checking Permissions and Obtaining Authorization

The Health Kit server uses the OAuth 2.0 protocol to authorize and confirm connected third-party apps. Apps need to use a logged-in HUAWEI ID to initiate an authorization request. Any request sent by an app must contain the scope information, based on which the server determines the validity of the app.

- The authorization code is used to request an access token. For details, see [Authorization Code](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/open-platform-oauth-0000001053629189-V5#EN-US_TOPIC_0000001053629189__section1022911426469) in OAuth 2.0-based Authentication.
- The scopes that can be contained in the authorization request are defined in [Health Kit Scope List](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/scope-list-0000001055419280-V5#EN-US_TOPIC_0000001055419280__section1078716412914).
- You can only access the data in the Health app after the user has authorized the app to open data to Health Kit. An authorization screen needs to be displayed for users to decide whether to grant the authorization. For details, see [Example of the Health App Authorization](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/server-app-auth-example-0000001071757151-V5).

#### Health Kit Scope Definition

When apps access APIs for which the permissions have been obtained, they may perform operations on user resources. For such permissions, Huawei has defined the corresponding user authorization scopes, which are used for OAuth2.0 authorization. Before an app is able to access any user resources, Huawei will prompt the user to grant the required permissions on the authorization screen. The app will only be able to access the user resources upon user approval.

Data written to the Health Kit platform must be real data of users. Do not write any virtual or forged data to the platform. The Health Kit platform will discriminate the written data and prevents abnormal data from being written.

- Common permissions are automatically granted after your application has been approved by HUAWEI Developers. The involved data types are the personal data, fitness data, and workout records.
- Advanced permissions require further approval by the related Huawei business operation personnel after your application has been approved by HUAWEI Developers. The related data types are the restricted data types indicated as approval required in [Public Data Types](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5).

If you only need to view data, apply for the .read** permission. If you only need the data storage permission, apply for the **.write** permission. To view and store data, apply for the **.both** permission.

For details about the mapping between authorization options on the app screen and scopes, see [Health Kit Scope List](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/scope-list-0000001055419280-V5#EN-US_TOPIC_0000001055419280__section1078716412914).
