<!--
  Title: Starting and Ending Workout
  Catalog: HMSCore-Guides-V5
  Document ID: starting-ending-workout-0000001052835041-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/starting-ending-workout-0000001052835041-V5
-->
# Starting and Ending Workout

By calling [startSport](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sf6a11c0ecf0548049fdc2eb38cbcf922) or [stopSport](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sf7d47f4c11ab4f98a5dc5c0687ae59a9), you can start or end a workout in the HUAWEI Health app directly from your app. This means your app users do not need to open the HUAWEI Health app to start or end workouts. If the user has linked a watch with your app, the watch will automatically display the workout screen when the user starts a workout, and exit the screen when the workout ends. Currently, four types of exercise are supported: outdoor walking, outdoor running, outdoor cycling, and indoor running.

This function is usually used together with the function of obtaining real-time data. The calling sequence is as follows:

- [registerSportData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s512ed23831a84b2599f373fcba5a0edf) Start to obtain real-time workout data.
- [startSport](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sf6a11c0ecf0548049fdc2eb38cbcf922)(sportType1) Start workout type 1.
- [stopSport](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sf7d47f4c11ab4f98a5dc5c0687ae59a9)() Stop workout type 1.
- [startSport](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sf6a11c0ecf0548049fdc2eb38cbcf922)(sportType2) Start workout type 2.
- [stopSport](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sf7d47f4c11ab4f98a5dc5c0687ae59a9)() Stop workout type 2.
- [unregisterSportData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s7fbc2f62cbfc4c79804033c9a152ef27) Stop obtaining real-time workout data.

Before using any of the APIs, make sure that you have obtained the related permissions from Huawei. Otherwise, the API calling will fail. If the user has not authorized the related permission, the API calling will also fail.

> **Note:** The required permissions are the same as those used to obtain the real-time data. Make sure that you have obtained the real-time data permissions, and you will be able to call the preceding APIs. This feature is supported by the HUAWEI Health app version 10.1.2.513 or later.

| Data Openness Type | API | Requesting Permissions from User (See [Signing In and Applying for Permissions](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/requesting-user-authorization-0000001071733944-V5)) | Scope URL | Requesting Permissions from Huawei (See [Applying for Health Kit](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/apply-kitservice-0000001071254802-V5)) |
| --- | --- | --- | --- | --- |
| Start workout | [startSport](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sf6a11c0ecf0548049fdc2eb38cbcf922) | [HEALTHKIT_EXTEND_SPORT_READ](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthextendscope-0000001071609519-V5#EN-US_TOPIC_0000001136869919__HEALTHKIT_EXTEND_SPORT_READ) Read permission for basic workout management (including real-time workout data) | https://www.huawei.com/healthkit/extend/sport.read Read the basic workout information in the Health app via Health Kit. | Basic workout management |
| Stop workout | [stopSport](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sf7d47f4c11ab4f98a5dc5c0687ae59a9) |  |  |  |

#### Starting Workout

> **Note:** Mobile phone system permissions required for outdoor walking, running, and cycling: GPS positioning, storage permission, and background location permission. Mobile phone system permissions required for indoor running: storage permission.

- Call the [startSport](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sf6a11c0ecf0548049fdc2eb38cbcf922) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to start the workout of the corresponding type.
- The query result will be returned via the [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) object defined as an input parameter. **Sample code** 
```cpp
// Outdoor running.
int sportType = HiHealthKitConstant.SPORT_TYPE_RUN;
HiHealthDataStore.startSport(context, sportType, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object message) {
        if (resultCode == HiHealthError.SUCCESS) {
            Log.i(TAG, "start sport success");
        }
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| startSportcallback | ResultCallback | Result callback. | M |
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). | M |
| message | Object | Result description (string). | M |

#### Stopping Workout

- Call the [stopSport](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sf7d47f4c11ab4f98a5dc5c0687ae59a9) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to stop the workout of the corresponding type.
- The query result will be returned via the [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) object defined as an input parameter. **Sample code** 
```cpp
HiHealthDataStore.stopSport(context, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object message) {
        if (resultCode == HiHealthError.SUCCESS) {
            Log.i(TAG, "stop sport success");
        }
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| stopSportcallback | ResultCallback | Result callback. | M |
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). | M |
| message | Object | Result description (string). | M |

#### Constants of Workout Types that Support Starting and Stopping Workout

| Data Openness Type | Constant | Key Value |
| --- | --- | --- |
| Outdoor walking | HiHealthKitConstant.[SPORT_TYPE_WALK](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthkitconstant-0000001072627358-V5#EN-US_TOPIC_0000001090250912__SPORT_TYPE_WALK) | 257 |
| Outdoor running | HiHealthKitConstant.[SPORT_TYPE_RUN](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthkitconstant-0000001072627358-V5#EN-US_TOPIC_0000001090250912__SPORT_TYPE_RUN) | 258 |
| Outdoor cycling | HiHealthKitConstant.[SPORT_TYPE_BIKE](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthkitconstant-0000001072627358-V5#EN-US_TOPIC_0000001090250912__SPORT_TYPE_BIKE) | 259 |
| Indoor running | HiHealthKitConstant.[SPORT_TYPE_TREADMILL](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthkitconstant-0000001072627358-V5#EN-US_TOPIC_0000001090250912__SPORT_TYPE_TREADMILL) | 264 |
