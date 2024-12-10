const fs = require('fs');

const plugin = {
    commands: [
        '/sf',
        '/purgeme',
    ],
    tags: ['owner'],
    init: (bot, {
        isOwner,
        mess
    }) => {
        const sentMessages = {};

        bot.onText(/^\/sf(?:\s+(.+))?$/, async (msg, match) => {
            if (!isOwner(msg.from.username)) {
                return bot.sendMessage(msg.chat.id, mess.owner, {
                    reply_to_message_id: msg.message_id
                });
            }

            try {
                const filename = (match[1] || '').trim();
                if (!filename) throw 'Uhm.. where is the code?\n\nUsage:\n/sf <filename>\n\nExample:\n/sf plugins/lann.js';

                const replyMessage = msg.reply_to_message;
                if (!replyMessage || !replyMessage.text) throw 'Reply to the message you want to save!';

                fs.writeFileSync(filename, replyMessage.text);

                const sentMessage = await bot.sendMessage(msg.chat.id, `Saved to ${filename}`, {
                    reply_to_message_id: msg.message_id
                });
                sentMessages[msg.chat.id] = sentMessages[msg.chat.id] || [];
                sentMessages[msg.chat.id].push(sentMessage.message_id);

            } catch (error) {
                bot.sendMessage(msg.chat.id, `Error: ${String(error)}`, {
                    reply_to_message_id: msg.message_id
                });
            }
        });

        bot.onText(/^\/purgeme(?:\s+(\d+))?$/, async (msg, match) => {
            const chatId = msg.chat.id;
            const count = match[1] ? parseInt(match[1]) : 100; // Default to 100 if count is not provided

            try {
                const userId = msg.from.id;
                const messagesToDelete = [];
                let deletedCount = 0;

                for await (const message of bot.telegram.iterMessages(chatId, {
                    limit: count
                })) {
                    if (message.from.id === userId) {
                        messagesToDelete.push(message.message_id);
                        deletedCount++;
                    }
                }

                for (const messageId of messagesToDelete) {
                    try {
                        await bot.deleteMessage(chatId, messageId);
                    } catch (error) {
                        console.error(`Failed to delete message with ID ${messageId}:`, error);
                    }
                }

                await bot.sendMessage(chatId, `Successfully deleted ${deletedCount} your message.`, {
                    reply_to_message_id: msg.message_id
                });

            } catch (error) {
                bot.sendMessage(chatId, `Error: ${String(error)}`, {
                    reply_to_message_id: msg.message_id
                });
            }
        });
    },
};

module.exports = plugin;