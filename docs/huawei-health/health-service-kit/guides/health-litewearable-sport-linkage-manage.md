<!--
  Title: Managing Workout Linkage
  Catalog: harmonyos-guides
  Document ID: health-litewearable-sport-linkage-manage
  Updated: 2026-10-14 09:29:53
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-litewearable-sport-linkage-manage
-->
# Managing Workout Linkage

#### Use Cases

Starting from version 6.1.1(24), workout linkage management is supported.

Workout linkage management includes configuring, starting, pausing, resuming, and stopping workout linkage. It also covers data subscription and unsubscription, the delivery of fused data, and read/write operations for workout records.

#### API Description

| API | Description |
| --- | --- |
| [config](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutconfig)(workoutConfig: WorkoutConfig): void | Configures workout linkage. |
| [start](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutstart)(): StartResult | Starts workout linkage. |
| [pause](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutpause)(): void | Pauses workout linkage. |
| [resume](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutresume)(): void | Resumes workout linkage. |
| [stop](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutstop)(): void | Stops workout linkage. |
| [onData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutondata)(dataType: undefined, listener: Callback<[SampleReal](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#samplereal)[]>): void | Subscribes to all types of data. |
| [offData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutoffdata)(dataType: undefined, listener?: Callback<[SampleReal](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#samplereal)[]>): void | Unsubscribes from all types of data. |
| [sendData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#workoutsenddata)(sampleReal: [SampleReal](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice-lite#samplereal)[]): void | Delivers fused workout data. |
| [readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore-lite#healthstorereaddata)<T extends ExerciseSequence>(request: exercisesequencereadrequest, callback: Callback<T[]>): void | Reads the latest workout record. |
| [saveData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore-lite#healthstoresavedata)(exerciseSequence: ExerciseSequence): void | Saves workout records. |

#### Before Getting Started

- [Apply for Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply).
- Call the [user authorization](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-litewearable-add-permissions) API to guide the user to grant the required permissions. According to the [permission requirements](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-permission-description#lite-wearable), the user needs to enable the workout record read and write permissions, as well as the linkage API control permission.
- Refer to [Health Service Kit FAQs](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-faqs) if needed.

#### Development Procedure

- Import the Health Service Kit functional module. 
```javascript
import healthService from '@hms.health.service';
import healthStore from '@hms.health.store';
```

- Configure linkage. 
```javascript
function config() {
  let workoutOptions = {
    linkageType: healthService.workout.LinkageType.ACTIVITY_LINK,
    sportType: healthStore.exerciseSequenceHelper.badminton.EXERCISE_TYPE.id,
    activityGoals: [
      {
        type: healthService.workout.TargetType.CALORIE,
        value: 100
      }
    ]
  };
  try {
    healthService.workout.config(workoutOptions);
  } catch (err) {
    // Handle the exception.
  }
}
```

- Start linkage. 
```javascript
function start() {
  try {
    let startResult = healthService.workout.start();
  } catch (err) {
    // Handle the exception.
  }
}
```

- Pause/Resume linkage. 
```javascript
function pause() { // Pause linkage.
  try {
    healthService.workout.pause();
  } catch (err) {
    // Handle the exception.
  }
}

function resume() { // Resume linkage.
  try {
    healthService.workout.resume();
  } catch (err) {
    // Handle the exception.
  }
}
```

- Subscribe to data to obtain workout data in real time, and process the obtained workout data. 
```javascript
function onData() {
  const callback = (sampleReals) => {
    // Processing logic for workout data callback.
  };

  try {
    healthService.workout.onData(undefined, callback);
  } catch (e) {
    if (e.code === 1009104001) { // Another app has called the start API to start linkage.
      // Go back to the preparation screen.
    } else if (e.code === 1009104003) { // The command is invalid in the current state. Start workout linkage first.
      // Go back to the preparation screen.
    }
  }
}
```

- Deliver fused data. Call the API at the appropriate time depending on your need. 
```javascript
function sendData() {
  let sampleReal = {
    dataType: healthStore.healthDataTypes.WORKOUT_REALTIME,
    time: new Date().getTime(),
    fields: {
      avgShotSpeed: 10
    }
  };

  try {
    healthService.workout.sendData([sampleReal]);
  } catch(err) {
   // Handle the exception.
  }
}
```

- Unsubscribe from data. Call the API at the appropriate time depending on your need. 
```javascript
function offData() {
  const callback = (sampleReals) => {
    // Processing logic for workout data callback.
  };

  try {
    healthService.workout.offData(undefined, callback);
  } catch (e) {
    // Handle the exception.
  }
}
```

- Save workout records. 
```javascript
function saveData() {
  let healthSequence = {
    dataType: healthStore.healthDataTypes.WORKOUT_REALTIME,
    // DataSourceId returned by the insertDataSource API.
    dataSourceId: 'xxx',
    localDate: '09/26/2023',
    startTime: 1695740400000,  // 2023-9-26 23:00:00
    endTime: 1695769200000,   // 2023-9-27 07:00:00
    timeZone: '+0800',
    modifiedTime: 1695769200000,
    exerciseType: healthStore.exerciseSequenceHelper.badminton. EXERCISE_TYPE,
    duration: 1800000,
    summaries: {
      avgShotSpeed: 25.5,
      maxShotSpeed: 32.8,
      shots: 125,
      maxContinuousRally: 7,
      forehandStroke: 45,
      backhandStroke: 32,
      overhandStroke: 18,
      underhandStroke: 10,
      smash: 23,
      highClear: 15
    }
  }

  try {
    healthStore.saveData(healthSequence);
  } catch (err) {
    // Handle the exception.
  }
}
```

- Read workout records. 
```javascript
function readData() {
  const startTime = 1698040800000; // 2023-10-23 14:00:00
  const endTime = 1698042600000; // 2023-10-23 14:30:00

  const sequenceReadRequest = {
    startTime: startTime,
    endTime: endTime,
    exerciseType: healthStore.exerciseSequenceHelper.badminton. EXERCISE_TYPE,
    count: 1,
    sortOrder: healthStore.SortOrder.DESC,
    readOptions: {
      withPartialDetails: ['exerciseHeartRate']
    }
  };

  const callback = (samplePoints) => {
    // Processing logic for record data callback.
  };

  try {
    healthStore.readData(sequenceReadRequest, callback);
  } catch (err) {
    // Handle the exception.
  }
}
```

- Stop linkage. 
```javascript
function stop() {
  try {
    healthService.workout.stop();
  } catch (err) {
    // Handle the exception.
  }
}
```
