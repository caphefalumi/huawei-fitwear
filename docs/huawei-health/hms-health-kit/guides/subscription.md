<!--
  Title: Data Subscription Mechanism
  Catalog: HMSCore-Guides-V5
  Document ID: subscription-0000001078496860-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/subscription-0000001078496860-V5
-->
# Data Subscription Mechanism

The Health Kit cloud provides a subscription mechanism which notifies the app of user data changes in real time, ensuring that the app can always obtain the latest data.

#### Roles and Components

| Role/Component | Description |
| --- | --- |
| Subscriber | The app is the subscriber. When the user data changes, Health Kit notifies the callback address of the app's server. The subscriber is uniquely identified by a subscriber ID. |
| Event | User events, including authorization cancellation, activity record change (update or deletion), change of atomic data (update or deletion), and more. |
| Subscription record | Records the mappings between subscribers, users, and user events that subscribers listen for. The subscription record is uniquely identified by an ID. |
| Notification | Health Kit sends a notification to the subscriber's callback address to notify the subscriber of changes of the user event. |

#### Event Subscription

| Event Type | Event Type ID | Description | Metadata |
| --- | --- | --- | --- |
| User account event | USER_EVENT$REVOKE_ALL | Authorization cancellation event | - |
| USER_EVENT$REVOKE_PART | Partial authorization cancellation event |  |  |
| USER_EVENT$DELETE_USER | Account cancellation event |  |  |
| User activity event | ACTIVITY_RECORD_EVENT$UPDATE | Activity creation/update event | **metaKey**: • **startTime**: start time of data changes. • **endTime**: end time of data changes. • **activityType**: activity type corresponding to the activity record. • **timeZone**: time zone. |
| ACTIVITY_RECORD_EVENT$DELETE | User deletion event |  |  |
| Sampling dataset event | SAMPLESET_EVENT$UPDATE${DATATYPE} | Sampling dataset creation/update event | **metaKey**: • **startTime**: start time of data changes. • **endTime**: end time of data changes. • **datatype**: atomic sampling data type. • **timeZone**: time zone. • **recordDay**: date of an activity record. |
| SAMPLESET_EVENT$DELETE${DATATYPE} | Sampling dataset deletion event |  |  |
| Connectivity verification event | CONNECTION_VERIFY_EVENT$VERIFY | Callback URL connectivity verification event | N/A |

#### Subscribable Data Types in the Health App

| Event Type | Data Type | Activity Type/Data Type | Supported |
| --- | --- | --- | --- |
| User activity event | Activity record | See [Activity Type Constants](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/activity-types-0000001050071667-V5). | Yes |
| HUAWEI TruSleepTM | **activityType**: 65 | Yes |  |
| Sampling dataset event | Health details | com.huawei.instantaneous.body_weight | Yes |
| com.huawei.instantaneous.blood_glucose |  |  |  |
| com.huawei.instantaneous.blood_pressure |  |  |  |
| com.huawei.instantaneous.spo2 |  |  |  |
| Step count details | com.huawei.continuous.steps.delta | Yes |  |
| com.huawei.continuous.distance.delta |  |  |  |
| com.huawei.continuous.calories.burnt |  |  |  |
| Step count statistics | com.huawei.continuous.steps.total | Yes |  |
| com.huawei.continuous.distance.total |  |  |  |
| com.huawei.continuous.calories.burnt.total |  |  |  |
