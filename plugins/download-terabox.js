const fetch = require('node-fetch');

const plugin = {
    commands: ['/teraboxdl'],
    tags: ['download'],
    init: async (bot, {
        mess,
        apikey
    }) => {

        const typingTimeout = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

        bot.onText(/^\/teraboxdl(?: (.+))?$/, async (msg, match) => {
            const chatId = msg.chat.id;
            const inputText = match[1];

            if (!inputText) {
                bot.sendMessage(chatId, '❗Input ur Terabox link example\n/teraboxdl https://www.terabox.app/wap/share/filelist?surl=ZsxiFVgudFvU8tJxKJ9YZA', {
                    reply_to_message_id: msg.message_id
                });
                return;
            }

            bot.sendChatAction(chatId, 'typing');
            await typingTimeout(2000);

            const waitingMessage = await bot.sendMessage(chatId, mess.wait, {
                reply_to_message_id: msg.message_id
            });

            try {
                const apiUrl = `https://api.betabotz.eu.org/api/download/terabox?url=${encodeURIComponent(inputText)}&apikey=${apikey}`;
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const mek = await response.json();
                if (!mek.status) {
                    throw new Error('Invalid API response');
                }
                const results = mek.result;

                // Store the results in the callback data
                const callbackData = JSON.stringify(results);
                await bot.sendMessage(chatId, `📂 *Click "Select Video" to see the file list:*`, {
                    parse_mode: 'Markdown',
                    reply_to_message_id: msg.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: 'Select Video',
                                callback_data: 'SHOW_FILE_LIST'
                            }]
                        ]
                    }
                });

                bot.data = results; // Save the data in bot context for callback query

                await bot.deleteMessage(chatId, waitingMessage.message_id);
            } catch (error) {
                console.error('Error:', error);
                bot.sendMessage(chatId, 'An error occurred while processing your request.', {
                    reply_to_message_id: msg.message_id
                });

                await bot.deleteMessage(chatId, waitingMessage.message_id);
            }
        });

        bot.on('callback_query', async (callbackQuery) => {
            const chatId = callbackQuery.message.chat.id;
            const messageId = callbackQuery.message.message_id;

            if (callbackQuery.data === 'SHOW_FILE_LIST') {
                const results = bot.data; // Retrieve saved data
                const inlineKeyboard = [];
                for (const item of results) {
                    const {
                        files
                    } = item;

                    for (const file of files) {
                        const {
                            filename,
                            url
                        } = file;
                        inlineKeyboard.push([{
                            text: filename,
                            url: url
                        }]);
                    }
                }

                await bot.editMessageText(`📂 *Choose a file to download:*`, {
                    chat_id: chatId,
                    message_id: messageId,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: inlineKeyboard
                    }
                });
            }

            // Acknowledge the callback query
            bot.answerCallbackQuery(callbackQuery.id);
        });
    },
};

module.exports = plugin;