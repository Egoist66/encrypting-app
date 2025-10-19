# 🚨 Исправление локальной авторизации Google OAuth

## ❌ Проблема
```
Ошибка 400: redirect_uri_mismatch
```

**Причина:** В Google Cloud Console не настроен redirect URI для локальной разработки.

## ✅ РЕШЕНИЕ

### 1. Создайте файл `.env` для локальной разработки

Создайте файл `.env` в корне проекта:

```bash
# Локальные переменные окружения для разработки
GOOGLE_CLIENT_ID=ваш-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=ваш-google-client-secret
JWT_SECRET=super-secret-jwt-key-for-local-development-min-32-characters
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:3001
```

### 2. Получите Google OAuth credentials

1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Выберите ваш проект
3. **APIs & Services** → **Credentials**
4. Найдите ваш OAuth 2.0 Client ID или создайте новый

### 3. Настройте Authorized redirect URIs

В Google Cloud Console добавьте **ОБА** URL:

```
http://localhost:3001/api/auth/google/callback
https://your-app.vercel.app/api/auth/google/callback
```

### 4. Настройте Authorized JavaScript origins

Добавьте **ОБА** URL:

```
http://localhost:3000
https://your-app.vercel.app
```

### 5. Запустите локальную разработку

```bash
# Установите зависимости (если еще не установлены)
npm install

# Запустите локальную разработку
npm run dev
```

### 6. Проверьте результат

1. Откройте http://localhost:3000
2. Попробуйте авторизацию через Google
3. Должен работать без ошибок

## 🔍 Проверка настроек

### Локальный сервер:
- URL: http://localhost:3001
- OAuth callback: http://localhost:3001/api/auth/google/callback

### Vercel (production):
- URL: https://your-app.vercel.app
- OAuth callback: https://your-app.vercel.app/api/auth/google/callback

## ⚠️ Важно

- **НЕ** добавляйте `.env` в git (он уже в .gitignore)
- Используйте **разные** OAuth credentials для локальной разработки и продакшена
- Или используйте **одни и те же** credentials, но с **разными** redirect URIs

## 🆘 Если проблема остается

1. Убедитесь, что файл `.env` создан в корне проекта
2. Проверьте, что все переменные заполнены правильно
3. Убедитесь, что redirect URIs в Google Cloud Console точно совпадают
4. Перезапустите сервер после изменения `.env`

## 📋 Чек-лист

- [ ] Создан файл `.env` с переменными окружения
- [ ] В Google Cloud Console добавлен `http://localhost:3001/api/auth/google/callback`
- [ ] В Google Cloud Console добавлен `http://localhost:3000` в JavaScript origins
- [ ] Сервер перезапущен после изменений
- [ ] Локальная авторизация работает

