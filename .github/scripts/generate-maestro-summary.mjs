import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function findFilesByExt(dir, ext) {
  const matches = [];
  if (!fs.existsSync(dir)) return matches;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      matches.push(...findFilesByExt(fullPath, ext));
    } else if (entry.isFile() && entry.name.endsWith(ext)) {
      matches.push(fullPath);
    }
  }
  return matches;
}

export function generateSummary({
  artifactsDir = "maestro-artifacts",
  recordingUrl = process.env.RECORDING_URL || "",
  artifactsUrl = process.env.ARTIFACTS_URL || "",
  exitCode = process.env.MAESTRO_EXIT_CODE || "0",
  githubRepository = process.env.GITHUB_REPOSITORY || "",
  githubRunId = process.env.GITHUB_RUN_ID || "",
}) {
  const defaultRunUrl =
    githubRepository && githubRunId
      ? `https://github.com/${githubRepository}/actions/runs/${githubRunId}`
      : "";

  const finalArtifactsUrl = artifactsUrl || defaultRunUrl || "#";
  const finalRecordingUrl = recordingUrl || finalArtifactsUrl;

  const reportPath = path.join(artifactsDir, "report.xml");
  let hasReport = false;
  let totalTests = 0;
  let totalFailures = 0;
  let totalErrors = 0;
  let duration = "0";
  let failureDetails = [];
  let testCases = [];

  if (fs.existsSync(reportPath)) {
    hasReport = true;
    try {
      const xml = fs.readFileSync(reportPath, "utf8");

      const testsuitesMatch = xml.match(
        /<testsuites[^>]*tests="(\d+)"[^>]*failures="(\d+)"[^>]*errors="(\d+)"[^>]*time="([^"]+)"/,
      );
      if (testsuitesMatch) {
        totalTests = parseInt(testsuitesMatch[1], 10);
        totalFailures = parseInt(testsuitesMatch[2], 10);
        totalErrors = parseInt(testsuitesMatch[3], 10);
        duration = testsuitesMatch[4];
      } else {
        const testsuiteMatch = xml.match(
          /<testsuite[^>]*tests="(\d+)"[^>]*failures="(\d+)"[^>]*errors="(\d+)"[^>]*time="([^"]+)"/,
        );
        if (testsuiteMatch) {
          totalTests = parseInt(testsuiteMatch[1], 10);
          totalFailures = parseInt(testsuiteMatch[2], 10);
          totalErrors = parseInt(testsuiteMatch[3], 10);
          duration = testsuiteMatch[4];
        }
      }

      const testcaseRegex =
        /<testcase[^>]*name="([^"]+)"[^>]*time="([^"]+)"([\s\S]*?)<\/testcase>|<testcase[^>]*name="([^"]+)"[^>]*time="([^"]+)"\s*\/>/g;
      let match;
      while ((match = testcaseRegex.exec(xml)) !== null) {
        const name = match[1] || match[4];
        const time = match[2] || match[5];
        const inner = match[3] || "";
        const failed = inner.includes("<failure");
        testCases.push({ name, time, failed });
      }

      const failureRegex = /<failure[^>]*message="([^"]*)"[^>]*>([\s\S]*?)<\/failure>/g;
      let failMatch;
      while ((failMatch = failureRegex.exec(xml)) !== null) {
        const message = failMatch[1];
        const detail = failMatch[2].replace(/<!\[CDATA\[|\]\]>/g, "").trim();
        failureDetails.push({ message, detail });
      }
    } catch (err) {
      console.error("Error parsing report.xml:", err);
    }
  }

  const isFailed = (exitCode !== "0" && exitCode !== 0) || totalFailures > 0 || totalErrors > 0;
  const statusEmoji = isFailed ? "❌" : "✅";
  const statusText = isFailed ? "Failed" : "Passed";

  // Search for MP4 files
  const mp4Files = findFilesByExt(artifactsDir, ".mp4");
  let videoName = "None detected";
  let videoSize = "N/A";
  let videoFound = false;

  if (mp4Files.length > 0) {
    const videoFile = mp4Files[0];
    videoName = path.basename(videoFile);
    try {
      const stats = fs.statSync(videoFile);
      videoSize = formatBytes(stats.size);
      videoFound = true;
    } catch {
      videoSize = "Unknown";
    }
  }

  const passedTests = Math.max(0, totalTests - totalFailures - totalErrors);

  let md = `## 📱 Maestro E2E Execution Summary\n\n`;
  md += `| 🧪 Test Result | 📹 Execution Recording |\n`;
  md += `| :--- | :--- |\n`;

  const testResultCol = [
    `**Status:** ${statusEmoji} **${statusText}**`,
    `**Flow:** \`apps/mobile/tests/e2e/fitness.yaml\``,
    `**Duration:** ${duration}s`,
    hasReport
      ? `**Tests:** ${totalTests} total (${passedTests} passed, ${totalFailures + totalErrors} failed)`
      : `**Execution:** Exit code ${exitCode}`,
  ].join("<br>");

  const videoCol = [
    `**File:** \`${videoName}\``,
    `**Size:** ${videoSize}`,
    `**Format:** MP4 Video`,
    videoFound
      ? `<br>👉 [**Download / Watch Recording**](${finalRecordingUrl})`
      : `<br>*(No recording generated)*`,
  ].join("<br>");

  md += `| ${testResultCol} | ${videoCol} |\n\n`;

  if (isFailed) {
    md += `> [!WARNING]\n`;
    md += `> Maestro end-to-end test flow encountered failures. Review the failure log below or inspect the test recording.\n\n`;

    if (failureDetails.length > 0) {
      md += `<details open>\n<summary><b>🔍 Failure Details</b></summary>\n\n`;
      for (const fail of failureDetails) {
        if (fail.message) {
          md += `**Error:** ${fail.message}\n\n`;
        }
        if (fail.detail) {
          md += `\`\`\`text\n${fail.detail}\n\`\`\`\n\n`;
        }
      }
      md += `</details>\n\n`;
    }
  } else {
    md += `> [!NOTE]\n`;
    md += `> All Maestro end-to-end flows passed successfully on Android Emulator (API 34). Video recording captured the full execution lifecycle.\n\n`;
  }

  md += `### 📦 Artifacts & Downloads\n`;
  if (videoFound) {
    md += `- 🎬 **Test Recording Video:** [Download \`${videoName}\` (${videoSize})](${finalRecordingUrl})\n`;
  }
  md += `- 📁 **Complete Test Bundle (Report, Logs, Artifacts):** [Download \`maestro-e2e-artifacts\`](${finalArtifactsUrl})\n`;

  return md;
}

// Run CLI if invoked directly
const isDirectRun =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isDirectRun) {
  const summary = generateSummary({});
  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (summaryFile) {
    fs.appendFileSync(summaryFile, summary + "\n");
    console.log("Appended Maestro summary to GITHUB_STEP_SUMMARY.");
  } else {
    console.log(summary);
  }
}
