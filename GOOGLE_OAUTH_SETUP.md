# 🔐 Настройка Google OAuth для Encrypting App

Полное пошаговое руководство по настройке Google OAuth авторизации (занимает ~10 минут).

---

## 📋 Шаг 1: Создание проекта в Google Cloud Console

### 1.1 Откройте консоль
👉 Перейдите: https://console.cloud.google.com/

### 1.2 Создайте новый проект
1. Нажмите на выпадающий список проектов в верхней панели
2. Нажмите **"New Project"** (Новый проект)
3. Заполните:
   - **Project name**: `Encrypting App`
   - **Organization**: оставьте по умолчанию
4. Нажмите **"Create"** (Создать)
5. Дождитесь создания (несколько секунд)
6. **Выберите созданный проект** в выпадающем списке

✅ Убедитесь, что нужный проект выбран в верхней панели!

---

## 🔑 Шаг 2: Настройка OAuth Consent Screen

⚠️ **Важно**: Сначала нужно настроить Consent Screen, иначе не сможете создать credentials!

### 2.1 Откройте настройки
1. В левом меню: **APIs & Services** → **OAuth consent screen**
2. Если не видите меню, нажмите на иконку ☰ (гамбургер) слева вверху

### 2.2 Выберите тип приложения
- Выберите: **External** (Внешнее)
- Нажмите **"Create"** (Создать)

### 2.3 OAuth Consent Screen (страница 1)
Заполните обязательные поля:
- **App name**: `Encrypting App`
- **User support email**: выберите ваш email из списка
- **App logo**: можно пропустить
- **Application home page**: можно пропустить
- **Developer contact information**: введите ваш email

Нажмите **"Save and Continue"** (Сохранить и продолжить)

### 2.4 Scopes (страница 2)
1. Нажмите **"Add or Remove Scopes"** (Добавить или удалить области)
2. В появившемся окне найдите и отметьте галочками:
   - ✅ `.../auth/userinfo.email` (Email address)
   - ✅ `.../auth/userinfo.profile` (Basic profile info)
3. Нажмите **"Update"** (Обновить)
4. Нажмите **"Save and Continue"** (Сохранить и продолжить)

### 2.5 Test Users (страница 3)
1. Нажмите **"+ Add Users"** (Добавить пользователей)
2. Введите ваш Gmail адрес для тестирования
3. Нажмите **"Add"** (Добавить)
4. Нажмите **"Save and Continue"** (Сохранить и продолжить)

### 2.6 Summary (страница 4)
- Просмотрите настройки
- Нажмите **"Back to Dashboard"** (Вернуться к панели)

✅ OAuth Consent Screen настроен!

---

## 🎫 Шаг 3: Создание OAuth 2.0 Client ID

### 3.1 Откройте Credentials
1. В левом меню: **APIs & Services** → **Credentials**
2. В верхней панели нажмите **"+ Create Credentials"**
3. Выберите **"OAuth client ID"**

### 3.2 Выберите тип приложения
- **Application type**: выберите **Web application** (Веб-приложение)
- **Name**: введите `Encrypting App Web Client`

### 3.3 Добавьте Authorized redirect URIs

⚠️ **Критически важно**: Google будет перенаправлять пользователей только на эти URL!

#### Для локальной разработки:
В разделе **"Authorized redirect URIs"**:
1. Нажмите **"+ Add URI"**
2. Введите: `http://localhost:3001/api/auth/google/callback`

#### Для продакшена (опционально, можно добавить позже):
3. Нажмите **"+ Add URI"** еще раз
4. Введите: `https://your-app.vercel.app/api/auth/google/callback`
   - ⚠️ Замените `your-app.vercel.app` на ваш реальный Vercel домен!

### 3.4 Создайте credentials
Нажмите **"Create"** (Создать)

---

## 📝 Шаг 4: Скопируйте Credentials

### 4.1 Сохраните данные
После создания появится модальное окно с вашими credentials:

```
Your Client ID
123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com

Your Client Secret  
GOCSPX-abc123def456ghi789jkl012
```

### 4.2 Скопируйте оба значения
📋 **Скопируйте их сейчас!** Вам нужны:
1. **Client ID** - длинная строка, заканчивается на `.apps.googleusercontent.com`
2. **Client Secret** - строка типа `GOCSPX-...` (~35 символов)

💡 **Подсказка**: Вы всегда можете посмотреть их позже на странице Credentials

⚠️ **Безопасность**: Никогда не публикуйте Client Secret в Git или публичных местах!

---

## ⚙️ Шаг 5: Настройка локального окружения

### 5.1 Создайте файл .env

В корне проекта выполните команду:

```bash
cat > server/.env << 'EOF'
# Server Configuration
PORT=3001
NODE_ENV=development

# Session & JWT Secrets (уже сгенерированы)
SESSION_SECRET=8a9f2d7c3e5b1a6f4d8c2b9e7f3a5c1d8e4b6a2f9c7d3e5a1b8f4c6d2e9a7b3f
JWT_SECRET=7b6e4c8a2f9d1e5c3b7a9f2d4e6c8a1b5f3d7e9c2a6b8f4d1e7c3a9b5e2f6d

# Google OAuth - ЗАМЕНИТЕ на ваши значения!
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here

# URLs для локальной разработки
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:3001
EOF
```

