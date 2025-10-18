# Переменные окружения для Vercel

После деплоя на Vercel необходимо настроить следующие переменные окружения:

## Обязательные переменные

### Google OAuth
- `GOOGLE_CLIENT_ID` - Client ID из Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - Client Secret из Google Cloud Console

### JWT
- `JWT_SECRET` - Секретный ключ для подписи JWT токенов (сгенерируйте длинную случайную строку)

### URLs
- `CLIENT_URL` - URL вашего фронтенда (например: `https://your-app.vercel.app`)
- `SERVER_URL` - URL вашего API (например: `https://your-app.vercel.app`)

## Как добавить переменные в Vercel

### Через веб-интерфейс:
1. Откройте проект на https://vercel.com
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте каждую переменную:
   - Name: имя переменной
   - Value: значение
   - Environment: выберите **Production**, **Preview**, **Development**
4. Нажмите **Save**

### Через CLI:
```bash
vercel env add JWT_SECRET
# Введите значение когда попросит
# Выберите окружения (Production, Preview, Development)

vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add CLIENT_URL
vercel env add SERVER_URL
```

## Пример значений для продакшена

```bash
GOOGLE_CLIENT_ID=ваш-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=ваш-google-client-secret
JWT_SECRET=super-secret-jwt-key-min-32-characters-1234567890
CLIENT_URL=https://your-app.vercel.app
SERVER_URL=https://your-app.vercel.app
```

## ⚠️ Важно!

1. **JWT_SECRET** должен быть длинной случайной строкой (минимум 32 символа)
2. **CLIENT_URL** и **SERVER_URL** обычно одинаковые для Vercel (один домен для фронтенда и API)
3. В Google Cloud Console обновите **Authorized redirect URIs**:
   - `https://your-app.vercel.app/api/auth/google/callback`
4. В Google Cloud Console обновите **Authorized JavaScript origins**:
   - `https://your-app.vercel.app`

## После добавления переменных

Выполните редеплой:
```bash
vercel --prod
```

Или просто сделайте коммит - Vercel автоматически пересоберет проект с новыми переменными окружения.

