const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const router = express.Router();

const token = '7808983965:AAHEi5O7Mp4mK3pd4bawyEOpawIDLrzJCJc';
const chatId = '888919232';

const bot = new TelegramBot(token, { polling: false });

// Новый роутер для отправки формы
router.post('/send-form', async (req, res) => {
  const { name, contacts, problemDescription } = req.body;

  if (name && contacts && problemDescription) {
    const message = `
        Обратная связь :

      Имя: ${name}
      Контакты: ${contacts}
      Описание проблемы: ${problemDescription}
    `;

    try {
      const response = await bot.sendMessage(chatId, message);
      console.log('Ответ от Telegram:', response);

      res.status(200).send({ success: true });
    } catch (error) {
      console.error('Ошибка при отправке сообщения в Telegram:', error);

      // Если ошибка от Telegram API, логируем детальный ответ
      if (error.response) {
        console.error('Ответ от Telegram:', error.response.data);
        console.error('Код ошибки:', error.response.status);
      }

      res
        .status(500)
        .send({ error: 'Не удалось отправить сообщение в Telegram' });
    }
  } else {
    res.status(400).send({ error: 'Все поля формы должны быть заполнены' });
  }
});

module.exports = router;
