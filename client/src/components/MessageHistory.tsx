import { useState } from 'react';
import { EncryptedMessage } from '../types/message-history';

interface MessageHistoryProps {
  messages: EncryptedMessage[];
  isLoading: boolean;
  onDeleteMessage: (messageId: string) => void;
  onClearHistory: () => void;
  onRemoveDuplicates?: () => void;
  hasDuplicates?: boolean;
}

export const MessageHistory = ({ 
  messages, 
  isLoading, 
  onDeleteMessage, 
  onClearHistory,
  onRemoveDuplicates,
  hasDuplicates = false
}: MessageHistoryProps) => {
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Можно добавить уведомление об успешном копировании
    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
  };

  const handleClearHistory = () => {
    onClearHistory();
    setShowConfirmClear(false);
  };

  if (isLoading) {
    return (
      <div className="message-history">
        <div className="loading">⏳ Загрузка истории...</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="message-history">
        <div className="empty-state">
          <h3>📝 История сообщений пуста</h3>
          <p>Здесь будут отображаться ваши зашифрованные сообщения</p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-history">
      <div className="history-header">
        <h3>📝 История сообщений ({messages.length})</h3>
        <div className="history-actions">
          {onRemoveDuplicates && hasDuplicates && (
            <button 
              className="remove-duplicates-btn"
              onClick={onRemoveDuplicates}
              title="Удалить дубликаты"
            >
              🧹 Убрать дубликаты
            </button>
          )}
          <button 
            className="clear-history-btn"
            onClick={() => setShowConfirmClear(true)}
            title="Очистить всю историю"
          >
            🗑️ Очистить
          </button>
        </div>
      </div>

      {showConfirmClear && (
        <div className="confirm-dialog">
          <div className="confirm-content">
            <h4>⚠️ Подтверждение</h4>
            <p>Вы уверены, что хотите удалить всю историю сообщений?</p>
            <div className="confirm-buttons">
              <button 
                className="confirm-btn danger"
                onClick={handleClearHistory}
              >
                Да, удалить
              </button>
              <button 
                className="confirm-btn"
                onClick={() => setShowConfirmClear(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="messages-list">
        {messages.map((message) => (
          <div key={message.id} className="message-item">
            <div className="message-header">
              <div className="message-info">
                <span className="message-time">{formatDate(message.timestamp)}</span>
                {message.sentToTelegram && (
                  <span className="telegram-sent">📱 Отправлено в Telegram</span>
                )}
              </div>
              <button 
                className="delete-message-btn"
                onClick={() => onDeleteMessage(message.id)}
                title="Удалить сообщение"
              >
                ❌
              </button>
            </div>

            <div className="message-content">
              <div className="original-text">
                <strong>Исходный текст:</strong>
                <p>{message.originalText}</p>
              </div>

              <div className="encrypted-section">
                <div className="encrypted-header">
                  <button 
                    className="toggle-btn"
                    onClick={() => setExpandedMessage(
                      expandedMessage === message.id ? null : message.id
                    )}
                  >
                    {expandedMessage === message.id ? '🔽' : '▶️'} Зашифрованные данные
                  </button>
                </div>

                {expandedMessage === message.id && (
                  <div className="encrypted-data">
                    <div className="encrypted-item">
                      <div className="encrypted-label">
                        <label>Зашифрованный текст:</label>
                        <button 
                          className="copy-btn"
                          onClick={() => copyToClipboard(message.encryptedText)}
                          title="Копировать зашифрованный текст"
                        >
                          📋 Копировать
                        </button>
                      </div>
                      <div className="encrypted-value">
                        <pre>{message.encryptedText}</pre>
                      </div>
                    </div>

                    <div className="encrypted-item">
                      <div className="encrypted-label">
                        <label>Ключ шифрования:</label>
                        <button 
                          className="copy-btn"
                          onClick={() => copyToClipboard(message.encryptionKey)}
                          title="Копировать ключ"
                        >
                          📋 Копировать
                        </button>
                      </div>
                      <div className="encrypted-value">
                        <pre>{message.encryptionKey}</pre>
                      </div>
                    </div>

                    {message.telegramChatId && (
                      <div className="telegram-info">
                        <strong>Отправлено в Telegram:</strong> {message.telegramChatId}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
