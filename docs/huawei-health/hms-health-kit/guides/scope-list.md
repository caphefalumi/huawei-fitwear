<!--
  Title: Scopes
  Catalog: HMSCore-Guides-V5
  Document ID: scope-list-0000001055419280-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/scope-list-0000001055419280-V5
-->
# Scopes

#### Health Kit Scope List

| Type | **Scope Permission URL (Inaccessible)** | Security Level | Description |
| --- | --- | --- | --- |
| Personal data | https://www.huawei.com/healthkit/heightweight.read | High | Views the height and weight in Health Kit. |
| https://www.huawei.com/healthkit/heightweight.write | High | Stores the height and weight in Health Kit. |  |
| Health data | https://www.huawei.com/healthkit/sleep.read | High | Views the sleep data in Health Kit. |
| https://www.huawei.com/healthkit/sleep.write | High | Stores the sleep data in Health Kit. |  |
| https://www.huawei.com/healthkit/heartrate.read | High | Views the heart rate data (including heart rate, resting heart rate, and heart rate during workout) in Health Kit. |  |
| https://www.huawei.com/healthkit/heartrate.write | High | Stores the heart rate data (including heart rate, resting heart rate, and heart rate during workout) in Health Kit. |  |
| https://www.huawei.com/healthkit/nutrition.read | High | Views the nutrition data in Health Kit. |  |
| https://www.huawei.com/healthkit/nutrition.write | High | Stores the nutrition data in Health Kit. |  |
| https://www.huawei.com/healthkit/stress.read | High | Views the stress data in Health Kit. |  |
| https://www.huawei.com/healthkit/stress.write | High | Stores the stress data in Health Kit. |  |
| Fitness data | https://www.huawei.com/healthkit/step.read | High | Views the step count in Health Kit. |
| https://www.huawei.com/healthkit/step.write | High | Stores the step count in Health Kit. |  |
| https://www.huawei.com/healthkit/distance.read | High | Views the distance and climbing height in Health Kit. |  |
| https://www.huawei.com/healthkit/distance.write | High | Stores the distance and climbing height in Health Kit. |  |
| https://www.huawei.com/healthkit/speed.read | High | Views the speed data in Health Kit. |  |
| https://www.huawei.com/healthkit/speed.write | High | Stores the speed data in Health Kit. |  |
| https://www.huawei.com/healthkit/calories.read | High | Views the calories (including the BMR) in Health Kit. |  |
| https://www.huawei.com/healthkit/calories.write | High | Stores calories (including the BMR) in Health Kit. |  |
| https://www.huawei.com/healthkit/pulmonary.read | High | Views the pulmonary function data (e.g. VO2 Max) in Health Kit. |  |
| https://www.huawei.com/healthkit/pulmonary.write | High | Stores the pulmonary function data (e.g. VO2 Max) in Health Kit. |  |
| https://www.huawei.com/healthkit/strength.read | High | Views medium- and high-intensity data in Health Kit. |  |
| https://www.huawei.com/healthkit/strength.write | High | Stores medium- and high-intensity data in Health Kit. |  |
| https://www.huawei.com/healthkit/activity.read | High | Views the activity data (such as activity points, workout, jump, strength, running posture, cycling, and activity duration) in Health Kit. |  |
| https://www.huawei.com/healthkit/activity.write | High | Stores the activity data (such as activity points, workout, strength, jump, running posture, cycling, and activity duration) in Health Kit. |  |
| https://www.huawei.com/healthkit/location.read | High | Views the location data (including the trajectory) in Health Kit. |  |
| https://www.huawei.com/healthkit/location.write | High | Stores the location data (including the trajectory) in Health Kit. |  |
| Restricted data types | https://www.huawei.com/healthkit/bloodglucose.read | High | Views the blood glucose data in Health Kit. |
| https://www.huawei.com/healthkit/bloodglucose.write | High | Stores the blood glucose data in Health Kit. |  |
| https://www.huawei.com/healthkit/bloodpressure.read | High | Views the blood pressure data in Health Kit. |  |
| https://www.huawei.com/healthkit/bloodpressure.write | High | Stores the blood pressure data in Health Kit. |  |
| https://www.huawei.com/healthkit/oxygensaturation.read | High | Views the blood oxygen data in Health Kit. |  |
| https://www.huawei.com/healthkit/oxygensaturation.write | High | Stores the blood oxygen data in Health Kit. |  |
| https://www.huawei.com/healthkit/bodytemperature.read | High | Views the body temperature data in Health Kit. |  |
| https://www.huawei.com/healthkit/bodytemperature.write | High | Stores the body temperature data in Health Kit. |  |
| https://www.huawei.com/healthkit/reproductive.read | High | Views the reproductive data in Health Kit. |  |
| https://www.huawei.com/healthkit/reproductive.write | High | Stores the reproductive data in Health Kit. |  |
| https://www.huawei.com/healthkit/hearthealth.read | High | Views the heart health data in Health Kit. |  |
| https://www.huawei.com/healthkit/hearthealth.write | High | Stores the heart health data in Health Kit. |  |
| Workout records | https://www.huawei.com/healthkit/activityrecord.read | High | Views user activity records in Health Kit. |
| https://www.huawei.com/healthkit/activityrecord.write | High | Stores user activity records in Health Kit. |  |

- The read-only and write-only permissions are available for the user authorization scopes involved in the Health Kit open services. You should apply for corresponding permissions based on service characteristics when creating your product on HUAWEI Developers.
- When the user uses the service for the first time, the scope set applied by the developer will be displayed on the HUAWEI ID authorization screen for the user to view. The related APIs can only be called after the user grants the authorization. After any changes are made to the scope set due to service updates or any other reason, a prompt should appear to ask the user to grant the authorization again.
- Partners must encrypt user data with high security levels before storing it. Huawei will adjust the security level of user data in a timely manner based on business changes and requirements of relevant laws and regulations.
- The app should allow users to revoke some or all of the granted permissions.
