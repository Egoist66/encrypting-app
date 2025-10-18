import { useDecryption } from "../../hooks/useDecryption";

export const Decryption = () => {
  const {
    encrypted,
    setEncrypted,
    key,
    setKey,
    handleDecrypt,
    result,
    isDecrypting,
  } = useDecryption();

  return (
    <div className="encryption-form">
      <h2>Расшифровать сообщение</h2>
      <textarea
        value={encrypted}
        onChange={(e) => setEncrypted(e.target.value)}
        placeholder="Введите зашифрованный текст..."
        rows={3}
      />
      <input
        type="text"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Введите ключ..."
        className="key-input"
      />
      <button
        onClick={handleDecrypt}
        inert={isDecrypting}
        disabled={!encrypted || !key || isDecrypting}
      >
        {isDecrypting ? "Расшифровывается..." : "Расшифровать"}
      </button>
      {result && (
        <div className="result">
          <pre dangerouslySetInnerHTML={{ __html: result }}></pre>
        </div>
      )}
    </div>
  );
};

