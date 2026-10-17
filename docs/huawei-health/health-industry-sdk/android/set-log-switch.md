<!--
  Title: Setting the Log Switch
  Catalog: huaweihealth-Guides
  Document ID: set-log-switch-0000002372216465
  Updated: 2026-08-05 02:10:13
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-log-switch-0000002372216465
-->
# Setting the Log Switch

This section describes how to set the log switch.

- Call the [getServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getServiceClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [ServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/serviceclient-0000001434627952) object.
- Call the [setLogSwitch](https://developer.huawei.com/consumer/en/doc/health-References/serviceclient-0000001434627952#EN-US_TOPIC_0000002647924358__setLogSwitch-boolean-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the log switch. 
```cpp
// Obtain the ServiceClient object.
ServiceClient serviceClient = IndustryWear.getServiceClient(this);

// Set the log switch. true: enable; false: disable.
boolean isLogEnabled = true;
serviceClient.setLogSwitch(isLogEnabled, new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
	// Process the returned information.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, an empty string is returned. If the API call fails, an error message is returned. |
