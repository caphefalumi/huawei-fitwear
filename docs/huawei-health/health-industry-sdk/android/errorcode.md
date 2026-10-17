<!--
  Title: Result Codes
  Catalog: huaweihealth-Guides
  Document ID: errorcode-0000002372870401
  Updated: 2026-08-05 02:10:04
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/errorcode-0000002372870401
-->
# Result Codes

| Category | Description | Value | Suggested Solution |
| --- | --- | --- | --- |
| Universal result codes | Operation successful. | 0 | N/A |
| General error. | 1 | Contact the O&M personnel for assistance. |  |
| Invalid parameter. | 2 | Verify the input parameters. |  |
| API not supported. | 3 | Verify that the command is valid. Verify that the API level of the server-side SDK is correct. |  |
| Request timed out. | 4 | Verify that the device is connected. |  |
| Authorization certificate failed to be verified. | 5 | Verify that the certificate is correctly configured. Verify that the network status is normal. |  |
| Internal error. | 6 | Try again. If the retry fails, contact the O&M personnel for assistance. |  |
| Device not connected. | 7 | Connect the device and try again. |  |
| Subscription data returned successfully. | 8 | N/A |  |
| Parameters not configured. | 9 | Configure related parameters, such as user information, the maximum heart rate, and heart rate zone. |  |
| Event reported. | 10 | There's a single workout data, daily activity data, or blood pressure measurement update event. Query the corresponding data on the wearable. |  |
| Service conflict. | 11 | The same task is being executed. Call the API after the current task is complete. |  |
| Feature not activated. | 12 | The feature corresponding to the currently used API is not activated. Call the activation API to activate the feature first. |  |
| Scanning successful. | 20 | N/A |  |
| Scanning failed. | 21 | Verify that the app is running properly. |  |
| Scanning complete. | 22 | N/A |  |
| Bluetooth disabled. | 23 | Enable Bluetooth. |  |
| Feedback on template-based notifications. | 24 | N/A |  |
| Device to be added not found. | 25 | Scan for devices again. |  |
| No permission granted. | 26 | Apply for the permission. For details, please refer to [Adding Permissions](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/add-permission-0000002338138528). |  |
| The number of devices allowed to be paired by the developer certificate has been used up. | 27 | Apply for a developer certificate again. |  |
| The number of wearables paired with the current mobile device has reached the threshold. | 28 | Delete unused devices and try again. |  |
| Device does not support the specified Bluetooth type. | 29 | N/A |  |
| Device does not support the current capability. | 30 | N/A |  |
| Device cannot be added repeatedly. | 31 | Delete the device and then add it again. |  |
| Location disabled. | 32 | Enable the location function. |  |
| Scanning… | 33 | A scanning task is being processed. Try again after the scanning task is complete. |  |
| File does not exist. | 40 | Check whether the file exists or whether you have the permission to access the file. |  |
| File size exceeds the maximum supported by the Bluetooth protocol. | 41 | N/A |  |
| Duplicate file. | 42 | Do not transfer the same file, such as a song, repeatedly. |  |
| File name contains special characters that are not supported by the device. | 43 | N/A |  |
| Insufficient storage on device. | 44 | Before transferring files, verify that the remaining storage space on the device is sufficient. |  |
| Communication status codes between the industry app and wearable app | App has not been installed on the wearable. | 200 | Install the app on the wearable. |
| App has been installed on the wearable but not launched. | 201 | Open the wearable app. |  |
| App has been installed on the wearable and launched. | 202 | N/A |  |
| System error. | 203 | N/A |  |
| Message (or file) failed to be sent or received. | 206 | N/A |  |
| Message (or file) sent, received, or canceled successfully. | 207 | N/A |  |
| File transfer progress. | 208 | N/A |  |
| The number of subscriptions to the communications with wearable apps exceeds the maximum. (A maximum of 10 subscriptions with different wearable app package names are supported.) | 209 | Cancel some of the existing subscriptions before making new subscriptions. |  |
| File in the queue. | 210 | The file is in the transmission queue. Do not transfer the same file repeatedly. |  |
| Real-time sensor data subscription status codes | Sensor type not supported. | 300 | N/A |
| Sensor occupied. | 301 | The sensor does not support simultaneous subscription from multiple devices. Cancel the current subscription and try again. |  |
| Subscription to the current data not supported on [smart wearables](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557) in the [specified BLE connection mode](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/add-device-0000002338138536#EN-US_TOPIC_0000002678163965__li2517961181). | 302 | Use the [auto mode](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/add-device-0000002338138536#EN-US_TOPIC_0000002678163965__li132048191618) to pair and connect to the [smart wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557), and then subscribe to the data again. |  |
| Device not worn or removed. | 303 | Subscribe to the data after the device is worn. |  |
| Device control and device event status codes | Measurement in progress. | 401 | N/A |
| Measurement completed. | 402 | N/A |  |
| Measurement canceled. | 403 | The user has canceled the measurement on the device. |  |
| Measurement cannot be started. | 404 | A higher-priority function is currently running on the wearable. |  |
| Wearable not worn. | 405 | Wear the wearable. |  |
| Wearable not worn properly. | 406 | Wear the wearable properly before calling the API. |  |
| Measurement timed out. | 407 | No measurement status was received from the device within 5 minutes. |  |
| Abnormal measurement result. | 408 | The measurement result reported is abnormal, possibly due to the abnormal measured temperature or ambient temperature. |  |
| Call in progress. | 409 | Wait for the measurement result. |  |
| Measurement service conflict. | 410 | The SDK on the wearable was starting SpO2 or body temperature measurement. |  |
| Music synchronizing status codes | Music app on the device is not authorized. | 500 | For a [smart wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557), you need to open the music app on it and grant the access to storage before querying, adding, or deleting songs. If the access to storage is not granted, the SDK returns this error code. For a [lite wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li1184517579555) or [smart band](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li19369195911148), there is no restriction on the storage access permission. |
| Device does not support the music format. | 501 | N/A |  |
| Device does not support certain HD audio formats. | 502 | N/A |  |
| The number of songs exceeds the maximum supported by the device. | 503 | N/A |  |
| The number of songs to be deleted exceeds the maximum supported. | 504 | N/A |  |
| Status codes for device connection state broadcasts | Unknown error. | 0 | Reconnect the device. |
| Connecting… | 1 | N/A |  |
| Connection successful. | 2 | N/A |  |
| Disconnected. | 3 | N/A |  |
| Connection failed. | 4 | Reconnect the device. |  |
| Failed to verify the validity period of the authorization certificate. | 5 | Check the validity period of the certificate. |  |
