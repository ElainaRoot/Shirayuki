const fetch = require('node-fetch');

const plugin = {
    commands: ['/tiktokdl'],
    tags: ['download'],
    init: async (bot, {
        buttonUrl,
        mess,
        apikey
    }) => {

        bot.onText(/^\/tiktokdl(?: (.+))?$/, async (msg, match) => {
            const chatId = msg.chat.id;
            const inputText = match[1];
            if (!inputText) {
                bot.sendMessage(chatId, '🔗 Input ur link\n/tiktokdl https://vt.tiktok.com/ikq8axJ/', {
                    reply_to_message_id: msg.message_id
                });
                return;
            }
            bot.sendMessage(chatId, '⏳ Your request is being processed, please wait...', {
                reply_to_message_id: msg.message_id
            });
            try {
                const apiUrl = `https://api.betabotz.eu.org/api/download/tiktok?url=${encodeURIComponent(inputText)}&apikey=${apikey}`;
                const apis = await fetch(apiUrl);
                const res = await apis.json();

                const {
                    title,
                    video,
                    audio
                } = res.result;
                const videoUrl = video[0];
                const audioUrl = audio[0];

                const caption = `🎥 *Deskripsi:* *${title}*\n\n*Note:* reply anything to me to get sound\n🎵 *Audio:* [Download Audio](${audioUrl})`;
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

                const sentMessage = await bot.sendVideo(chatId, videoUrl, {
                    caption: caption,
                    parse_mode: 'Markdown',
                    reply_to_message_id: msg.message_id,
                    ...replyMarkup
                });

                bot.onReplyToMessage(chatId, sentMessage.message_id, (replyMsg) => {
                    bot.sendAudio(chatId, audioUrl, {
                        reply_to_message_id: replyMsg.message_id
                    });
                });

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