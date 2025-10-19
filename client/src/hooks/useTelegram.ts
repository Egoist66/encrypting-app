import { useState } from "react";
import { ApiResponse, TelegramSendRequest, TelegramSendResponse } from "../types/api-response";

export const useTelegram = () => {
    const [isSending, setIsSending] = useState<boolean>(false);
    const [sendStatus, setSendStatus] = useState<{success: boolean, message: string} | null>(null);

    const sendToTelegram = async (data: TelegramSendRequest) => {
        try {
            setIsSending(true);
            setSendStatus(null);

            const response = await fetch("/api/telegram/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            const result: ApiResponse<TelegramSendResponse> = await response.json();

            if (result.success) {
                setSendStatus({
                    success: true,
                    message: result.message || "Сообщение успешно отправлено в Telegram!"
                });
                // Очищаем поле chat_id после успешной отправки
                return true;
            } else {
                setSendStatus({
                    success: false,
                    message: result.error || "Ошибка отправки в Telegram"
                });
                return false;
            }
        } catch (error) {
            console.error("Ошибка отправки в Telegram:", error);
            setSendStatus({
                success: false,
                message: "Ошибка соединения с сервером"
            });
        } finally {
            setIsSending(false);
        }
    };

    const clearStatus = () => {
        setSendStatus(null);
    };

    return {
        isSending,
        sendStatus,
        sendToTelegram,
        clearStatus
    };
};
