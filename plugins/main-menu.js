const plugin = {
    commands: ['/menu'],
    tags: ['info', 'main'],
    init: (bot, {
        loadedPlugins,
        buttonUrl,
        imageUrl
    }) => {
        const Start = new Date();

        bot.onText(/^\/menu$/, async (msg) => {
            const chatId = msg.chat.id;
            const now = new Date();
            const uptimeMilliseconds = now - Start;
            const uptimeSeconds = Math.floor(uptimeMilliseconds / 1000);
            const uptimeMinutes = Math.floor(uptimeSeconds / 60);
            const uptimeHours = Math.floor(uptimeMinutes / 60);

            let menuText = `Hi ${msg.from.username || 'User'}\nI am an automated system (Telegram Bot) which will help you every day.\n\n`;
            menuText += `┌  ◦ Uptime: ${uptimeHours} hours ${uptimeMinutes % 60} minutes ${uptimeSeconds % 60} seconds\n`;
            menuText += `│  ◦ Library: Telegraf\n`;
            menuText += `│  ◦ Hari: ${getDayName(now.getDay())}\n`;
            menuText += `│  ◦ Waktu: ${now.toLocaleTimeString()}\n`;
            menuText += `│  ◦ Tanggal: ${now.toLocaleDateString()}\n`;
            menuText += `│  ◦ Version: 0.0.1\n`;
            menuText += `└\n\n`;

            const tagsAndCommands = {};

            loadedPlugins.forEach((plugin) => {
                const tag = escapeMarkdownV2(plugin.tags[0]); // Escape tag
                if (!tagsAndCommands[tag]) {
                    tagsAndCommands[tag] = [];
                }
                plugin.commands.forEach(command => {
                    tagsAndCommands[tag].push(escapeMarkdownV2(command)); // Escape command
                });
            });

            Object.entries(tagsAndCommands).forEach(([tag, commands]) => {
                menuText += `┌  ◦ *${escapeMarkdownV2(tag)}*\n`; // Escape tag, tetapi tidak tanda bintang
                commands.forEach((command) => {
                    menuText += `│  ◦ ${escapeMarkdownV2(command)}\n`; // Escape command
                });
                menuText += `└\n`;
            });

            // Escape menuText before sending
            menuText = escapeMarkdownV2(menuText);

            try {
                const sentMessage = await bot.sendPhoto(chatId, imageUrl, {
                    caption: menuText,
                    parse_mode: 'MarkdownV2', // Menggunakan MarkdownV2
                    reply_to_message_id: msg.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: 'Script Bot',
                                url: buttonUrl
                            }],
                        ],
                    },
                });

            } catch (error) {
                console.error('Error sending menu:', error);
                bot.sendMessage(chatId, 'Error sending menu. Please try again later.', {
                    reply_to_message_id: msg.message_id
                });
            }
        });
    },
};

function escapeMarkdownV2(text) {
    return text.replace(/([_[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

function getDayName(dayIndex) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
}

module.exports = plugin;