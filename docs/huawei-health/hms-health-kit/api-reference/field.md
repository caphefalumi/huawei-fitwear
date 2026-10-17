<!--
  Title: Field
  Catalog: HMSCore-References-V5
  Document ID: field-0000001050090134-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/field-0000001050090134-V5
-->
# Field

| Class Info |
| --- |
| public class Field implements Parcelable Fields for common data types. |

#### Public Field Summary

| Qualifier and Type | Field and Description |
| --- | --- |
| static final int | [FORMAT_INT32](#EN-US_TOPIC_0000001053048310__section476754517298) Field that contains integer values. |
| static final int | [FORMAT_FLOAT](#EN-US_TOPIC_0000001053048310__section87691745112919) Field that contains float values. |
| static final int | [FORMAT_STRING](#EN-US_TOPIC_0000001053048310__section27711545142918) Field that contains string values. |
| static final int | [FORMAT_MAP](#EN-US_TOPIC_0000001053048310__section167758459292) Field that contains mapped values. |
| static final int | [FORMAT_LONG](#EN-US_TOPIC_0000001053048310__section1029863519578) Field that contains long integer values. |
| static final int | [FORMAT_DOUBLE](#EN-US_TOPIC_0000001053048310__section134113775720) Field that contains double-precision floating-point values. |
| static final int | [MEAL_UNKNOWN](#EN-US_TOPIC_0000001053048310__section13778174512292) Unknown meal type. |
| static final int | [MEAL_BREAKFAST](#EN-US_TOPIC_0000001053048310__section19780174516294) Breakfast. |
| static final int | [MEAL_LUNCH](#EN-US_TOPIC_0000001053048310__section57831845172919) Lunch. |
| static final int | [MEAL_DINNER](#EN-US_TOPIC_0000001053048310__section3786154511292) Dinner. |
| static final int | [MEAL_SNACK](#EN-US_TOPIC_0000001053048310__section17788145152910) Snack. |
| static final int | [TYPE_OF_RESISTANCE_UNKNOWN](#EN-US_TOPIC_0000001053048310__section0792114513296) Use of an unknown object for resistance during an exercise. |
| static final int | [TYPE_OF_RESISTANCE_BARBELL](#EN-US_TOPIC_0000001053048310__section1795164512911) Use of a barbell for resistance during an exercise. |
| static final int | [TYPE_OF_RESISTANCE_CABLE](#EN-US_TOPIC_0000001053048310__section77971745182917) Use of a cable for resistance during an exercise. |
| static final int | [TYPE_OF_RESISTANCE_DUMBBELL](#EN-US_TOPIC_0000001053048310__section118091245122917) Use of a dumbbell for resistance during an exercise. |
| static final int | [TYPE_OF_RESISTANCE_KETTLEBELL](#EN-US_TOPIC_0000001053048310__section281234514299) Use of a kettlebell for resistance during an exercise. |
| static final int | [TYPE_OF_RESISTANCE_MACHINE](#EN-US_TOPIC_0000001053048310__section1281415453293) Use of a machine for resistance during an exercise. |
| static final int | [TYPE_OF_RESISTANCE_BODY](#EN-US_TOPIC_0000001053048310__section17816245102913) Use of the user's own body weight for resistance during an exercise. |
| static final String | [NUTRIENTS_FACTS_CALORIES](#EN-US_TOPIC_0000001053048310__section68191045112910) Calories (kcal). |
| static final String | [NUTRIENTS_FACTS_TOTAL_FAT](#EN-US_TOPIC_0000001053048310__section38221545132919) Total fat (g). |
| static final String | [NUTRIENTS_FACTS_SATURATED_FAT](#EN-US_TOPIC_0000001053048310__section1482534592920) Saturated fat (g). |
| static final String | [NUTRIENTS_FACTS_UNSATURATED_FAT](#EN-US_TOPIC_0000001053048310__section58271145132914) Unsaturated fat (g). |
| static final String | [NUTRIENTS_FACTS_POLYUNSATURATED_FAT](#EN-US_TOPIC_0000001053048310__section883114516298) Polyunsaturated fat (g). |
| static final String | [NUTRIENTS_FACTS_MONOUNSATURATED_FAT](#EN-US_TOPIC_0000001053048310__section1083494515298) Monounsaturated fat (g). |
| static final String | [NUTRIENTS_FACTS_TRANS_FAT](#EN-US_TOPIC_0000001053048310__section1083814520299) Trans fat (g). |
| static final String | [NUTRIENTS_FACTS_CHOLESTEROL](#EN-US_TOPIC_0000001053048310__section6840154517294) Cholesterol (mg). |
| static final String | [NUTRIENTS_FACTS_SODIUM](#EN-US_TOPIC_0000001053048310__section1584374542914) Sodium (mg). |
| static final String | [NUTRIENTS_FACTS_POTASSIUM](#EN-US_TOPIC_0000001053048310__section128468453292) Potassium (mg). |
| static final String | [NUTRIENTS_FACTS_TOTAL_CARBS](#EN-US_TOPIC_0000001053048310__section1284824517291) Total carbohydrates (g). |
| static final String | [NUTRIENTS_FACTS_DIETARY_FIBER](#EN-US_TOPIC_0000001053048310__section3851124562918) Dietary fiber (g). |
| static final String | [NUTRIENTS_FACTS_SUGAR](#EN-US_TOPIC_0000001053048310__section188541745172915) Sugar amount (g). |
| static final String | [NUTRIENTS_FACTS_PROTEIN](#EN-US_TOPIC_0000001053048310__section1385684542911) Protein amount (g). |
| static final String | [NUTRIENTS_FACTS_VITAMIN_A](#EN-US_TOPIC_0000001053048310__section1585984519293) Vitamin A amount in international unit (IU). |
| static final String | [NUTRIENTS_FACTS_VITAMIN_C](#EN-US_TOPIC_0000001053048310__section108624454292) Vitamin C amount (mg). |
| static final String | [NUTRIENTS_FACTS_CALCIUM](#EN-US_TOPIC_0000001053048310__section5864194519291) Calcium amount (mg). |
| static final String | [NUTRIENTS_FACTS_IRON](#EN-US_TOPIC_0000001053048310__section168671245122920) Iron amount (mg). |
| static final Field | [FIELD_PRECISION](#EN-US_TOPIC_0000001053048310__section486915459291) Precision. |
| static final Field | [FIELD_ALTITUDE](#EN-US_TOPIC_0000001053048310__section7871445192911) Altitude. |
| static final Field | [FIELD_TYPE_OF_ACTIVITY](#EN-US_TOPIC_0000001053048310__section08732459298) Activity type. |
| static final Field | [FIELD_POSSIBILITY_OF_ACTIVITY](#EN-US_TOPIC_0000001053048310__section2087544513299) Activity type confidence. |
| static final Field | [FIELD_BPM](#EN-US_TOPIC_0000001053048310__section1087684532914) Heart rate. |
| static final Field | [FIELD_POSSIBILITY](#EN-US_TOPIC_0000001053048310__section3878245192910) Confidence level in the range of [0.0, 100.0]. |
| static final Field | [FIELD_SPAN](#EN-US_TOPIC_0000001053048310__section88811545172911) Duration. |
| static final Field | [FIELD_DISTANCE](#EN-US_TOPIC_0000001053048310__section4882174532914) Distance (m). |
| static final Field | [FIELD_DISTANCE_DELTA](#EN-US_TOPIC_0000001053048310__section17884174515294) Distance covered since the last reading. |
| static final Field | [FIELD_HEIGHT](#EN-US_TOPIC_0000001053048310__section888612452292) Height (m). |
| static final Field | [FIELD_STEPS_DELTA](#EN-US_TOPIC_0000001053048310__section208881845182914) Steps taken since the last reading. |
| static final Field | [FIELD_STEPS](#EN-US_TOPIC_0000001053048310__section1220075183018) Step count. |
| static final Field | [FIELD_STEP_LENGTH](#EN-US_TOPIC_0000001053048310__section1489204532913) Step length (m). |
| static final Field | [FIELD_LATITUDE](#EN-US_TOPIC_0000001053048310__section19894174511297) Latitude (degree). |
| static final Field | [FIELD_LONGITUDE](#EN-US_TOPIC_0000001053048310__section58961845182917) Longitude (degree). |
| static final Field | [FIELD_BODY_WEIGHT](#EN-US_TOPIC_0000001053048310__section1689704520298) Weight (kg). |
| static final Field | [FIELD_BMI](#EN-US_TOPIC_0000001053048310__section1019295711487) Body mass index, which is calculated via dividing the weight kilograms by the square meter of height (kg/m2). |
| static final Field | [FIELD_BODY_FAT](#EN-US_TOPIC_0000001053048310__section1689720501484) Body fat (kg), accurate to the first decimal place. |
| static final Field | [FIELD_BODY_FAT_RATE](#EN-US_TOPIC_0000001053048310__section1477631194812) Body fat rate (percentage). |
| static final Field | [FIELD_MUSCLE_MASS](#EN-US_TOPIC_0000001053048310__section739874510521) Muscle mass (kg). |
| static final Field | [FIELD_BASAL_METABOLISM](#EN-US_TOPIC_0000001053048310__section17648154613524) Basic metabolism (kcal/day). |
| static final Field | [FIELD_MOISTURE](#EN-US_TOPIC_0000001053048310__section1516934885217) Water weight (kg). |
| static final Field | [FIELD_MOISTURE_RATE](#EN-US_TOPIC_0000001053048310__section615171811612) Water rate (percentage). |
| static final Field | [FIELD_VISCERAL_FAT_LEVEL](#EN-US_TOPIC_0000001053048310__section81149497525) Visceral fat (level). |
| static final Field | [FIELD_BONE_SALT](#EN-US_TOPIC_0000001053048310__section1016215017521) Bone salt amount (kg). |
| static final Field | [FIELD_PROTEIN_RATE](#EN-US_TOPIC_0000001053048310__section1220855116523) Protein ratio (percentage). |
| static final Field | [FIELD_BODY_AGE](#EN-US_TOPIC_0000001053048310__section720213528523) Body age. |
| static final Field | [FIELD_BODY_SCORE](#EN-US_TOPIC_0000001053048310__section17265385214) Body score (score). |
| static final Field | [FIELD_SKELETAL_MUSCLEL_MASS](#EN-US_TOPIC_0000001053048310__section18893145375217) Skeletal muscle (kg). |
| static final Field | [FIELD_IMPEDANCE](#EN-US_TOPIC_0000001053048310__section3837854135213) Impedance (ohm). |
| static final Field | [FIELD_CIRCUMFERENCE](#EN-US_TOPIC_0000001053048310__section889964512916) Circumference of a body part (such as the hip, chest, and waist) in centimeters. |
| static final Field | [FIELD_SPEED](#EN-US_TOPIC_0000001053048310__section149031145102917) Speed (m/s). |
| static final Field | [FIELD_RPM](#EN-US_TOPIC_0000001053048310__section15905154512913) Rotations per minute or rate per minute. |
| static final Field | [FIELD_STEP_RATE](#EN-US_TOPIC_0000001053048310__section18908194582917) Step frequency. |
| static final Field | [FIELD_ROTATION](#EN-US_TOPIC_0000001053048310__section14910134519297) Rotations. |
| static final Field | [FIELD_CALORIES](#EN-US_TOPIC_0000001053048310__section2912545152912) Calories (kcal). |
| static final Field | [FIELD_CALORIES_TOTAL](#EN-US_TOPIC_0000001053048310__section1473218122120) Calories (kcal). |
| static final Field | [FIELD_POWER](#EN-US_TOPIC_0000001053048310__section591444515292) Power (Watt). |
| static final Field | [FIELD_HYDRATE](#EN-US_TOPIC_0000001053048310__section189167451299) Volume (liter). |
| static final Field | [FIELD_MEAL](#EN-US_TOPIC_0000001053048310__section191812459292) Meal type. |
| static final Field | [FIELD_FOOD](#EN-US_TOPIC_0000001053048310__section8920174512915) Food type. |
| static final Field | [FIELD_NUTRIENTS](#EN-US_TOPIC_0000001053048310__section692284513298) Nutrients. |
| static final Field | [FIELD_NUTRIENTS_FACTS](#EN-US_TOPIC_0000001053048310__section2924124562912) Nutrition facts. |
| static final Field | [FIELD_FRAGMENTS](#EN-US_TOPIC_0000001053048310__section492616457296) Fragments. |
| static final Field | [FIELD_AVG](#EN-US_TOPIC_0000001053048310__section792814452291) Average value. |
| static final Field | [FIELD_MAX](#EN-US_TOPIC_0000001053048310__section89309456298) Maximum value. |
| static final Field | [FIELD_MIN](#EN-US_TOPIC_0000001053048310__section159321145132917) Minimum value. |
| static final Field | [FIELD_MIN_LATITUDE](#EN-US_TOPIC_0000001053048310__section1293464519290) Low latitude (degree). |
| static final Field | [FIELD_MIN_LONGITUDE](#EN-US_TOPIC_0000001053048310__section89356458293) Low longitude (degree). |
| static final Field | [FIELD_MAX_LATITUDE](#EN-US_TOPIC_0000001053048310__section293754516298) High latitude (degree). |
| static final Field | [FIELD_MAX_LONGITUDE](#EN-US_TOPIC_0000001053048310__section119396459294) High longitude (degree). |
| static final Field | [FIELD_APPEARANCE](#EN-US_TOPIC_0000001053048310__section1941045122916) Number of occurrences within a period of time. |
| static final Field | [FIELD_INTENSITY](#EN-US_TOPIC_0000001053048310__section39431745192917) Workout intensity. |
| static final Field | [FALL_ASLEEP_TIME](#EN-US_TOPIC_0000001053048310__section63861254182711) Time when the user falls asleep, expressed as a Unix timestamp. |
| static final Field | [WAKE_UP_TIME](#EN-US_TOPIC_0000001053048310__section8753111962810) Time when the user wakes up, expressed as a Unix timestamp. |
| static final Field | [GO_BED_TIME_NEW](#EN-US_TOPIC_0000001053048310__section122371926122811) Time when the user goes to bed. |
| static final Field | [LIGHT_SLEEP_TIME](#EN-US_TOPIC_0000001053048310__section4954192882816) Light sleep duration. |
| static final Field | [DEEP_SLEEP_TIME](#EN-US_TOPIC_0000001053048310__section166318104322) Deep sleep duration. |
| static final Field | [DREAM_TIME](#EN-US_TOPIC_0000001053048310__section65029448342) REM sleep duration. |
| static final Field | [AWAKE_TIME](#EN-US_TOPIC_0000001053048310__section8531134611345) Duration when staying awake. |
| static final Field | [ALL_SLEEP_TIME](#EN-US_TOPIC_0000001053048310__section163868481341) Total sleep duration. |
| static final Field | [WAKE_UP_CNT](#EN-US_TOPIC_0000001053048310__section16613114933416) Number of times the user is awake. |
| static final Field | [DEEP_SLEEP_PART](#EN-US_TOPIC_0000001053048310__section1580855093412) Number of deep sleep segments. |
| static final Field | [SLEEP_STATE](#EN-US_TOPIC_0000001053048310__section16284162403616) Sleep state. |
| static final Field | [SCORE](#EN-US_TOPIC_0000001053048310__section1095018418315) Stress score. |
| static final Field | [GRADE](#EN-US_TOPIC_0000001053048310__section111925357117) Stress grade. |
| static final Field | [MEASURE_TYPE](#EN-US_TOPIC_0000001053048310__section1243854318125) Stress measurement type: active or passive. |
| static final Field | [STRESS_AVG](#EN-US_TOPIC_0000001053048310__section690814271417) Average stress score. |
| static final Field | [STRESS_MAX](#EN-US_TOPIC_0000001053048310__section98121828171816) Highest stress score. |
| static final Field | [STRESS_MIN](#EN-US_TOPIC_0000001053048310__section1017575817182) Lowest stress score. |
| static final Field | [STRESS_LAST](#EN-US_TOPIC_0000001053048310__section29248152199) Latest stress score. |
| static final Field | [MEASURE_COUNT](#EN-US_TOPIC_0000001053048310__section1582555419196) Number of stress measurement times. |
| static final Field | [EXERCISE_TYPE](#EN-US_TOPIC_0000001053048310__section665818256533) Medium- and high-intensity activity type. |
| static final Field | [INTENSITY_MAP](#EN-US_TOPIC_0000001053048310__section1565992575314) Medium- and high-intensity statistics value. |
| static final Field | [FIELD_LAST](#EN-US_TOPIC_0000001053048310__section5441172520013) Latest value. |
| static final Field | [FIELD_JUMP_HEIGHT](#EN-US_TOPIC_0000001053048310__section53421113440) Jump height. |
| static final Field | [FIELD_PASSAGE_DURATION](#EN-US_TOPIC_0000001053048310__section1773121311445) Hang time. |
| static final Field | [FIELD_JUMP_TIMES](#EN-US_TOPIC_0000001053048310__section7505161516442) Number of jumps. |
| static final Field | [FIELD_MIN_JUMP_HEIGHT](#EN-US_TOPIC_0000001053048310__section1154214173444) Minimum jump height. |
| static final Field | [FIELD_AVG_JUMP_HEIGHT](#EN-US_TOPIC_0000001053048310__section9385111904419) Average jump height. |
| static final Field | [FIELD_MAX_JUMP_HEIGHT](#EN-US_TOPIC_0000001053048310__section12420422144412) Maximum jump height. |
| static final Field | [FIELD_MIN_PASSAGE_DURATION](#EN-US_TOPIC_0000001053048310__section2212142554414) Minimum hang time. |
| static final Field | [FIELD_AVG_PASSAGE_DURATION](#EN-US_TOPIC_0000001053048310__section1795276444) Average hang time. |
| static final Field | [FIELD_MAX_PASSAGE_DURATION](#EN-US_TOPIC_0000001053048310__section148271929184410) Maximum hang time. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [Field](#EN-US_TOPIC_0000001053048310__section206819581424)(String name, int format) Constructs a **Field** object. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| int | [getFormat](#EN-US_TOPIC_0000001053048310__section69454455297)() Obtains the attribute type. |
| String | [getName](#EN-US_TOPIC_0000001053048310__section18949154572913)() Obtains the attribute name. |
| final Boolean | [isOptional](#EN-US_TOPIC_0000001053048310__section848063055215)() Indicates whether it is optional. |
| static Field | [newFloatField](#EN-US_TOPIC_0000001053048310__section795984532912)(String name) Creates an attribute that contains float values. |
| static Field | [newDoubleField](#EN-US_TOPIC_0000001053048310__section1917620493147)(String name) Creates an attribute that contains double-precision floating-point values. |
| static Field | [newIntField](#EN-US_TOPIC_0000001053048310__section17200144185312)(String name) Creates an attribute that contains integer values. |
| static Field | [newMapField](#EN-US_TOPIC_0000001053048310__section1086710163543)(String name) Creates an attribute of the mapping type. |
| static Field | [newStringField](#EN-US_TOPIC_0000001053048310__section39701545132914)(String name) Creates an attribute of the string type. |
| static Field | [newLongField](#EN-US_TOPIC_0000001053048310__section165006589138)(String name) Creates an attribute of the long integer type. |

#### Public Constructors

## Field(String name, int format)

| Constructor |
| --- |
| public Field(String name, int format) Constructs a **Field** object. |

**Parameters**

| Name | Description |
| --- | --- |
| name | Field name. |
| format | Attribute type. |

#### Public Fields

## FORMAT_INT32

| Field |
| --- |
| public static final int FORMAT_INT32 Field that contains integer values. Constant value: **1** |

## FORMAT_FLOAT

| Field |
| --- |
| public static final int FORMAT_FLOAT Field that contains float values. Constant value: **2** |

## FORMAT_STRING

| Field |
| --- |
| public static final int FORMAT_STRING Field that contains string values. Constant value: **3** |

## FORMAT_MAP

| Field |
| --- |
| public static final int FORMAT_MAP Field that contains mapped values. Constant value: **4** |

## FORMAT_LONG

| Field |
| --- |
| public static final int FORMAT_LONG Field that contains mapped values. Constant value: **5** |

## FORMAT_DOUBLE

| Field |
| --- |
| public static final int FORMAT_DOUBLE Field that contains mapped values. Constant value: **2** |

## MEAL_UNKNOWN

| Field |
| --- |
| public static final int MEAL_UNKNOWN Unknown meal type. Constant value: **0** |

## MEAL_BREAKFAST

| Field |
| --- |
| public static final int MEAL_BREAKFAST Breakfast. Constant value: **1** |

## MEAL_LUNCH

| Field |
| --- |
| public static final int MEAL_LUNCH Lunch. Constant value: **2** |

## MEAL_DINNER

| Field |
| --- |
| public static final int MEAL_DINNER Dinner. Constant value: **3** |

## MEAL_SNACK

| Field |
| --- |
| public static final int MEAL_SNACK Snack. Constant value: **4** |

## TYPE_OF_RESISTANCE_UNKNOWN

| Field |
| --- |
| public static final int TYPE_OF_RESISTANCE_UNKNOWN Use of an unknown object for resistance during an exercise. Constant value: **0** |

## TYPE_OF_RESISTANCE_BARBELL

| Field |
| --- |
| public static final int TYPE_OF_RESISTANCE_BARBELL Use of a barbell for resistance during an exercise. Constant value: **1** |

## TYPE_OF_RESISTANCE_CABLE

| Field |
| --- |
| public static final int TYPE_OF_RESISTANCE_CABLE Use of a cable for resistance during an exercise. Constant value: **2** |

## TYPE_OF_RESISTANCE_DUMBBELL

| Field |
| --- |
| public static final int TYPE_OF_RESISTANCE_DUMBBELL Use of a dumbbell for resistance during an exercise. Constant value: **3** |

## TYPE_OF_RESISTANCE_KETTLEBELL

| Field |
| --- |
| public static final int TYPE_OF_RESISTANCE_KETTLEBELL Use of a kettlebell for resistance during an exercise. Constant value: **4** |

## TYPE_OF_RESISTANCE_MACHINE

| Field |
| --- |
| public static final int TYPE_OF_RESISTANCE_MACHINE Use of a machine for resistance during an exercise. Constant value: **5** |

## TYPE_OF_RESISTANCE_BODY

| Field |
| --- |
| public static final int TYPE_OF_RESISTANCE_BODY Use of the user's own body weight for resistance during an exercise. Constant value: **6** |

## NUTRIENTS_FACTS_CALORIES

| Field |
| --- |
| public static final String NUTRIENTS_FACTS_CALORIES Calories (kcal). Constant value: **calories** |

## NUTRIENTS_FACTS_TOTAL_FAT

| Field |
| --- |
| public static final String NUTRIENTS_FACTS_TOTAL_FAT Total fat (g). Constant value: **fat.total** |

## NUTRIENTS_FACTS_SATURATED_FAT

| Field |
| --- |
| public static final String NUTRIENTS_FACTS_SATURATED_FAT Saturated fat (g). Constant value: **fat.saturated** |

## NUTRIENTS_FACTS_UNSATURATED_FAT

| Field |
| --- |
| public static final String NUTRIENTS_FACTS_UNSATURATED_FAT Unsaturated fat (g). Constant value: **fat.unsaturated** |

## NUTRIENTS_FACTS_POLYUNSATURATED_FAT

| Field |
| --- |
| public static final String NUTRIENTS_FACTS_POLYUNSATURATED_FAT Polyunsaturated fat (g). Constant value: **fat.polyunsaturated** |

## NUTRIENTS_FACTS_MONOUNSATURATED_FAT

| Field |
| --- |
| public static final String NUTRIENTS_FACTS_MONOUNSATURATED_FAT Monounsaturated fat (g). Constant value: **fat.monounsaturated** |

## NUTRIENTS_FACTS_TRANS_FAT

| Field |
| --- |
| public static final String NUTRIENTS_FACTS_TRANS_FAT Trans fat (g). Constant value: **fat.trans** |

## NUTRIENTS_FACTS_CHOLESTEROL

| Field |
| --- |
| public static final String NUTRIENTS_FACTS_CHOLESTEROL Cholesterol (mg). Constant value: **cholesterol** |

## NUTRIENTS_FACTS_SODIUM

| Field |
| --- |
| public static final String NUTRIENTS_FACTS_SODIUM Sodium (mg). Constant value: **sodium** |

## NUTRIENTS_FACTS_POTASSIUM

| Field |
| --- |
| public static final String NUTRIENTS_FACTS_POTASSIUM Potassium (mg). Constant value: **potassium** |

## NUTRIENTS_FACTS_TOTAL_CARBS

| Field |
| --- |
| public static final String NUTRIENTS_FACTS_TOTAL_CARBS Total carbohydrates (g). Constant value: **carbs.total** |

## NUTRIENTS_FACTS_DIETARY_FIBER

| Field |
| --- |
| public static final String NUTRIENTS_FACTS_DIETARY_FIBER Dietary fiber (g). Constant value: **dietary_fiber** |

## NUTRIENTS_FACTS_SUGAR

| Field |
| --- |
| public static final String NUTRIENTS_FACTS_SUGAR Sugar amount (g). Constant value: **sugar** |

## NUTRIENTS_FACTS_PROTEIN

| Field |
| --- |
| public static final String NUTRIENTS_FACTS_PROTEIN Protein amount (g). Constant value: **protein** |

## NUTRIENTS_FACTS_VITAMIN_A

| Field |
| --- |
| public static final String NUTRIENTS_FACTS_VITAMIN_A Vitamin A amount in international unit (IU). Constant value: **vitamin_a** |

## NUTRIENTS_FACTS_VITAMIN_C

| Field |
| --- |
| public static final String NUTRIENTS_FACTS_VITAMIN_C Vitamin C amount (mg). Constant value: **vitamin_c** |

## NUTRIENTS_FACTS_CALCIUM

| Field |
| --- |
| public static final String NUTRIENTS_FACTS_CALCIUM Calcium amount (mg). Constant value: **calcium** |

## NUTRIENTS_FACTS_IRON

| Field |
| --- |
| public static final String NUTRIENTS_FACTS_IRON Iron amount (mg). Constant value: **iron**. |

## FIELD_PRECISION

| Field |
| --- |
| public static final Field FIELD_PRECISION Precision. |

## FIELD_ALTITUDE

| Field |
| --- |
| public static final Field FIELD_ALTITUDE Altitude. |

## FIELD_TYPE_OF_ACTIVITY

| Field |
| --- |
| public static final Field FIELD_TYPE_OF_ACTIVITY Activity type. |

## FIELD_POSSIBILITY_OF_ACTIVITY

| Field |
| --- |
| public static final Field FIELD_POSSIBILITY_OF_ACTIVITY Activity type confidence. |

## FIELD_BPM

| Field |
| --- |
| public static final Field FIELD_BPM Heart rate. |

## FIELD_POSSIBILITY

| Field |
| --- |
| public static final Field FIELD_POSSIBILITY Confidence, with a value ranging from 0.0 to 100.0. |

## FIELD_SPAN

| Field |
| --- |
| public static final Field FIELD_SPAN Duration. |

## FIELD_DISTANCE

| Field |
| --- |
| public static final Field FIELD_DISTANCE Distance (m). |

## FIELD_DISTANCE_DELTA

| Field |
| --- |
| public static final Field FIELD_DISTANCE_DELTA Distance covered since the last reading. |

## FIELD_HEIGHT

| Field |
| --- |
| public static final Field FIELD_HEIGHT Height (m). |

## FIELD_STEPS_DELTA

| Field |
| --- |
| public static final Field FIELD_STEPS_DELTA Steps taken since the last reading. |

## FIELD_STEPS

| Field |
| --- |
| public static final Field FIELD_STEPS Step count. |

## FIELD_STEP_LENGTH

| Field |
| --- |
| public static final Field FIELD_STEP_LENGTH Step length (m). |

## FIELD_LATITUDE

| Field |
| --- |
| public static final Field FIELD_LATITUDE Latitude (degree). |

## FIELD_LONGITUDE

| Field |
| --- |
| public static final Field FIELD_LONGITUDE Longitude (degree). |

## FIELD_BODY_WEIGHT

| Field |
| --- |
| public static final Field FIELD_BODY_WEIGHT Weight (kg). |

## FIELD_BMI

| Field |
| --- |
| public static final Field FIELD_BMI Body mass index. It is calculated via dividing the weight kilograms by the square meter of height. Value range: [1.0, 200.0]. |

## FIELD_BODY_FAT

| Field |
| --- |
| public static final Field FIELD_BODY_FAT Body fat (kg). Accurate to the first decimal place. Value range: (1, 560). |

## FIELD_BODY_FAT_RATE

| Field |
| --- |
| public static final Field FIELD_BODY_FAT_RATE Body fat rate (percentage). Value range in percentage: [0.0, 100.0]. |

## FIELD_MUSCLE_MASS

| Field |
| --- |
| public static final Field FIELD_MUSCLE_MASS Muscle mass (kg). Value range: (0.1, 150) |

## FIELD_BASAL_METABOLISM

| Field |
| --- |
| public static final Field FIELD_BASAL_METABOLISM Basic metabolism (kcal/day). Value range: (0, 10000). |

## FIELD_MOISTURE

| Field |
| --- |
| public static final Field FIELD_MOISTURE Water weight (kg). Accurate to the first decimal place. Value range: (0, 500). |

## FIELD_MOISTURE_RATE

| Field |
| --- |
| public static final Field FIELD_MOISTURE_RATE Water rate (percentage). Accurate to the first decimal place. Value range: [0.0, 100.0]. |

## FIELD_VISCERAL_FAT_LEVEL

| Field |
| --- |
| public static final Field FIELD_VISCERAL_FAT_LEVEL Visceral fat (level). Accurate to the first decimal place. Value range: [1.0, 59.0]. |

## FIELD_BONE_SALT

| Field |
| --- |
| public static final Field FIELD_BONE_SALT Bone salt amount (kg). Value range: [0.5, 5.0]. |

## FIELD_PROTEIN_RATE

| Field |
| --- |
| public static final Field FIELD_PROTEIN_RATE Protein ratio (percentage). Accurate to the first decimal place. Value range: [0.0, 100.0]. |

## FIELD_BODY_AGE

| Field |
| --- |
| public static final Field FIELD_BODY_AGE Body age. Value range: [5, 99]. |

## FIELD_BODY_SCORE

| Field |
| --- |
| public static final Field FIELD_BODY_SCORE Body score (score). Accurate to the first decimal place. Value range: [0.0, 100.0]. |

## FIELD_SKELETAL_MUSCLEL_MASS

| Field |
| --- |
| public static final Field FIELD_SKELETAL_MUSCLEL_MASS Skeletal muscle (kg). Value range: (1.0, 150). |

## FIELD_IMPEDANCE

| Field |
| --- |
| public static final Field FIELD_IMPEDANCE Impedance (ohm). Value range: (0.1, 100000.0). |

## FIELD_CIRCUMFERENCE

| Field |
| --- |
| public static final Field FIELD_CIRCUMFERENCE Circumference of a body part (such as the hip, chest, and waist) in centimeters. |

## FIELD_SPEED

| Field |
| --- |
| public static final Field FIELD_SPEED Speed (m/s). |

## FIELD_RPM

| Field |
| --- |
| public static final Field FIELD_RPM Rotations per minute or rate per minute. |

## FIELD_STEP_RATE

| Field |
| --- |
| public static final Field FIELD_STEP_RATE Step frequency. |

## FIELD_ROTATION

| Field |
| --- |
| public static final Field FIELD_ROTATION Rotations. |

## FIELD_CALORIES

| Field |
| --- |
| public static final Field FIELD_CALORIES Calories (kcal). |

## FIELD_CALORIES_TOTAL

| Field |
| --- |
| public static final Field FIELD_CALORIES_TOTAL Calories (kcal). |

## FIELD_POWER

| Field |
| --- |
| public static final Field FIELD_POWER Power (Watt). |

## FIELD_HYDRATE

| Field |
| --- |
| public static final Field FIELD_HYDRATE Volume (Liter). |

## FIELD_MEAL

| Field |
| --- |
| public static final Field FIELD_MEAL Meal type. |

## FIELD_FOOD

| Field |
| --- |
| public static final Field FIELD_FOOD Food type. |

## FIELD_NUTRIENTS

| Field |
| --- |
| public static final Field FIELD_NUTRIENTS Nutrients. |

## FIELD_NUTRIENTS_FACTS

| Field |
| --- |
| public static final Field FIELD_NUTRIENTS_FACTS Nutrition facts. |

## FIELD_FRAGMENTS

| Field |
| --- |
| public static final Field FIELD_FRAGMENTS Fragments. |

## FIELD_AVG

| Field |
| --- |
| public static final Field FIELD_AVG Average value. |

## FIELD_MAX

| Field |
| --- |
| public static final Field FIELD_MAX Maximum value. |

## FIELD_MIN

| Field |
| --- |
| public static final Field FIELD_MIN Minimum value. |

## FIELD_MIN_LATITUDE

| Field |
| --- |
| public static final Field FIELD_MIN_LATITUDE Low latitude (degree). |

## FIELD_MIN_LONGITUDE

| Field |
| --- |
| public static final Field FIELD_MIN_LONGITUDE Low longitude (degree). |

## FIELD_MAX_LATITUDE

| Field |
| --- |
| public static final Field FIELD_MAX_LATITUDE High latitude (degree). |

## FIELD_MAX_LONGITUDE

| Field |
| --- |
| public static final Field FIELD_MAX_LONGITUDE High longitude (degree). |

## FIELD_APPEARANCE

| Field |
| --- |
| public static final Field FIELD_APPEARANCE Number of occurrences within a period of time. |

## FIELD_INTENSITY

| Field |
| --- |
| public static final Filed FIELD_INTENSITY Workout intensity. |

## FALL_ASLEEP_TIME

| Field |
| --- |
| public static final Filed FALL_ASLEEP_TIME Time when the user falls asleep. Indicates the UTC time stamp. |

## WAKE_UP_TIME

| Field |
| --- |
| public static final Filed WAKE_UP_TIME Time when the user wakes up. Indicates the UTC time stamp. |

## GO_BED_TIME_NEW

| Field |
| --- |
| public static final Filed GO_BED_TIME_NEW Time when the user goes to bed. |

## LIGHT_SLEEP_TIME

| Field |
| --- |
| public static final Filed LIGHT_SLEEP_TIME Light sleep duration. |

## DEEP_SLEEP_TIME

| Field |
| --- |
| public static final Filed DEEP_SLEEP_TIME Deep sleep duration. |

## DREAM_TIME

| Field |
| --- |
| public static final Filed DREAM_TIME REM sleep duration. |

## AWAKE_TIME

| Field |
| --- |
| public static final Filed AWAKE_TIME Duration when staying awake. |

## ALL_SLEEP_TIME

| Field |
| --- |
| public static final Filed ALL_SLEEP_TIME Total sleep duration. |

## WAKE_UP_CNT

| Field |
| --- |
| public static final Filed WAKE_UP_CNT Number of times the user wakes up. |

## DEEP_SLEEP_PART

| Field |
| --- |
| public static final Filed DEEP_SLEEP_PART Number of deep sleep segments. |

## SLEEP_STATE

| Field |
| --- |
| public static final Filed SLEEP_STATE Sleep state. |

## SCORE

| Field |
| --- |
| public static final Field SCORE Stress score. Value range: [1, 99]. |

## GRADE

| Field |
| --- |
| public static final Field GRADE Stress grade. Value range: [1, 4]. |

## MEASURE_TYPE

| Field |
| --- |
| public static final Field MEASURE_TYPE Stress measurement flag: active or passive. Value range: [1, 2]. |

## STRESS_AVG

| Field |
| --- |
| public static final Field STRESS_AVG Average stress score. Value range: [1, 99]. |

## STRESS_MAX

| Field |
| --- |
| public static final Field STRESS_MAX Highest stress score. Value range: [1, 99]. |

## STRESS_MIN

| Field |
| --- |
| public static final Field STRESS_MIN Lowest stress score. Value range: [1, 99]. |

## STRESS_LAST

| Field |
| --- |
| public static final Field STRESS_LAST Latest stress score. Value range: [1, 99]. |

## MEASURE_COUNT

| Field |
| --- |
| public static final Field MEASURE_COUNT Number of stress measurement times. Value range: [1, 2147483647]. |

## EXERCISE_TYPE

| Field |
| --- |
| public static final Field EXERCISE_TYPE Medium- and high-intensity activity type. Value range: [1, 8]. |

## INTENSITY_MAP

| Field |
| --- |
| public static final Field INTENSITY_MAP Medium- and high-intensity statistics mapped value. |

## FIELD_LAST

| Field |
| --- |
| public static final Field FIELD_LAST Latest measurement value. |

## FIELD_JUMP_HEIGHT

| Field |
| --- |
| public static final Field FIELD_JUMP_HEIGHT Jump height. |

## FIELD_PASSAGE_DURATION

| Field |
| --- |
| public static final Field FIELD_PASSAGE_DURATION Hang time. |

## FIELD_JUMP_TIMES

| Field |
| --- |
| public static final Field FIELD_JUMP_TIMES Number of jumps. |

## FIELD_MIN_JUMP_HEIGHT

| Field |
| --- |
| public static final Field FIELD_MIN_JUMP_HEIGHT Minimum jump height. |

## FIELD_AVG_JUMP_HEIGHT

| Field |
| --- |
| public static final Field FIELD_AVG_JUMP_HEIGHT Average jump height. |

## FIELD_MAX_JUMP_HEIGHT

| Field |
| --- |
| public static final Field FIELD_MAX_JUMP_HEIGHT Maximum jump height. |

## FIELD_MIN_PASSAGE_DURATION

| Field |
| --- |
| public static final Field FIELD_MIN_PASSAGE_DURATION Minimum hang time. |

## FIELD_AVG_PASSAGE_DURATION

| Field |
| --- |
| public static final Field FIELD_AVG_PASSAGE_DURATION Average hang time. |

## FIELD_MAX_PASSAGE_DURATION

| Field |
| --- |
| public static final Field FIELD_MAX_PASSAGE_DURATION Maximum hang time. |

#### Public Methods

## getFormat()

| Method |
| --- |
| public int getFormat() Obtains the attribute type. |

**Returns**

| Type | Description |
| --- | --- |
| int | Attribute type. |

## getName()

| Method |
| --- |
| public String getName() Obtains the attribute name. |

**Returns**

| Type | Description |
| --- | --- |
| String | Attribute name. |

## isOptional()

| Method |
| --- |
| public final Boolean isOptional() Indicates whether it is optional. |

**Returns**

| Type | Description |
| --- | --- |
| Boolean | Indicates whether it is optional. |

## newFloatField(String name)

| Method |
| --- |
| public static Field newFloatField(String name) Creates an attribute that contains float values. |

**Parameters**

| Name | Description |
| --- | --- |
| name | Name. |

**Returns**

| Type | Description |
| --- | --- |
| Field | Field to contain float values. |

## newDoubleField(String name)

| Method |
| --- |
| public static Field newDoubleField(String name) Creates an attribute that contains double-precision floating-point values. |

**Parameters**

| Name | Description |
| --- | --- |
| name | Name. |

**Returns**

| Type | Description |
| --- | --- |
| Field | Attribute that contains double-precision floating-point values. |

## newIntField(String name)

| Method |
| --- |
| public static Field newIntField(String name) Creates an attribute that contains integer values. |

**Parameters**

| Name | Description |
| --- | --- |
| name | Name. |

**Returns**

| Type | Description |
| --- | --- |
| Field | Field to contain integer values. |

## newMapField(String name)

| Method |
| --- |
| public static Field newMapField(String name) Creates an attribute of the mapping type. |

**Parameters**

| Name | Description |
| --- | --- |
| name | Name. |

**Returns**

| Type | Description |
| --- | --- |
| Field | Attribute of the mapping type. |

## newStringField(String name)

| Method |
| --- |
| public static Field newStringField(String name) Creates an attribute of the string type. |

**Parameters**

| Name | Description |
| --- | --- |
| name | Name. |

**Returns**

| Type | Description |
| --- | --- |
| Field | Field to contain string values. |

## newLongField(String name)

| Method |
| --- |
| public static Field newLongField(String name) Creates an attribute of the long integer type. |

**Parameters**

| Name | Description |
| --- | --- |
| name | Name. |

**Returns**

| Type | Description |
| --- | --- |
| Field | Long integer type attribute. |
