import { readFile } from "node:fs/promises";
import { JobDescription } from "./types.js";

export async function loadJobDescription(filePath: string): Promise<JobDescription> {
  const raw = await readFile(filePath, "utf-8");
  const lines = raw.split("\n");

  const heading = lines[0]?.replace(/^#\s*/, "").trim() ?? "Unknown Position";
  const headingMatch = heading.match(/^(.+?)\s*(?:—|–)\s*(.+)$/);
  const title = headingMatch?.[1]?.trim() ?? heading;
  const company = headingMatch?.[2]?.trim() ?? undefined;

  const requiredSkills = parseListSection(raw, "Required Skills");
  const preferredSkills = parseListSection(raw, "Preferred Skills");
  const responsibilities = parseListSection(raw, "Responsibilities");

  return { raw, title, company, requiredSkills, preferredSkills, responsibilities };
}

function parseListSection(raw: string, sectionName: string): string[] {
  const section = raw.match(
    new RegExp(`^##\\s+${sectionName}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|(?![\\s\\S]))`, "im")
  );
  if (!section) return [];

  const items: string[] = [];
  const itemRegex = /^[-*]\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(section[1])) !== null) {
    const value = match[1].trim();
    if (value) items.push(value);
  }

  return items;
}
