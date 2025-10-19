// Типы для истории сообщений
export interface EncryptedMessage {
  id: string;
  originalText: string;
  encryptedText: string;
  encryptionKey: string;
  timestamp: number;
  sentToTelegram?: boolean;
  telegramChatId?: string;
}

export interface UserMessageHistory {
  userId: string;
  messages: EncryptedMessage[];
}

export interface MessageHistoryStorage {
  [userId: string]: UserMessageHistory;
}
