import { CV, JobDescription, MatchResult, SkillMatch } from "../types.js";
import { MatcherStrategy } from "./matcher.js";

export class RegexMatcher implements MatcherStrategy {
  readonly name = "regex";

  async analyze(cv: CV, job: JobDescription): Promise<MatchResult> {
    const skillMatches: SkillMatch[] = [];

    for (const skill of job.requiredSkills) {
      const match = cv.skills.find(
        (s) => s.name.toLowerCase() === skill.toLowerCase()
      );
      skillMatches.push({
        skill,
        category: match?.category ?? "unknown",
        matched: !!match,
        cvLevel: match?.level,
        requirementType: "required",
      });
    }

    for (const skill of job.preferredSkills) {
      const match = cv.skills.find(
        (s) => s.name.toLowerCase() === skill.toLowerCase()
      );
      skillMatches.push({
        skill,
        category: match?.category ?? "unknown",
        matched: !!match,
        cvLevel: match?.level,
        requirementType: "preferred",
      });
    }

    const requiredMatches = skillMatches.filter(
      (m) => m.requirementType === "required"
    );
    const preferredMatches = skillMatches.filter(
      (m) => m.requirementType === "preferred"
    );

    const requiredMatchPercentage =
      requiredMatches.length > 0
        ? Math.round(
            (requiredMatches.filter((m) => m.matched).length /
              requiredMatches.length) *
              100
          )
        : 0;

    const preferredMatchPercentage =
      preferredMatches.length > 0
        ? Math.round(
            (preferredMatches.filter((m) => m.matched).length /
              preferredMatches.length) *
              100
          )
        : 0;

    const totalSkills = skillMatches.length;
    const matchedSkills = skillMatches.filter((m) => m.matched).length;
    const overallMatchPercentage =
      totalSkills > 0
        ? Math.round((matchedSkills / totalSkills) * 100)
        : 0;

    const missingCriticalSkills = requiredMatches
      .filter((m) => !m.matched)
      .map((m) => m.skill);

    const strengths = requiredMatches
      .filter((m) => m.matched)
      .map((m) => m.skill);

    const gaps = missingCriticalSkills;

    const hints = this.generateHints(missingCriticalSkills, strengths);

    return {
      jobTitle: job.title,
      company: job.company,
      overallMatchPercentage,
      requiredMatchPercentage,
      preferredMatchPercentage,
      skillMatches,
      missingCriticalSkills,
      strengths,
      gaps,
      hints,
      generatedAt: new Date().toISOString(),
    };
  }

  private generateHints(missingSkills: string[], strengths: string[]): string[] {
    const hints: string[] = [];

    if (missingSkills.length > 0) {
      hints.push(
        `Consider adding any transferable experience related to: ${missingSkills.join(", ")}.`
      );
      hints.push(
        "If you have exposure to these skills in academic or personal projects, mention them explicitly."
      );
    }

    if (strengths.length > 0) {
      hints.push(
        `Highlight your strength in ${strengths.join(", ")} earlier in your CV — put them in the summary/profile section.`
      );
      hints.push(
        "For each matched skill, add a quantifiable achievement under your experience to reinforce proficiency."
      );
    }

    hints.push(
      "Tailor your professional summary to mirror keywords from the job description."
    );
    hints.push(
      "Use the same terminology as the job posting — applicant tracking systems favor keyword alignment."
    );

    return hints;
  }
}
