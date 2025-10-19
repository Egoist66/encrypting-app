// Тест отправки сообщения маме
require('dotenv').config();
const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MOM_CHAT_ID = '568285771'; // Chat ID мамы
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function testSendToMom() {
  try {
    console.log('📤 Тестирование отправки сообщения маме...');
    console.log('Chat ID мамы:', MOM_CHAT_ID);
    
    const response = await axios.post(`${API_URL}/sendMessage`, {
      chat_id: MOM_CHAT_ID,
      text: '🔐 <b>Зашифрованное сообщение</b>\n\n<b>Исходный текст:</b>\nПривет, мама!\n\n<b>Зашифрованный текст:</b>\n<code>abc123def456</code>\n\n<b>Ключ шифрования:</b>\n<code>key123456</code>\n\n<i>Для расшифровки используйте приложение: http://localhost:3000</i>',
      parse_mode: 'HTML'
    });
    
    if (response.data.ok) {
      console.log('✅ Сообщение маме отправлено успешно!');
      console.log('Message ID:', response.data.result.message_id);
    } else {
      console.log('❌ Ошибка:', response.data);
    }
    
  } catch (error) {
    console.error('❌ Ошибка отправки маме:', error.response?.data || error.message);
  }
}

testSendToMom();
