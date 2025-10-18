# 🚨 СРОЧНО: Настройка переменных окружения в Vercel

## Проблема
Ошибка в логах: `TypeError: OAuth2Strategy requires a clientID option`

Это означает, что переменная `GOOGLE_CLIENT_ID` не установлена в Vercel.

## ✅ Решение

### 1. Перейдите в настройки Vercel

1. Откройте https://vercel.com
2. Выберите ваш проект
3. Перейдите в **Settings** → **Environment Variables**

### 2. Добавьте переменные окружения

Добавьте следующие переменные **для всех окружений** (Production, Preview, Development):

| Переменная | Описание | Пример значения |
|------------|----------|-----------------|
| `GOOGLE_CLIENT_ID` | Client ID из Google Cloud Console | `123456789-abcdefg.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Client Secret из Google Cloud Console | `GOCSPX-abcdefghijklmnop` |
| `JWT_SECRET` | Секретный ключ для JWT | `super-secret-key-min-32-characters-long` |
| `CLIENT_URL` | URL вашего фронтенда | `https://your-app.vercel.app` |
| `SERVER_URL` | URL вашего API | `https://your-app.vercel.app` |

### 3. Получите Google OAuth credentials

1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API
4. Перейдите в **APIs & Services** → **Credentials**
5. Нажмите **Create Credentials** → **OAuth 2.0 Client IDs**
6. Выберите **Web application**
7. Добавьте **Authorized redirect URIs**:
   ```
   https://your-app.vercel.app/api/auth/google/callback
   ```
8. Добавьте **Authorized JavaScript origins**:
   ```
   https://your-app.vercel.app
   ```
9. Скопируйте **Client ID** и **Client Secret**

### 4. Пересоберите проект

После добавления всех переменных:

```bash
git add .
git commit -m "Add environment variables"
git push
```

Или сделайте принудительный редеплой:
```bash
vercel --prod
```

### 5. Проверьте результат

1. Откройте `https://your-app.vercel.app/api/health`
2. Должно показать `hasGoogleClientId: true`
3. Попробуйте авторизацию через Google

## 🔍 Проверка переменных

После деплоя проверьте health endpoint:
```
https://your-app.vercel.app/api/health
```

Ответ должен содержать:
```json
{
  "success": true,
  "data": {
    "env": {
      "hasGoogleClientId": true,
      "hasGoogleClientSecret": true,
      "hasJwtSecret": true
    }
  }
}
```

## ⚠️ Важно

- Все переменные должны быть установлены **для всех окружений**
- `JWT_SECRET` должен быть длиннее 32 символов
- `CLIENT_URL` и `SERVER_URL` обычно одинаковые для Vercel
- Callback URL в Google Cloud Console должен точно совпадать с настройками

## 🆘 Если проблема остается

1. Убедитесь, что переменные действительно установлены в Vercel
2. Проверьте, что они установлены для всех окружений (Production, Preview, Development)
3. Убедитесь, что нет лишних пробелов в значениях переменных
4. Проверьте логи в Vercel Dashboard → Functions → View Function Logs
