import { generateSummary } from "./generate-maestro-summary"

if (import.meta.main) {
  const { success } = generateSummary({ exitCode: process.env.MAESTRO_EXIT_CODE })
  if (!success) {
    console.error(
      "Maestro failed, returned no exit status, or produced an invalid/empty JUnit report.",
    )
    process.exitCode = 1
  } else {
    console.log("Maestro completed successfully and JUnit results are valid.")
  }
}
