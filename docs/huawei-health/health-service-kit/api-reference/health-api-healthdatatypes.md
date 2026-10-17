<!--
  Title: healthDataTypes (Health and Fitness Data Type Constants)
  Catalog: harmonyos-references
  Document ID: health-api-healthdatatypes
  Updated: 2026-10-14 09:35:45
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthdatatypes
-->
# healthDataTypes (Health and Fitness Data Type Constants)

This module provides constants of health and fitness data types.

**Since:** 5.0.0(12)

#### Modules to Import

```typescript
import { healthStore } from '@kit.HealthServiceKit';
```

> **Note:** This module is a sub-module of **healthStore** and needs to be used in **healthStore.healthDataTypes** mode.

#### Constants

**System capability:** SystemCapability.Health.HealthStore

**Since:** 5.0.0(12)

**Model restriction:** This API can be used only in the stage model.

| Name | Type | Description |
| --- | --- | --- |
| BLOOD_OXYGEN_SATURATION | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | SpO2 data type. |
| BLOOD_PRESSURE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Blood pressure data type. |
| BODY_TEMPERATURE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Body temperature data type. |
| DAILY_ACTIVITIES | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Daily activity data type. |
| EMOTION | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Emotion data type. **Since:** 5.1.0(18) |
| HEART_RATE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Dynamic heart rate data type. |
| HEART_RATE_VARIABILITY | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Heart rate variability data type. **Since:** 5.1.0(18) |
| HEIGHT | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Height data type. |
| RESTING_HEART_RATE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Resting heart rate data type. |
| SKIN_TEMPERATURE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Skin temperature data type. |
| STRESS | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Stress data type. |
| WEIGHT | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Weight data type. |
| SLEEP_RECORD | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Nighttime sleep data type. |
| SLEEP_NAP_RECORD | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Nap data type. |
| MENSTRUAL_CYCLE | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Menstrual cycle data type. **Since:** 6.1.1(24) |
| WORKOUT | [healthStore.DataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#datatype) | Workout record data type. |
| ADVENTURES | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Expedition subdata type. |
| AEROBICS | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Aerobics subdata type. |
| AIR_WALKER | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Air walker subdata type. |
| ARCHERY | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Archery subdata type. |
| BADMINTON | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Badminton subdata type. |
| BALLET | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Ballet subdata type. |
| BASEBALL | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Baseball subdata type. |
| BASKETBALL | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Basketball subdata type. |
| BEACH_SOCCER | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Beach soccer subdata type. |
| BEACH_VOLLEYBALL | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Beach volleyball subdata type. |
| BELLY_DANCE | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Belly dance subdata type. |
| BIATHLON | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Biathlon subdata type. |
| BMX | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | BMX cycling subdata type. |
| BODY_COMBAT | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Body combat subdata type. |
| BOWLING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Bowling subdata type. |
| BOXING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Boxing subdata type. |
| BREATH_HOLDING_TEST | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Apnea test subdata type. |
| BREATH_HOLDING_TRAIN | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Apnea training subdata type. |
| BUNGEE_JUMPING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Bungee jumping subdata type. |
| CANOEING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Canoeing subdata type. |
| CORE_TRAINING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Core training subdata type. |
| CRICKET | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Cricket subdata type. |
| CROSS_COUNTRY_SKIING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Cross-country skiing subdata type. |
| CROSS_FIT | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | CrossFit subdata type. |
| CURLING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Curling subdata type. |
| CYCLING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Outdoor cycling subdata type. |
| DANCE | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Dance subdata type. |
| DARTS | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Darts subdata type. |
| DIVING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Freediving subdata type. |
| DODGE_BALL | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Dodgeball subdata type. |
| DRAGON_BOAT | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Dragon boat subdata type. |
| DRIFTING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Drifting subdata type. |
| ELLIPTICAL | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Elliptical subdata type. |
| ESPORTS | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | eSports subdata type. |
| FENCING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Fencing subdata type. |
| FISHING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Fishing subdata type. |
| FREE_SPARRING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Free sparring subdata type. |
| FREE_TRAINING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Free training subdata type. |
| FRISBEE | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Frisbee subdata type. |
| FUNCTIONAL_TRAINING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Functional training subdata type. |
| GATEBALL | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Gateball subdata type. |
| GOLF_COURSE_MODEL | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Golf (course mode) subdata type. |
| GOLF_PRACTICE | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Golf (driving range mode) subdata type. |
| HANDBALL | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Handball subdata type. |
| HIIT | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | HIIT subdata type. |
| HIKING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Hiking subdata type. |
| HOCKEY | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Hockey subdata type. |
| HORSE_RIDING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Horse riding subdata type. |
| HULA_HOOP | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Hula hoop subdata type. |
| HUNTING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Battle game subdata type. |
| ICE_HOCKEY | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Ice hockey subdata type. |
| INDOOR_CYCLING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Indoor cycling subdata type. |
| INDOOR_RUNNING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Indoor running subdata type. |
| INDOOR_WALKING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Indoor walking subdata type. |
| JAZZ_DANCE | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Jazz dance subdata type. |
| JUMPING_ROPE | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Rope jumping subdata type. |
| KARATE | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Karate subdata type. |
| KENDO | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Kendo subdata type. |
| KITE_FLYING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Kite flying subdata type. |
| LATIN_DANCE | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Latin dance subdata type. |
| MARTIAL_ARTS | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Martial arts subdata type. |
| MOTORBOAT | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Motorboat subdata type. |
| MOUNTAIN_HIKE | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Mountain hike subdata type. |
| OBSTACLE_RACE | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Obstacle race subdata type. |
| OPEN_WATER_SWIM | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Open water swimming subdata type. |
| ORIENTEERING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Orienteering subdata type. |
| PADEL | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Padel subdata type. |
| PARACHUTE | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Parachuting subdata type. |
| PARALLEL_BARS | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Parallel bars subdata type. |
| PARKOUR | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Parkour subdata type. |
| PHYSICAL_TRAINING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Physical training subdata type. |
| PILATES | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Pilates subdata type. |
| PLAYGROUND_RACE | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Track run subdata type. |
| PLAZA_DANCING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Plaza dance subdata type. |
| POOL | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Pool subdata type. |
| POOL_SWIM | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Pool swimming subdata type. |
| RACING_CAR | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Auto racing subdata type. |
| ROCK_CLIMBING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Rock climbing subdata type. |
| ROLLER_SKATING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Roller skating subdata type. |
| ROWER | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Rower subdata type. |
| ROWING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Rowing subdata type. |
| RUGBY | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Rugby subdata type. |
| RUNNING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Outdoor running subdata type. |
| SAILBOAT | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Sailing subdata type. |
| SCUBA_DIVING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Scuba diving subdata type. |
| SENSE_SPORT | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Motion-controlled sports subdata type. |
| SEPAKTAKRAW | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Sepak takraw subdata type. |
| SHUTTLECOCK | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Shuttlecock subdata type. |
| SINGLE_BAR | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Single bar subdata type. |
| SKATEBOARD | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Skateboard subdata type. |
| SKATING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Skating subdata type. |
| SKIING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Skiing subdata type. |
| SLED | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Sledding subdata type. |
| SNOWBOARDING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Snowboarding subdata type. |
| SNOWMOBILE | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Snowmobile subdata type. |
| SOCCER | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Soccer subdata type. |
| SOFTBALL | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Softball subdata type. |
| SPINNING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Spinning subdata type. |
| SQUASH | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Squash subdata type. |
| STAIR_CLIMBING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Stair climbing subdata type. |
| STEPPER | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Stepper subdata type. |
| STREET_DANCE | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Street dance subdata type. |
| STRENGTH_TRAINING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Strength training subdata type. |
| SUP | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | SUP subdata type. |
| SURFING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Surfing subdata type. |
| SWINGING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Swinging subdata type. |
| TABLE_TENNIS | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Table tennis subdata type. |
| TAEKWONDO | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Taekwondo subdata type. |
| TAI_CHI | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Tai Chi subdata type. |
| TENNIS | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Tennis subdata type. |
| TRAIL_RUNNING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Trail running subdata type. |
| TRIATHLON | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Triathlon subdata type. |
| TUG_OF_WAR | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Tug of war subdata type. |
| VOLLEYBALL | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Volleyball subdata type. |
| WALKING | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Outdoor walking subdata type. |
| YOGA | [healthStore.SubDataType](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#subdatatype) | Yoga subdata type. |
