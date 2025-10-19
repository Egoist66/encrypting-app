import { useState } from "react";
import { ApiResponse } from "../types/api-response";
import { delay } from "../utils/delay";

export const useDecryption = () => {
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [encrypted, setEncrypted] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const handleDecrypt = async () => {
    try {
      setIsDecrypting(true);
      await delay(1000);
      const response = await fetch("/api/decrypt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ encrypted, key }),
      });
      const data: ApiResponse = await response.json();
      if (data.success && data.data) {
        setResult(`<b>Расшифрованный текст:</b> ${data.data.decrypted}`);
        setEncrypted("");
        setKey("");
      } else {
        setResult(`<b style="color: #e74c3c;">Ошибка:</b> ${data.error || "Не удалось расшифровать"}`);
      }
      setIsDecrypting(false);
    } catch (err) {
      console.error("Ошибка расшифрования:", err);
      setResult(`<b style="color: #e74c3c;">Ошибка:</b> Проблема с подключением`);
      setIsDecrypting(false);
    }
  };

  return {
    encrypted,
    setEncrypted,
    key,
    setKey,
    result,
    handleDecrypt,
    isDecrypting,
  };
};

