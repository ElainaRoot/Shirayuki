const fetch = require('node-fetch');

const plugin = {
    commands: ['/capcutdl'],
    tags: ['download'],
    init: async (bot, {
        buttonUrl,
        mess,
        apikey
    }) => {
        const typingTimeout = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

        bot.onText(/^\/capcutdl(?: (.+))?$/, async (msg, match) => {
            const chatId = msg.chat.id;
            const inputText = match[1];

            if (!inputText) {
                return bot.sendMessage(chatId, '❗Input ur link example\n/capcutdl https://www.capcut.com/template-detail/7273798219329441025?template_id=7273798219329441025&share_token=1ea9b68c-aa1b-4fc4-86c2-bf2b9136b6e0&enter_from=template_detail&region=ID&language=in&platform=copy_link&is_copy_link=1', {
                    reply_to_message_id: msg.message_id
                });
            }

            await bot.sendChatAction(chatId, 'typing');
            await typingTimeout(2000);

            const waitingMessage = await bot.sendMessage(chatId, mess.wait, {
                reply_to_message_id: msg.message_id
            });

            try {
                const apiUrl = `https://api.betabotz.eu.org/api/download/capcut?url=${encodeURIComponent(inputText)}&apikey=${apikey}`;
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const {
                    result: {
                        video: video_ori,
                        title,
                        owner
                    }
                } = await response.json();
                const caption = `*Title:* ${title}\n*Owner:* ${owner}\n`;
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

                await bot.sendVideo(chatId, video_ori, {
                    caption: caption,
                    reply_to_message_id: msg.message_id,
                    ...replyMarkup
                });

                await bot.sendMessage(chatId, `✅ Download success`, {
                    reply_to_message_id: msg.message_id
                });
                await bot.deleteMessage(chatId, waitingMessage.message_id);
            } catch (error) {
                console.error('Error:', error);
                await bot.sendMessage(chatId, 'An error occurred while processing your request.', {
                    reply_to_message_id: msg.message_id
                });
                await bot.deleteMessage(chatId, waitingMessage.message_id);
            }
        });
    },
};

module.exports = plugin;