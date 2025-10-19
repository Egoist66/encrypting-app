import { useEncryption } from "../../hooks/useEncryption";

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
        </div>
      )}
    </div>
  );
};
