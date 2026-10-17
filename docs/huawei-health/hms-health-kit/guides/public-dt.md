<!--
  Title: Public Data Types
  Catalog: HMSCore-Guides-V5
  Document ID: public-dt-0000001050069714-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5
-->
# Public Data Types

Public data types are standard data types provided by the platform. An app can read and write data of these types.

#### Application Scenarios

- Your app When creating a data collector, you need to specify the corresponding data types. Each data type has one or more fields. For details about how to build a data collector, see the [setDataType(DataType dataType)](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollector_builder-0000001050162310-V5#EN-US_TOPIC_0000001053367046__section155754267164) method in [DataCollector](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollector_class-0000001050164265-V5). For details about data types, see [DataType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datatype-0000001050089916-V5).

- Your app server When creating a data collector, you need to specify the corresponding Health data types. For details about the API, see [Creating a Data Collector](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_create-0000001050114852-V5). > **Note:** Approval required: indicates whether the permission corresponding to the data type needs to be manually approved when applying for the Health Kit service. Discrete: indicates the sampling data type corresponding to discrete time points. Cumulative: indicates the sampling data type corresponding to a continuous time range. For details about the mapping between data type names and client data type constants, see [Mapping Between Client Data Type Constants and Public Data Types](#EN-US_TOPIC_0000001051066438__section1259142711212).

#### Public Atomic Data Types

Data types in this table allow write and read operations from an app.

| **Data Type** | **Desc** | **Field** | **Type** | Optional (O)/Mandatory (M) | Approval Required? | Data Classification | Unit/**Desc** | Value Range |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| com.huawei.continuous.steps.delta | Step count. | steps_delta | int | M | No | Cumulative | Step | Value range over 1 second: (0, 10] Value range over 1 minute: (0, 600] Value range over 1 hour: (0, 36000] |
| com.huawei.continuous.distance.delta | Distance. | distance_delta | float | M | No | Cumulative | Meter | Value range over 1 second: (0, 100] Value range over 1 minute: (0, 6000] Value range over 1 hour: (0, 360000] |
| com.huawei.continuous.calories.burnt | Calories burnt. | calories | double | M | No | Cumulative | Kcal | Value range over 1 second: (0, 0.555555555555556) Value range over 1 minute: (0, 33.333333333333333) Value range over 1 hour: (0, 2000] |
| com.huawei.instantaneous.heart_rate | Heart rate. | bpm | float | M | Yes | Discrete | Times/minute | (0, 255) |
| com.huawei.instantaneous.body_weight | Weight. | body_weight | float | M | No | Discrete | kg | (1, 560) |
| bmi | float | O | kg/m2 | [1.0, 200.0] |  |  |  |  |
| body_fat | float | O | kg | (1, 560) |  |  |  |  |
| body_fat_rate | float | O | Percentage | (0.0, 100.0] |  |  |  |  |
| muscle_mass | float | O | kg | (0.1, 150) |  |  |  |  |
| basal_metabolism | float | O | Kcal/day | (0, 10000) |  |  |  |  |
| moisture | float | O | kg | (0, 500). Accurate to the first decimal place. |  |  |  |  |
| moisture_rate | float | O | Percentage | (0.0, 100.0]. Accurate to the first decimal place. |  |  |  |  |
| visceral_fat_level | float | O | - | [1.0, 59.0]. Accurate to the first decimal place. |  |  |  |  |
| bone_salt | float | O | kg | [0.5, 5.0] |  |  |  |  |
| protein_rate | float | O | Percentage | (0.0, 100.0]. Accurate to the first decimal place. |  |  |  |  |
| body_age | int | O | - | [5, 99] |  |  |  |  |
| body_score | float | O | Percentage | (0.0, 100.0]. Accurate to the first decimal place. |  |  |  |  |
| skeletal_musclel_mass | float | O | kg | (1.0, 150) |  |  |  |  |
| impedance | float | O | Ohm | (0.1, 100000.0) |  |  |  |  |
| com.huawei.instantaneous.blood_glucose | Blood glucose concentration. | level | float | M | Yes | Discrete | mmol/L | [1.0, 100.0]. It is recommended that the number be accurate to the first decimal place. |
| measure_time | int | M | Enum | Time for measuring blood glucose. The values can be: **1**: before breakfast (on an empty stomach) **2**: after breakfast **3**: before lunch **4**: after lunch **5**: before dinner **6**: after dinner **7**: before bedtime **8**: in the wee hours of the morning **9**: in random times |  |  |  |  |
| sample_source | int | O | Enum | Source from which the blood glucose is measured. The values can be: **1**: interstitial fluid **2**: capillary blood **3**: plasma **4**: serum **5**: tears **6**: whole blood |  |  |  |  |
| com.huawei.instantaneous.blood_pressure | Blood pressure. | systolic_pressure | float | M | Yes | Discrete | mmHg | [40, 300] |
| diastolic_pressure | float | M | mmHg | [30, 200] |  |  |  |  |
| body_posture | int | O | Enum | Body posture during blood pressure measurement. The values can be: **1**: standing **2**: sitting **3**: lying **4**: semi-reclining |  |  |  |  |
| measure_body_part_of_blood_pressure | int | O | Enum | Blood pressure measurement position. The values can be: **1**: left wrist **2**: right wrist **3**: left upper arm **4**: right upper arm |  |  |  |  |
| com.huawei.continuous.sleep.fragment | Sleep state. | sleep_state | int | M | Yes | Cumulative | Enum | The values can be: **1**: light sleep **2**: REM sleep **3**: deep sleep **4**: awake **5**: nap |
| com.huawei.instantaneous.spo2 | Blood oxygen saturation. | saturation | float | M | Yes | Discrete | Percentage | (0, 100] |
| oxygen_supply_flow_rate | float | M | L/min | (0, 1500) |  |  |  |  |
| oxygen_therapy | int | O | Enum | The values can be: **1**: oxygen therapy via the nasal cannula |  |  |  |  |
| spo2_measurement_mechanism | int | O | Enum | The values can be: **1**: oxygen saturation measured in peripheral capillaries |  |  |  |  |
| spo2_measurement_approach | int | O | Enum | The values can be: **1**: oxygen saturation measured by the pulse oximetry. |  |  |  |  |
| com.huawei.instantaneous.speed | Speed. | speed | float | M | No | Discrete | Meter/second | - |
| com.huawei.instantaneous.steps.rate | Step cadence. | step_rate | float | M | No | Discrete | Steps/minute | - |
| com.huawei.continuous.exercise_intensity.v2 | Medium- and high-intensity. | exercise_type | int | M | No | Discrete | Enum | **1**: walking **2**: running **3**: cycling **4**: training **5**: heart rate **6**: climbing **7**: swimming **8**: other |
| com.huawei.instantaneous.location.sample | GPS position. | latitude | double | M | Yes | Discrete | Degree | - |
| longitude | double | M | Degree | - |  |  |  |  |
| precision | double | M | Meter | - |  |  |  |  |
| altitude | double | M | Meter | - |  |  |  |  |
| com.huawei.instantaneous.height | Height. | height | float | M | No | Discrete | Meter | (0.4, 2.6) |
| com.huawei.continuous.activity.fragment | Active fragment. | type_of_activity | int | M | No | Cumulative | Enum | See [Activity Type Constants](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/activity-types-0000001050071667-V5). |
| com.huawei.instantaneous.power.sample | Instantaneous power generated when performing an activity | power | float | M | No | Discrete | Watt | - |
| com.huawei.instantaneous.nutrition_facts | Food and nutrition facts. | nutrients_facts | Map<String, float> | M | Yes | Discrete | Calories/gram | - |
| meal | int | O | - | - |  |  |  |  |
| food | String | O | - | - |  |  |  |  |
| com.huawei.instantaneous.hydrate | Water taken over a single drink. | hydrate | float | M | Yes | Discrete | Liter | - |
| com.huawei.instantaneous.body.temperature | Body temperature. | temperature | float | M | Yes | Discrete | Degree Celsius | - |
| measure_body_part_of_temperature | int | O | Enum | The options are as follows: **1**: axillary temperature **2**: finger temperature **3**: forehead temperature **4**: oral temperature **5**: rectal temperature **6**: temporal artery temperature **7**: toe temperature **8**: tympanic membrane temperature **9**: wrist temperature **10**: vaginal temperature |  |  |  |  |
| com.huawei.instantaneous.body.temperature.rest | Body temperature when resting. | temperature | float | M | Yes | Discrete | Degree Celsius | - |
| measure_body_part_of_temperature | int | O | Enum | The options are as follows: **1**: axillary temperature **2**: finger temperature **3**: forehead temperature **4**: oral temperature **5**: rectal temperature **6**: temporal artery temperature **7**: toe temperature **8**: tympanic membrane temperature **9**: wrist temperature **10**: vaginal temperature |  |  |  |  |
| com.huawei.instantaneous.cervical_mucus | Cervical mucus. | texture | int | M | Yes | Discrete | Enum | The values can be: **1**: dry **2**: sticky **3**: creamy **4**: watery **5**: egg white |
| amount | int | M | Enum | The values can be: **1**: light **2**: medium **3**: heavy |  |  |  |  |
| com.huawei.instantaneous.cervical_status | Cervical state. | position | int | O | Yes | Discrete | Enum | The values can be: **1**: low **2**: medium **3**: high |
| dilation_status | int | O | Enum | The values can be: **1**: closed **2**: partially opened **3**: fully opened |  |  |  |  |
| firmness_level | int | O | Enum | The values can be: **1**: soft **2**: medium **3**: firm |  |  |  |  |
| com.huawei.continuous.menstrual_flow | Menstrual volume. | volume | int | M | Yes | Cumulative | Enum | The values can be: **1**: very light (spotting) **2**: light **3**: medium **4**: heavy |
| com.huawei.instantaneous.ovulation_detection | Ovulation test result | detection_result | int | M | Yes | Discrete | Enum | The values can be: **1**: negative **2**: positive |
| com.huawei.instantaneous.vaginal_speckle | Vaginal spotting. | appearance | int | M | Yes | Discrete | - | The value can only be **1**. |
| com.huawei.instantaneous.biking.pedaling.rate | Pedaling rate. | rpm | float | M | No | Discrete | Rotations/minute | - |
| com.huawei.instantaneous.biking.wheel_rotation | Wheel speed. | rpm | float | M | No | Discrete | Rotations/minute | - |
| com.huawei.instantaneous.stress | Stress. | score | int | M | Yes | Discrete | Score | [1, 99] |
| grade | int | M | Discrete | Enum | The values can be: **1**: relaxed **2**: normal **3**: medium **4**: high |  |  |  |
| measure_type | int | O | Discrete | Enum | The values can be: **1**: active **2**: passive |  |  |  |
| com.huawei.instantaneous.resting_heart_rate | Resting heart rate | bpm | float | M | Yes | Discrete | Times/minute | [30, 160] |
| com.huawei.continuous.jump | Jump | jump_height | float | M | No | Cumulative | Meter | (0, 2.45] |
| passage_duration | int | M | No | Millisecond | (0, 2100] |  |  |  |
| com.huawei.instantaneous.exercise_heart_rate | Heart rate during workout | bpm | float | M | No | Discrete | Times/minute | (0, 255) |
| com.huawei.continuous.ecg_record | ECG measurement record | ecg_type | int | M | Yes | Cumulative | Enum | Access via REST is supported. The options are as follows: **1**: 1-lead **6**: 6-lead **12**: 12-lead **18**: 18-lead |
| avg_heart_rate | int | M | Times/minute | (0, 255) |  |  |  |  |
| ecg_arrhythmia_type | long | O | Enum | Access via REST is supported. The values can be: **1**: sinus rhythm **2**: atrial fibrillation **4**: premature ventricular beats **8**: atrial premature beats **16**: tachycardia **32**: bradycardia **64**: uncertain |  |  |  |  |
| user_symptom | long | O | Enum | Access via REST is supported. The values can be: **1**: no discomfort **2**: chest congestion **4**: chest pain **8**: panic **16**: dyspnea **32**: dizziness **64**: fatigue **128**: poor sleep **256**: cold and fever **512**: other |  |  |  |  |
| sampling_frequency | int | O | Hz | [0, 1000] |  |  |  |  |
| ecg_algorithm_version | String | O | - | - |  |  |  |  |
| com.huawei.continuous.ecg_detail | ECG measurement details | ecg_type | int | M | Yes | Discrete | Enum | Access via REST is supported. The options are as follows: **1**: 1-lead **6**: 6-lead **12**: 12-lead **18**: 18-lead |
| voltage_datas | String | O | - | - |  |  |  |  |

#### Public Statistical Data Types

Data types in this table can only be read (but not written) by an app.

For details about the mapping between statistical data types and atomic data types, see [Mapping Between Statistical Data Types and Atomic Data Types](#EN-US_TOPIC_0000001051066438__section1319045413231).

| **Data Type Name** | **Desc** | **Field** | **Type** | Optional (O)/Mandatory (M) | Approval Required? | Data Classification | Unit | Use Cases |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| com.huawei.continuous.steps.total | Step count. | steps | int | M | No | Cumulative | Step | • Aggregation statistics • Activity record statistics • Real-time data reading • Access via Android devices or REST is supported. |
| com.huawei.continuous.distance.total | Distance. | distance | float | M | No | Cumulative | Meter | • Aggregation statistics • Activity record statistics • Access via Android devices or REST is supported. |
| com.huawei.continuous.calories.burnt.total | Calories burnt. | calories_total | double | M | No | Cumulative | Kcal | • Aggregation statistics • Activity record statistics • Access via Android devices or REST is supported. |
| com.huawei.continuous.heart_rate.statistics | Heart rate. | avg | float | M | Yes | Cumulative | Times | • Aggregation statistics • Activity record statistics • Access via Android devices or REST is supported. |
| max | float | M | Times |  |  |  |  |  |
| min | float | M | Times |  |  |  |  |  |
| com.huawei.continuous.body_weight.statistics | Weight. | avg | float | M | No | Cumulative | kg | • Aggregation statistics • Access via Android devices or REST is supported. |
| max | float | M | kg |  |  |  |  |  |
| min | float | M | kg |  |  |  |  |  |
| com.huawei.continuous.sleep.statistics | Sleep statistics. | fall_asleep_time | long | M | Yes | Cumulative | Millisecond | • Aggregation statistics • Activity record statistics • Access via Android devices or REST is supported. |
| wakeup_time | long | M | Millisecond |  |  |  |  |  |
| light_sleep_time | int | M | Minute |  |  |  |  |  |
| deep_sleep_time | int | M | Minute |  |  |  |  |  |
| dream_time | int | M | Minute |  |  |  |  |  |
| awake_time | int | M | Minute |  |  |  |  |  |
| all_sleep_time | int | M | Minute |  |  |  |  |  |
| wakeup_count | int | M | Times |  |  |  |  |  |
| deep_sleep_part | int | M | Times |  |  |  |  |  |
| go_bed_time | long | O | Millisecond |  |  |  |  |  |
| com.huawei.continuous.steps.rate.statistics | Step cadence. | avg | float | M | No | Cumulative | Times | • Activity record statistics • Access via Android devices or REST is supported. |
| max | float | M | Times |  |  |  |  |  |
| min | float | M | Times |  |  |  |  |  |
| com.huawei.continuous.blood_glucose.statistics | Blood glucose concentration. | avg | float | M | Yes | Cumulative | mmol/L | • Aggregation statistics • Access via REST is supported. |
| max | float | M | mmol/L |  |  |  |  |  |
| min | float | M | mmol/L |  |  |  |  |  |
| correlation_with_mealtime | integer | O | - |  |  |  |  |  |
| meal | integer | O | - |  |  |  |  |  |
| correlation_with_sleep_state | integer | O | - |  |  |  |  |  |
| sample_source | integer | O | - |  |  |  |  |  |
| com.huawei.continuous.body.blood_pressure.statistics | Blood pressure. | systolic_pressure_avg | float | M | Yes | Cumulative | mmHg | • Aggregation statistics • Access via REST is supported. |
| systolic_pressure_max | float | M | mmHg |  |  |  |  |  |
| systolic_pressure_min | float | M | mmHg |  |  |  |  |  |
| diastolic_pressure_avg | float | M | mmHg |  |  |  |  |  |
| diastolic_pressure_max | float | M | mmHg |  |  |  |  |  |
| diastolic_pressure_min | float | M | mmHg |  |  |  |  |  |
| body_posture | integer | O | - |  |  |  |  |  |
| measure_body_part | integer | O | - |  |  |  |  |  |
| com.huawei.continuous.spo2.statistics | Blood oxygen. | saturation_avg | float | M | Yes | Cumulative | Percentage | • Aggregation statistics • Access via REST is supported. |
| saturation_max | float | M | Percentage |  |  |  |  |  |
| saturation_min | float | M | Percentage |  |  |  |  |  |
| oxygen_supply_flow_rate_avg | float | M | L/min |  |  |  |  |  |
| oxygen_supply_flow_rate_max | float | M | L/min |  |  |  |  |  |
| oxygen_supply_flow_rate_min | float | M | L/min |  |  |  |  |  |
| oxygen_therapy | integer | O | - |  |  |  |  |  |
| spo2_measurement_mechanism | integer | O | - |  |  |  |  |  |
| spo2_measurement_approach | integer | O | - |  |  |  |  |  |
| com.huawei.continuous.speed.statistics | Instantaneous speed. | avg | float | M | No | Cumulative | Meter/second | • Aggregation statistics • Access via REST is supported. |
| max | float | M | Meter/second |  |  |  |  |  |
| min | float | M | Meter/second |  |  |  |  |  |
| com.huawei.continuous.exercise_intensity.v2.statistics | Medium- and high-intensity. | intensity_map | Map<Integer, Integer> | M | No | Cumulative | - | • Aggregation statistics • Access via Android devices or REST is supported. |
| com.huawei.continuous.height.statistics | Height. | avg | float | M | No | Cumulative | Meter | • Aggregation statistics • Access via REST is supported. |
| max | float | M | Meter |  |  |  |  |  |
| min | float | M | Meter |  |  |  |  |  |
| com.huawei.instantaneous.stress.statistics | Stress. | avg | int | M | Yes | Discrete | Score | • Aggregation statistics • Access via Android devices or REST is supported. |
| max | int | M | Score |  |  |  |  |  |
| min | int | M | Score |  |  |  |  |  |
| last | int | M | Score |  |  |  |  |  |
| measure_count | int | M | Times |  |  |  |  |  |
| com.huawei.continuous.resting_heart_rate.statistics | Resting heart rate | avg | float | M | Yes | Discrete | Times/minute | • Aggregation statistics • Access via Android devices or REST is supported. |
| max | float | M | Times/minute |  |  |  |  |  |
| min | float | M | Times/minute |  |  |  |  |  |
| last | float | M | Times/minute |  |  |  |  |  |
| com.huawei.continuous.jump.statistics | Jump | jump_times | int | M | No | Cumulative | Times | • Aggregation statistics • Activity record statistics • Access via Android devices or REST is supported. |
| avg_jump_height | float | O | No | Meter |  |  |  |  |
| max_jump_height | float | O | No | Meter |  |  |  |  |
| min_jump_height | float | O | No | Meter |  |  |  |  |
| avg_passage_duration | int | O | No | Millisecond |  |  |  |  |
| max_passage_duration | int | O | No | Millisecond |  |  |  |  |
| min_passage_duration | int | O | No | Millisecond |  |  |  |  |
| com.huawei.continuous.body.temperature.statistics | Body temperature | avg | float | M | Yes | Cumulative | Degree Celsius | • Aggregation statistics • Access via Android devices or REST is supported. |
| max | float | M | Yes | Degree Celsius |  |  |  |  |
| min | float | M | Yes | Degree Celsius |  |  |  |  |
| com.huawei.continuous.exercise_heart_rate.statistics | Heart rate during workout | avg | float | M | Yes | Cumulative | Times | • Aggregation statistics • Activity record statistics • Access via Android devices or REST is supported. |
| max | float | M | Yes | Times |  |  |  |  |
| min | float | M | Yes | Times |  |  |  |  |

> **Note:** For **intensity_map** of **com.huawei.continuous.exercise_intensity.v2.statistics**: The key is **exercise_type**. For details, see **com.huawei.continuous.exercise_intensity.v2**. The value indicates the duration of the **exercise_type** in the statistical period. The unit is minute.

#### Mapping Between Client Data Type Constants and Public Data Types

| Data Type Field | **Data Type** |
| --- | --- |
| DataType.DT_CONTINUOUS_STEPS_DELTA | com.huawei.continuous.steps.delta |
| DataType.DT_CONTINUOUS_DISTANCE_DELTA | com.huawei.continuous.distance.delta |
| DataType.DT_CONTINUOUS_CALORIES_BURNT | com.huawei.continuous.calories.burnt |
| DataType.DT_INSTANTANEOUS_HEART_RATE | com.huawei.instantaneous.heart_rate |
| DataType.DT_CONTINUOUS_SLEEP | com.huawei.continuous.sleep.fragment |
| DataType.DT_INSTANTANEOUS_HEIGHT | com.huawei.instantaneous.height |
| DataType.DT_INSTANTANEOUS_SPEED | com.huawei.instantaneous.speed |
| DataType.DT_INSTANTANEOUS_STEPS_RATE | com.huawei.instantaneous.steps.rate |
| DataType.DT_CONTINUOUS_ACTIVITY_SEGMENT | com.huawei.continuous.activity.fragment |
| DataType.DT_INSTANTANEOUS_POWER_SAMPLE | com.huawei.instantaneous.power.sample |
| DataType.DT_INSTANTANEOUS_HYDRATE | com.huawei.instantaneous.hydrate |
| HealthDataTypes.DT_INSTANTANEOUS_BODY_TEMPERATURE | com.huawei.instantaneous.body.temperature |
| DataType.DT_INSTANTANEOUS_BIKING_PEDALING_RATE | com.huawei.instantaneous.biking.pedaling.rate |
| DataType.DT_INSTANTANEOUS_BIKING_WHEEL_ROTATION | com.huawei.instantaneous.biking.wheel_rotation |
| HealthDataTypes.DT_INSTANTANEOUS_BODY_TEMPERATURE_REST | com.huawei.instantaneous.body.temperature.rest |
| DataType.DT_INSTANTANEOUS_BODY_WEIGHT | com.huawei.instantaneous.body_weight |
| HealthDataTypes.DT_INSTANTANEOUS_BLOOD_GLUCOSE | com.huawei.instantaneous.blood_glucose |
| HealthDataTypes.DT_INSTANTANEOUS_BLOOD_PRESSURE | com.huawei.instantaneous.blood_pressure |
| HealthDataTypes.DT_INSTANTANEOUS_SPO2 | com.huawei.instantaneous.spo2 |
| DataType.DT_INSTANTANEOUS_LOCATION_SAMPLE | com.huawei.instantaneous.location.sample |
| DataType.DT_INSTANTANEOUS_NUTRITION_FACTS | com.huawei.instantaneous.nutrition_facts |
| HealthDataTypes.DT_INSTANTANEOUS_CERVICAL_MUCUS | com.huawei.instantaneous.cervical_mucus |
| HealthDataTypes.DT_INSTANTANEOUS_CERVICAL_STATUS | com.huawei.instantaneous.cervical_status |
| HealthDataTypes.DT_CONTINUOUS_MENSTRUAL_FLOW | com.huawei.continuous.menstrual_flow |
| HealthDataTypes.DT_INSTANTANEOUS_OVULATION_DETECTION | com.huawei.instantaneous.ovulation_detection |
| HealthDataTypes.DT_INSTANTANEOUS_VAGINAL_SPECKLE | com.huawei.instantaneous.vaginal_speckle |
| DataType.DT_INSTANTANEOUS_STRESS | com.huawei.instantaneous.stress |
| DataType.DT_INSTANTANEOUS_RESTING_HEART_RATE | com.huawei.instantaneous.resting_heart_rate |
| DataType.DT_INSTANTANEOUS_EXERCISE_HEART_RATE | com.huawei.instantaneous.exercise_heart_rate |
| DataType.DT_CONTINUOUS_JUMP | com.huawei.continuous.jump |
| DataType.DT_CONTINUOUS_EXERCISE_INTENSITY_V2 | com.huawei.continuous.exercise_intensity.v2 |
| DataType.DT_CONTINUOUS_STEPS_TOTAL | com.huawei.continuous.steps.total |
| DataType.DT_CONTINUOUS_DISTANCE_TOTAL | com.huawei.continuous.distance.total |
| DataType.DT_CONTINUOUS_CALORIES_BURNT_TOTAL | com.huawei.continuous.calories.burnt.total |
| DataType.POLYMERIZE_CONTINUOUS_HEART_RATE_STATISTICS | com.huawei.continuous.heart_rate.statistics |
| DataType.POLYMERIZE_CONTINUOUS_BODY_WEIGHT_STATISTICS | com.huawei.continuous.body_weight.statistics |
| HealthDataTypes.POLYMERIZE_CONTINUOUS_BODY_TEMPERATURE_STATISTICS | com.huawei.continuous.body.temperature.statistics |
| DataType.DT_STATISTICS_SLEEP | com.huawei.continuous.sleep.statistics |
| DataType.DT_INSTANTANEOUS_STRESS_STATISTICS | com.huawei.instantaneous.stress.statistics |
| DataType.DT_RESTING_HEART_RATE_STATISTICS | com.huawei.continuous.resting_heart_rate.statistics |
| DataType.DT_CONTINUOUS_JUMP_STATISTICS | com.huawei.continuous.jump.statistics |
| DataType.DT_CONTINUOUS_EXERCISE_HEART_RATE_STATISTICS | com.huawei.continuous.exercise_heart_rate.statistics |
| DataType.DT_STATISTICS_EXERCISE_INTENSITY_V2 | com.huawei.continuous.exercise_intensity.v2.statistics |
| DataType.DT_CONTINUOUS_STEPS_RATE_STATISTICS | com.huawei.continuous.steps.rate.statistics |
| HealthDataTypes.POLYMERIZE_CONTINUOUS_BODY_BLOOD_GLUCOSE_STATISTICS | com.huawei.continuous.blood_glucose.statistics |
| HealthDataTypes.POLYMERIZE_CONTINUOUS_BODY_BLOOD_PRESSURE_STATISTICS | com.huawei.continuous.body.blood_pressure.statistics |
| HealthDataTypes.POLYMERIZE_CONTINUOUS_SPO2_STATISTICS | com.huawei.continuous.spo2.statistics |
| DataType.POLYMERIZE_CONTINUOUS_SPEED_STATISTICS | com.huawei.continuous.speed.statistics |
| DataType.POLYMERIZE_CONTINUOUS_HEIGHT_STATISTICS | com.huawei.continuous.height.statistics |

#### Mapping Between Statistical Data Types and Atomic Data Types

| Statistical Data Type | Atomic Data Type |
| --- | --- |
| com.huawei.continuous.steps.total | com.huawei.continuous.steps.delta |
| com.huawei.continuous.distance.total | com.huawei.continuous.distance.delta |
| com.huawei.continuous.calories.burnt.total | com.huawei.continuous.calories.burnt |
| com.huawei.continuous.heart_rate.statistics | com.huawei.instantaneous.heart_rate |
| com.huawei.continuous.body_weight.statistics | com.huawei.instantaneous.body_weight |
| com.huawei.continuous.sleep.statistics | com.huawei.continuous.sleep.fragment |
| com.huawei.continuous.steps.rate.statistics | com.huawei.instantaneous.steps.rate |
| com.huawei.continuous.blood_glucose.statistics | com.huawei.instantaneous.blood_glucose |
| com.huawei.continuous.body.blood_pressure.statistics | com.huawei.instantaneous.blood_pressure |
| com.huawei.continuous.spo2.statistics | com.huawei.instantaneous.spo2 |
| com.huawei.continuous.speed.statistics | com.huawei.instantaneous.speed |
| com.huawei.continuous.exercise_intensity.v2.statistics | com.huawei.continuous.exercise_intensity.v2 |
| com.huawei.continuous.height.statistics | com.huawei.instantaneous.height |
| com.huawei.instantaneous.stress.statistics | com.huawei.instantaneous.stress |
| com.huawei.continuous.resting_heart_rate.statistics | com.huawei.instantaneous.resting_heart_rate |
| com.huawei.continuous.jump.statistics | com.huawei.continuous.jump |
| com.huawei.continuous.body.temperature.statistics | com.huawei.instantaneous.body.temperature |
| com.huawei.continuous.exercise_heart_rate.statistics | com.huawei.instantaneous.exercise_heart_rate |

#### Relationship Between Health Record Subdata Types

| Health Record Data Type | Subdata Type |
| --- | --- |
| com.huawei.continuous.ecg_record | com.huawei.continuous.ecg_detail |
