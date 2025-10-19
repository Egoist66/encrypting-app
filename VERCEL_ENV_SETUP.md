# 🚨 СРОЧНО: Настройка переменных окружения в Vercel

## Проблема
Ошибка: `TypeError: OAuth2Strategy requires a clientID option`

Это означает, что переменные окружения `GOOGLE_CLIENT_ID` и `GOOGLE_CLIENT_SECRET` не установлены в Vercel.

## 🔧 Решение

### Шаг 1: Получите Google OAuth credentials

1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API
4. Перейдите в "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Выберите "Web application"
6. Добавьте Authorized redirect URIs:
   - `https://encrypting-app.vercel.app/api/auth/google/callback`
7. Скопируйте Client ID и Client Secret

### Шаг 2: Добавьте переменные в Vercel

#### Через веб-интерфейс:
1. Откройте проект на [vercel.com](https://vercel.com)
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте следующие переменные:

```
GOOGLE_CLIENT_ID=ваш-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=ваш-google-client-secret
JWT_SECRET=длинная-случайная-строка-минимум-32-символа-для-безопасности
CLIENT_URL=https://encrypting-app.vercel.app
SERVER_URL=https://encrypting-app.vercel.app
```

#### Через CLI:
```bash
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET  
vercel env add JWT_SECRET
vercel env add CLIENT_URL
vercel env add SERVER_URL
```

### Шаг 3: Выберите окружения
Для каждой переменной выберите:
- ✅ Production
- ✅ Preview  
- ✅ Development

### Шаг 4: Редеплой
```bash
vercel --prod
```

## 🔍 Проверка

После редеплоя проверьте:
1. Откройте `https://encrypting-app.vercel.app/api/health`
2. Должен вернуться JSON с информацией о переменных окружения
3. Попробуйте авторизацию через Google

## 📋 Пример значений

```bash
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwx
JWT_SECRET=super-secret-jwt-key-minimum-32-characters-long-1234567890
CLIENT_URL=https://encrypting-app.vercel.app
SERVER_URL=https://encrypting-app.vercel.app
```

## ⚠️ Важно!

- JWT_SECRET должен быть длинной случайной строкой (минимум 32 символа)
- Не используйте простые пароли или короткие строки
- Все переменные должны быть добавлены для всех окружений (Production, Preview, Development)