# 🔐 Encrypting App

Монолитное React + Express приложение на TypeScript с Google OAuth авторизацией и возможностью деплоя на Vercel.

## ✨ Основные возможности

- 🔒 **AES-256-CBC шифрование** - надежная защита данных
- 🔐 **Google OAuth авторизация** - безопасный вход через Google
- ⚡ **React 19 + Activity API** - современный UI с сохранением состояния
- 🚀 **Express + TypeScript** - типобезопасный backend
- 🌐 **Vercel Ready** - готово к деплою на Vercel
- 🎨 **Красивый UI** - современный дизайн с анимациями

## 📁 Структура проекта

```
encrypting-app/
├── client/              # React приложение (Vite + TypeScript)
│   ├── src/            # Исходный код клиента
│   ├── public/         # Статические файлы
│   └── dist/           # Собранное приложение (генерируется)
├── server/             # Express API (TypeScript)
│   └── src/
│       ├── types.ts   # TypeScript типы и интерфейсы
│       ├── routes/    # API роуты
│       └── services/  # Бизнес-логика
├── api/                # Vercel Serverless Functions
│   └── index.ts       # Главная serverless function
└── package.json        # Root package.json с workspaces
```

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+
- pnpm (или npm)
- Google OAuth credentials (см. [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md))

### Установка зависимостей

Проект поддерживает как **npm**, так и **pnpm**:

```bash
# С помощью npm
npm install

# С помощью pnpm (рекомендуется)
pnpm install
```

Эта команда установит зависимости для всех workspaces (root, client, server, api).

### Настройка Google OAuth

**⚠️ Важно**: Для работы приложения требуется настроить Google OAuth!

1. Следуйте подробной инструкции: [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)
2. Создайте файл `server/.env` на основе `server/.env.example`
3. Добавьте ваши Google OAuth credentials

Пример `server/.env`:
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
SESSION_SECRET=your-random-session-secret
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:3001
```

### Локальная разработка

Запустите клиент и сервер одновременно:

```bash
pnpm dev
# или
npm run dev
```

Или запустите их отдельно:

```bash
# Запуск только клиента (React)
pnpm dev:client

# Запуск только сервера (Express)
pnpm dev:server
```

**Адреса:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Сборка для продакшена

```bash
pnpm build
# или
npm run build
```

Эта команда соберет:
1. Server код (`server/dist/`)
2. Client приложение (`client/dist/`)

## 📦 Workspaces

Проект использует npm workspaces для управления монорепозиторием:

- **@encrypting-app/client** - React приложение
- **@encrypting-app/server** - Express API
- **@encrypting-app/api** - Vercel Serverless Functions

Типы определены в `server/src/types.ts` и используются как в server, так и в api. Клиент использует локальные определения типов.

## 🌐 Деплой на Vercel

### Подготовка

**⚠️ Обязательно**: Перед деплоем настройте Google OAuth для продакшена!

1. В [Google Cloud Console](https://console.cloud.google.com/) добавьте redirect URI:
```
https://your-app.vercel.app/api/auth/google/callback
```

2. Сгенерируйте секретные ключи:
```bash
openssl rand -base64 32
```

### Первый деплой

1. Установите Vercel CLI (если еще не установлен):
```bash
npm i -g vercel
```

2. Войдите в Vercel:
```bash
vercel login
```

3. Задеплойте приложение:
```bash
vercel
```

При первом деплое Vercel задаст несколько вопросов:
- Set up and deploy? → **Yes**
- Which scope? → Выберите ваш аккаунт
- Link to existing project? → **No**
- What's your project's name? → **encrypting-app** (или любое другое)
- In which directory is your code located? → **./** (нажмите Enter)

### Настройка переменных окружения на Vercel

**Обязательные переменные** (через Dashboard или CLI):

```bash
# Session и JWT секреты
vercel env add SESSION_SECRET
vercel env add JWT_SECRET

# Google OAuth
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET

# URLs
vercel env add CLIENT_URL
# https://your-app.vercel.app

