<!--
  Title: Result Codes
  Catalog: huaweihealth-Guides
  Document ID: errorcode-0000002447302129
  Updated: 2026-08-05 02:10:04
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/errorcode-0000002447302129
-->
# Result Codes

| Category | Description | Value | Suggested Solution |
| --- | --- | --- | --- |
| Universal result codes | Operation successful. | 0 | N/A |
| General error. | 1 | Contact the O&M personnel for assistance. |  |
| Invalid parameter. | 2 | Verify the input parameters. |  |
| API not supported. | 3 | Verify that the command is valid. Verify that the API level of the server-side SDK is correct. |  |
| Request timed out. | 4 | N/A |  |
| Authorization certificate failed to be verified. | 5 | Verify that the certificate is correctly configured. Verify that the network status is normal. |  |
| Service conflict. | 6 | The same task is being executed. Call the API after the current task is complete. |  |
| The device does not support the current data type. | 7 | Check the validity of the data type. Check the API level of the server-side SDK. |  |
| Subscription data returned successfully. | 8 | N/A |  |
| Requesting authentication. | 9 | An authentication task is in progress. Wait for the current authentication task to complete before calling the authentication API. |  |
| Subscribe to event notifications. | 10 | N/A |  |
| Real-time sensor data subscription status codes | Sensor type not supported. | 300 | N/A |
| Device not worn or removed. | 303 | Subscribe to or report the data after the device is worn. |  |
| Device control and device event status codes | Measurement in progress. | 401 | N/A |
| Measurement completed. | 402 | N/A |  |
| Measurement canceled. | 403 | The user has canceled the measurement on the device. |  |
| Measurement cannot be started. | 404 | A higher-priority function is currently running on the wearable. |  |
| Wearable not worn. | 405 | Wear the wearable. |  |
| Device not worn properly. | 406 | Wear the device properly before calling the API. |  |
| Measurement timed out. | 407 | No measurement status was received from the device within 5 minutes. |  |
| Abnormal measurement result. | 408 | The measurement result reported is abnormal, possibly due to the abnormal measured temperature or ambient temperature. |  |
| Call in progress. | 409 | Wait for the measurement result. |  |
| Measurement service conflict. | 410 | The SDK on the phone was starting SpO2 or body temperature measurement. |  |
