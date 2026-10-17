<!--
  Title: Version Change History
  Catalog: HMSCore-Guides-V5
  Document ID: version-change-history-0000001053214729-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/version-change-history-0000001053214729-V5
-->
# Version Change History

#### 5.1.0.300 (2021-01-08)

| SDK version for Android: com.huawei.hihealth:hihealthkit:5.1.0.300 **Modified Features** • Changed the button for applying data read and write permissions from "Apply for HiHealth Kit" to "[Apply for Health Kit](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/apply-kitservice-0000001071254802-V5)." • Changed the procedure for [Signing In and Applying for Permissions](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/requesting-user-authorization-0000001071733944-V5) to be consistent with that of the basic Health Kit capabilities. **New Features** • [Querying Daily Activities](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/querying-dailyactivity-0000001053253403-V5): Added step count details data. • [Querying Health Data](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/querying-singleworkout-record-0000001053333367-V5): Added stress and heart rate details. • Added support for [Pagination](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/pagination-query-0000001071262988-V5). • [Obtaining Real-time Data](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/obtaining-real-time-data-0000001050163997-V5): Added the running form data. • [Obtaining the API Level](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/obtains-apilevel-0000001065048142-V5): Added support for obtaining the API level of the extended Health Kit capabilities. |
| --- |

> **Note:** Requires HUAWEI Health 11.0.3.512 or later.

#### Earlier Versions

## 5.0.0.300 (2020-09-08)

| Android version: com.huawei.hihealth:hihealthkit:5.0.0.300 **Modified Features** Added the [registerSportData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s512ed23831a84b2599f373fcba5a0edf) and [unregisterSportData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s7fbc2f62cbfc4c79804033c9a152ef27) APIs to respectively replace [startRealTimeSportData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sfaf64b0d1548424589ee475625fde7e6) and [stopRealTimeSportData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s8d062799e6a04e2581beaaf08c5f1bbb) (deprecated). **New Features** • Added the support for querying the blood oxygen data, real-time workout data from Huawei-certified treadmills, elliptical machines, rowing machines, and spinning bikes, and regular sleep data. • Added the [startSport](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sf6a11c0ecf0548049fdc2eb38cbcf922) and [stopSport](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sf7d47f4c11ab4f98a5dc5c0687ae59a9) APIs that allow users to start and stop the current workout session on your app, without having to be redirected to the HUAWEI Health app screen. Currently, four types of exercise are supported: outdoor walking, outdoor running, outdoor cycling, and indoor running. • Added the [getDataAuthStatusEx](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthauth-0000001072149458-V5#EN-US_TOPIC_0000001136987077__s1c759c481a46468aa0e9afca971142a3) API that allows you to check whether a user has granted related permissions. • Optimized [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). |
| --- |

## Documents of Earlier Versions

[HiHealth 5.0.0.300](https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/overview-0000001050060843)
