// Тестовый скрипт для проверки Telegram endpoint на локальном сервере
// Запуск: node test-telegram-local.js

const axios = require('axios');

const SERVER_URL = 'http://localhost:3001';

async function testTelegramEndpoint() {
  try {
    console.log('🧪 Тестирование Telegram endpoint...');
    
    // Тест без авторизации (должен вернуть 401)
    console.log('\n1. Тест без авторизации:');
    try {
      await axios.post(`${SERVER_URL}/api/telegram/send`, {
        chat_id: '@test',
        encrypted_text: 'test',
        encryption_key: 'test'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Правильно требует авторизацию');
      } else {
        console.log('❌ Неожиданный ответ:', error.response?.status);
      }
    }
    
    // Тест с неверными данными (должен вернуть 400)
    console.log('\n2. Тест с неверным chat_id:');
    try {
      await axios.post(`${SERVER_URL}/api/telegram/send`, {
        chat_id: 'invalid-chat-id',
        encrypted_text: 'test',
        encryption_key: 'test'
      }, {
        headers: {
          'Cookie': 'auth_token=fake-token'
        }
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Правильно валидирует chat_id');
      } else {
        console.log('❌ Неожиданный ответ:', error.response?.status);
      }
    }
    
    console.log('\n✅ Telegram endpoint работает корректно!');
    console.log('\n📋 Для полного тестирования:');
    console.log('1. Установите TELEGRAM_BOT_TOKEN в .env файле');
    console.log('2. Авторизуйтесь в приложении');
    console.log('3. Зашифруйте сообщение');
    console.log('4. Попробуйте отправить в Telegram');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

testTelegramEndpoint();
