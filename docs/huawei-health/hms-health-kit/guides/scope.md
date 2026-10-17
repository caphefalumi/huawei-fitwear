<!--
  Title: Scopes
  Catalog: HMSCore-Guides-V5
  Document ID: scope-0000001053805684-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/scope-0000001053805684-V5
-->
# Scopes

| Type | **Data Type** | **Description** | Reading | Read Permission Scope – URL | Read Permission Scope – Constant | Writing | Write Permission Scope – URL | Write Permission Scope – Constant |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Health behavior management | Personal profile | Includes the gender, date of birth, height, and weight. | √ | https://www.huawei.com/healthkit/extend/healthbehavior.read Read the health behavior information in the Health app via Health Kit. | HEALTHKIT_EXTEND_HEALTHBEHAVIOR_READ Read permission for health behavior management | × | - | - |
| Basic workout management | Daily activities | Includes step count (statistics and details), distance, calories, and medium- and high-intensity activities. | √ | https://www.huawei.com/healthkit/ext end/sport.read Read the basic workout information in the Health app via Health Kit. | HEALTHKIT_EXTEND_SPORT_READ Read permission for basic workout management | × | - | - |
| Single workout record | Includes the walking, running, and cycling records, but does not include GPS tracks. | √ | × | - | - |  |  |  |
| Real-time workout data | Includes the duration, distance, speed, heart rate, calories, step count, step cadence, stroke count, and stroke rate. | √ | × | - | - |  |  |  |
| Heart health/Sleep management | Sleep | Includes TruSleep data such as sleep scores and sleep durations, as well as regular sleep data. | √ | https://www.huawei.com/healthkit/extend/hearthealthsleep.read Read the heart health/sleep information in the Health app via Health Kit. | HEALTHKIT_EXTEND_HEARTHEALTHSLEEP_READ Read permission for heart health/sleep management | × | - | - |
| Heart health | Includes daily heart statistics and real-time heart measurement data: • Daily heart statistics include the heart rate range, resting heart rate, and heart rate details. • Real-time heart rate measurement data includes real-time heart rate and heart RR interval (RRI). | √ | × | - | - |  |  |  |
| Diet/Fat reduction management | Weight | Includes the weight, BMI, fat rate, muscle mass, and other related data measured by the body fat scale. | √ | https://www.huawei.com/healthkit/extend/fatreduction.read Read the diet/fat reduction information in the Health app via Health Kit. | HEALTHKIT_EXTEND_FATREDUCTION_READ Read permission for diet/Fat reduction management | √ | https://www.huawei.com/healthkit/extend/fatreduction.write Write the diet/fat reducation information to the Health app via Health Kit. | HEALTHKIT_EXTEND_FATREDUCTION_WRITE Write permission for diet/fat reducation management (including weight) |
| Emotion/Stress management | Stress | Includes the stress values. | √ | https://www.huawei.com/healthkit/extend/emotion.read Read the emotion/stress information in the Health app via Health Kit. | HEALTHKIT_EXTEND_EMOTION_READ Read permission for emotion/stress management | × | - | - |
| Chronic disease management | Blood oxygen | Includes daily maximum, minimum, and average blood oxygen level of the day, as well as the last measured blood oxygen level of each day. | √ | https://www.huawei.com/healthkit/extend/chronicdisease.read Read the chronic disease information in the Health app via Health Kit. | HEALTHKIT_EXTEND_CHRONICDISEASE_READ Read permission for chronic disease management | × | - | - |

- The read and write permissions are available for the user authorization scopes involved in the extended Health Kit capabilities. You should apply for corresponding permissions based on service characteristics when creating your product on HUAWEI Developers.
- When the user uses the service for the first time, the scope set applied by the developer will be displayed on the HUAWEI ID authorization screen for the user to view. The related APIs can only be called after the user grants the authorization. After any changes are made to the scope set due to service updates or any other reason, a prompt should appear to ask the user to grant the authorization again.
- You must encrypt the above user data before storing it.
- Your app should allow users to revoke some or all of the granted permissions.
