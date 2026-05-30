import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadCV } from "./cv.js";
import { loadJobDescription, analyze } from "./analyzer.js";
import { generateReport } from "./reporter.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const CV_PATH = join(ROOT, "cvs", "cv.txt");
const JOBS_DIR = join(ROOT, "jobs");
const REPORTS_DIR = join(ROOT, "reports");

async function main() {
  const jobArg = process.argv[2];

  if (!jobArg) {
    console.error("Usage: npm start -- <job-file>");
    console.error("   or: npm start -- <path-to-job-description.txt>");
    process.exit(1);
  }

  const jobPath = jobArg.includes("\\") || jobArg.includes("/")
    ? jobArg
    : join(JOBS_DIR, jobArg);

  console.log(`\n📄 Loading CV from: ${CV_PATH}`);
  const cv = await loadCV(CV_PATH);

  console.log(`📋 Loading job description from: ${jobPath}`);
  const job = await loadJobDescription(jobPath);

  console.log(`🔍 Analyzing match...\n`);
  const result = analyze(cv, job);

  console.log(`📊 Match Result for: ${result.jobTitle}`);
  console.log(`   Overall Match:  ${result.overallMatchPercentage}%`);
  console.log(`   Required Skills: ${result.requiredMatchPercentage}%`);
  console.log(`   Preferred Skills: ${result.preferredMatchPercentage}%`);

  const reportPath = await generateReport(result, REPORTS_DIR, jobPath);
  console.log(`\n📝 Report saved to: ${reportPath}\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
