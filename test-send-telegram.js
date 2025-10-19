// Тест отправки сообщения в Telegram
require('dotenv').config();
const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = '566390170'; // Ваш chat_id
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function testSendMessage() {
  try {
    console.log('📤 Тестирование отправки сообщения...');
    console.log('Chat ID:', CHAT_ID);
    console.log('Bot Token:', BOT_TOKEN ? '✅ Установлен' : '❌ Не установлен');
    
    const response = await axios.post(`${API_URL}/sendMessage`, {
      chat_id: CHAT_ID,
      text: '🧪 Тестовое сообщение от бота!',
      parse_mode: 'HTML'
    });
    
    if (response.data.ok) {
      console.log('✅ Сообщение отправлено успешно!');
      console.log('Message ID:', response.data.result.message_id);
    } else {
      console.log('❌ Ошибка:', response.data);
    }
    
  } catch (error) {
    console.error('❌ Ошибка отправки:', error.response?.data || error.message);
  }
}

testSendMessage();
