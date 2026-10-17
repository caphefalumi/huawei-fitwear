<!--
  Title: Common Parameters
  Catalog: HMSCore-References-V5
  Document ID: public-parameter-0000001050202130-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/public-parameter-0000001050202130-V5
-->
# Common Parameters

#### Common Parameters for the Gray Update

The Health Kit server provides the **x-huid** and **x-version** fields for the gray update. In a gray update, newly released features are only available to some users. The server routes the app of the new version to the cloud server based on the **x-version** configuration routing rule. After the beta verification is complete, the server is updated on the entire network basis, and then the official version is released for the client.

To meet the gray update requirements, the following common parameters can be carried in requests sent to the server:

| Field | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| Authorization | String | M | Standard OAuth2 authentication header. The format is Bearer ${access_token}. |
| Content-type | String | M | Currently, only application/json is supported. That is, the HTTP body must be in JSON format. |
| x-version | String | M | Software version number of the app calling the API, that is, the version number of the current client. The server can perform gray release based on this parameter. For details, see the following note section. |
| Accept-Encoding | String | O | If the value contains **gzip**, the server determines whether to use **gzip** for encoding based on the size of the data to be returned. |
| Content-Encoding | String | O | If the HTTP body of the API is large and **gzip** needs to be enabled, the header must be set to **gzip**. |
| x-caller-trace-id | String | O | Request tracing ID, which is used to connect the entire request chain between the service calling party and server. It is recommended that this parameter be carried. |
| x-client-id | String | O | App ID allocated by HUAWEI Developers. The server can perform gray routing based on this parameter. |
| x-huid | String | O | UID of the user's HUAWEI ID. The server can perform gray release based on the UID. |
| NOTE: The format of the x-version field is as follows: Different apps may have the same version number, for example, 20.0.3.309. In addition, apps of the same type are classified into Android and iOS apps. Therefore, to facilitate the gray verification targeted at an app of a specific version, the format of x-version is defined as "OS_App type_Version number displayed on the app screen". |  |  |  |

The common parameters of gray release are carried in the HTTP header of the request. The following shows an example:

```cpp
POST /healthkit/v1/dataCollectors
Host: domain
Content-type: application/json
Accept-Language: zh-CN,zh
Accept-Encoding: gzip, deflate
Connection: keep-alive
x-huid: 160086000000000388
x-version: and_wear_2.0.0.301
Authorization: Bearer XXX
```
