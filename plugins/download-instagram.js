const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const plugin = {
    commands: ['/igdl'],
    tags: ['download'],
    init: async (bot, { buttonUrl, mess, apikey }) => {
        bot.onText(/^\/igdl(?: (.+))?$/, async (msg, match) => {
            const chatId = msg.chat.id;
            const inputText = match[1];

            if (!inputText) {
                bot.sendMessage(chatId, '🔗 Input your Instagram post link\n/igdl https://www.instagram.com/p/ByxKbUSnubS/?utm_source=ig_web_copy_link', {
                    reply_to_message_id: msg.message_id
                });
                return;
            }

            bot.sendMessage(chatId, '⏳ Your request is being processed, please wait...', {
                reply_to_message_id: msg.message_id
            });

            try {
                const apiUrl = `https://api.betabotz.eu.org/api/download/igdowloader?url=${encodeURIComponent(inputText)}&apikey=${apikey}`;
                const response = await fetch(apiUrl);
                const res = await response.json();

                if (res.status) {
                    const media = res.message[0];

                    if (media) {
                        const { wm, _url } = media;
                        const caption = `📷 *Instagram Post*\n🔗 *Watermark:* ${wm}\n*Download Link:* [Download](${_url})`;

                        const videoPath = path.resolve(__dirname, 'video.mp4');
                        const writer = fs.createWriteStream(videoPath);
                        const response = await axios({
                            url: _url,
                            method: 'GET',
                            responseType: 'stream'
                        });
                        response.data.pipe(writer);

                        writer.on('finish', async () => {

                            await bot.sendVideo(chatId, videoPath, {
                                caption: caption,
                                parse_mode: 'Markdown',
                                reply_to_message_id: msg.message_id,
                            });

                            fs.unlinkSync(videoPath);
                        });

                        writer.on('error', (err) => {
                            console.error('Error writing video to disk:', err);
                            bot.sendMessage(chatId, '❌ Failed to download video.', {
                                reply_to_message_id: msg.message_id
                            });
                        });
                    } else {
                        bot.sendMessage(chatId, '❌ No media found in the response.', {
                            reply_to_message_id: msg.message_id
                        });
                    }
                } else {
                    bot.sendMessage(chatId, '❌ An error occurred: ' + res.message, {
                        reply_to_message_id: msg.message_id
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                bot.sendMessage(chatId, '❌ An error occurred while processing your request. Please try again.', {
                    reply_to_message_id: msg.message_id
                });
            }
        });
    },
};

module.exports = plugin;