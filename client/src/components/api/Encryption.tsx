import { useEncryption } from "../../hooks/useEncryption";
import { useTelegram } from "../../hooks/useTelegram";
import { useState } from "react";

export const Encryption = () => {
    const { 
      text, 
      setText, 
      handleEncrypt, 
      result, 
      isEncrypting, 
      encryptedText, 
      encryptionKey, 
      copyEncryptedText, 
      copyKey, 
      copyStatus 
    } = useEncryption();

    const { isSending, sendStatus, sendToTelegram, clearStatus } = useTelegram();
    const [telegramChatId, setTelegramChatId] = useState<string>("");
    const [showTelegramForm, setShowTelegramForm] = useState<boolean>(false);

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

  return (
    <div className="encryption-form">
      <h2>Зашифровать сообщение</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Введите текст..."
        rows={4}
      />
      <button onClick={handleEncrypt} inert={isEncrypting} disabled={!text || isEncrypting}>
        {isEncrypting ? "Зашифровывается..." : "Зашифровать"}
      </button>
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
              className="telegram-toggle-btn" 
              onClick={toggleTelegramForm}
            >
              {showTelegramForm ? "✖ Скрыть отправку в Telegram" : "📱 Отправить в Telegram"}
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
                    1. Получатель должен написать боту @encrypt_app_bot
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
