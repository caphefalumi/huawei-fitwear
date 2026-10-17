<!--
  Title: Bundle Keys for Real-time Workout
  Catalog: HMSCore-Guides-V5
  Document ID: bundle-key-0000001054330104-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/bundle-key-0000001054330104-V5
-->
# Bundle Keys for Real-time Workout

| Workout Type | Outdoor Walking, Outdoor Running, Outdoor Cycling, and Indoor Running | Treadmill | Elliptical Machine | Rowing Machine | Spinning Bike | Valid Bundle Key | Value Type | Value Unit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GPS | √ | X | X | X | X | HiHealthKitConstant.BUNDLE_KEY_GPS | Integer | None **0**: disabled **1**: searching **2**: weak **3**: medium **4**: strong |
| Workout distance | √ | √ | √ | √ | √ | HiHealthKitConstant.BUNDLE_KEY_DISTANCE | Double | Meter |
| Workout duration | √ | √ | √ | √ | √ | HiHealthKitConstant.BUNDLE_KEY_DURATION | Integer | Second |
| Calories | √ | √ | √ | √ | √ | HiHealthKitConstant.BUNDLE_KEY_CALORIE | Integer | kcal |
| Speed | √ | √ | √ | X | √ | HiHealthKitConstant.BUNDLE_KEY_SPEED | Integer | Meter/second |
| Target workout distance | √ (requires extra configuration in workout settings) | X | X | X | X | HiHealthKitConstant.BUNDLE_KEY_DISTANCE_TARGET | Integer | Meter |
| Target workout duration | √ (requires extra configuration in workout settings) | X | X | X | X | HiHealthKitConstant.BUNDLE_KEY_TIME_TARGET | Integer | Second |
| Target calories burnt | √ (requires extra configuration in workout settings) | X | X | X | X | HiHealthKitConstant.BUNDLE_KEY_CALORIE_TARGET | Integer | kcal |
| Pace | √ | X | X | X | X | HiHealthKitConstant.BUNDLE_KEY_PACE | Integer | Second |
| Workout status | √ | √ | √ | √ | √ | HiHealthKitConstant.BUNDLE_KEY_SPORT_STATE | Integer | **0**: Workout starts. **1**: Workout is paused. **2**: Workout in progress. **3**: Workout resumed. **4**: Workout stopped. |
| Altitude | √ | X | X | X | X | HiHealthKitConstant.BUNDLE_KEY_ALTITUDE | Double | Meter |
| Target value | √ | X | X | X | X | HiHealthKitConstant.BUNDLE_KEY_TARGET_VALUE | Float | - |
| Original target | √ | X | X | X | X | HiHealthKitConstant.BUNDLE_KEY_ORIGIN_TARGET | Integer | - |
| Workout type | √ | √ | √ | √ | √ | HiHealthKitConstant.BUNDLE_KEY_SPORT_TYPE | Integer | - |
| Target type | √ | X | X | X | X | HiHealthKitConstant.BUNDLE_KEY_TARGET_TYPE | Integer | - |
| Track type | √ | X | X | X | X | HiHealthKitConstant.BUNDLE_KEY_TRACK_TYPE | Integer | - |
| Heart rate time | √ (requires the user to wear the wearable device) | X | X | X | X | HiHealthKitConstant.BUNDLE_KEY_HEARTRATE_TIME | Long | - |
| Heart rate (requires the user to wear the wearable device) | √ | √ | √ | √ | √ | HiHealthKitConstant. BUNDLE_KEY_HEARTRATE | Integer | bpm |
| Total number of steps | √ | √ | √ | X | X | HiHealthKitConstant.BUNDLE_KEY_TOTAL_STEPS | Integer | Steps |
| Step cadence | √ (requires the user to wear the wearable device) | √ | X | X | X | HiHealthKitConstant.BUNDLE_KEY_STEP_RATE | Integer | Steps/minute |
| Aerobic training | √ (requires the user to wear the wearable device) | X | X | X | X | HiHealthKitConstant.BUNDLE_KEY_AEROBIC_EXERCISE | Integer | - |
| Total elevation gain | √ (requires the user to wear the wearable device) | X | X | X | X | HiHealthKitConstant.BUNDLE_KEY_TOTAL_CREEP | Integer | Decimeter |
| Descent height | √ (requires the user to wear the wearable device) | X | X | X | X | HiHealthKitConstant. BUNDLE_KEY_TOTAL_DESCENT | Integer | Decimeter |
| Heart rate limit intervals | √ (requires the user to wear the wearable device) | X | X | X | X | HiHealthKitConstant. BUNDLE_KEY_HEART_RATE_ZONE | Integer | - |
| Performance indicator | √ (requires the user to wear the wearable device) | X | X | X | X | HiHealthKitConstant. BUNDLE_KEY_PERFORMANCE_INDICATOR | Integer | - |
| Workout start time | √ (requires the user to wear the wearable device) | X | X | X | X | HiHealthKitConstant. BUNDLE_KEY_SPORT_START_TIME | Long | - |
| Anaerobic training | √ (requires the user to wear the wearable device) | X | X | X | X | HiHealthKitConstant.BUNDLE_KEY_ANAEROBIC_EXERCISE | Integer | - |
| Link type | √ (requires the user to wear the wearable device) | X | X | X | X | HiHealthKitConstant.BUNDLE_KEY_LINK_TYPE | Integer | - |
| Resistance level | X | X | √ | X | √ | HiHealthKitConstant. BUNDLE_KEY_RESISTANCE_LEVEL | Integer | - |
| Power | X | X | √ | √ | √ | HiHealthKitConstant.BUNDLE_KEY_POWER | Integer | Watt |
| Step cadence | X | X | √ | X | √ | HiHealthKitConstant.BUNDLE_KEY_CADENCE | Integer | Times/minute |
| Stroke count | X | X | X | √ | X | HiHealthKitConstant. BUNDLE_KEY_TOTAL_PADDLE | Integer | Times/minute |
| Pace when connecting to the equipment | X | X | X | √ | X | HiHealthKitConstant. BUNDLE_KEY_AVERAGE_PACE | Integer | Second |
| Stroke rate | X | X | X | √ | X | HiHealthKitConstant. BUNDLE_KEY_TOTAL_PADDLE_FREQUENCY | Float | Times/minute |
| Landing time | √ (requires the user to wear the wearable device that is capable of detecting running forms) | √ (requires the user to wear the wearable device that is capable of detecting running forms) | X | X | X | HiHealthKitConstant.BUNDLE_KEY_CONTACT_TIMEE | Integer | Millisecond |
| Landing impact | √ (requires the user to wear the wearable device that is capable of detecting running forms) | √ (requires the user to wear the wearable device that is capable of detecting running forms) | X | X | X | HiHealthKitConstant.BUNDLE_KEY_IMPACT_ACC | Integer | Gravity acceleration |
| Swing angle | √ (requires the user to wear the wearable device that is capable of detecting running forms) | √ (requires the user to wear the wearable device that is capable of detecting running forms) | X | X | X | HiHealthKitConstant.BUNDLE_KEY_SWING_ANGLE | Integer | Degree |
| Eversion angles | √ (requires the user to wear the wearable device that is capable of detecting running forms) | √ (requires the user to wear the wearable device that is capable of detecting running forms) | X | X | X | HiHealthKitConstant.BUNDLE_KEY_EVERSION_EXCURSION | Integer | Degree |
| Hang time | √ (requires the user to wear the wearable device that is capable of detecting running forms) | √ (requires the user to wear the wearable device that is capable of detecting running forms) | X | X | X | HiHealthKitConstant.BUNDLE_KEY_HANG_TIME | Integer | Millisecond |
| Hang rate | √ (requires the user to wear the wearable device that is capable of detecting running forms) | √ (requires the user to wear the wearable device that is capable of detecting running forms) | X | X | X | HiHealthKitConstant.BUNDLE_KEY_IMPACT_HANG_RATE | Double | 1 |
| Forefoot strike step count | √ (requires the user to wear the wearable device that is capable of detecting running forms) | √ (requires the user to wear the wearable device that is capable of detecting running forms) | X | X | X | HiHealthKitConstant.BUNDLE_KEY_FOREFOOT_STRIKE_PATTERN | Integer | Steps |
| Midfoot strike step count | √ (requires the user to wear the wearable device that is capable of detecting running forms) | √ (requires the user to wear the wearable device that is capable of detecting running forms) | X | X | X | HiHealthKitConstant.BUNDLE_KEY_WHOLEFOOT_STRIKE_PATTERN | Integer | Steps |
| Heel strike step count | √ (requires the user to wear the wearable device that is capable of detecting running forms) | √ (requires the user to wear the wearable device that is capable of detecting running forms) | X | X | X | HiHealthKitConstant.BUNDLE_KEY_HINDFOOT_STRIKE_PATTERN | Integer | Steps |
