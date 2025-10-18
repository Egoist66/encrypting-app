import { useEncryption } from "../../hooks/useEncryption";

export const Encryption = () => {

    const { text, setText, handleEncrypt, result, isEncrypting } = useEncryption()
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
          <pre dangerouslySetInnerHTML={{ __html: result }}></pre>
        </div>
      )}
    </div>
  );
};
