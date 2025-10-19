// Тест отправки разделенных сообщений
require('dotenv').config();
const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MOM_CHAT_ID = '568285771'; // Chat ID мамы
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function testSeparateMessages() {
  try {
    console.log('📤 Тестирование отправки разделенных сообщений...');
    console.log('Chat ID мамы:', MOM_CHAT_ID);
    
    // Первое сообщение - информация и зашифрованный текст
    const message1 = `
🔐 <b>Зашифрованное сообщение</b>

<b>Исходный текст:</b>
Привет, мама! Это тестовое сообщение.

<b>Зашифрованный текст:</b>
<code>abc123def456ghi789jkl012mno345pqr678stu901vwx234yz</code>

<i>Для расшифровки используйте приложение: https://encrypting-app.vercel.app/</i>
    `.trim();

    // Второе сообщение - ключ шифрования
    const message2 = `
🔑 <b>Ключ шифрования</b>

<code>key123456789abcdef</code>

<i>Скопируйте этот ключ для расшифровки</i>
    `.trim();

    // Отправляем первое сообщение
    console.log('📤 Отправка первого сообщения...');
    const response1 = await axios.post(`${API_URL}/sendMessage`, {
      chat_id: MOM_CHAT_ID,
      text: message1,
      parse_mode: 'HTML',
    });

    if (response1.data.ok) {
      console.log('✅ Первое сообщение отправлено успешно!');
    } else {
      console.log('❌ Ошибка первого сообщения:', response1.data);
      return;
    }

    // Небольшая задержка между сообщениями
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Отправляем второе сообщение
    console.log('📤 Отправка второго сообщения...');
    const response2 = await axios.post(`${API_URL}/sendMessage`, {
      chat_id: MOM_CHAT_ID,
      text: message2,
      parse_mode: 'HTML',
    });

    if (response2.data.ok) {
      console.log('✅ Второе сообщение отправлено успешно!');
      console.log('🎉 Разделенные сообщения отправлены!');
    } else {
      console.log('❌ Ошибка второго сообщения:', response2.data);
    }
    
  } catch (error) {
    console.error('❌ Ошибка отправки:', error.response?.data || error.message);
  }
}

testSeparateMessages();