vercel env add SERVER_URL
# https://your-app.vercel.app
```

Или через Vercel Dashboard:
1. Откройте проект на vercel.com
2. Settings → Environment Variables
3. Добавьте все переменные для Production, Preview и Development

### Продакшн деплой

```bash
vercel --prod
```

### Автоматический деплой

После привязки к GitHub репозиторию, Vercel будет автоматически деплоить:
- **main/master ветка** → продакшн
- **другие ветки** → preview деплой

### Проверка деплоя

1. Откройте `https://your-app.vercel.app`
2. Должен появиться экран входа
3. Нажмите "Войти через Google"
4. После авторизации вы попадете в приложение

**Если что-то не работает:**
```bash
vercel logs
```

## 🔧 Доступные скрипты

### Root (монорепозиторий)

- `npm run dev` - Запуск клиента и сервера одновременно
- `npm run build` - Сборка всего проекта
- `npm run clean` - Удаление всех node_modules и dist

### Client

```bash
cd client
npm run dev      # Запуск dev сервера
npm run build    # Сборка для продакшена
npm run preview  # Просмотр собранного приложения
```

### Server

```bash
cd server
npm run dev      # Запуск с hot reload (tsx watch)
npm run build    # Компиляция TypeScript
npm run start    # Запуск скомпилированного кода
```

## 🛠️ Технологии

### Frontend
- **React 19** - UI библиотека с Activity API
- **TypeScript** - Типизация
- **Vite** - Сборщик и dev сервер
- **CSS3** - Стилизация
- **Context API** - Управление состоянием авторизации

### Backend
- **Express** - Web фреймворк
- **TypeScript** - Типизация
- **Passport.js** - Аутентификация
- **Google OAuth 2.0** - Авторизация через Google
- **express-session** - Управление сессиями
- **Node.js Crypto** - Шифрование (AES-256-CBC)
- **CORS** - Cross-origin запросы

### DevOps
- **Vercel** - Хостинг и деплой
- **pnpm workspaces** - Монорепозиторий
- **tsx** - TypeScript execution для разработки

## 📝 API Endpoints

### Authentication

#### Инициация Google OAuth
```
GET /api/auth/google
```
Перенаправляет на страницу авторизации Google.

#### OAuth Callback
```
GET /api/auth/google/callback
```
Обрабатывает ответ от Google после авторизации.

#### Получить текущего пользователя
```
GET /api/auth/user
```
Возвращает информацию о текущем пользователе (требует авторизации).

#### Выход
```
POST /api/auth/logout
```
Завершает сессию пользователя.

### Protected Endpoints (требуют авторизации)

#### Health Check
```
GET /api/health
```
Проверка работоспособности API.

#### Шифрование
```
POST /api/encrypt
Content-Type: application/json
Authorization: Required (Cookie-based session)

{
  "text": "your text to encrypt"
}

Response:
{
  "success": true,
  "data": {
    "encrypted": "...",
    "key": "..."
  }
}
```

#### Расшифрование
```
POST /api/decrypt
Content-Type: application/json
Authorization: Required (Cookie-based session)

{
  "encrypted": "...",
  "key": "..."
}

Response:
{
  "success": true,
  "data": {
    "decrypted": "original text"
  }
}
```

**⚠️ Важно**: Все endpoints шифрования/расшифрования защищены авторизацией. Без входа через Google доступ будет запрещен.

## 🔐 Безопасность

### Авторизация
- **Google OAuth 2.0** - безопасная аутентификация через Google
- **Session-based auth** - сессии с secure cookies
- **Protected routes** - все API endpoints защищены авторизацией
- **Middleware** - проверка аутентификации на каждом запросе

### Шифрование данных
Приложение использует **AES-256-CBC** для шифрования:
- Алгоритм: AES-256-CBC
- Ключ: 256-bit (32 байта)
- IV: Random 16 байт
- Формат: `IV:EncryptedData` (hex)

