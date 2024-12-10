const plugin = {
    commands: ['/start', '/infobot'],
    tags: ['main'],
    init: (bot, {
        buttonUrl
    }) => {
        // /start command
        bot.onText(/^\/start$/, (msg) => {
            const From = msg.chat.id;
            const user = msg.from;

            const caption = `
🌟 Hi ${user.first_name}! 
Welcome to **ShirayukiBot**! 🤖✨
I'm a Telegram bot created by *Shirayuki* to assist you with your needs. 

📝 Here’s what you can do:
- Type /menu to see all our menu lists.
- Ask me anything, and I'll do my best to help you!

💡 **Tip:** You can explore various features by clicking the buttons below!

Let's get started! 🚀
      `;

            const replyMarkup = {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: '🛠 Script Bot',
                            url: buttonUrl
                        }],
                        [{
                            text: '📋 View Menu',
                            callback_data: 'view_menu'
                        }],
                        [{
                            text: 'ℹ️ Info Bot',
                            callback_data: 'info_bot'
                        }],
                    ],
                },
            };

            bot.sendMessage(From, caption, {
                parse_mode: 'Markdown',
                reply_to_message_id: msg.message_id,
                ...replyMarkup
            });
        });

        bot.onText(/^\/infobot$/, (msg) => {
            const From = msg.chat.id;

            const infoMessage = `
🔍 **Bot Information**
- **Name:** ShiraBot
- **Version:** Beta
- **Creator:** Shirayuki
- **Status:** This bot is currently lurking in the shadows of beta testing. Please report any bugs or eerie occurrences! 👻

✨ **Features:** 
- The features are still limited, but I’ll be conjuring new ones as time goes on. 
Thank you for your attention and support in this haunting journey!

💬 Feel free to explore and interact with the bot. Your feedback is like a guiding light in the dark!

If you have any spooky suggestions or additional features, don’t hesitate to summon me. 

Thank you for being a part of this eerie adventure! 🌈✨
      `;

            bot.sendMessage(From, infoMessage, {
                parse_mode: 'Markdown',
                reply_to_message_id: msg.message_id
            });
        });

        bot.on('callback_query', (query) => {
            const chatId = query.message.chat.id;

            if (query.data === 'info_bot') {
                const infoMessage = `
🔍 **Bot Information**
- **Name:** ShiraBot
- **Version:** Beta
- **Creator:** Shirayuki
- **Status:** This bot is currently lurking in the shadows of beta testing. Please report any bugs or eerie occurrences! 👻

✨ **Features:** 
- The features are still limited, but I’ll be conjuring new ones as time goes on. 
Thank you for your attention and support in this haunting journey!

💬 Feel free to explore and interact with the bot. Your feedback is like a guiding light in the dark!

If you have any spooky suggestions or additional features, don’t hesitate to summon me. 

Thank you for being a part of this eerie adventure! 🌈✨
        `;

                // Send the info message in response to the callback
                bot.sendMessage(chatId, infoMessage, {
                    parse_mode: 'Markdown'
                });

                // Acknowledge the callback query
                bot.answerCallbackQuery(query.id);
            }

            // Handle callback queries for View Menu
            if (query.data === 'view_menu') {
                const menuMessage = `
🍽️ **Menu** 🍽️
Welcome to the enchanted menu of **ShirayukiBot**! Here’s what awaits you, what can this bot do?

1️⃣ **Main Info**: Only the main feature of this bot because I haven't added anything here
2️⃣ **Downloader**: This downloader has more or less the ability to download from the TikTok, Douyin, Terabox, etc. platforms and also has an AIO (All In One) feature
3️⃣ **OpenAi**: I just added features from OpenAi, maybe next time I will add some more features
4️⃣ **Misc**: For other features, you can try it yourself. If there are not enough features, I'm sorry because I don't have much time to make all of this.

Thank you for using this bot and also thanks to the creator of this bot base✨
        `;

                // Send the menu message in response to the callback
                bot.sendMessage(chatId, menuMessage, {
                    parse_mode: 'Markdown'
                });

                // Acknowledge the callback query
                bot.answerCallbackQuery(query.id);
            }
        });
    }
};

module.exports = plugin;