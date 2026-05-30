import { Config, MatcherType } from "./types.js";

export function loadConfig(): Config {
  const matcherEnv = process.env.MATCHER_TYPE?.trim().toLowerCase();
  const matcher: MatcherType =
    matcherEnv === "llm" || matcherEnv === "regex" ? matcherEnv : "regex";

  return {
    matcher,
    openaiApiKey: process.env.OPENAI_API_KEY,
    openaiModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  };
}
