import { useState, useEffect } from 'react';
import { EncryptedMessage, MessageHistoryStorage } from '../types/message-history';

const STORAGE_KEY = 'encrypting_app_message_history';

export const useMessageHistory = (userId: string | null) => {
  const [messages, setMessages] = useState<EncryptedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем историю из localStorage
  useEffect(() => {
    console.log('🔄 Загружаем историю для userId:', userId);
    
    if (!userId) {
      console.log('❌ Нет userId, очищаем сообщения');
      setMessages([]);
      setIsLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log('📦 Данные из localStorage:', stored);
      
      if (stored) {
        const history: MessageHistoryStorage = JSON.parse(stored);
        const userHistory = history[userId];
        console.log('👤 История пользователя:', userHistory);
        
        if (userHistory) {
          // Сортируем по времени (новые сверху)
          const sortedMessages = userHistory.messages.sort((a, b) => b.timestamp - a.timestamp);
          console.log('📝 Отсортированные сообщения:', sortedMessages);
          setMessages(sortedMessages);
        } else {
          console.log('📝 Нет истории для этого пользователя');
        }
      } else {
        console.log('📝 Нет данных в localStorage');
      }
    } catch (error) {
      console.error('Ошибка загрузки истории сообщений:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Сохраняем новое сообщение
  const saveMessage = (message: Omit<EncryptedMessage, 'id' | 'timestamp'>) => {
    if (!userId) {
      console.log('❌ Нет userId для сохранения сообщения');
      return;
    }

    console.log('💾 Сохраняем сообщение:', { userId, message });

    const newMessage: EncryptedMessage = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let history: MessageHistoryStorage = stored ? JSON.parse(stored) : {};

      if (!history[userId]) {
        history[userId] = { userId, messages: [] };
      }

      // Проверяем на дублирование по содержимому (оригинальный текст + зашифрованный текст + ключ)
      const isDuplicate = history[userId].messages.some(existingMessage => 
        existingMessage.originalText === message.originalText &&
        existingMessage.encryptedText === message.encryptedText &&
        existingMessage.encryptionKey === message.encryptionKey
      );

      if (isDuplicate) {
        console.log('⚠️ Пропускаем дублирование сообщения в localStorage');
        return;
      }

      // Добавляем новое сообщение в начало массива
      history[userId].messages.unshift(newMessage);

      // Ограничиваем количество сообщений (например, последние 100)
      if (history[userId].messages.length > 100) {
        history[userId].messages = history[userId].messages.slice(0, 100);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      setMessages(prev => [newMessage, ...prev]);
      
      console.log('✅ Сообщение сохранено в localStorage и состояние обновлено');
    } catch (error) {
      console.error('Ошибка сохранения сообщения:', error);
    }
  };

  // Обновляем сообщение (например, после отправки в Telegram)
  const updateMessage = (messageId: string, updates: Partial<EncryptedMessage>) => {
    if (!userId) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const history: MessageHistoryStorage = JSON.parse(stored);
      if (!history[userId]) return;

      const messageIndex = history[userId].messages.findIndex(msg => msg.id === messageId);
      if (messageIndex !== -1) {
        history[userId].messages[messageIndex] = {
          ...history[userId].messages[messageIndex],
          ...updates,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, ...updates }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Ошибка обновления сообщения:', error);
    }
  };

  // Удаляем сообщение
  const deleteMessage = (messageId: string) => {
    if (!userId) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const history: MessageHistoryStorage = JSON.parse(stored);
      if (!history[userId]) return;

      history[userId].messages = history[userId].messages.filter(msg => msg.id !== messageId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Ошибка удаления сообщения:', error);
    }
  };

  // Очищаем всю историю пользователя
  const clearHistory = () => {
    if (!userId) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const history: MessageHistoryStorage = JSON.parse(stored);
      delete history[userId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      setMessages([]);
    } catch (error) {
      console.error('Ошибка очистки истории:', error);
    }
  };

  // Удаляем дубликаты из истории
  const removeDuplicates = () => {
    if (!userId) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const history: MessageHistoryStorage = JSON.parse(stored);
      if (!history[userId]) return;

      const uniqueMessages: EncryptedMessage[] = [];
      const seen = new Set<string>();

      for (const message of history[userId].messages) {
        // Создаем безопасный ключ для сравнения (кодируем Unicode символы)
        const messageKey = btoa(encodeURIComponent(`${message.originalText}-${message.encryptedText}-${message.encryptionKey}`));
        if (!seen.has(messageKey)) {
          seen.add(messageKey);
          uniqueMessages.push(message);
        }
      }

      history[userId].messages = uniqueMessages;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      setMessages(uniqueMessages);
      
      console.log(`🧹 Удалено ${history[userId].messages.length - uniqueMessages.length} дубликатов`);
    } catch (error) {
      console.error('Ошибка удаления дубликатов:', error);
    }
  };

  return {
    messages,
    isLoading,
    saveMessage,
    updateMessage,
    deleteMessage,
    clearHistory,
    removeDuplicates,
  };
};
