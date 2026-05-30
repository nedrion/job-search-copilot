import { CV, JobDescription, MatchResult } from "../types.js";

export interface MatcherStrategy {
  readonly name: string;
  analyze(cv: CV, job: JobDescription): Promise<MatchResult>;
}
