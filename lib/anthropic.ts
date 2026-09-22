import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-sonnet-5";

// Server-side only — reads ANTHROPIC_API_KEY from the environment.
export const anthropic = new Anthropic();
