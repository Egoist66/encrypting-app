#!/bin/bash

# Скрипт для настройки переменных окружения в Vercel

echo "🚀 Настройка переменных окружения для Vercel..."
echo ""

# Проверяем, установлен ли Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI не установлен. Установите его:"
    echo "npm install -g vercel"
    exit 1
fi

echo "📋 Добавление переменных окружения..."

# Добавляем переменные окружения
echo "1. GOOGLE_CLIENT_ID"
vercel env add GOOGLE_CLIENT_ID production preview development

echo ""
echo "2. GOOGLE_CLIENT_SECRET"
vercel env add GOOGLE_CLIENT_SECRET production preview development

echo ""
echo "3. JWT_SECRET"
vercel env add JWT_SECRET production preview development

echo ""
echo "4. CLIENT_URL"
vercel env add CLIENT_URL production preview development

echo ""
echo "5. SERVER_URL"
vercel env add SERVER_URL production preview development

echo ""
echo "✅ Переменные окружения добавлены!"
echo ""
echo "🔄 Выполните редеплой:"
echo "vercel --prod"
echo ""
echo "🔍 Проверьте переменные:"
echo "vercel env ls"
