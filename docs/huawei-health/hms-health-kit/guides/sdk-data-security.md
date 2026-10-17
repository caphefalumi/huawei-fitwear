<!--
  Title: SDK Data Security
  Catalog: HMSCore-Guides-V5
  Document ID: sdk-data-security-0000001050071699-V5
  Updated: 2021-05-27 00:46:54
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/sdk-data-security-0000001050071699-V5
-->
# SDK Data Security

#### How Does the SDK Work?

The SDK needs to be integrated into your app during app packaging. It starts when the app is launched and stops as soon as the app is closed, without performing any operations in the background.

#### What Permissions Are Required for Using the SDK?

**SDK Permissions**

Your app integrating Health Kit does not need to apply for additional permissions from the phone system.

**Health Core Permissions**

You can call the Health Kit APIs via the HMS Core SDK that has been integrated into the phone. The call of the Health Kit APIs will ultimately be processed by Health Core. Health Core must be granted with permissions to call the various APIs. The statement of the related permissions should be provided in the privacy statement of the developer.

- Network access permission: used to synchronize data between Health Core and Health Kit cloud.
- Physical activity permission: used for real-time step counting.

#### What Data Does the SDK Collect?

Health Kit will never proactively collect or process users' personal data. It works only at the request of third-party apps. Upon user authorization, a third-party app can read and write data on Health Kit within permission scopes. Data will be synced to the Health Kit cloud. The following table lists the data types and scopes supported by Health Kit. For details about the mapping between scopes and permissions, see [Scopes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopes-0000001050092713-V5) in the *API Reference*.

