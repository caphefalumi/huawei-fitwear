<!--
  Title: Debugging and Verification
  Catalog: huaweihealth-Guides
  Document ID: test-verification-0000002594269424
  Updated: 2026-08-05 02:10:03
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/test-verification-0000002594269424
-->
# Debugging and Verification

You need to perform functional verification testing based on the following test cases.

| Test Case | Prerequisite | Step | Expected Result |
| --- | --- | --- | --- |
| Certificate configuration | • The industry app has obtained the access permission. • The industry app has integrated the Health Industry SDK. • The industry app has been installed on the mobile device. | • Call the API for setting the certificate path. • Call the API for querying the certificate path. • Call the API for deleting the certificate path. | For step 1, the certificate path is set successfully. For step 2, the certificate path is queried successfully, and the returned certificate path is consistent with that set in step 1. For step 3, the certificate path is deleted successfully. |
| Device connection | • The industry app has obtained the access permission and preconfigured the required certificate. • The industry app has integrated the Health Industry SDK. • The industry app has been installed on the mobile device. | • Call the API for registering a listener for the industry wearable connection status. • Call the API for scanning for industry wearables. • Call the API for connecting to the industry wearable. • Call the API for disconnecting from the industry wearable. • Call the API for connecting to the industry wearable. • Call the API for deleting the industry wearable. | For step 2, the industry wearables that can be connected are detected. For step 3, the industry app is successfully connected to the industry wearable. Status code **1** and then **2** are returned. For step 4, the industry wearable is successfully disconnected, and status code **3** is returned. For step 6, the industry wearable is successfully deleted, and status code **3** is returned. |
| Device configuration | • The industry app has obtained the access permission and preconfigured the required certificate. • The industry app has integrated the Health Industry SDK. • The industry app has been installed on the mobile device. • The industry wearable has been connected to the mobile device through the industry app. | Taking setting and querying basic user information as an example: • Call the API for setting basic user information. • Call the API for querying basic user information. | For step 1, the basic user information is set successfully. For step 2, the basic user information is queried successfully, and the basic user information returned is consistent with what you have set in step 1. |
| Health data | Taking SpO2 data query as an example: • Wear an industry wearable. • Measure SpO2 on the industry wearable. • Call the API for querying SpO2 data. | For step 3, the SpO2 data is queried and returned successfully. |  |
| Daily activity data | Taking daily activity data query as an example: • Wear an industry wearable. • Start an outdoor walk workout on the wearable and walk. • Call the API for querying daily activity data. | For step 3, the daily activity data is queried and returned successfully. |  |
| Log management | • Call the API for setting the log switch. • Call the API for querying the log switch state. | For step 1, the log switch is set successfully. For step 2, the log switch state is queried successfully, and the returned state is consistent with that set in step 1. |  |
| Workout data | Taking activity record query as an example: • Wear an industry wearable. • Start an outdoor walk workout on the wearable and walk. • Call the API for querying activity records. | For step 3, the activity record data is queried and returned successfully. |  |