### Рекомендации
✅ Используйте сильные SESSION_SECRET и JWT_SECRET  
✅ Никогда не коммитьте .env файлы  
✅ Используйте HTTPS в продакшене  
✅ Регулярно обновляйте зависимости

## 🤝 Добавление новых функций

### Добавление нового API endpoint

1. Добавьте типы в `server/src/types.ts`:
```typescript
export interface MyRequest {
  // ...
}

export interface MyResponse {
  // ...
}
```

2. Создайте handler в `server/src/routes/index.ts`:
```typescript
router.post('/my-endpoint', (req, res) => {
  // ...
});
```

3. Добавьте endpoint в `api/index.ts` для Vercel

4. Используйте в клиенте:
```typescript
const response = await fetch('/api/my-endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

### Добавление новой страницы

1. Создайте компонент в `client/src/`
2. Обновите `client/src/App.tsx`
3. При необходимости добавьте типы локально в компонент или создайте `client/src/types.ts`

## 📚 Полезные команды

```bash
# Установка новой зависимости для клиента
pnpm add package-name --filter client

# Установка новой зависимости для сервера
pnpm add package-name --filter server

# Установка dev зависимости для всего проекта
pnpm add -D package-name -w

# Проверка типов во всех workspaces
pnpm type-check

# Очистка всех node_modules и собранных файлов
pnpm clean
```

## 🐛 Отладка

### Проблемы с авторизацией

#### "redirect_uri_mismatch"
**Решение**: Проверьте, что в Google Cloud Console добавлен правильный redirect URI
- Локально: `http://localhost:3001/api/auth/google/callback`
- Vercel: `https://your-app.vercel.app/api/auth/google/callback`

#### "Unauthorized. Please log in."
**Решение**: 
1. Проверьте, что вы авторизованы (нажмите "Войти через Google")
2. Проверьте cookies в браузере
3. Убедитесь, что SESSION_SECRET установлен

#### Авторизация не работает на Vercel
**Решение**:
1. Проверьте все environment variables на Vercel
2. Убедитесь, что используется HTTPS
3. Проверьте логи: `vercel logs`
4. Убедитесь, что redirect URI включает ваш Vercel домен

### Проблемы с типами

```bash
# Проверить типы в клиенте
cd client && pnpm type-check

# Проверить типы в сервере
cd server && pnpm type-check
```

### Проблемы с Vercel

1. Проверьте логи деплоя: `vercel logs`
2. Убедитесь, что `vercel.json` правильно настроен
3. Проверьте переменные окружения
4. Убедитесь, что `api/index.ts` корректно импортирует модули

### Проблемы с шифрованием

#### "Failed to decrypt text"
**Решение**: 
1. Проверьте, что ключ копируется полностью
2. Убедитесь, что зашифрованный текст не поврежден
3. Проверьте, что используется тот же ключ, что был при шифровании

## 📚 Документация

- [Настройка Google OAuth](./GOOGLE_OAUTH_SETUP.md) - Подробная инструкция по настройке Google OAuth
- [server/.env.example](./server/.env.example) - Пример файла с переменными окружения

## 🎯 Особенности реализации

### React Activity API
Приложение использует новый React Activity API для сохранения состояния компонентов:
- Компоненты Encryption и Decryption остаются смонтированными
- Переключение между режимами не приводит к потере введенных данных
- Улучшенный UX без лишних перерендеров

### Session-based Authentication
- Passport.js с Google OAuth 2.0 strategy
- Express-session для управления сессиями
- Secure cookies для продакшена
- Middleware защита всех API endpoints

### Монорепозиторий
- pnpm workspaces для управления зависимостями
- Общие типы между server и api
- Единая команда для запуска dev окружения

## 🤝 Contributing

1. Fork проекта
2. Создайте ветку для фичи (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

MIT

## 👨‍💻 Автор

Создано с использованием:
- React 19 с Activity API
- Express + TypeScript
- Google OAuth 2.0
- Vercel Serverless Functions

---

**Happy Coding! 🚀**

**Не забудьте настроить Google OAuth перед использованием!** 🔐

