# 🔧 Исправление ошибки деплоя на Vercel

## ❌ Исходная ошибка

```
npm error No workspaces found:
npm error   --workspace=client
Error: Command "npm run build --workspace=client" exited with 1
```

## 🔍 Причина

Vercel **не поддерживает npm workspaces** в buildCommand и installCommand. Команды вида `npm run build --workspace=client` работают только локально, где есть корневой `package.json` с настроенными workspaces.

## ✅ Решение

### Изменения в `vercel.json`

**Было:**
```json
{
  "buildCommand": "npm run build:client && npm run build:api",
  "installCommand": "npm install",
  ...
}
```

**Стало:**
```json
{
  "buildCommand": "cd client && npm run build && cd ../api && npm run build",
  "installCommand": "npm install --prefix client && npm install --prefix api",
  ...
}
```

### Что изменилось:

1. **installCommand** - теперь устанавливает зависимости напрямую в каждую папку:
   - `npm install --prefix client` - установка зависимостей клиента
   - `npm install --prefix api` - установка зависимостей API

2. **buildCommand** - теперь переходит в каждую папку и запускает локальную сборку:
   - `cd client && npm run build` - сборка клиента
   - `cd ../api && npm run build` - сборка API

## 📂 Структура папки API

Папка API полностью готова к деплою:

```
api/
├── config/
│   ├── passport.ts          # Конфигурация Passport
│   └── passport.js          # Скомпилированный
├── routes/
│   ├── auth.ts              # Маршруты авторизации
│   └── auth.js              # Скомпилированный
├── services/
│   ├── encryption.ts        # Сервис шифрования
│   └── encryption.js        # Скомпилированный
├── index.ts                 # Главная serverless функция
├── index.js                 # Скомпилированная (entry point для Vercel)
├── types.ts                 # TypeScript типы
├── types.js                 # Скомпилированный
├── package.json             # Зависимости API
└── tsconfig.json            # Конфигурация TypeScript
```

### ✅ Проверки:

- ✅ Все `.ts` файлы компилируются в `.js`
- ✅ Все импорты используют расширение `.js` (требование ESM)
- ✅ `package.json` содержит `"type": "module"`
- ✅ Все зависимости установлены
- ✅ `index.js` экспортирует default serverless функцию
- ✅ Структура независима от `server/` папки

## 🚀 Как теперь деплоить

### 1. Локальная проверка

```bash
# Полная сборка (как на Vercel)
cd client && npm install && npm run build && \
cd ../api && npm install && npm run build

# Проверка результата
ls -la client/dist/index.html  # Клиент собран
ls -la api/index.js            # API собран
```

### 2. Деплой на Vercel

```bash
# Первый деплой
vercel

# Продакшн деплой
vercel --prod
```

### 3. Настройка переменных окружения

В Vercel Dashboard добавьте:

| Variable | Value |
|----------|-------|
| `SESSION_SECRET` | Случайная строка (используйте `openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | Ваш Google Client ID |
| `GOOGLE_CLIENT_SECRET` | Ваш Google Client Secret |
| `CLIENT_URL` | `https://ваш-домен.vercel.app` |
| `SERVER_URL` | `https://ваш-домен.vercel.app` |
| `NODE_ENV` | `production` |

### 4. Обновите Google OAuth redirect URI

```
https://ваш-домен.vercel.app/api/auth/google/callback
```

## 🔄 Локальная разработка

Для локальной разработки workspaces по-прежнему работают:

```bash
# Установка зависимостей (использует workspaces)
npm install

# Запуск dev серверов (использует workspaces)
npm run dev

# Сборка (использует workspaces)
npm run build
```

**Workspaces используются только локально!** На Vercel команды работают напрямую с папками.

## 📋 Список всех изменений

### Измененные файлы:
- ✅ `vercel.json` - исправлены buildCommand и installCommand
- ✅ `.gitignore` - добавлены скомпилированные JS файлы API
- ✅ `.vercelignore` - исключены лишние файлы
- ✅ `api/package.json` - добавлен build скрипт
- ✅ `api/tsconfig.json` - настроена компиляция
- ✅ `api/index.ts` - обновлены импорты

### Новые файлы:
- ✅ `api/config/passport.ts` - конфигурация Passport
- ✅ `api/routes/auth.ts` - маршруты авторизации
- ✅ `api/services/encryption.ts` - сервис шифрования
- ✅ `api/types.ts` - TypeScript типы
- ✅ `DEPLOY_QUICK_START.md` - быстрый старт деплоя
- ✅ `VERCEL_DEPLOY.md` - полная инструкция
- ✅ `CHANGELOG_VERCEL_FIX.md` - детали исправлений

## ✅ Итоговый чеклист перед деплоем

- [ ] Файл `api/index.js` создан (запустите `cd api && npm run build`)
- [ ] Файл `client/dist/index.html` создан (запустите `cd client && npm run build`)
- [ ] Переменные окружения настроены на Vercel
- [ ] Google OAuth redirect URI обновлен
- [ ] Код закоммичен в git

## 🎯 После деплоя проверьте:

1. **Клиент**: `https://ваш-домен.vercel.app/`
2. **API Health**: `https://ваш-домен.vercel.app/api/health`
3. **Auth Status**: `https://ваш-домен.vercel.app/api/auth/status`
4. **Google OAuth**: Кнопка "Войти через Google" работает

## 📚 Дополнительная документация

- **[DEPLOY_QUICK_START.md](./DEPLOY_QUICK_START.md)** - быстрый старт
- **[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)** - подробная инструкция
- **[GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)** - настройка OAuth

---

## 🎉 Готово!

Теперь ваше приложение готово к деплою на Vercel без ошибок workspaces!

**Команда для деплоя:**
```bash
vercel --prod
```

**Happy Deploying! 🚀**

