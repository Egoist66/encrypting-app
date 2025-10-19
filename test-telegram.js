// Тестовый скрипт для проверки Telegram интеграции
// Запуск: node test-telegram.js

require('dotenv').config();
const axios = require('axios');

// Замените на ваш токен бота
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function testTelegramBot() {
  try {
    console.log('🤖 Тестирование Telegram бота...');
    
    // Проверяем информацию о боте
    const botInfo = await axios.get(`${API_URL}/getMe`);
    console.log('✅ Бот найден:', botInfo.data.result);
    
    // Проверяем последние обновления
    const updates = await axios.get(`${API_URL}/getUpdates`);
    console.log('📨 Последние обновления:', updates.data.result.length);
    
    if (updates.data.result.length > 0) {
      const lastUpdate = updates.data.result[updates.data.result.length - 1];
      console.log('💬 Последнее сообщение:', {
        chat_id: lastUpdate.message?.chat?.id,
        username: lastUpdate.message?.chat?.username,
        text: lastUpdate.message?.text
      });
    }
    
    console.log('\n✅ Telegram бот работает корректно!');
    console.log('\n📋 Для использования в приложении:');
    console.log('1. Добавьте TELEGRAM_BOT_TOKEN в .env файл');
    console.log('2. Используйте chat_id из вывода выше');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.response?.data || error.message);
    console.log('\n🔧 Убедитесь что:');
    console.log('1. TELEGRAM_BOT_TOKEN установлен в переменных окружения');
    console.log('2. Токен бота корректный');
    console.log('3. Бот создан через @BotFather');
  }
}

testTelegramBot();
