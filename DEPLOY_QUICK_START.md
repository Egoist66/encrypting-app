# 🚀 Быстрый старт деплоя на Vercel

## ✅ Проверка перед деплоем

```bash
# 1. Проверьте сборку локально
npm run build:client && npm run build:api

# 2. Убедитесь, что API функция скомпилирована
ls -la api/index.js
```

## 🔧 Настройка Google OAuth для Vercel

1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Перейдите в "APIs & Services" → "Credentials"
3. Выберите ваш OAuth 2.0 Client ID
4. Добавьте в "Authorized redirect URIs":
   ```
   https://ваш-домен.vercel.app/api/auth/google/callback
   ```
   (замените `ваш-домен` на реальный домен после первого деплоя)

## 📦 Деплой

### Первый раз

```bash
# 1. Установите Vercel CLI (если еще не установлен)
npm i -g vercel

# 2. Войдите в Vercel
vercel login

# 3. Деплой
vercel
```

### После первого деплоя

```bash
# Продакшн деплой
vercel --prod
```

## 🔐 Настройка переменных окружения

### Через CLI

```bash
# Session secret (сгенерируйте случайную строку)
vercel env add SESSION_SECRET
# Введите: (результат команды openssl rand -base64 32)

# Google OAuth
vercel env add GOOGLE_CLIENT_ID
# Введите: your-client-id.apps.googleusercontent.com

vercel env add GOOGLE_CLIENT_SECRET
# Введите: your-client-secret

# URLs (после получения домена от Vercel)
vercel env add CLIENT_URL
# Введите: https://ваш-домен.vercel.app

vercel env add SERVER_URL
# Введите: https://ваш-домен.vercel.app

# Environment
vercel env add NODE_ENV
# Введите: production
```

### Через Dashboard (рекомендуется)

1. Откройте ваш проект на [vercel.com](https://vercel.com)
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте следующие переменные для **Production**, **Preview** и **Development**:

| Variable | Value | Example |
|----------|-------|---------|
| `SESSION_SECRET` | Случайная строка | `abc123...xyz` (используйте `openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | Google Client ID | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google Client Secret | `GOCSPX-...` |
| `CLIENT_URL` | URL клиента | `https://ваш-домен.vercel.app` |
| `SERVER_URL` | URL сервера | `https://ваш-домен.vercel.app` |
| `NODE_ENV` | Environment | `production` |

4. Нажмите **Save**

## 🔄 Редеплой после настройки переменных

После добавления переменных окружения:

```bash
vercel --prod
```

## ✅ Проверка работы

После деплоя проверьте:

### 1. Клиент загружается
```
https://ваш-домен.vercel.app/
```

### 2. API работает
```
https://ваш-домен.vercel.app/api/health
```
Должно вернуть:
```json
{
  "success": true,
  "message": "✅ API работает!"
}
```

### 3. Auth работает
```
https://ваш-домен.vercel.app/api/auth/status
```
Должно вернуть:
```json
{
  "success": true,
  "data": {
    "authenticated": false
  }
}
```

### 4. Google OAuth работает
1. Откройте приложение
2. Нажмите "Войти через Google"
3. Выберите аккаунт Google
4. Должен произойти редирект обратно в приложение
5. Вы должны быть авторизованы

## 🐛 Если что-то не работает

### Просмотр логов
```bash
vercel logs
```

### Типичные проблемы

#### ❌ "redirect_uri_mismatch"
**Решение:** Добавьте правильный redirect URI в Google Console:
```
https://ваш-домен.vercel.app/api/auth/google/callback
```

#### ❌ "API не отвечает"
**Решение:** 
1. Проверьте логи: `vercel logs`
2. Убедитесь, что `api/index.js` создан
3. Проверьте переменные окружения

#### ❌ "Session не сохраняется"
**Решение:**
1. Убедитесь, что `SESSION_SECRET` установлен
2. Проверьте, что используется HTTPS (автоматически на Vercel)
3. Проверьте настройки cookies в браузере

## 📝 Генерация секретных ключей

```bash
# Session secret
openssl rand -base64 32

# Или используйте онлайн генератор:
# https://generate-secret.now.sh/32
```

## 🔄 Автоматический деплой

### Настройка GitHub

1. Подключите репозиторий к Vercel через Dashboard
2. Каждый push в `main` будет автоматически деплоиться
3. Pull requests получат preview деплой

### Команды Git

```bash
# Добавить изменения
git add .

# Коммит
git commit -m "Ready for production"

# Push (автоматически задеплоится)
git push origin main
```

## 📚 Полная документация

- **[CHANGELOG_VERCEL_FIX.md](./CHANGELOG_VERCEL_FIX.md)** - Что было исправлено
- **[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)** - Подробная инструкция
- **[GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)** - Настройка OAuth

---

## 🎉 Готово!

После выполнения всех шагов ваше приложение будет доступно по адресу:
```
https://ваш-домен.vercel.app
```

**Не забудьте:**
- ✅ Настроить Google OAuth redirect URI
- ✅ Добавить все переменные окружения
- ✅ Проверить работу авторизации
- ✅ Протестировать шифрование

**Happy Deploying! 🚀**

