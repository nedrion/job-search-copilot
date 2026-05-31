import { Config } from "../types.js";
import { MatcherStrategy } from "./matcher.js";
import { RegexMatcher } from "./regex-matcher.js";
import { LLMMatcher } from "./llm-matcher.js";

export function createMatcher(config: Config): MatcherStrategy {
  switch (config.matcher) {
    case "llm":
      return new LLMMatcher(
        config.llmBaseUrl ?? "http://localhost:11434/v1",
        config.llmApiKey || "ollama",
        config.llmModel ?? "llama3"
      );
    case "regex":
      return new RegexMatcher();
    default:
      return new RegexMatcher();
  }
}
