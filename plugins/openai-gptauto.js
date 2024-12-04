const fetch = require('node-fetch');

const plugin = {
  commands: ['/shira2 on/off'],
  tags: ['openai'],
  init: async (bot, { api, apikey }) => {
    
    // Menyimpan status obrolan untuk setiap pengguna
    const chatStatus = {};
    const conversationHistory = {};

    // Fitur untuk mengaktifkan dan menonaktifkan obrolan
    bot.onText(/^\/(shira2|shira|chatgpt|assist) (on|off)$/, async (msg, match) => {
      const chatId = msg.chat.id;
      const action = match[2]; // Mengambil aksi (on/off) dari match
      const command = match[1]; // Mengambil perintah yang digunakan

      if (action === 'on') {
        chatStatus[chatId] = true;
        conversationHistory[chatId] = [];
        bot.sendMessage(chatId, `🤖 Mode obrolan aktif. Anda sekarang dapat mulai bercakap-cakap dengan Shira. Ketik /${command} off untuk menonaktifkannya.`);
      } else {
        chatStatus[chatId] = false;
        delete conversationHistory[chatId]; // Hapus riwayat percakapan saat dimatikan
        bot.sendMessage(chatId, `❌ Mode obrolan dinonaktifkan. Ketik /${command} on untuk mengaktifkannya lagi.`);
      }
    });

    bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      if (chatStatus[chatId]) {
        const inputText = msg.text;
        if (!inputText || inputText.startsWith('/')) return; // Abaikan perintah

        // Tambahkan pesan pengguna ke riwayat
        if (!conversationHistory[chatId]) {
          conversationHistory[chatId] = [];
        }
        conversationHistory[chatId].push(`${inputText}`);

        try {
          const latestUserInput = inputText;
          const chatgptUrl = `https://api.ryzendesu.vip/api/ai/v2/chatgpt?text=${encodeURIComponent(latestUserInput)}&prompt=bro`;
          const response = await fetch(chatgptUrl);
          const json = await response.json();

          if (json.action === "success") {
            const gptResponse = json.response;
            // Pastikan karakter khusus ditangani dengan benar
            bot.sendMessage(chatId, gptResponse, { parse_mode: 'Markdown' });
            conversationHistory[chatId].push(`${gptResponse}`);
          } else {
            bot.sendMessage(chatId, '❌ Gagal mendapatkan respons dari ChatGPT. Silakan coba lagi.');
          }

        } catch (error) {
          console.error('Error:', error);
          bot.sendMessage(chatId, '❌ Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.');
        }
      }
    });
  },
};

module.exports = plugin;