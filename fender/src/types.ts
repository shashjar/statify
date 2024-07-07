export type Sender = "ai" | "user";

export type ChatMessage = {
  sender: Sender;
  content: string;
};
