const plugin = {
  commands: ['/start'],
  tags: ['main'],
  init: (bot, { buttonUrl }) => {
    bot.onText(/^\/start$/, (msg) => {
      const From = msg.chat.id;
      const user = msg.from;
      const caption = `Hi ${user.first_name}! Welcome to ShiraBot, I'm a Telegram bot created by Shirayuki to help you 😄, please type /menu to see all our menu lists.`;
      const replyMarkup = {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Script Bot', url: buttonUrl }],
          ],
        },
      };
      bot.sendMessage(From, caption, { reply_to_message_id: msg.message_id, ...replyMarkup });
    });
  }
};

module.exports = plugin;
