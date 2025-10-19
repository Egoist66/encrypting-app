// Типы для API
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Типы для Telegram
export interface TelegramSendRequest {
    chat_id: string;
    encrypted_text: string;
    encryption_key: string;
    original_text?: string;
}

export interface TelegramSendResponse {
    success: boolean;
    message_id?: number;
    error?: string;
}
  