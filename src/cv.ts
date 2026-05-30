import { readFile } from "node:fs/promises";
import { CV, Skill, Experience, Education } from "./types.js";

export async function loadCV(filePath: string): Promise<CV> {
  const raw = await readFile(filePath, "utf-8");

  const skills = parseSkills(raw);
  const experience = parseExperience(raw);
  const education = parseEducation(raw);

  return { raw, skills, experience, education };
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Language: ["typeScript", "javaScript", "python", "java", "go", "rust", "c#", "c++", "ruby", "php", "swift", "kotlin", "scala", "elixir"],
  Frontend: ["react", "angular", "vue", "svelte", "nextjs", "nuxt", "html", "css", "sass", "tailwind", "redux"],
  Backend: ["node.js", "express", "nest.js", "nestjs", "graphql", "rest", "api", "microservice"],
  Database: ["postgresql", "postgres", "mysql", "mongodb", "redis", "sqlite", "dynamodb", "elasticsearch", "cassandra"],
  "Cloud & DevOps": ["aws", "azure", "gcp", "docker", "kubernetes", "k8s", "terraform", "ci/cd", "jenkins", "github actions", "gitlab"],
  Testing: ["jest", "mocha", "cypress", "playwright", "vitest", "pytest", "junit"],
};

const LEVEL_KEYWORDS: Record<string, RegExp> = {
  expert: /\b(expert|lead|architect|principal|staff)\b/i,
  advanced: /\b(advanced|senior|strong|proficient)\b/i,
  intermediate: /\b(intermediate|mid|moderate|working knowledge)\b/i,
};

function categorizeSkill(name: string): string {
  const lower = name.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category;
    }
  }
  return "Other";
}

function inferLevel(name: string, contextLines: string[]): Skill["level"] {
  const checkText = [name, ...contextLines.slice(0, 3)].join(" ");
  for (const [level, pattern] of Object.entries(LEVEL_KEYWORDS)) {
    if (pattern.test(checkText)) return level as Skill["level"];
  }
  return "intermediate";
}

function parseSkills(raw: string): Skill[] {
  const skills: Skill[] = [];
  const section = raw.match(/^##\s+Skills\s*\n([\s\S]*?)(?=\n##\s|(?![^]))/im);

  if (!section) return skills;

  const lines = section[1].split("\n");
  const contextLines = lines.map((l) => l.replace(/^[-*]\s*/, "").trim());

  for (const line of lines) {
    const trimmed = line.replace(/^[-*]\s*/, "").trim();
    if (!trimmed) continue;

    const parts = trimmed.split(",");
    for (const part of parts) {
      const name = part.trim();
      if (!name) continue;

      skills.push({
        name,
        category: categorizeSkill(name),
        level: inferLevel(name, contextLines),
      });
    }
  }

  return skills;
}

function parseExperience(raw: string): Experience[] {
  const experiences: Experience[] = [];
  const section = raw.match(/^##\s+Experience\s*\n([\s\S]*?)(?=\n##\s|(?![^]))/im);

  if (!section) return experiences;

  const roleRegex = /^###\s+(.+?)\s*[:—–-]\s*(.+?)\s*\((.+?)\)\s*$/gm;
  const content = section[1];
  let match: RegExpExecArray | null;

  const roleMatches: { role: string; company: string; duration: string; bodyStart: number; bodyEnd: number }[] = [];
  let lastMatch: RegExpExecArray | null = null;

  while ((match = roleRegex.exec(content)) !== null) {
    if (lastMatch) {
      roleMatches[roleMatches.length - 1].bodyEnd = match.index;
    }
    roleMatches.push({
      role: match[1].trim(),
      company: match[2].trim(),
      duration: match[3].trim(),
      bodyStart: match.index + match[0].length,
      bodyEnd: content.length,
    });
    lastMatch = match;
  }

  for (const rm of roleMatches) {
    const body = content.slice(rm.bodyStart, rm.bodyEnd);
    const highlightRegex = /^[-*]\s+(.+)$/gm;
    const highlights: string[] = [];
    let hMatch: RegExpExecArray | null;

    while ((hMatch = highlightRegex.exec(body)) !== null) {
      highlights.push(hMatch[1].trim());
    }

    experiences.push({
      role: rm.role,
      company: rm.company,
      duration: rm.duration,
      highlights,
    });
  }

  return experiences;
}

function parseEducation(raw: string): Education[] {
  const education: Education[] = [];
  const section = raw.match(/^##\s+Education\s*\n([\s\S]*?)(?=\n##\s|(?![^]))/im);

  if (!section) return education;

  const lineRegex = /^[-*]\s+(.+?)\s*[:—–-]\s*(.+?)\s*\((.+?)\)\s*$/gm;
  let match: RegExpExecArray | null;

  while ((match = lineRegex.exec(section[1])) !== null) {
    education.push({
      degree: match[1].trim(),
      institution: match[2].trim(),
      year: match[3].trim(),
    });
  }

  return education;
}
