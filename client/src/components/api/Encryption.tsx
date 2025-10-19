import { useEncryption } from "../../hooks/useEncryption";
import { useTelegram } from "../../hooks/useTelegram";
import { useMessageHistory } from "../../hooks/useMessageHistory";
import { MessageHistory } from "../MessageHistory";
import { Tabs } from "../Tabs";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

export const Encryption = () => {
    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    const { 
      text, 
      setText, 
      handleEncrypt, 
      result, 
      isEncrypting, 
      encryptedText, 
      encryptionKey, 
      originalText, 
      copyEncryptedText, 
      copyKey, 
      copyStatus
    } = useEncryption();

    const { isSending, sendStatus, sendToTelegram, clearStatus } = useTelegram();
    const { 
      messages, 
      isLoading: historyLoading, 
      saveMessage, 
      updateMessage, 
      deleteMessage, 
      clearHistory,
      removeDuplicates 
    } = useMessageHistory(user?.id || null);
    
    const [telegramChatId, setTelegramChatId] = useState<string>("");
    const [showTelegramForm, setShowTelegramForm] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("encrypt");
    const [lastSavedHash, setLastSavedHash] = useState<string>(""); // Хеш последнего сохраненного сообщения

    // Функция для проверки наличия дубликатов
    const hasDuplicates = () => {
        if (messages.length <= 1) return false;
        
        const seen = new Set<string>();
        for (const message of messages) {
            const messageKey = btoa(encodeURIComponent(`${message.originalText}-${message.encryptedText}-${message.encryptionKey}`));
            if (seen.has(messageKey)) {
                return true;
            }
            seen.add(messageKey);
        }
        return false;
    };

    // useEffect для сохранения сообщения после успешного шифрования
    useEffect(() => {
        if (encryptedText && encryptionKey && originalText) {
            // Создаем уникальный хеш для сообщения (безопасно для Unicode)
            const messageHash = btoa(encodeURIComponent(originalText + encryptedText + encryptionKey)).slice(0, 20);
            
            // Проверяем, что это новое сообщение (не дублируем сохранение)
            if (messageHash !== lastSavedHash) {
                console.log('💾 Сохраняем новое сообщение в историю:');
                console.log('📝 originalText:', originalText);
                console.log('🔐 encryptedText:', encryptedText);
                console.log('🔑 encryptionKey:', encryptionKey);
                console.log('🔍 messageHash:', messageHash);
                console.log('🔍 lastSavedHash:', lastSavedHash);
                
                // Дополнительная проверка: убеждаемся, что данные соответствуют друг другу
                if (originalText.trim() && encryptedText.trim() && encryptionKey.trim()) {
                    saveMessage({
                        originalText: originalText,
                        encryptedText: encryptedText,
                        encryptionKey: encryptionKey,
                    });
                    
                    setLastSavedHash(messageHash);
                } else {
                    console.error('❌ Ошибка: пустые данные для сохранения');
                }
            } else {
                console.log('⚠️ Пропускаем дублирование сообщения с хешем:', messageHash);
            }
        }
    }, [encryptedText, encryptionKey, originalText, saveMessage, lastSavedHash]);

    const handleEncryptWithHistory = async () => {
        console.log('🔐 Начинаем шифрование с сохранением в историю');
        console.log('👤 Текущий пользователь:', user);
        console.log('📝 Текст для шифрования:', text);
        
        // Вызываем оригинальную функцию шифрования
        await handleEncrypt();
    };

    const handleSendToTelegram = async () => {
        if (!telegramChatId.trim()) {
            alert("Введите chat_id получателя");
            return;
        }

        if (!encryptedText || !encryptionKey) {
            alert("Сначала зашифруйте сообщение");
            return;
        }

        const success = await sendToTelegram({
            chat_id: telegramChatId.trim(),
            encrypted_text: encryptedText,
            encryption_key: encryptionKey,
            original_text: text
        });

        // Обновляем сообщение в истории после отправки в Telegram
        if (success && messages.length > 0) {
            // Находим последнее сообщение (самое новое)
            const lastMessage = messages[0];
            updateMessage(lastMessage.id, {
                sentToTelegram: true,
                telegramChatId: telegramChatId.trim()
            });
        }

        // Очищаем поле chat_id после успешной отправки
        if (success) {
            setTelegramChatId("");
        }
    };

    const toggleTelegramForm = () => {
        setShowTelegramForm(!showTelegramForm);
        if (showTelegramForm) {
            clearStatus();
        }
    };

  const tabs = [
    {
      id: "encrypt",
      label: "Шифрование",
      icon: "🔐",
      content: (
        <div className="encrypt-tab">
          <h2>Зашифровать сообщение</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите текст..."
            rows={4}
          />
          <button className="encrypt-btn" onClick={handleEncryptWithHistory} inert={isEncrypting} disabled={!text || isEncrypting}>
            {isEncrypting ? "Зашифровывается..." : "Зашифровать"}
          </button>
        </div>
      )
    },
    {
      id: "history",
      label: "История",
      icon: "📝",
      content: (
        <div>
          <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#f8f9fa', borderRadius: '4px', fontSize: '0.9rem' }}>
            <strong>Отладка:</strong> Сообщений: {messages.length}, Загрузка: {historyLoading ? 'Да' : 'Нет'}, Пользователь: {user?.id || 'Нет'}
            {hasDuplicates() && (
              <>
                <br />
                <button 
                  onClick={removeDuplicates}
                  style={{ 
                    marginTop: '0.5rem', 
                    padding: '0.25rem 0.5rem', 
                    fontSize: '0.8rem',
                    background: '#ffc107',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  🧹 Очистить дубликаты
                </button>
              </>
            )}
          </div>
          <MessageHistory
            messages={messages}
            isLoading={historyLoading}
            onDeleteMessage={deleteMessage}
            onClearHistory={clearHistory}
            onRemoveDuplicates={removeDuplicates}
            hasDuplicates={hasDuplicates()}
          />
        </div>
      )
    }
  ];

  return (
    <div className="encryption-form">
      <Tabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      {result && (
        <div className="result">
          <div className="result-header">
            <h3>Результат шифрования</h3>
          </div>
          <div className="result-content">
            <div className="result-item">
              <div className="result-label">
                <label>Зашифрованный текст:</label>
                <button 
                  className="copy-btn" 
                  onClick={copyEncryptedText}
                  title="Копировать зашифрованный текст"
                >
                  {copyStatus.text ? "✓ Скопировано" : "📋 Копировать"}
                </button>
              </div>
              <div className="result-value">
                <pre>{encryptedText}</pre>
              </div>
            </div>
            <div className="result-item">
              <div className="result-label">
                <label>Ключ шифрования:</label>
                <button 
                  className="copy-btn" 
                  onClick={copyKey}
                  title="Копировать ключ шифрования"
                >
                  {copyStatus.key ? "✓ Скопировано" : "📋 Копировать"}
                </button>
              </div>
              <div className="result-value">
                <pre>{encryptionKey}</pre>
              </div>
            </div>
          </div>
          
          {/* Telegram отправка */}
          <div className="telegram-section">
            <button 
              className="telegram-send-btn" 
              onClick={toggleTelegramForm}
            >
              {showTelegramForm ? "✖ Скрыть" : "📱 Отправить в Telegram"}
            </button>
            
            {showTelegramForm && (
              <div className="telegram-form">
                <div className="form-group">
                  <label htmlFor="telegram-chat-id">
                    Chat ID получателя:
                  </label>
                  <div className="input-with-button">
                    <input
                      id="telegram-chat-id"
                      type="text"
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      placeholder="Введите числовой ID (например, 568285771)"
                      className="telegram-input"
                    />
                    <button 
                      type="button"
                      className="get-chat-id-btn"
                      onClick={() => window.open('/get-chat-id.html', '_blank')}
                      title="Получить chat_id"
                    >
                      🔍 Получить ID
                    </button>
                  </div>
                  <small className="help-text">
                    <strong>📱 Для отправки по @username:</strong>
                    <br />
                    1. Получатель должен написать боту <a href="https://t.me/encrypt_app_bot" target="_blank">@encrypt_app_bot</a>
                    <br />
                    2. Затем используйте числовой ID (например, 568285771)
                    <br />
                    <br />
                    <strong>❌ Нельзя:</strong> Отправлять напрямую по @username
                    <br />
                    <strong>✅ Можно:</strong> Использовать числовой chat_id
                  </small>
                </div>
                
                <button 
                  className="telegram-send-btn" 
                  onClick={handleSendToTelegram}
                  disabled={isSending || !telegramChatId.trim()}
                >
                  {isSending ? "📤 Отправляется..." : "📤 Отправить в Telegram"}
                </button>
                
                {sendStatus && (
                  <div className={`telegram-status ${sendStatus.success ? 'success' : 'error'}`}>
                    {sendStatus.success ? "✅" : "❌"} {sendStatus.message}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
