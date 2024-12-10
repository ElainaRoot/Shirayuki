const fetch = require('node-fetch');

const plugin = {
    commands: ['/ytmp4dl2', '/ytmp3dl2'],
    tags: ['download'],
    init: async (bot, { buttonUrl, mess, apikey }) => {
        const maxDescriptionLength = 150; // Batasi panjang deskripsi

        bot.onText(/^\/ytmp4dl2(?: (.+))?$/, async (msg, match) => {
            const chatId = msg.chat.id;
            const inputText = match[1];

            if (!inputText) {
                bot.sendMessage(chatId, '🔗 Input your YouTube video link\n/ytmp4dl2 https://youtu.be/6l5V3BWDcMw', {
                    reply_to_message_id: msg.message_id
                });
                return;
            }

            bot.sendMessage(chatId, '⏳ Your request is being processed, please wait...', {
                reply_to_message_id: msg.message_id
            });

            try {
                const apiUrl = `https://api.betabotz.eu.org/api/download/yt?url=${encodeURIComponent(inputText)}&apikey=${apikey}`;
                const response = await fetch(apiUrl);
                const res = await response.json();

                if (res.status) {
                    const { title, description, thumb, duration, mp3, mp4, id } = res.result;

                    // Potong deskripsi jika terlalu panjang
                    let truncatedDescription = description;
                    if (description.length > maxDescriptionLength) {
                        truncatedDescription = description.substring(0, maxDescriptionLength) + '...'; // Tambahkan ellipsis
                    }

                    await bot.sendPhoto(chatId, thumb, {
                        caption: `🪪 *ID:* ${id}\n🎥 *Title:* *${title}*\n📝 *Description:* ${truncatedDescription}\n⏳ *Duration:* ${duration} seconds\n\n🎵 *Download MP3:* [Download Here](${mp3})`,
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

        bot.onText(/^\/ytmp3dl2(?: (.+))?$/, async (msg, match) => {
            const chatId = msg.chat.id;
            const inputText = match[1];

            if (!inputText) {
                bot.sendMessage(chatId, '🔗 Input your YouTube video link\n/ytmp3dl2 https://youtu.be/6l5V3BWDcMw', {
                    reply_to_message_id: msg.message_id
                });
                return;
            }

            bot.sendMessage(chatId, '⏳ Your request is being processed, please wait...', {
                reply_to_message_id: msg.message_id
            });

            try {
                const apiUrl = `https://api.betabotz.eu.org/api/download/yt?url=${encodeURIComponent(inputText)}&apikey=${apikey}`;
                const response = await fetch(apiUrl);
                const res = await response.json();

                if (res.status) {
                    const { title, description, thumb, duration, mp3, mp4, id } = res.result;

                    // Potong deskripsi jika terlalu panjang
                    let truncatedDescription = description;
                    if (description.length > maxDescriptionLength) {
                        truncatedDescription = description.substring(0, maxDescriptionLength) + '...'; // Tambahkan ellipsis
                    }

                    await bot.sendPhoto(chatId, thumb, {
                        caption: `🪪 *ID:* ${id}\n🎵 *Title:* *${title}*\n📝 *Description:* ${truncatedDescription}\n⏳ *Duration:* ${duration} seconds\n\n🎵 *Download MP4:* [Download Here](${mp4})`,
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