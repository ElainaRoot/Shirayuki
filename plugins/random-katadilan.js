const fetch = require('node-fetch');

const plugin = {
    commands: ['/katadilan'],
    tags: ['random'],
    init: async (bot, { buttonUrl, apikey }) => {

        bot.onText(/^\/katadilan$/, async (msg) => {
            const chatId = msg.chat.id;

            bot.sendMessage(chatId, '⏳ Sedang mengambil kutipan, harap tunggu...', { reply_to_message_id: msg.message_id });

            try {
                const apiUrl = `https://api.betabotz.eu.org/api/random/katadilan?apikey=${apikey}`;
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data && data.dilan) {
                    const caption = `📝 *Kutipan Dilan:*\n\n"${data.dilan}"\n\n*By:* Shirayuki`;
                    bot.sendMessage(chatId, caption, { parse_mode: 'Markdown', reply_to_message_id: msg.message_id });
                } else {
                    bot.sendMessage(chatId, '❌ Tidak ada kutipan yang ditemukan. Silakan coba lagi.', { reply_to_message_id: msg.message_id });
                }

            } catch (error) {
                console.error('Error:', error);
                bot.sendMessage(chatId, '❌ Terjadi kesalahan saat mengambil kutipan. Silakan coba lagi.', { reply_to_message_id: msg.message_id });
            }
        });    
    },
};

module.exports = plugin;