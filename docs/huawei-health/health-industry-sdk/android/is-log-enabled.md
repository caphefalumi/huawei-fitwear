<!--
  Title: Obtaining the Log Switch State
  Catalog: huaweihealth-Guides
  Document ID: is-log-enabled-0000002372256585
  Updated: 2026-08-05 02:10:15
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/is-log-enabled-0000002372256585
-->
# Obtaining the Log Switch State

This section describes how to obtain the log switch state.

- Call the [getServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getServiceClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [ServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/serviceclient-0000001434627952) object.
- Call the [isLogEnabled](https://developer.huawei.com/consumer/en/doc/health-References/serviceclient-0000001434627952#EN-US_TOPIC_0000002647924358__isLogEnabled-com_huawei_health_industry_client_callback_ServiceCallback-) method to obtain the log switch state. 
```cpp
// Obtain the ServiceClient object.
ServiceClient serviceClient = IndustryWear.getServiceClient(this);

// Obtain the log switch state.
serviceClient.isLogEnabled(new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
	// Process the returned information.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, the log switch state is returned. If the API call fails, an error code is returned. |
 
```cpp
result example:
{
    "isLogEnabled":false
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| isLogEnabled | false | Log switch disabled. |
| true | Log switch enabled. |  |
