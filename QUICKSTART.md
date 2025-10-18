# ⚡ Быстрый старт Encrypting App

**Время настройки**: ~10 минут | **Сложность**: Легко

---

## 🎯 Шаг 1: Установка зависимостей

```bash
pnpm install
```

Дождитесь установки всех пакетов для client, server и api.

---

## 🔑 Шаг 2: Настройка Google OAuth

### Вариант A: Быстрая настройка (5 минут)

1. **Откройте**: https://console.cloud.google.com/
2. **Создайте проект**: нажмите "New Project" → назовите `Encrypting App`
3. **OAuth Consent Screen**:
   - APIs & Services → OAuth consent screen
   - External → Create
   - Заполните App name и emails → Save and Continue (3 раза)
4. **Создайте Credentials**:
   - APIs & Services → Credentials → Create Credentials → OAuth client ID
   - Web application → Name: `Encrypting App Web Client`
   - Authorized redirect URIs: `http://localhost:3001/api/auth/google/callback`
   - Create
5. **Скопируйте**: Client ID и Client Secret

### Вариант B: Подробная инструкция

📖 Полное руководство с картинками: [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

---

## 📝 Шаг 3: Создайте .env файл

Выполните в терминале:

```bash
cat > server/.env << 'EOF'
# Server Configuration
PORT=3001
NODE_ENV=development

# Secrets (уже сгенерированы для вас)
SESSION_SECRET=8a9f2d7c3e5b1a6f4d8c2b9e7f3a5c1d8e4b6a2f9c7d3e5a1b8f4c6d2e9a7b3f
JWT_SECRET=7b6e4c8a2f9d1e5c3b7a9f2d4e6c8a1b5f3d7e9c2a6b8f4d1e7c3a9b5e2f6d

# Google OAuth - ВСТАВЬТЕ ВАШИ ЗНАЧЕНИЯ!
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here

# URLs
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:3001
EOF
```

**Затем откройте `server/.env` и замените**:
- `your-client-id-here.apps.googleusercontent.com` → ваш Client ID
- `your-client-secret-here` → ваш Client Secret

✅ Убедитесь, что нет лишних пробелов!

---

## 🚀 Шаг 4: Запуск приложения

```bash
pnpm dev
```

**Ожидаемый вывод:**
```
[0] 🚀 Server is running on http://localhost:3001
[0] 🔐 Google OAuth: http://localhost:3001/api/auth/google
[1] ➜  Local:   http://localhost:3000/
```

✅ Если видите эти сообщения - всё работает!

---

## ✅ Шаг 5: Тестирование

### 5.1 Откройте приложение
Перейдите: http://localhost:3000

### 5.2 Войдите
1. Нажмите кнопку **"Войти через Google"**
2. Выберите ваш аккаунт
3. Разрешите доступ к email и профилю
4. Вас перенаправит обратно в приложение

### 5.3 Протестируйте функции
1. ✅ Зашифруйте текст (получите encrypted текст и ключ)
2. ✅ Переключитесь на "Расшифровать"
3. ✅ Вставьте encrypted текст и ключ
4. ✅ Получите исходный текст обратно!

**Видите своё имя и аватар справа вверху?** 🎉 Отлично, всё работает!

## 🌐 Деплой на Vercel

### Подготовка

1. Добавьте redirect URI в Google Cloud Console:
```
https://your-app.vercel.app/api/auth/google/callback
```

### Деплой

```bash
vercel

# Добавьте environment variables:
vercel env add SESSION_SECRET
vercel env add JWT_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add CLIENT_URL
vercel env add SERVER_URL

# Production deploy
vercel --prod
```

---

## 🐛 Проблемы при запуске?

### 🔴 "OAuth2Strategy requires a clientID option"
**Причина**: Файл `server/.env` не создан или GOOGLE_CLIENT_ID пустой  
**Решение**: Проверьте, что файл `server/.env` существует и credentials заполнены

### 🔴 "redirect_uri_mismatch" 
**Причина**: Неверный redirect URI в Google Console  
**Решение**: Добавьте ТОЧНЫЙ URI: `http://localhost:3001/api/auth/google/callback`

### 🔴 "This app isn't verified"
**Причина**: Вы не добавлены в Test Users  
**Решение**: Google Console → OAuth consent screen → Test users → добавьте ваш email

### 🔴 "Unauthorized. Please log in."
**Причина**: Cookies не сохраняются  
**Решение**: 
1. Используйте `http://localhost:3000` (не `127.0.0.1`)
2. Проверьте, что SESSION_SECRET установлен
3. Перезапустите приложение

---

## 📚 Дополнительная документация

- 📖 [README.md](./README.md) - Полная документация проекта
- 🔐 [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) - Детальная настройка OAuth (с чеклистом)
- 🌐 Деплой на Vercel - см. секцию в README.md

---

## 🎉 Готово!

Теперь ваше приложение:
- ✅ Полностью защищено Google OAuth авторизацией
- ✅ Шифрует данные с помощью AES-256-CBC
- ✅ Использует React 19 с Activity API
- ✅ Готово к деплою на Vercel

### Что дальше?

1. **Протестируйте** все функции
2. **Настройте Vercel** для продакшена (см. README.md)
3. **Добавьте свои фичи** - архитектура готова к расширению!

### Полезные ссылки

- Google Cloud Console: https://console.cloud.google.com/
- Vercel Dashboard: https://vercel.com/
- React Activity API: https://react.dev/

---

**Happy Coding!** 🚀🔐

💡 **Подсказка**: Если что-то непонятно - откройте [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) для детальных инструкций!

