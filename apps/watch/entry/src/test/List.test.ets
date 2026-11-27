import localUnitTest from './LocalUnit.test';
import repCounterTest from './RepCounter.test';
import workoutSessionTest from './WorkoutSession.test';

export default function testsuite() {
  localUnitTest();
  workoutSessionTest();
  repCounterTest();
}
