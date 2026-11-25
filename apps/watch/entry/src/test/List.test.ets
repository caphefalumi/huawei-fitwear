import localUnitTest from './LocalUnit.test';
import workoutSessionTest from './WorkoutSession.test';

export default function testsuite() {
  localUnitTest();
  workoutSessionTest();
}
