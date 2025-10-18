# Инструкция по деплою на Vercel

## Подготовка к деплою

### 1. Установите зависимости
```bash
npm install
```

### 2. Проверьте сборку локально
```bash
# Сборка клиента
npm run build:client

# Сборка API функции
npm run build:api
```

### 3. Настройте переменные окружения

В панели Vercel настройте следующие переменные окружения:

**Обязательные:**
- `GOOGLE_CLIENT_ID` - Client ID от Google OAuth
- `GOOGLE_CLIENT_SECRET` - Client Secret от Google OAuth
- `SESSION_SECRET` - Секретный ключ для сессий (случайная строка)
- `CLIENT_URL` - URL вашего клиента (например, `https://your-app.vercel.app`)
- `SERVER_URL` - URL вашего сервера (например, `https://your-app.vercel.app`)

**Опциональные:**
- `NODE_ENV` - установите `production`

### 4. Настройка Google OAuth

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте или выберите проект
3. Перейдите в "APIs & Services" > "Credentials"
4. Создайте OAuth 2.0 Client ID
5. Добавьте в "Authorized redirect URIs":
   - `https://your-app.vercel.app/api/auth/google/callback`
6. Скопируйте Client ID и Client Secret в переменные окружения Vercel

## Деплой

### Первый деплой

1. Установите Vercel CLI (если еще не установлен):
```bash
npm install -g vercel
```

2. Войдите в Vercel:
```bash
vercel login
```

3. Деплой проекта:
```bash
vercel --prod
```

### Последующие деплои

При каждом push в ветку `main` на GitHub, Vercel автоматически создаст новый деплой.

Для ручного деплоя:
```bash
vercel --prod
```

## Структура проекта для Vercel

```
encrypting-app/
├── api/                    # Serverless функции для Vercel
│   ├── config/             # Конфигурация Passport
│   ├── routes/             # API routes
│   ├── services/           # Сервисы (шифрование)
│   ├── index.js            # Скомпилированная функция (генерируется)
│   ├── index.ts            # Главная serverless функция
│   ├── types.ts            # TypeScript типы
│   └── package.json        # Зависимости API
├── client/                 # React приложение
│   └── dist/               # Собранный клиент (генерируется)
├── vercel.json             # Конфигурация Vercel
└── package.json            # Корневой package.json
```

## Проверка деплоя

После деплоя проверьте:

1. **Клиент**: https://your-app.vercel.app/
2. **API Health Check**: https://your-app.vercel.app/api/health
3. **Auth Status**: https://your-app.vercel.app/api/auth/status

## Отладка

### Проверка логов
```bash
vercel logs [deployment-url]
```

### Локальная проверка
```bash
# Запустите локально для тестирования
vercel dev
```

### Частые проблемы

1. **Ошибка 404 на API endpoints**
   - Убедитесь, что `api/index.js` создан (запустите `npm run build:api`)
   - Проверьте `vercel.json` rewrites

2. **Ошибка Google OAuth**
   - Проверьте правильность redirect URIs в Google Console
   - Убедитесь, что `CLIENT_URL` и `SERVER_URL` настроены правильно
   - Проверьте, что переменные окружения установлены в Vercel

3. **Ошибка сессий**
   - Убедитесь, что `SESSION_SECRET` настроен
   - Проверьте cookie settings (secure: true для production)

4. **Ошибка компиляции TypeScript**
   - Запустите `npm run build:api` локально для проверки
   - Проверьте все импорты в `api/index.ts`

## Полезные команды

```bash
# Просмотр всех деплоев
vercel ls

# Удалить деплой
vercel remove [deployment-id]

# Просмотр переменных окружения
vercel env ls

# Добавить переменную окружения
vercel env add [name]
```

## Дополнительная информация

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Google OAuth Setup](./GOOGLE_OAUTH_SETUP.md)

