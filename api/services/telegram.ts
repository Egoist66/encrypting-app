import axios, { AxiosError } from 'axios';

export interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
}

export interface TelegramSendResult {
  success: boolean;
  message_id?: number;
  error?: string;
}

/**
 * Отправляет сообщение в Telegram
 */
export async function sendTelegramMessage(
  chatId: string, 
  text: string, 
  parseMode: 'HTML' | 'Markdown' = 'HTML'
): Promise<TelegramSendResult> {
  try {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
    
    console.log('🔧 Переменные окружения:');
    console.log('TELEGRAM_BOT_TOKEN:', TELEGRAM_BOT_TOKEN ? '✅ Установлен' : '❌ Не установлен');
    console.log('TELEGRAM_API_URL:', TELEGRAM_API_URL);
    
    if (!TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN не настроен');
    }

    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: parseMode,
    });

    if (response.data.ok) {
      return {
        success: true,
        message_id: response.data.result.message_id,
      };
    } else {
      return {
        success: false,
        error: response.data.description || 'Неизвестная ошибка Telegram API',
      };
    }
  } catch (error) {
    console.error('Ошибка отправки в Telegram:', error);
    
    if (axios.isAxiosError(error)) {
      const errorData = (error as AxiosError).response?.data as any;
      const errorMessage = errorData?.description || error.message;
      return {
        success: false,
        error: `Ошибка Telegram API: ${errorMessage}`,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
    };
  }
}

/**
 * Форматирует зашифрованное сообщение для отправки в Telegram
 */
export function formatEncryptedMessage(
  encryptedText: string, 
  encryptionKey: string, 
  originalText?: string
): string {
    const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';  
  const message = `
🔐 <b>Зашифрованное сообщение</b>

<b>Исходный текст:</b>
${originalText || 'Не указан'}

<b>Зашифрованный текст:</b>
<code>${encryptedText}</code>

<b>Ключ шифрования:</b>
<code>${encryptionKey}</code>

<i>Для расшифровки используйте приложение: ${CLIENT_URL}</i>
  `.trim();

  return message;
}

/**
 * Отправляет зашифрованное сообщение в виде двух отдельных сообщений для удобного копирования
 */
export async function sendEncryptedMessageSeparate(
  chatId: string,
  encryptedText: string,
  encryptionKey: string,
  originalText?: string
): Promise<TelegramSendResult> {
  try {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
    
    if (!TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN не настроен');
    }

    const CLIENT_URL = 'https://encrypting-app.vercel.app/';
    
    // Первое сообщение - информация и зашифрованный текст
    const message1 = `
🔐 <b>Зашифрованное сообщение</b>

<b>Исходный текст:</b>
${originalText || 'Не указан'}

<b>Зашифрованный текст:</b>
<code>${encryptedText}</code>

<i>Для расшифровки используйте приложение: ${CLIENT_URL}</i>
    `.trim();

    // Второе сообщение - ключ шифрования
    const message2 = `
🔑 <b>Ключ шифрования</b>

<code>${encryptionKey}</code>

<i>Скопируйте этот ключ для расшифровки</i>
    `.trim();

    // Отправляем первое сообщение
    const response1 = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: message1,
      parse_mode: 'HTML',
    });

    if (!response1.data.ok) {
      return {
        success: false,
        error: response1.data.description || 'Ошибка отправки первого сообщения',
      };
    }

    // Отправляем второе сообщение
    const response2 = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: message2,
      parse_mode: 'HTML',
    });

    if (!response2.data.ok) {
      return {
        success: false,
        error: response2.data.description || 'Ошибка отправки второго сообщения',
      };
    }

    return {
      success: true,
      message_id: response1.data.result.message_id,
    };

  } catch (error) {
    console.error('Ошибка отправки разделенных сообщений в Telegram:', error);
    
    if (axios.isAxiosError(error)) {
      const errorData = (error as AxiosError).response?.data as any;
      const errorMessage = errorData?.description || error.message;
      return {
        success: false,
        error: `Ошибка Telegram API: ${errorMessage}`,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
    };
  }
}

/**
 * Проверяет валидность chat_id
 */
export function isValidChatId(chatId: string): boolean {
  // Telegram chat_id может быть числом или строкой, начинающейся с @
  // Также поддерживаем отрицательные числа для групп
  return /^(@\w+|-?\d+)$/.test(chatId);
}
