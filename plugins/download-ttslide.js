const fetch = require('node-fetch');

const plugin = {
    commands: ['/ttslidedl'],
    tags: ['download'],
    init: async (bot, {
        buttonUrl,
        mess,
        apikey
    }) => {

        bot.onText(/^\/ttslidedl(?: (.+))?$/, async (msg, match) => {
            const chatId = msg.chat.id;
            const inputText = match[1];
            if (!inputText) {
                bot.sendMessage(chatId, '🔗 Input link example:\n/ttslidedl https://vt.tiktok.com/ZSjTuHT4r/', {
                    reply_to_message_id: msg.message_id
                });
                return;
            }
            bot.sendMessage(chatId, '⏳ Your request is being processed, please wait...', {
                reply_to_message_id: msg.message_id
            });
            try {
                const apiUrl = `https://api.betabotz.eu.org/api/download/ttslide?url=${encodeURIComponent(inputText)}&apikey=${apikey}`;
                const response = await fetch(apiUrl);
                const res = await response.json();

                if (!res.status) {
                    bot.sendMessage(chatId, '❌ An error occurred while processing your request. Please try again.', {
                        reply_to_message_id: msg.message_id
                    });
                    return;
                }

                const {
                    title,
                    images,
                    audio,
                    thumbnail
                } = res.result;
                const audioUrl = audio[0];

                const caption = `🖼️ *Title:* *${title}*\n\n🎵 *Audio:* [Download Audio](${audioUrl})`;
                const replyMarkup = {
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: 'Script Bot',
                                url: buttonUrl
                            }],
                            [{
                                text: 'Download Audio',
                                url: audioUrl
                            }],
                        ],
                    },
                };

                await bot.sendPhoto(chatId, thumbnail, {
                    caption: caption,
                    parse_mode: 'Markdown',
                    reply_to_message_id: msg.message_id,
                    ...replyMarkup
                });

                // Send images in batches of three
                for (let i = 0; i < images.length; i += 3) {
                    const imageBatch = images.slice(i, i + 3);
                    const batchCaption = `📸 Here are images ${i + 1} to ${Math.min(i + 3, images.length)} from the slide:`;

                    await bot.sendMediaGroup(chatId, imageBatch.map(url => ({
                        type: 'photo',
                        media: url
                    })), {
                        caption: batchCaption
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