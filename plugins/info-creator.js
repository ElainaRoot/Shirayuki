const fs = require('fs');
const path = require('path');

const plugin = {
    commands: ['/owner'],
    tags: ['info', 'music'],
    init: (bot, {
        ownerName = 'Bot Owner',
        ownerNumber = 'Not Provided'
    }) => {
        const escapeHTML = (text) => {
            if (typeof text !== 'string') {
                text = String(text || '');
            }
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        };

        bot.onText(/^\/owner$/, async (msg) => {
            const chatId = msg.chat.id;
            const escapedOwnerName = escapeHTML(ownerName || 'Unknown Owner');
            const escapedOwnerNumber = escapeHTML(ownerNumber || 'Not Provided');
            const escapedUserName = escapeHTML(msg.from.first_name || 'User');

            const caption = `👋 Hello <b>${escapedUserName}</b>!\n\n──────────\n💡 <b>Owner Information</b>:\n\n🧑‍💻 <b>Name</b>: ${escapedOwnerName}\n📞 <b>Contact</b>: ${escapedOwnerNumber}\n\n──────────\n💬 <i>Feel free to reach out if you need assistance!</i>\n\n✨ Powered by <b>@Shirayuki05_bot</b>`;

            const dirPath = 'lib/music';

            try {
                const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.mp3'));

                if (files.length === 0) {
                    await bot.sendMessage(chatId, '❌ No music files found.');
                    return;
                }
                const randomFile = files[Math.floor(Math.random() * files.length)];
                const filePath = path.join(dirPath, randomFile);

                const sentMessage = await bot.sendMessage(chatId, caption, {
                    parse_mode: 'HTML',
                    reply_to_message_id: msg.message_id,
                });
                console.log('Message sent successfully.');

                bot.sendChatAction(chatId, 'record_voice');
                await bot.sendVoice(chatId, fs.createReadStream(filePath), {
                    caption: '🎵 Enjoy the music!',
                    reply_to_message_id: sentMessage.message_id,
                });
                console.log('Voice note sent successfully.');
            } catch (error) {
                console.error('Error:', error.message);
                await bot.sendMessage(chatId, '❌ Terjadi kesalahan saat mengirim informasi atau musik.');
            }
        });
    },
};

module.exports = plugin;