### 5.2 Вставьте ваши Google credentials

Откройте файл `server/.env` в редакторе и замените:

```bash
# БЫЛО:
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here

# СТАНЕТ (вставьте ВАШИ значения из Шага 4):
GOOGLE_CLIENT_ID=123456789-abcdefghij...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456...
```

### 5.3 Проверьте файл

Убедитесь что:
- ✅ Файл `server/.env` создан
- ✅ GOOGLE_CLIENT_ID заменен на ваш реальный Client ID
- ✅ GOOGLE_CLIENT_SECRET заменен на ваш реальный Client Secret
- ✅ Нет лишних пробелов в начале/конце значений

💡 **Подсказка**: Если хотите сгенерировать свои секреты:
```bash
openssl rand -base64 32
```

## ☁️ Шаг 7: Настройка на Vercel

### Через Vercel Dashboard:

1. Откройте ваш проект на [vercel.com](https://vercel.com)
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте следующие переменные:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `SESSION_SECRET` | ваш-секретный-ключ | Production, Preview, Development |
| `JWT_SECRET` | ваш-jwt-секрет | Production, Preview, Development |
| `GOOGLE_CLIENT_ID` | ваш-client-id | Production, Preview, Development |
| `GOOGLE_CLIENT_SECRET` | ваш-client-secret | Production, Preview, Development |
| `CLIENT_URL` | https://your-app.vercel.app | Production |
| `SERVER_URL` | https://your-app.vercel.app | Production |

### Через Vercel CLI:

```bash
vercel env add SESSION_SECRET
# Введите значение

vercel env add JWT_SECRET
# Введите значение

vercel env add GOOGLE_CLIENT_ID
# Введите значение

vercel env add GOOGLE_CLIENT_SECRET
# Введите значение

vercel env add CLIENT_URL
# https://your-app.vercel.app

vercel env add SERVER_URL
# https://your-app.vercel.app
```

---

## 🚀 Шаг 6: Запуск и тестирование

### 6.1 Установите зависимости (если еще не установлены)

```bash
pnpm install
```

### 6.2 Запустите приложение

```bash
pnpm dev
```

Вы должны увидеть:
```
[0] 🚀 Server is running on http://localhost:3001
[0] 🔐 Google OAuth: http://localhost:3001/api/auth/google
[1] ➜  Local:   http://localhost:3000/
```

✅ Если видите эти сообщения - всё настроено правильно!

### 6.3 Протестируйте авторизацию

1. Откройте браузер: http://localhost:3000
2. Вы увидите красивый экран входа с кнопкой "Войти через Google"
3. Нажмите на кнопку
4. Выберите ваш Google аккаунт (тот, который добавили в Test Users)
5. Разрешите доступ к email и профилю
6. Вы будете перенаправлены обратно в приложение
7. Теперь можете шифровать/расшифровывать сообщения! 🎉

### 6.4 Проверьте что работает

После успешного входа:
- ✅ Видите ваше имя и фото в правом верхнем углу
- ✅ Можете переключаться между "Зашифровать" и "Расшифровать"
- ✅ Кнопка "Выйти" работает
- ✅ После выхода снова показывается экран входа

---

## 🌐 Шаг 7: Деплой на Vercel (опционально)

Когда будете готовы задеплоить:

### 7.1 Добавьте Vercel redirect URI в Google Console

1. Вернитесь в [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Нажмите на ваш OAuth 2.0 Client ID
4. В разделе "Authorized redirect URIs" добавьте:
   ```
   https://your-app.vercel.app/api/auth/google/callback
   ```
   (замените на ваш реальный Vercel домен)
5. Нажмите **"Save"**

### 7.2 Деплой

```bash
vercel

# Добавьте environment variables:
vercel env add SESSION_SECRET
vercel env add JWT_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add CLIENT_URL
vercel env add SERVER_URL

# Production deploy:
vercel --prod
```

### 7.3 Проверка на Vercel

Откройте `https://your-app.vercel.app` и проверьте авторизацию.

---

## ❗ Устранение проблем

### 🔴 "OAuth2Strategy requires a clientID option"

**Причина**: Файл `server/.env` не создан или пуст

**Решение**:
1. Убедитесь, что файл `server/.env` существует
2. Проверьте, что GOOGLE_CLIENT_ID и GOOGLE_CLIENT_SECRET заполнены
3. Перезапустите приложение: `pnpm dev`

### 🔴 "redirect_uri_mismatch"

**Причина**: Неверный redirect URI в Google Console

**Решение**: 
1. Откройте Google Cloud Console → Credentials
2. Проверьте, что добавлен ТОЧНЫЙ URL:
   - Локально: `http://localhost:3001/api/auth/google/callback`
   - Vercel: `https://your-app.vercel.app/api/auth/google/callback`
3. Обратите внимание на:
   - ✅ Правильный протокол (http vs https)
   - ✅ Правильный порт (3001 для локальной разработки)
   - ✅ Точный путь (`/api/auth/google/callback`)

### 🔴 "access_denied" или "This app isn't verified"

**Причина**: Вы не добавлены в Test Users

**Решение**:
1. Google Cloud Console → OAuth consent screen
2. Scroll down to "Test users"
3. Добавьте ваш Gmail адрес
4. Попробуйте авторизоваться снова

### 🔴 "invalid_client"

**Причина**: Неверные Client ID или Client Secret

**Решение**:
1. Проверьте `server/.env`:
   - Нет лишних пробелов в начале/конце
   - Значения скопированы полностью
2. Пересоздайте credentials в Google Console если нужно
3. Перезапустите приложение

### 🔴 Авторизация не работает на Vercel

**Решение**:
1. Проверьте логи: `vercel logs`
2. Убедитесь, что все environment variables установлены на Vercel
3. Проверьте, что redirect URI на Vercel добавлен в Google Console
4. Убедитесь, что используется HTTPS (не HTTP)

### 🔴 "Unauthorized. Please log in."

**Причина**: Session не сохраняется или истекла

**Решение**:
1. Проверьте cookies в браузере (F12 → Application → Cookies)
2. Попробуйте перелогиниться
3. Проверьте, что SESSION_SECRET установлен
4. На Vercel: убедитесь, что cookies с `sameSite: none` и `secure: true`

### 🔴 Session не сохраняется

**Решение**:
1. Локально: убедитесь, что используете `http://localhost` (не `127.0.0.1`)
2. Vercel: должен использоваться HTTPS
3. Проверьте CORS настройки - должно быть `credentials: true`
4. Проверьте что CLIENT_URL и SERVER_URL настроены правильно

## 📱 Для добавления нескольких доменов

Если вы хотите использовать несколько доменов (staging, production):

1. В Google Cloud Console добавьте все redirect URIs:
```
http://localhost:3001/api/auth/google/callback
https://staging.vercel.app/api/auth/google/callback
https://production.vercel.app/api/auth/google/callback
```

2. На Vercel настройте разные environment variables для разных окружений

## 🔒 Безопасность

✅ **Рекомендации:**
- Используйте сильные случайные строки для `SESSION_SECRET` и `JWT_SECRET`
- Никогда не коммитьте `.env` файлы в Git
- Регулярно обновляйте зависимости
- Используйте HTTPS в продакшене
- Ограничьте список авторизованных redirect URIs

❌ **Не делайте:**
- Не используйте простые пароли типа "secret" или "password"
- Не публикуйте credentials в публичных репозиториях
- Не используйте одинаковые секреты для разработки и продакшена

## 📚 Дополнительная информация

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Documentation](http://www.passportjs.org/)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

---

## 💡 Полезные советы

### Где найти свои credentials позже?

1. [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Нажмите на название вашего OAuth 2.0 Client ID
4. Client ID виден сразу, Client Secret можно посмотреть нажав на иконку глаза

### Как добавить больше Test Users?

1. **APIs & Services** → **OAuth consent screen**
2. Scroll down до "Test users"
3. Нажмите "Add Users"
4. Добавьте Gmail адреса

### Тестирование с внешним URL (ngrok)

Если нужно протестировать с внешнего URL:

```bash
# Установите ngrok
brew install ngrok  # macOS
# или скачайте с https://ngrok.com

# Запустите туннель
ngrok http 3001

# Скопируйте HTTPS URL (например: https://abc123.ngrok.io)
# Добавьте в Google Console:
# https://abc123.ngrok.io/api/auth/google/callback
```

### Публикация приложения (после тестирования)

Когда приложение готово для публичного использования:

1. **OAuth consent screen** → **Publishing status**
2. Нажмите **"Publish App"**
3. Пройдите верификацию Google (может занять несколько дней)
4. После верификации любой пользователь сможет войти

### Backup credentials

💾 **Рекомендуется**: Сохраните копию credentials в безопасном месте:
- Password manager (1Password, LastPass, Bitwarden)
- Encrypted notes
- Не храните в Git!

---

## ✅ Чеклист настройки

Используйте этот чеклист для проверки:

- [ ] Проект создан в Google Cloud Console
- [ ] OAuth Consent Screen настроен (External)
- [ ] Scopes добавлены (email, profile)
- [ ] Test Users добавлены
- [ ] OAuth Client ID создан (Web application)
- [ ] Redirect URI добавлен: `http://localhost:3001/api/auth/google/callback`
- [ ] Client ID скопирован
- [ ] Client Secret скопирован
- [ ] Файл `server/.env` создан
- [ ] GOOGLE_CLIENT_ID вставлен в `.env`
- [ ] GOOGLE_CLIENT_SECRET вставлен в `.env`
- [ ] Зависимости установлены (`pnpm install`)
- [ ] Приложение запущено (`pnpm dev`)
- [ ] Авторизация работает на http://localhost:3000
- [ ] Можно зашифровать/расшифровать сообщение

---

## 📚 Дополнительные ресурсы

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

---

🎉 **Поздравляем!** Ваше приложение теперь защищено Google OAuth авторизацией!

💬 Если возникли проблемы - проверьте раздел "Устранение проблем" выше.

