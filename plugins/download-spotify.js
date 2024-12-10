const fetch = require('node-fetch');

const plugin = {
    commands: ['/spotifydl'],
    tags: ['download'],
    init: async (bot, {
        buttonUrl,
        mess,
        apikey
    }) => {
        bot.onText(/^\/spotifydl(?: (.+))?$/, async (msg, match) => {
            const chatId = msg.chat.id;
            const inputText = match[1];
            if (!inputText) {
                bot.sendMessage(chatId, '🔗 Input ur spotify track link\n/spotifydl https://open.spotify.com/track/3zakx7RAwdkUQlOoQ7SJRt/', {
                    reply_to_message_id: msg.message_id
                });
                return;
            }
            bot.sendMessage(chatId, '⏳ Your request is being processed, please wait...', {
                reply_to_message_id: msg.message_id
            });
            try {
                const apiUrl = `https://api.betabotz.eu.org/api/download/spotify?url=${encodeURIComponent(inputText)}&apikey=${apikey}`;
                const response = await fetch(apiUrl);
                const res = await response.json();

                if (res.status) {
                    const { title, artist, duration, thumbnail, url } = res.result.data;
                    const caption = `🎵 *Title:* *${title}*\n*Artist:* [${artist.name}](${artist.external_urls.spotify})\n*Duration:* ${duration}\n*Download Link:* [Download MP3](${url})`;

                    await bot.sendPhoto(chatId, thumbnail, {
                        caption: caption,
                        parse_mode: 'Markdown',
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