export interface ChatMessage {
  fromUser?: string;
  toUser?: string;
  message: string;
  createdAt?: Date;
  organizationId?: string;
}
