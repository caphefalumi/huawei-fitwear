<!--
  Title: Accessing Health Kit via the HTTP RESTful API
  Catalog: HMSCore-Guides-V5
  Document ID: use-restful-api-0000001050071697-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/use-restful-api-0000001050071697-V5
-->
# Accessing Health Kit via the HTTP RESTful API

The HTTP RESTful API is defined as follows:

**Protocol**: HTTPS

**HTTPS request header:**

For information about input parameters, see [Common Parameters](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/public-parameter-0000001050202130-V5).

**Content-type**: application/json

**Authorization**: Bearer ${access_token}. For details about how to obtain an access token, see [Authorization Code](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/open-platform-oauth-0000001053629189-V5#EN-US_TOPIC_0000001053629189__section1022911426469) in OAuth 2.0-based Authentication.

**x-client-id**: App ID allocated by HUAWEI Developers. The server can perform gray routing based on this parameter. It is recommended that this parameter be carried.

**x-version**: Software version number of the app calling the API, that is, the version number of the current client. It is recommended that this parameter be carried.

**x-caller-trace-id**: Request tracing ID, which is used to connect the entire request chain between the service calling party and server. It is recommended that this parameter be carried.

**URL format:**

https://health-api.cloud.huawei.com/healthkit/v1/{resourcesSet}/{resourceId}?{param=xxx}

The following table describes the parameters in the URL.

| Field | Description | Format |
| --- | --- | --- |
| Method | HTTP methods | POST, PUT, PATCH, GET, and DELETE |
| resourcesSet | Resource set | For example: dataCollectors (a set of data collectors) |
| resourceId | Resource ID | For example: dataCollectorId (ID of a data collector) |
| param | Parameter for queries | For example: limit (length of a single pagination query) |

For details about the HTTP RESTful API, see [Health Kit Server API Reference](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_create-0000001050114852-V5).
