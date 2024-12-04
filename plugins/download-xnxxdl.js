const fetch = require('node-fetch');

const plugin = {
    commands: ['/xnxxdl'],
    tags: ['download'],
    init: async (bot, { buttonUrl, apikey }) => {

        // Fitur untuk downloader xnxxdl
        bot.onText(/^\/xnxxdl (.+)$/, async (msg, match) => {
            const chatId = msg.chat.id;
            const inputUrl = match[1];

            if (!inputUrl) {
                bot.sendMessage(chatId, '🔗 Silakan masukkan tautan video dari XNXX yang valid! Contoh: /xnxxdl https://www.xnxx.com/video-y3pklda/jav_short_secretary_satisfies_her_boss', { reply_to_message_id: msg.message_id });
                return;
            }

            bot.sendMessage(chatId, '⏳ Sedang memproses permintaan Anda, harap tunggu...', { reply_to_message_id: msg.message_id });

            try {
                const apiUrl = `https://api.betabotz.eu.org/api/download/xnxxdl?url=${encodeURIComponent(inputUrl)}&apikey=${apikey}`;
                const response = await fetch(apiUrl);
                const data = await response.json();

                console.log('API Response:', data); // Log respons API untuk debugging

                if (data.status && data.result) {
                    const { title, quality, views, thumb, url } = data.result;

                    const caption = `🎥 *Judul:* ${title || 'Tidak ada judul'}\n*Quality:* ${quality.trim()}\n*Views:* ${views}\n\n🖼️ *Thumbnail:* ${thumb}\n\n🔗 *Download URL:* [Klik di sini](${url})`;
                    bot.sendMessage(chatId, caption, { parse_mode: 'Markdown', reply_to_message_id: msg.message_id });
                } else {
                    bot.sendMessage(chatId, '❌ Tidak ada video yang ditemukan. Silakan coba lagi.', { reply_to_message_id: msg.message_id });
                }

            } catch (error) {
                console.error('Error:', error);
                bot.sendMessage(chatId, '❌ Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.', { reply_to_message_id: msg.message_id });
            }
        });
    },
};

module.exports = plugin;