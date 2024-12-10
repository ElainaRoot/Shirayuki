const fetch = require('node-fetch');

const plugin = {
    commands: ['/animestatus'],
    tags: ['download'],
    init: async (bot, {
        buttonUrl,
        mess,
        apikey
    }) => {

        const typingTimeout = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

        bot.onText(/^\/animestatus$/, async (msg) => {
            const chatId = msg.chat.id;

            bot.sendChatAction(chatId, 'typing');
            await typingTimeout(2000);

            const waitingMessage = await bot.sendMessage(chatId, mess.wait, {
                reply_to_message_id: msg.message_id
            });

            try {
                const apiUrl = `https://api.betabotz.eu.org/api/download/storyanime?apikey=${apikey}`;
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const mek = await response.json();
                if (!mek.status) {
                    throw new Error('Invalid API response');
                }

                const {
                    url: videoUrl,
                    title
                } = mek.result;

                const caption = `✅ Succes download video...`;
                const replyMarkup = {
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: 'Script Bot',
                                url: buttonUrl
                            }]
                        ],
                    },
                };

                await bot.sendVideo(chatId, videoUrl, {
                    caption: caption,
                    reply_to_message_id: msg.message_id,
                    ...replyMarkup
                });

                await bot.deleteMessage(chatId, waitingMessage.message_id);
            } catch (error) {
                console.error('Error:', error);
                bot.sendMessage(chatId, 'An error occurred while processing your request.', {
                    reply_to_message_id: msg.message_id
                });

                await bot.deleteMessage(chatId, waitingMessage.message_id);
            }
        });
    },
};

module.exports = plugin;