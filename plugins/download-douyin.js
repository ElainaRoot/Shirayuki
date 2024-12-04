const fetch = require('node-fetch');

const plugin = {
  commands: ['/douyin'],
  tags: ['download'],
  init: async (bot, { buttonUrl, mess, apikey }) => {

    // Fitur untuk Douyin
    bot.onText(/^\/douyin(?: (.+))?$/, async (msg, match) => {
      const chatId = msg.chat.id;
      const inputText = match[1];
      if (!inputText) {
        bot.sendMessage(chatId, '🔗 Silakan masukkan tautan Douyin yang valid! Contoh: /douyin https://v.douyin.com/ikq8axJ/', { reply_to_message_id: msg.message_id });
        return;
      }
      bot.sendMessage(chatId, '⏳ Sedang memproses permintaan Anda, harap tunggu...', { reply_to_message_id: msg.message_id });
      try {
        const apiUrl = `https://api.betabotz.eu.org/api/download/douyin?url=${encodeURIComponent(inputText)}&apikey=${apikey}`;
        const apis = await fetch(apiUrl);
        const res = await apis.json();

        const { title, video, audio } = res.result;
        const videoUrl = video[0];
        const audioUrl = audio[0];

        const caption = `🎥 *Deskripsi:* *${title}*\n\n*Note:* reply anything to me to get sound\n🎵 *Audio:* [Download Audio](${audioUrl})`;
        const replyMarkup = {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Script Bot', url: buttonUrl }],
              [{ text: 'Download Audio', url: audioUrl }],
            ],
          },
        };

        const sentMessage = await bot.sendVideo(chatId, videoUrl, { caption: caption, parse_mode: 'Markdown', reply_to_message_id: msg.message_id, ...replyMarkup });

        bot.onReplyToMessage(chatId, sentMessage.message_id, (replyMsg) => {
          bot.sendAudio(chatId, audioUrl, { reply_to_message_id: replyMsg.message_id });
        });

      } catch (error) {
        console.error('Error:', error);
        bot.sendMessage(chatId, '❌ Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.', { reply_to_message_id: msg.message_id });
      }
    });    
  },
};

module.exports = plugin;