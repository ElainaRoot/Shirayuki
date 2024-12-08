const fetch = require('node-fetch');

const plugin = {
    commands: ['/aio'],
    tags: ['download'],
    init: async (bot, { buttonUrl, mess, apikey }) => {
        bot.onText(/^\/aio(?: (.+))?$/, async (msg, match) => {
            const chatId = msg.chat.id;
            const inputText = match[1];

            if (!inputText) {
                bot.sendMessage(chatId, `❗Input ur url like YouTube, Twitter, Facebook, dll.\n\n*Example:* /aio1 https://fb.watch/mcx9K6cb6t/?mibextid=8103lRmnirLUhozF`, {
                    reply_to_message_id: msg.message_id
                });
                return;
            }

            try {
                // Send loading message
                const loadingMessage = await bot.sendMessage(chatId, mess.wait, {
                    reply_to_message_id: msg.message_id
                });

                const old = new Date();
                const response = await fetch(`https://api.betabotz.eu.org/api/download/allin?url=${encodeURIComponent(inputText)}&apikey=${apikey}`);
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const res = data.result.medias.map(({ url }) => url);
                
                let capt = `乂 *A I O  D L* 乂\n\n`;
                capt += `◦ *🍟 Fetching* : ${((new Date - old) * 1)} ms\n`;
                capt += `\n`; 

                if (res.length > 0) {
                    for (let i = 0; i < res.length; i++) {
                        await bot.sendVideo(chatId, res[i], {
                            caption: capt,
                            reply_to_message_id: msg.message_id,
                            reply_markup: {
                                inline_keyboard: [[{
                                    text: 'Script Bot',
                                    url: buttonUrl
                                }]]
                            },
                            parse_mode: 'Markdown'
                        });
                    }
                } else {
                    bot.sendMessage(chatId, 'No media found or an error occurred.', {
                        reply_to_message_id: msg.message_id
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                bot.sendMessage(chatId, 'An error occurred while processing your request. Please try again later.', {
                    reply_to_message_id: msg.message_id
                });
            }
        });
    },
};

module.exports = plugin;