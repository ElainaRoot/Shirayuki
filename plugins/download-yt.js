const fetch = require('node-fetch');

const plugin = {
    commands: ['/ytmp4', '/ytmp3'],
    tags: ['download'],
    init: async (bot, { buttonUrl, mess, apikey }) => {
        const maxDescriptionLength = 150;

        bot.onText(/^\/ytmp4(?: (.+))?$/, async (msg, match) => {
            const chatId = msg.chat.id;
            const inputText = match[1];

            if (!inputText) {
                bot.sendMessage(chatId, '🔗 Input your YouTube video link\n/ytmp4 https://www.youtube.com/watch?v=C8mJ8943X80/', {
                    reply_to_message_id: msg.message_id
                });
                return;
            }

            bot.sendMessage(chatId, '⏳ Your request is being processed, please wait...', {
                reply_to_message_id: msg.message_id
            });

            try {
                const apiUrl = `https://api.betabotz.eu.org/api/download/ytmp4?url=${encodeURIComponent(inputText)}&apikey=${apikey}`;
                const response = await fetch(apiUrl);
                const res = await response.json();

                if (res.status) {
                    const { title, description, thumb, duration, mp3, mp4 } = res.result;

                    let truncatedDescription = description;
                    if (description.length > maxDescriptionLength) {
                        truncatedDescription = description.substring(0, maxDescriptionLength) + '...';
                    }

                    await bot.sendPhoto(chatId, thumb, {
                        caption: `🎥 *Title:* *${title}*\n📝 *Description:* ${truncatedDescription}\n⏳ *Duration:* ${duration} seconds\n\n🎵 *Download MP3:* [Download Here](${mp3})`,
                        parse_mode: 'Markdown',
                        reply_to_message_id: msg.message_id,
                    });

                    await bot.sendVideo(chatId, mp4, {
                        reply_to_message_id: msg.message_id,
                    });
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

        bot.onText(/^\/ytmp3(?: (.+))?$/, async (msg, match) => {
            const chatId = msg.chat.id;
            const inputText = match[1];

            if (!inputText) {
                bot.sendMessage(chatId, '🔗 Input your YouTube video link\n/ytmp3 https://www.youtube.com/watch?v=C8mJ8943X80/', {
                    reply_to_message_id: msg.message_id
                });
                return;
            }

            bot.sendMessage(chatId, '⏳ Your request is being processed, please wait...', {
                reply_to_message_id: msg.message_id
            });

            try {
                const apiUrl = `https://api.betabotz.eu.org/api/download/ytmp3?url=${encodeURIComponent(inputText)}&apikey=${apikey}`;
                const response = await fetch(apiUrl);
                const res = await response.json();

                if (res.status) {
                    const { title, description, thumb, duration, mp3 } = res.result;

                    let truncatedDescription = description;
                    if (description.length > maxDescriptionLength) {
                        truncatedDescription = description.substring(0, maxDescriptionLength) + '...';
                    }

                    await bot.sendPhoto(chatId, thumb, {
                        caption: `🎵 *Title:* *${title}*\n📝 *Description:* ${truncatedDescription}\n⏳ *Duration:* ${duration} seconds\n\n🎵 *Download MP3:* [Download Here](${mp3})`,
                        parse_mode: 'Markdown',
                        reply_to_message_id: msg.message_id,
                    });

                    await bot.sendAudio(chatId, mp3, {
                        reply_to_message_id: msg.message_id,
                    });
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