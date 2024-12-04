const fetch = require('node-fetch');

const plugin = {
    commands: ['/capcutdl'],
    tags: ['download'],
    init: async (bot, {
        buttonUrl,
        mess,
        apikey
    }) => {
        bot.onText(/^\/capcutdl(?: (.+))?$/, async (msg, match) => {
            const chatId = msg.chat.id;
            const inputText = match[1];
            if (!inputText) {
                bot.sendMessage(chatId, '❗Input your link example\n/capcutdl https://www.capcut.com/template-detail/7273798219329441025?template_id=7273798219329441025&share_token=1ea9b68c-aa1b-4fc4-86c2-bf2b9136b6e0&enter_from=template_detail&region=ID&language=in&platform=copy_link&is_copy_link=1', {
                    reply_to_message_id: msg.message_id
                });
                return;
            }
            bot.sendMessage(chatId, mess.wait, {
                reply_to_message_id: msg.message_id
            });
            try {

                const apiUrl = `https://api.betabotz.eu.org/api/download/capcut?url=${encodeURIComponent(inputText)}&apikey=${apikey}`;
                const mek = await apiUrl.json();

                // Destructure the properties correctly
                const {
                    video: video_ori,
                    title
                } = mek.result;
                const ongner = mek.result.owner;
                const caption = `*Title:* ${title}\n*Owner:* ${ongner}\n`;
                const replyMarkup = {
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: 'Script Bot',
                                url: buttonUrl
                            }],
                        ],
                    },
                };

                bot.sendVideo(chatId, video_ori, {
                    caption: caption,
                    reply_to_message_id: msg.message_id,
                    ...replyMarkup
                });

                bot.sendMessage(chatId, `✅ Download succes`, {
                    reply_to_message_id: msg.message_id
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