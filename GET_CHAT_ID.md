# Как получить Chat ID для отправки сообщений

## Для отправки сообщения пользователю:

### 1. Получатель должен написать боту
- Найдите бота @encrypt_app_bot в Telegram
- Напишите ему любое сообщение (например, "привет")

### 2. Получите chat_id
Выполните команду в терминале:
```bash
curl -s "https://api.telegram.org/bot8331038630:AAEdGKGwXOLXenETi9Xk7chSNf57BsTmHpU/getUpdates" | jq '.result[] | {chat_id: .message.chat.id, username: .message.chat.username, first_name: .message.chat.first_name}'
```

### 3. Используйте числовой chat_id
В приложении используйте числовой ID (например, `568285771`), а не @username

## Текущие пользователи:

- **Ваш chat_id**: `566390170` (@codebuilder1)
- **Мама chat_id**: `568285771` (@NewNata)

## Важно:
- Бот не может инициировать разговор с пользователем
- Пользователь должен сначала написать боту
- Используйте числовой chat_id, а не @username
