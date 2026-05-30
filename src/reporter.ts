import { writeFile } from "node:fs/promises";
import { join, parse } from "node:path";
import { MatchResult } from "./types.js";

export async function generateReport(
  result: MatchResult,
  outputDir: string,
  jobFileName: string
): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const jobName = parse(jobFileName).name;
  const fileName = `report-${jobName}-${timestamp}.md`;
  const filePath = join(outputDir, fileName);

  const lines: string[] = [
    `# Job Match Report: ${result.jobTitle}`,
    "",
    result.company ? `**Company:** ${result.company}` : "",
    result.company ? "" : "",
    `**Generated:** ${new Date(result.generatedAt).toLocaleString()}`,
    "",
    `## Overall Match`,
    "",
    `**${result.overallMatchPercentage}%** overall match with this position.`,
    "",
    `| Category | Match Rate |`,
    `|---|---|`,
    `| Required Skills | ${result.requiredMatchPercentage}% |`,
    `| Preferred Skills | ${result.preferredMatchPercentage}% |`,
    "",
    `## Skill Breakdown`,
    "",
    `| Skill | Type | Matched | CV Level |`,
    `|---|---|---|---|`,
  ];

  for (const sm of result.skillMatches) {
    const matched = sm.matched ? "✅ Yes" : "❌ No";
    const level = sm.cvLevel ?? "—";
    lines.push(
      `| ${sm.skill} | ${sm.requirementType} | ${matched} | ${level} |`
    );
  }

  lines.push("", "## Strengths", "");
  if (result.strengths.length > 0) {
    for (const s of result.strengths) {
      lines.push(`- ✅ **${s}** — matched in your CV`);
    }
  } else {
    lines.push("_No direct skill matches found._");
  }

  lines.push("", "## Gaps", "");
  if (result.gaps.length > 0) {
    for (const g of result.gaps) {
      lines.push(`- ❌ **${g}** — missing from your CV`);
    }
  } else {
    lines.push("_All required skills are covered!_");
  }

  lines.push("", "## CV Improvement Hints", "");
  for (const hint of result.hints) {
    lines.push(`- 💡 ${hint}`);
  }

  lines.push("");

  const content = lines.filter((l) => l !== undefined).join("\n");
  await writeFile(filePath, content, "utf-8");

  return filePath;
}
