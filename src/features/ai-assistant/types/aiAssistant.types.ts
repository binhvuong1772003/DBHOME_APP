export type AiAssistantDisplayMode = "closed" | "compact" | "expanded";

export type AiMessageRole = "user" | "assistant";

export type AiMessageState = "sent" | "error";

export interface AiChatMessage {
  id: string;
  role: AiMessageRole;
  content: string;
  state: AiMessageState;
  retryPrompt?: string;
}

export interface AiChatResponse {
  message: string;
}