| **Category** | **Data Item** | **Scope Name** | **Scope Permission URL (Inaccessible)** | **Permissions** |
| --- | --- | --- | --- | --- |
| Personal information | Height and weight | HEALTHKIT_HEIGHTWEIGHT_READ | https://www.huawei.com/healthkit/heightweight.read | Views the height and weight in Health Kit. |
| HEALTHKIT_HEIGHTWEIGHT_WRITE | https://www.huawei.com/healthkit/heightweight.write | Stores the height and weight in Health Kit. |  |  |
| Fitness data | Step count | HEALTHKIT_STEP_READ | https://www.huawei.com/healthkit/step.read | Views the step count in Health Kit. |
| HEALTHKIT_STEP_WRITE | https://www.huawei.com/healthkit/step.write | Stores the step count in Health Kit. |  |  |
| Fitness data | Distance and climbing height | HEALTHKIT_DISTANCE_READ | https://www.huawei.com/healthkit/distance.read | Views the distance and climbing height in Health Kit. |
| HEALTHKIT_DISTANCE_WRITE | https://www.huawei.com/healthkit/distance.write | Stores the distance and climbing height in Health Kit. |  |  |
| Fitness data | Speed | HEALTHKIT_SPEED_READ | https://www.huawei.com/healthkit/speed.read | Views the speed in Health Kit. |
| HEALTHKIT_SPEED_WRITE | https://www.huawei.com/healthkit/speed.write | Stores the speed in Health Kit. |  |  |
| Fitness data | Calories (including the BMR) | HEALTHKIT_CALORIES_READ | https://www.huawei.com/healthkit/calories.read | Views the calories (including the BMR) in Health Kit. |
| HEALTHKIT_CALORIES_WRITE | https://www.huawei.com/healthkit/calories.write | Stores calories (including the BMR) in Health Kit. |  |  |
| Fitness data | Pulmonary function data (e.g. VO2 Max) | HEALTHKIT_PULMONARY_READ | https://www.huawei.com/healthkit/pulmonary.read | Views the pulmonary function data (e.g. VO2 Max) in Health Kit. |
| HEALTHKIT_PULMONARY_WRITE | https://www.huawei.com/healthkit/pulmonary.write | Stores the pulmonary function data (e.g. VO2 Max) in Health Kit. |  |  |
| Fitness data | Medium- and high-intensity data | HEALTHKIT_STRENGTH_READ | https://www.huawei.com/healthkit/strength.read | Views medium- and high-intensity data in Health Kit. |
| HEALTHKIT_STRENGTH_WRITE | https://www.huawei.com/healthkit/strength.write | Stores medium- and high-intensity data in Health Kit. |  |  |
| Fitness data | Activity data (such as activity points, workout, strength, jump, running posture, cycling, and activity duration) | HEALTHKIT_ACTIVITY_READ | https://www.huawei.com/healthkit/activity.read | Views the activity data (such as activity points, workout, strength, jump, running posture, cycling, and activity duration) in Health Kit. |
| HEALTHKIT_ACTIVITY_WRITE | https://www.huawei.com/healthkit/activity.write | Stores the activity data (such as activity points, workout, strength, jump, running posture, cycling, and activity duration) in Health Kit. |  |  |
| Fitness data | Location data (including the trajectory) | HEALTHKIT_LOCATION_READ | https://www.huawei.com/healthkit/location.read | Views the location data (including the trajectory) in Health Kit. |
| HEALTHKIT_LOCATION_WRITE | https://www.huawei.com/healthkit/location.write | Stores the location data (including the trajectory) in Health Kit. |  |  |
| Health data | Sleep data | HEALTHKIT_SLEEP_READ | https://www.huawei.com/healthkit/sleep.read | Views the sleep data in Health Kit. |
| HEALTHKIT_SLEEP_WRITE | https://www.huawei.com/healthkit/sleep.write | Stores the sleep data in Health Kit. |  |  |
| Health data | Heart rate data | HEALTHKIT_HEARTRATE_READ | https://www.huawei.com/healthkit/heartrate.read | Views the heart rate data in Health Kit. |
| HEALTHKIT_HEARTRATE_WRITE | https://www.huawei.com/healthkit/heartrate.write | Stores the heart rate data in Health Kit. |  |  |
| Health data | Nutrition data | HEALTHKIT_NUTRITION_READ | https://www.huawei.com/healthkit/nutrition.read | Views the nutrition data in Health Kit. |
| HEALTHKIT_NUTRITION_WRITE | https://www.huawei.com/healthkit/nutrition.write | Stores the nutrition data in Health Kit. |  |  |
| Health data | Stress data | HEALTHKIT_STRESS_READ | https://www.huawei.com/healthkit/stress.read | Views the stress data in Health Kit. |
| HEALTHKIT_STRESS_WRITE | https://www.huawei.com/healthkit/stress.write | Stores the stress data in Health Kit. |  |  |
| Restricted health data | Blood glucose data | HEALTHKIT_BLOODGLUCOSE_READ | https://www.huawei.com/healthkit/bloodglucose.read | Views the blood glucose data in Health Kit. |
| HEALTHKIT_BLOODGLUCOSE_WRITE | https://www.huawei.com/healthkit/bloodglucose.write | Stores the blood glucose data in Health Kit. |  |  |
| Restricted health data | Blood pressure data | HEALTHKIT_BLOODPRESSURE_READ | https://www.huawei.com/healthkit/bloodpressure.read | Views the blood pressure data in Health Kit. |
| HEALTHKIT_BLOODPRESSURE_WRITE | https://www.huawei.com/healthkit/bloodpressure.write | Stores the blood pressure data in Health Kit. |  |  |
| Restricted health data | Blood oxygen data | HEALTHKIT_OXYGENSTATURATION_READ | https://www.huawei.com/healthkit/oxygensaturation.read | Views the blood oxygen data in Health Kit. |
| HEALTHKIT_OXYGENSTATURATION_WRITE | https://www.huawei.com/healthkit/oxygensaturation.write | Stores the blood oxygen data in Health Kit. |  |  |
| Restricted health data | Body temperature data | HEALTHKIT_BODYTEMPERATURE_READ | https://www.huawei.com/healthkit/bodytemperature.read | Views the body temperature data in Health Kit. |
| HEALTHKIT_BODYTEMPERATURE_WRITE | https://www.huawei.com/healthkit/bodytemperature.write | Stores the body temperature data in Health Kit. |  |  |
| Restricted health data | Reproductive data | HEALTHKIT_REPRODUCTIVE_READ | https://www.huawei.com/healthkit/reproductive.read | Views the reproductive data in Health Kit. |
| HEALTHKIT_REPRODUCTIVE_WRITE | https://www.huawei.com/healthkit/reproductive.write | Stores the reproductive data in Health Kit. |  |  |
| Workout record data | Activity data (such as activity points, workout, strength, running posture, cycling, and activity duration) | HEALTHKIT_ACTIVITY_RECORD_READ | https://www.huawei.com/healthkit/activityrecord.read | Views the activity data (such as activity points, workout, strength, running posture, cycling, and activity duration) in Health Kit. |
| HEALTHKIT_ACTIVITY_RECORD_WRITE | https://www.huawei.com/healthkit/activityrecord.write | Stores the activity data (such as activity points, workout, strength, running posture, cycling, and activity duration) in Health Kit. |  |  |

#### How Does the SDK Protect Your Data?

The fitness and health data written by your app in Health Kit via the SDK will be periodically synched to the server.

**Data Access Control**

- Your app must pass the signature verification before calling the APIs of the Health Kit SDK.
- Your app requires user authorization before accessing required data through the SDK APIs.
- Your app can't read or write local fitness and health data when the phone screen is locked.

**Local Data Encryption**

If the Android version is later than 6.0 (API level: 23) or the system is HarmonyOS, the KeyStore encryption or the hierarchical protection mechanism for the system hardware is used to ensure the security and reliability of local data.

**Server Data Protection**

- The fitness and health data on the server is protected with user-level keys and is encrypted using AES GCM 256.
- The encryption key of the fitness and health data is stored on the KMS server and is isolated from user data.
