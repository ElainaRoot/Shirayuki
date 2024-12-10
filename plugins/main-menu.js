const fs = require('fs');

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

            let menuText = `✨ *Hi, ${msg.from.username || 'User'}!* ✨\n`;
            menuText += `🤖 *I am your friendly Telegram Bot, here to assist you every day!* 🤝\n\n`;

            menuText += `🛠️ *Bot Info*\n`;
            menuText += `├ 📅 *Date*: ${now.toLocaleDateString()}\n`;
            menuText += `├ 🕒 *Time*: ${now.toLocaleTimeString()}\n`;
            menuText += `├ 📆 *Day*: ${getDayName(now.getDay())}\n`;
            menuText += `├ 🛡️ *Uptime*: ${uptimeHours} hours, ${uptimeMinutes % 60} minutes, ${uptimeSeconds % 60} seconds\n`;
            menuText += `├ 📚 *Library*: telegram-bot-api\n`;
            menuText += `└ 🛠️ *Version*: Beta_1.0\n\n`;

            const tagsAndCommands = {};

            loadedPlugins.forEach((plugin) => {
                const tag = escapeMarkdownV2(plugin.tags[0]);
                if (!tagsAndCommands[tag]) {
                    tagsAndCommands[tag] = [];
                }
                plugin.commands.forEach(command => {
                    tagsAndCommands[tag].push(escapeMarkdownV2(command));
                });
            });

            Object.entries(tagsAndCommands).forEach(([tag, commands]) => {
                menuText += `╭──────────────╮\n`;
                menuText += `│  ✨ ${escapeMarkdownV2(tag)} ✨ │\n`;
                menuText += `╰──────────────╯\n`;
                commands.forEach((command) => {
                    menuText += `   ↪ ${escapeMarkdownV2(command)}\n`;
                });
                menuText += `\n`;
            });

            menuText = escapeMarkdownV2(menuText);
            try {
                const sentMessage = await bot.sendPhoto(chatId, imageUrl, {
                    caption: menuText,
                    parse_mode: 'MarkdownV2',
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

                const voiceFilePath = 'lib/music/1.mp3';
                if (fs.existsSync(voiceFilePath)) {
                    await bot.sendVoice(chatId, fs.createReadStream(voiceFilePath), {
                        caption: 'enjoy with this bot✨',
                        reply_to_message_id: sentMessage.message_id,
                    });
                } else {
                    console.error('Voice file not found.');
                    await bot.sendMessage(chatId, '❌ Voice file not found.');
                }

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