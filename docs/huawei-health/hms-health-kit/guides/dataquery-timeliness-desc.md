<!--
  Title: Data Query Timeliness
  Catalog: HMSCore-Guides-V5
  Document ID: dataquery-timeliness-desc-0000001058864328-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/dataquery-timeliness-desc-0000001058864328-V5
-->
# Data Query Timeliness

You are recommended to comply with the following suggestions to improve user experience:

| Ecosystem App Classification | Suggestions on Data Query Methods | Description | Suggestion |
| --- | --- | --- | --- |
| Mobile apps such as Codoon and Keep | Periodic query in the background: Enable the background to query data in the wee hours of the morning every day or every four hours. | This helps ensure data integrity. | It is recommended that the three methods be combined to ensure data integrity and timeliness. |
| Proactive query in the background: When a user opens an app and accesses the data display screen, the app automatically queries the latest data from the Health Kit platform. | This helps ensure that real-time data can be obtained. |  |  |
| Manual data synchronization: Add a button for manual data synchronization to screens such as the Health Kit authorization linking screen. | When the background synchronization is abnormal, users can use the manual synchronization mode. |  |  |
| Background server ecosystem apps | Periodic query in the background: Enable the background to query data in the wee hours of the morning every day or every four hours. | This helps ensure data integrity. | - |
| Utilize the subscription notification mechanism of the Cloud API to obtain user data in a timely manner. | This helps ensure that real-time data can be obtained. (Will be supported in later versions. Please stay tuned.) | Recommended for ecosystem apps that have strong requirements on data timeliness, such as sports events and reward apps. |  |
