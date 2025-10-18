# 🚨 СРОЧНОЕ ИСПРАВЛЕНИЕ: Ошибка 500 на Vercel

## ❌ Проблема
```
TypeError: OAuth2Strategy requires a clientID option
```

**Причина:** Переменная `GOOGLE_CLIENT_ID` не установлена в Vercel.

## ✅ РЕШЕНИЕ (5 минут)

### 1. Откройте Vercel Dashboard
- Перейдите на https://vercel.com
- Выберите ваш проект
- **Settings** → **Environment Variables**

### 2. Добавьте переменные
Добавьте **все эти переменные** для **Production, Preview, Development**:

```
GOOGLE_CLIENT_ID=ваш-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=ваш-google-client-secret
JWT_SECRET=super-secret-key-min-32-characters-long-123456789
CLIENT_URL=https://your-app.vercel.app
SERVER_URL=https://your-app.vercel.app
```

### 3. Получите Google OAuth данные
1. [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. **Create Credentials** → **OAuth 2.0 Client IDs**
4. **Authorized redirect URIs**: `https://your-app.vercel.app/api/auth/google/callback`
5. **Authorized JavaScript origins**: `https://your-app.vercel.app`

### 4. Пересоберите проект
```bash
git add .
git commit -m "Fix environment variables"
git push
```

### 5. Проверьте
Откройте: `https://your-app.vercel.app/api/health`

Должно показать `hasGoogleClientId: true`

---

**Если не помогло:** Проверьте логи в Vercel Dashboard → Functions → View Function Logs
