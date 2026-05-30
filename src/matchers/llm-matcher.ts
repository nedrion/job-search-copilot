import OpenAI from "openai";
import { CV, JobDescription, MatchResult, SkillMatch } from "../types.js";
import { MatcherStrategy } from "./matcher.js";

const SYSTEM_PROMPT = `You are a job-match analyst. Given a CV and a job description, analyze how well the CV matches the job.

Return a JSON object with this exact schema:
{
  "overallMatchPercentage": number,
  "requiredMatchPercentage": number,
  "preferredMatchPercentage": number,
  "skillMatches": [
    {
      "skill": string,
      "category": string,
      "matched": boolean,
      "cvLevel": "beginner" | "intermediate" | "advanced" | "expert" | null,
      "requirementType": "required" | "preferred"
    }
  ],
  "missingCriticalSkills": string[],
  "strengths": string[],
  "gaps": string[],
  "hints": string[]
}

Rules:
- overallMatchPercentage is the weighted match across all skills.
- requiredMatchPercentage is match rate on required skills only.
- preferredMatchPercentage is match rate on preferred skills only.
- skillMatches must list every required and preferred skill from the job description.
- matched is true when the CV demonstrates that skill (even partially or via a related technology).
- cvLevel estimates the candidate's proficiency based on CV evidence (set null if unmatched).
- category groups the skill (e.g. "Language", "Frontend", "Backend", "Database", "Cloud & DevOps", "Testing").
- strengths are matched required skills.
- gaps are unmatched required skills.
- hints are actionable suggestions to improve the CV for this specific role. Be specific — reference actual CV content.
- Return ONLY valid JSON — no markdown fences, no extra text.`;

export class LLMMatcher implements MatcherStrategy {
  readonly name = "llm";

  constructor(
    private apiKey: string,
    private model: string
  ) {}

  async analyze(cv: CV, job: JobDescription): Promise<MatchResult> {
    const userPrompt = this.buildPrompt(cv, job);

    const client = new OpenAI({ apiKey: this.apiKey });

    const response = await client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("LLM returned empty response");
    }

    const parsed = JSON.parse(content) as Omit<MatchResult, "jobTitle" | "company" | "generatedAt">;

    return {
      jobTitle: job.title,
      company: job.company,
      generatedAt: new Date().toISOString(),
      ...parsed,
    };
  }

  private buildPrompt(cv: CV, job: JobDescription): string {
    return `## CV
${cv.raw}

## Job Description
${job.raw}`;
  }
}
