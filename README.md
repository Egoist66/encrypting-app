# 🔐 Encrypting App

Полнофункциональное веб-приложение для безопасного шифрования и расшифрования текстовых данных с использованием AES-256-CBC алгоритма, аутентификации через Google OAuth 2.0 и интеграцией с Telegram для отправки зашифрованных сообщений.

## 📋 Содержание

- [Обзор](#обзор)
- [Архитектура](#архитектура)
- [Функциональность](#функциональность)
- [Telegram интеграция](#telegram-интеграция)
- [Технологический стек](#технологический-стек)
- [Установка и настройка](#установка-и-настройка)
- [Развертывание](#развертывание)
- [API Документация](#api-документация)
- [React компоненты](#react-компоненты)
- [Безопасность](#безопасность)
- [Структура проекта](#структура-проекта)
- [Разработка](#разработка)
- [Устранение неполадок](#устранение-неполадок)

## 🎯 Обзор

**Encrypting App** - это полнофункциональное веб-приложение, которое предоставляет пользователям возможность:

- 🔐 **Безопасное шифрование** текстовых данных с использованием AES-256-CBC
- 🔓 **Расшифрование** данных с использованием уникального ключа
- 👤 **Аутентификация** через Google OAuth 2.0
- 📱 **Telegram интеграция** для отправки зашифрованных сообщений
- 🛡️ **Защищенный доступ** - только авторизованные пользователи могут использовать функции шифрования
- 🌐 **Готовность к продакшену** - поддержка развертывания на Vercel

### Основные особенности

- **Монорепозиторий** с тремя workspace'ами (client, server, api)
- **TypeScript** для типобезопасности
- **React 19** с современными хуками и Context API
- **Express.js** сервер с поддержкой сессий
- **Serverless API** для Vercel
- **Google OAuth 2.0** интеграция с JWT токенами
- **AES-256-CBC** шифрование с случайным IV
- **Telegram Bot API** для отправки сообщений
- **Responsive дизайн** с современным UI/UX

## 🏗️ Архитектура

Приложение состоит из трех основных частей:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express Server │    │  Vercel API     │
│   (Port 3000)   │◄──►│   (Port 3001)   │    │  (Serverless)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Google OAuth   │    │  Telegram Bot   │    │  Crypto Module  │
│   (External)    │    │   (External)    │    │  (Node.js)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Компоненты системы

1. **Client** - React приложение для пользовательского интерфейса
2. **Server** - Express.js сервер для локальной разработки
3. **API** - Serverless функции для развертывания на Vercel
4. **Authentication** - Google OAuth 2.0 + JWT токены
5. **Encryption** - AES-256-CBC криптографические функции
6. **Telegram Integration** - Отправка зашифрованных сообщений через Telegram Bot API

## ⚡ Функциональность

### 🔐 Шифрование

- Ввод текста для шифрования
- Генерация уникального ключа шифрования
- Возврат зашифрованного текста и ключа
- Автоматическая очистка формы после успешного шифрования

### 🔓 Расшифрование

- Ввод зашифрованного текста
- Ввод ключа шифрования
- Возврат расшифрованного текста
- Обработка ошибок при неверном ключе

### 👤 Аутентификация

- Вход через Google аккаунт
- Автоматическое создание JWT токена
- Защита всех API endpoints
- Профиль пользователя с аватаром
- Безопасный выход из системы

### 🛡️ Безопасность

- Все операции шифрования требуют аутентификации
- JWT токены с истечением срока действия (7 дней)
- HTTP-only cookies для хранения токенов
- CORS настройки для безопасности
- Валидация входных данных

## 📱 Telegram интеграция

Приложение поддерживает отправку зашифрованных сообщений через Telegram Bot API. Это позволяет пользователям безопасно передавать зашифрованные данные через популярный мессенджер.

### Основные возможности

- **Отправка зашифрованных сообщений** в личные чаты и группы
- **Раздельная отправка** - зашифрованный текст и ключ отправляются отдельными сообщениями для удобного копирования
- **Форматирование сообщений** с HTML разметкой для лучшей читаемости
- **Валидация chat_id** для корректной отправки
- **Обработка ошибок** с подробными сообщениями

### Как это работает

1. **Пользователь шифрует текст** в веб-приложении
2. **Вводит Telegram chat_id** получателя (личный ID или @username)
3. **Приложение отправляет два сообщения:**
   - Первое: зашифрованный текст с инструкциями
   - Второе: ключ шифрования для расшифровки
4. **Получатель копирует данные** и использует веб-приложение для расшифровки

### Поддерживаемые форматы chat_id

- **Личные чаты:** `123456789` (числовой ID)
- **Группы:** `-123456789` (отрицательный числовой ID)
- **Каналы:** `@channel_name` (username канала)
- **Пользователи:** `@username` (username пользователя)

### Безопасность Telegram интеграции

- **Bot токен** хранится в переменных окружения
- **Валидация входных данных** перед отправкой
- **Обработка ошибок API** Telegram
- **Логирование операций** для отладки

## 🛠️ Технологический стек

### Frontend

- **React 19.2.0** - UI библиотека
- **TypeScript 5.3.3** - типизация
- **Vite 7.1.10** - сборщик и dev сервер
- **CSS3** - стилизация

### Backend

- **Node.js 18+** - runtime
- **Express.js 5.1.0** - веб-фреймворк
- **TypeScript 5.9.3** - типизация
- **Passport.js** - аутентификация
- **JWT** - токены авторизации

### Криптография

- **Node.js crypto** - встроенный модуль
- **AES-256-CBC** - алгоритм шифрования
- **Random IV** - инициализационный вектор

### Инфраструктура

- **Vercel** - хостинг и serverless функции
- **Google Cloud Console** - OAuth credentials
- **Telegram Bot API** - отправка сообщений
- **npm workspaces** - управление зависимостями

### Внешние сервисы

- **Google OAuth 2.0** - аутентификация пользователей
- **Telegram Bot API** - отправка зашифрованных сообщений
- **Node.js Crypto** - криптографические операции

## 🚀 Установка и настройка

### Предварительные требования

- **Node.js** версии 18.0.0 или выше
- **npm** версии 9.0.0 или выше
- **Google аккаунт** для настройки OAuth

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd encrypting-app
```

### 2. Установка зависимостей

```bash
# Установка всех зависимостей для всех workspace'ов
npm install

# Или установка по отдельности
npm install --workspace=client
npm install --workspace=server
npm install --workspace=api
```

### 3. Настройка Google OAuth

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API
4. Создайте OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3001/api/auth/google/callback`

### 4. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```bash
cp env.example .env
```

Заполните переменные в `.env`:

```env
# Google OAuth credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# JWT Secret (минимум 32 символа)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# URLs для локальной разработки
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:3001
```

### 5. Запуск приложения

#### Локальная разработка (рекомендуется)

```bash
# Запуск клиента и сервера одновременно
npm run dev

# Или запуск по отдельности
npm run dev:client  # http://localhost:3000
npm run dev:server  # http://localhost:3001
```

#### Только клиент

```bash
npm run dev:client
```

#### Только сервер

```bash
npm run dev:server
```

## 🌐 Развертывание

### Развертывание на Vercel

1. **Подготовка проекта:**

```bash
# Сборка для продакшена
npm run build
```

2. **Настройка Vercel:**

Создайте файл `vercel.json` (уже включен в проект):

```json
{
  "buildCommand": "cd client && npm run build && cd ../api && npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "bash install-vercel.sh",
  "functions": {
    "api/index.ts": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api"
    }
  ]
}
```

3. **Установка переменных окружения в Vercel:**

В панели Vercel добавьте следующие переменные:

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
CLIENT_URL=https://your-app.vercel.app
SERVER_URL=https://your-app.vercel.app
NODE_ENV=production
```

4. **Обновление Google OAuth настроек:**

В Google Cloud Console обновите:

- **Authorized JavaScript origins:** `https://your-app.vercel.app`
- **Authorized redirect URIs:** `https://your-app.vercel.app/api/auth/google/callback`

5. **Развертывание:**

```bash
# Установка Vercel CLI
npm i -g vercel

# Развертывание
vercel --prod
```

## 📚 API Документация

### Базовый URL

- **Локальная разработка:** `http://localhost:3001`
- **Продакшен:** `https://your-app.vercel.app`

### Аутентификация

Все защищенные endpoints требуют JWT токен в HTTP-only cookie.

#### `GET /api/auth/google`

Инициация OAuth с Google.

**Ответ:** Редирект на Google OAuth.

#### `GET /api/auth/google/callback`

Callback после авторизации Google.

**Ответ:** Редирект на клиент с установленным auth_token cookie.

#### `GET /api/auth/user`

Получение информации о текущем пользователе.

**Заголовки:**

```
Cookie: auth_token=<jwt_token>
```

**Ответ:**

```json
{
  "success": true,
  "data": {
    "id": "google_user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://lh3.googleusercontent.com/...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### `POST /api/auth/logout`

Выход из системы.

**Ответ:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### `GET /api/auth/status`

Проверка статуса аутентификации.

**Ответ:**

```json
{
  "success": true,
  "data": {
    "authenticated": true
  }
}
```

### Шифрование

#### `POST /api/encrypt`

Шифрование текста.

**Заголовки:**

```
Content-Type: application/json
Cookie: auth_token=<jwt_token>
```

**Тело запроса:**

```json
{
  "text": "Текст для шифрования"
}
```

**Ответ:**

```json
{
  "success": true,
  "data": {
    "encrypted": "a1b2c3d4e5f6:encrypted_text_here",
    "key": "64_character_hex_key"
  }
}
```

#### `POST /api/decrypt`

Расшифрование текста.

**Заголовки:**

```
Content-Type: application/json
Cookie: auth_token=<jwt_token>
```

**Тело запроса:**

```json
{
  "encrypted": "a1b2c3d4e5f6:encrypted_text_here",
  "key": "64_character_hex_key"
}
```

**Ответ:**

```json
{
  "success": true,
  "data": {
    "decrypted": "Исходный текст"
  }
}
```

### Системные endpoints

#### `GET /api/health`

Проверка состояния API.

**Ответ:**

```json
{
  "success": true,
  "message": "✅ API работает!",
  "data": {
    "env": {
      "hasGoogleClientId": true,
      "hasGoogleClientSecret": true,
      "hasJwtSecret": true,
      "clientUrl": "http://localhost:3000",
      "serverUrl": "http://localhost:3001"
    }
  }
}
```

## 🔒 Безопасность

### Криптографические меры

1. **AES-256-CBC шифрование:**

   - Использует 256-битный ключ
   - Случайный IV для каждого шифрования
   - Безопасный режим CBC

2. **Генерация ключей:**
   - Криптографически стойкие случайные ключи
   - 256-битные (64 hex символа) ключи
   - Уникальный ключ для каждого шифрования

### Аутентификация и авторизация

1. **Google OAuth 2.0:**

   - Проверенная система аутентификации
   - Безопасный обмен токенами
   - Защита от CSRF атак

2. **JWT токены:**

   - Подписанные токены с истечением срока
   - 7-дневный срок действия
   - HTTP-only cookies для хранения

3. **Защита endpoints:**
   - Все криптографические операции требуют аутентификации
   - Middleware проверки токенов
   - Валидация входных данных

### Сетевая безопасность

1. **CORS настройки:**

   - Ограниченные origins
   - Поддержка credentials
   - Защита от нежелательных запросов

2. **Cookie безопасность:**
   - HTTP-only флаг
   - Secure флаг в продакшене
   - SameSite защита

## 📁 Структура проекта

```
encrypting-app/
├── client/                 # React приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   │   ├── auth/       # Компоненты аутентификации
│   │   │   ├── api/        # Компоненты шифрования
│   │   │   └── layout/     # Компоненты макета
│   │   ├── context/        # React Context
│   │   ├── hooks/          # Кастомные хуки
│   │   ├── types/          # TypeScript типы
│   │   ├── utils/          # Утилиты
│   │   └── style/          # CSS стили
│   ├── dist/               # Собранное приложение
│   └── package.json
├── server/                 # Express сервер (локальная разработка)
│   ├── src/
│   │   ├── config/         # Конфигурация Passport
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API маршруты
│   │   └── services/       # Бизнес логика
│   └── package.json
├── api/                    # Vercel serverless функции
│   ├── config/             # Конфигурация Passport
│   ├── routes/             # API маршруты
│   ├── services/           # Бизнес логика
│   └── package.json
├── package.json            # Корневой package.json с workspaces
├── vercel.json             # Конфигурация Vercel
├── env.example             # Пример переменных окружения
└── README.md               # Документация
```

### Описание основных файлов

#### `/client/src/components/`

- **`auth/Login.tsx`** - Компонент входа через Google
- **`auth/Profile.tsx`** - Профиль пользователя
- **`api/Encryption.tsx`** - Форма шифрования
- **`api/Decryption.tsx`** - Форма расшифрования

#### `/client/src/hooks/`

- **`useEncryption.ts`** - Логика шифрования
- **`useDecryption.ts`** - Логика расшифрования

#### `/client/src/context/`

- **`AuthContext.tsx`** - Контекст аутентификации

#### `/api/services/` и `/server/src/services/`

- **`encryption.ts`** - Криптографические функции

#### `/api/config/` и `/server/src/config/`

- **`passport.ts`** - Конфигурация Google OAuth

## 🛠️ Разработка

### Доступные команды

```bash
# Разработка
npm run dev                 # Запуск клиента и сервера
npm run dev:client         # Только клиент
npm run dev:server         # Только сервер

# Сборка
npm run build              # Сборка всех workspace'ов
npm run build:client       # Сборка клиента
npm run build:server       # Сборка сервера
npm run build:api          # Сборка API

# Запуск продакшена
npm run start              # Запуск сервера

# Утилиты
npm run type-check         # Проверка типов
npm run clean              # Очистка node_modules
```

### Добавление новых функций

1. **Новый API endpoint:**

   - Добавьте маршрут в `/api/routes/` или `/server/src/routes/`
   - Создайте соответствующий сервис в `/services/`
   - Обновите типы в `types.ts`

2. **Новый React компонент:**

   - Создайте компонент в `/client/src/components/`
   - Добавьте соответствующие типы в `/client/src/types/`
   - Создайте хук если нужна сложная логика

3. **Новый сервис шифрования:**
   - Добавьте функции в `/services/encryption.ts`
   - Обновите API endpoints
   - Добавьте соответствующие типы

### Отладка

#### Логирование

- Все API запросы логируются в консоль
- Ошибки аутентификации подробно описаны
- Состояние переменных окружения выводится в health check

#### Проверка состояния

- `GET /api/health` - проверка API
- `GET /api/auth/status` - проверка аутентификации
- React DevTools для отладки состояния

## 🔧 Устранение неполадок

### Частые проблемы

#### 1. Ошибка аутентификации Google OAuth

**Проблема:** `Error: GOOGLE_CLIENT_ID environment variable is required`

**Решение:**

```bash
# Проверьте переменные окружения
echo $GOOGLE_CLIENT_ID
echo $GOOGLE_CLIENT_SECRET

# Убедитесь, что .env файл существует и заполнен
cat .env
```

#### 2. CORS ошибки

**Проблема:** `Access to fetch at 'http://localhost:3001' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Решение:**

- Убедитесь, что сервер запущен на порту 3001
- Проверьте CORS настройки в server/src/index.ts
- Убедитесь, что CLIENT_URL правильно настроен

#### 3. Ошибки сборки TypeScript

**Проблема:** `Type errors found`

**Решение:**

```bash
# Проверка типов
npm run type-check

# Очистка и переустановка
npm run clean
npm install
```

#### 4. Пнимание Vercel

**Проблема:** `Function timeout` или `Module not found`

**Решение:**

- Проверьте vercel.json конфигурацию
- Убедитесь, что все зависимости установлены
- Проверьте переменные окружения в Vercel dashboard

#### 5. Проблемы с cookies

**Проблема:** Токены не сохраняются или не отправляются

**Решение:**

- Убедитесь, что используется `credentials: 'include'`
- Проверьте настройки SameSite и Secure флагов
- В продакшене убедитесь, что домены совпадают

### Логи и отладка

#### Включение подробного логирования

```typescript
// В server/src/index.ts или api/index.ts
console.log("Environment variables:", {
  hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
  hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
  clientUrl: process.env.CLIENT_URL,
  serverUrl: process.env.SERVER_URL,
});
```

#### Проверка состояния аутентификации

```bash
# Проверка health endpoint
curl http://localhost:3001/api/health

# Проверка статуса аутентификации
curl http://localhost:3001/api/auth/status
```

### Контакты и поддержка

Если у вас возникли проблемы:

1. Проверьте логи в консоли браузера и сервера
2. Убедитесь, что все переменные окружения настроены
3. Проверьте версии Node.js и npm
4. Обратитесь к документации используемых библиотек

---

**Encrypting App** - надежное и безопасное решение для шифрования данных с современным пользовательским интерфейсом и профессиональной архитектурой.
