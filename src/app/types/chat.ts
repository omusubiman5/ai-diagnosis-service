export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatAPIRequest {
  messages: Pick<ChatMessage, 'role' | 'content'>[];
}

export interface ChatAPIResponse {
  message: Pick<ChatMessage, 'role' | 'content'>;
}

export interface ChatAPIError {
  error: string;
}
