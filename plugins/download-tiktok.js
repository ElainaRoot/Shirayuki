const fetch = require('node-fetch');

const plugin = {
    commands: ['/tiktok'],
    tags: ['download'],
    init: async (bot, {
        buttonUrl,
        mess,
        api,
        apikey
    }) => {
        bot.onText(/^\/tiktok(?: (.+))?$/, async (msg, match) => {
            const chatId = msg.chat.id;
            const inputText = match[1];
            if (!inputText) {
                bot.sendMessage(chatId, '❗Input your link example \n/tiktok https://vm.tiktok.com/ZGJAmhSrp/', {
                    reply_to_message_id: msg.message_id
                });
                return;
            }
            bot.sendMessage(chatId, mess.wait, {
                reply_to_message_id: msg.message_id
            });
            try {
                const apis = await fetch(api + '/api/download/tiktok?apikey=' + apikey + '&url=' + encodeURIComponent(inputText));
                const res = await apis.json();

                // Destructure the properties directly from res.result
                const {
                    title,
                    duration,
                    total_share,
                    total_download,
                    total_play,
                    total_comment,
                    video,
                    audio
                } = res.result;

                const nowm = video[0];
                const audioUrl = audio[0];
                const caption = `*Deskripsi:* *${title}*\n*Durasi:* ${duration}\n*Total Share:* ${total_share}\n*Total Download:* ${total_download}\n*Total Play:* ${total_play}\n*Total Komentar:* ${total_comment}\n*Audio:* [Audio](${audioUrl})`;
                const replyMarkup = {
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: 'Script Bot',
                                url: buttonUrl
                            }],
                            [{
                                text: 'Audio',
                                url: audioUrl
                            }],
                        ],
                    },
                };

                bot.sendVideo(chatId, nowm, {
                    caption: caption,
                    parse_mode: 'Markdown',
                    reply_to_message_id: msg.message_id,
                    ...replyMarkup
                });
            } catch (error) {
                console.error('Error:', error);
                bot.sendMessage(chatId, 'An error occurred while processing your request.', {
                    reply_to_message_id: msg.message_id
                });
            }
        });
    },
};

module.exports = plugin;