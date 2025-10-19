import { useState, useEffect } from "react";
import { ApiResponse } from "../types/api-response";
import { delay } from "../utils/delay";

export const useEncryption = () => {
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [isEncrypting, setIsEncrypting] = useState<boolean>(false);
    const [text, setText] = useState<string>("");
    const [result, setResult] = useState<string>("");
    const [encryptedText, setEncryptedText] = useState<string>("");
    const [encryptionKey, setEncryptionKey] = useState<string>("");
    const [copyStatus, setCopyStatus] = useState<{text: boolean, key: boolean}>({text: false, key: false});
  
    useEffect(() => {
      // Проверка связи с сервером
      (async () => {
        const response = await fetch("/api/health")
        const data: ApiResponse = await response.json();
        setMessage(data.message || "Сервер не отвечает");
        setLoading(false);

      })()
    }, []);
  
    const handleEncrypt = async () => {
      try {
        setIsEncrypting(true);
        await delay(1000);
        const response = await fetch("/api/encrypt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({ text }),
        });
        const data: ApiResponse = await response.json();
        if (data.success && data.data) {
          setEncryptedText(data.data.encrypted);
          setEncryptionKey(data.data.key);
          setResult(`<b>Зашифрованный текст:</b> ${data.data.encrypted}\n<b>Ключ:</b> ${data.data.key}`);
          setText("");
          setIsEncrypting(false);
        }
      } catch (err) {
        console.error("Ошибка шифрования:", err);
      }
    };

    const copyToClipboard = async (text: string, type: 'text' | 'key') => {
      try {
        await navigator.clipboard.writeText(text);
        setCopyStatus(prev => ({ ...prev, [type]: true }));
        setTimeout(() => {
          setCopyStatus(prev => ({ ...prev, [type]: false }));
        }, 2000);
      } catch (err) {
        console.error('Ошибка копирования:', err);
      }
    };

    const copyEncryptedText = () => copyToClipboard(encryptedText, 'text');
    const copyKey = () => copyToClipboard(encryptionKey, 'key');

    return { 
      message, 
      loading, 
      text, 
      result, 
      handleEncrypt, 
      setText, 
      isEncrypting, 
      encryptedText, 
      encryptionKey, 
      copyEncryptedText, 
      copyKey, 
      copyStatus 
    };
};