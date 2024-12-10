const fetch = require('node-fetch');

const plugin = {
    commands: ['/pinterestdl'],
    tags: ['download'],
    init: async (bot, {
        buttonUrl,
        mess,
        apikey
    }) => {
        bot.onText(/^\/pinterestdl(?: (.+))?$/, async (msg, match) => {
            const chatId = msg.chat.id;
            const inputText = match[1];

            if (!inputText) {
                bot.sendMessage(chatId, '🔗 Input your Pinterest link\n/pinterestdl https://pin.it/4CVodSq', {
                    reply_to_message_id: msg.message_id
                });
                return;
            }

            bot.sendMessage(chatId, '⏳ Your request is being processed, please wait...', {
                reply_to_message_id: msg.message_id
            });

            try {
                const apiUrl = `https://api.betabotz.eu.org/api/download/pinterest?url=${encodeURIComponent(inputText)}&apikey=${apikey}`;
                const response = await fetch(apiUrl);
                const res = await response.json();

                if (res.result.success) {
                    const {
                        image,
                        title
                    } = res.result.data || {
                        image: null,
                        title: "No title available"
                    };

                    const caption = `📌 *Title:* *${title}*\n*Image URL:* [View Image](${inputText})`;

                    if (image) {
                        await bot.sendPhoto(chatId, image, {
                            caption: caption,
                            parse_mode: 'Markdown',
                            reply_to_message_id: msg.message_id,
                        });
                    } else {
                        bot.sendMessage(chatId, '❌ No image found for the provided link.', {
                            reply_to_message_id: msg.message_id
                        });
                    }
                } else {
                    bot.sendMessage(chatId, '❌ An error occurred: ' + res.result.message, {
                        reply_to_message_id: msg.message_id
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                bot.sendMessage(chatId, '❌ An error occurred while processing your request. Please try again.', {
                    reply_to_message_id: msg.message_id
                });
            }
        });
    },
};

module.exports = plugin;