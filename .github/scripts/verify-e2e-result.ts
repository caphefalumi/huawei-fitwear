import { generateSummary } from "./generate-e2e-summary"

if (import.meta.main) {
  const { success } = generateSummary({ exitCode: process.env.E2E_EXIT_CODE })
  if (!success) {
    console.error("e2e failed, returned no exit status, or produced an invalid/empty JUnit report.")
    process.exitCode = 1
  } else {
    console.log("e2e completed successfully and JUnit results are valid.")
  }
}
