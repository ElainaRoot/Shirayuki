const fetch = require('node-fetch');

const plugin = {
    commands: ['/aio1'],
    tags: ['download'],
    init: async (bot, {
        buttonUrl,
        mess,
        apikey
    }) => {
        bot.onText(/^\/aio1(?: (.+))?$/, async (msg, match) => {
            const chatId = msg.chat.id;
            const inputText = match[1];

            if (!inputText) {
                bot.sendMessage(chatId, '❗Input your link almost supports all platforms example\n/aio1 https://music.youtube.com/watch?v=hfeEEonVN-c&si=nzec7OLGHaBMqQNa', {
                    reply_to_message_id: msg.message_id
                });
                return;
            }

            // Mengirim pesan loading pertama
            const loadingMessage = await bot.sendMessage(chatId, mess.wait, {
                reply_to_message_id: msg.message_id
            });

            const loadingTexts = [
                'Mencari...',
                'Mengunduh...',
                'Menyiapkan video...'
            ];

            // Menampilkan animasi loading
            for (let i = 0; i < loadingTexts.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Delay 1 detik
                bot.editMessageText(loadingTexts[i], {
                    chat_id: chatId,
                    message_id: loadingMessage.message_id
                });
            }

            try {
                const apiUrl = `https://api.ryzendesu.vip/api/downloader/aiodown?url=${encodeURIComponent(inputText)}`;
                const response = await fetch(apiUrl);
                const mek = await response.json();

                if (mek.success && mek.quality.length > 0) {
                    // Buat daftar kualitas
                    const qualityOptions = mek.quality.map((q, index) => `${index + 1}. ${q.quality}`).join('\n');
                    
                    bot.sendMessage(chatId, `Kualitas video yang tersedia:\n${qualityOptions}\n\nSilakan pilih kualitas (1-${mek.quality.length})`, {
                        reply_to_message_id: msg.message_id
                    });

                    // Tunggu balasan dari pengguna
                    bot.onReplyToMessage(chatId, loadingMessage.message_id, async (reply) => {
                        const selectedIndex = parseInt(reply.text) - 1;

                        if (selectedIndex >= 0 && selectedIndex < mek.quality.length) {
                            const selectedQuality = mek.quality[selectedIndex];
                            const video_ori = selectedQuality.url;

                            // Cek apakah video_ori adalah URL yang valid
                            const urlResponse = await fetch(video_ori);
                            if (!urlResponse.ok) {
                                return bot.sendMessage(chatId, 'Video URL tidak dapat diakses.', {
                                    reply_to_message_id: msg.message_id
                                });
                            }

                            const caption = `*Quality: ${selectedQuality.quality}*`;
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

                            // Kirim video dengan caption
                            bot.sendVideo(chatId, video_ori, {
                                caption: caption,
                                reply_to_message_id: msg.message_id,
                                ...replyMarkup,
                                parse_mode: 'Markdown'
                            });

                            return bot.sendMessage(chatId, `✅ Download successful`, {
                                reply_to_message_id: msg.message_id
                            });
                        } else {
                            bot.sendMessage(chatId, 'Pilihan tidak valid. Silakan coba lagi.', {
                                reply_to_message_id: msg.message_id
                            });
                        }
                    });
                } else {
                    bot.sendMessage(chatId, 'No video found or an error occurred.', {
                        reply_to_message_id: msg.message_id
                    });
                }
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