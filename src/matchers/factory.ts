import { Config } from "../types.js";
import { MatcherStrategy } from "./matcher.js";
import { RegexMatcher } from "./regex-matcher.js";
import { LLMMatcher } from "./llm-matcher.js";

export function createMatcher(config: Config): MatcherStrategy {
  switch (config.matcher) {
    case "llm": {
      if (!config.openaiApiKey) {
        throw new Error(
          "OPENAI_API_KEY is required when MATCHER_TYPE=llm"
        );
      }
      return new LLMMatcher(config.openaiApiKey, config.openaiModel ?? "gpt-4o-mini");
    }
    case "regex":
      return new RegexMatcher();
    default:
      return new RegexMatcher();
  }
}
