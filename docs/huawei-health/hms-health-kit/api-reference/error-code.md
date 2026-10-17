<!--
  Title: Result Codes
  Catalog: HMSCore-References-V5
  Document ID: error-code-0000001054236973-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/error-code-0000001054236973-V5
-->
# Result Codes

| Result Code | Value | Description | Solution |
| --- | --- | --- | --- |
| SC_OK | 200 | OK | - |
| SC_NO_CONTENT | 204 | Deleted successfully. | The deletion is successful. The code 204 indicates that there is no response body. |
| SC_BAD_REQUEST | 400 | Incorrect parameter. | Check the result code in the response and rectify the fault based on the result code. |
| SC_UNAUTHORIZED | 401 | Authentication failed. | Check the access token in the **Authorization** parameter in the request HTTP header. |
| SC_FORBIDDEN | 403 | Request rejected. | The scopes permission is insufficient and the request is rejected. |
| SC_NOT_FOUND | 404 | Service not found. | Verify that the request URI is correct. |
| SC_METHOD_NOT_ALLOWED | 405 | Invalid HTTP method. | The HTTP method is invalid. |
| SC_INTERNAL_SERVER_ERROR | 500 | Internal service error. | Go to **Support** > **Customer Service** > **Submit ticket online**, select the relevant category, and submit a ticket. Huawei will get back to you as soon as possible. |
| SC_BAD_GATEWAY | 502 | Gateway error. | There is a gateway error. |
| SC_SERVICE_UNAVAILABLE | 503 | Server unreachable. | There has been an internal error. Please try again later. Go to **Support** > **Customer Service** > **Submit ticket online**, select the relevant category, and submit a ticket. Huawei will get back to you as soon as possible. |
| EXECUTOR_FULL | 590 | Abnormal CSE microservice. | In general, the request body fails to be parsed in JSON format, or other internal CSE errors have occurred. |
