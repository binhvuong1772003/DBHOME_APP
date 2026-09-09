export type AiAssistantDisplayMode = "closed" | "compact" | "expanded";

export type AiMessageRole = "user" | "assistant";

export type AiMessageState = "sent" | "error";

export interface AiChatMessage {
  id: string;
  role: AiMessageRole;
  content: string;
  state: AiMessageState;
  retryPrompt?: string;
  createdAt?: string;
}

export interface AiChatResponse {
  conversationId: string;
  message: string;
}

export type AiConversationRole = "USER" | "ASSISTANT" | "TOOL";

export interface AiConversationMessage {
  id: string;
  role: AiConversationRole;
  content: string;
  toolName?: string | null;
  createdAt: string;
}

export interface AiConversationSummary {
  id: string;
  title?: string | null;
  summary?: string | null;
  status: "ACTIVE" | "ARCHIVED";
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: {
    role: AiConversationRole;
    content: string;
    createdAt: string;
  } | null;
}

export interface AiConversationListResponse {
  items: AiConversationSummary[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface AiConversationMessagesResponse {
  conversation: Pick<
    AiConversationSummary,
    "id" | "title" | "summary" | "status"
  >;
  items: AiConversationMessage[];
  nextCursor: string | null;
  hasMore: boolean;
}
