import { Config, MatcherType } from "./types.js";
import * as dotenv from 'dotenv';

export function loadConfig(): Config {
  dotenv.config();
  const matcherEnv = process.env.MATCHER_TYPE?.trim().toLowerCase();
  const matcher: MatcherType =
    matcherEnv === "llm" || matcherEnv === "regex" ? matcherEnv : "regex";

  return {
    matcher,
    llmBaseUrl: process.env.LLM_BASE_URL ?? "http://localhost:11434/v1",
    llmApiKey: process.env.LLM_API_KEY || "ollama",
    llmModel: process.env.LLM_MODEL ?? "llama3",
  };
}
