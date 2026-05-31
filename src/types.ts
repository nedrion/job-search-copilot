export type MatcherType = "regex" | "llm";

export interface Config {
  matcher: MatcherType;
  llmBaseUrl?: string;
  llmApiKey?: string;
  llmModel?: string;
}

export interface CV {
  raw: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
}

export interface Skill {
  name: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface Experience {
  role: string;
  company: string;
  duration: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface JobDescription {
  raw: string;
  title: string;
  company?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
}

export interface SkillMatch {
  skill: string;
  category: string;
  matched: boolean;
  cvLevel?: string;
  requirementType: "required" | "preferred";
}

export interface MatchResult {
  jobTitle: string;
  company: string | undefined;
  overallMatchPercentage: number;
  requiredMatchPercentage: number;
  preferredMatchPercentage: number;
  skillMatches: SkillMatch[];
  missingCriticalSkills: string[];
  strengths: string[];
  gaps: string[];
  hints: string[];
  generatedAt: string;
}
