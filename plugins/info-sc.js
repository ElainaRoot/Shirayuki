const plugin = {
    commands: ['/sc'],
    tags: ['info'],
    init: (bot, {
        buttonUrl
    }) => {
        bot.onText(/^\/sc$/, (msg) => {
            const From = msg.chat.id;
            const user = msg.from;

            const caption = `
👋 Hi ${user.first_name}! 
This bot utilizes scripts from **Shirayuki** to assist you with various tasks. 

💻 If you're interested in the script or want to learn more, click the button below:

🔗 **Script Bot**

Thank you for using ShiraBot! Your support means a lot! 🌟
      `;

            const replyMarkup = {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: '🛠 Script Bot',
                            url: buttonUrl
                        }],
                    ],
                },
            };

            bot.sendMessage(From, caption, {
                reply_to_message_id: msg.message_id,
                parse_mode: 'Markdown',
                ...replyMarkup
            });
        });
    }
};

module.exports = plugin;