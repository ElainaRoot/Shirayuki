const fetch = require('node-fetch');

const plugin = {
    commands: ['/twitterdl'], // Adding the new command
    tags: ['download'],
    init: async (bot, { buttonUrl, mess, apikey }) => {

        bot.onText(/^\/twitterdl(?: (.+))?$/, async (msg, match) => {
            const chatId = msg.chat.id;
            const inputText = match[1];
            if (!inputText) {
                bot.sendMessage(chatId, '🔗 Input the Twitter post link\nExample: /twitterdl https://twitter.com/reoenl/status/1678370956996390913\nExample: /twitterdl https://x.com/vidio/status/1865260033405259967', {
                    reply_to_message_id: msg.message_id
                });
                return;
            }
            bot.sendMessage(chatId, '⏳ Your request is being processed, please wait...', {
                reply_to_message_id: msg.message_id
            });
            try {
                const apiUrl = `https://api.betabotz.eu.org/api/download/twitter2?url=${encodeURIComponent(inputText)}&apikey=${apikey}`;
                const response = await fetch(apiUrl);
                const res = await response.json();

                if (res.status) {
                    const { text, user_name, tweetURL, mediaURLs } = res.result;

                    let caption = `User: ${user_name}\nTweet: ${text}\nTweet URL: ${tweetURL}`;

                    if (caption.length > 1024) {
                        caption = caption.substring(0, 1021) + '...';
                    }

                    const mediaGroup = mediaURLs.map(url => ({
                        type: 'photo',
                        media: url,
                        caption: caption,
                    }));

                    if (mediaGroup.length > 0) {
                        await bot.sendMediaGroup(chatId, mediaGroup);
                    }

                    if (mediaURLs.length > 0) {
                        const videoUrl = mediaURLs.find(url => url.includes('.mp4'));
                        if (videoUrl) {
                            await bot.sendVideo(chatId, videoUrl, {
                                caption: `Video from Tweet`,
                                reply_to_message_id: msg.message_id,
                            });
                        }
                    }
                } else {
                    bot.sendMessage(chatId, '❌ An error occurred: ' + res.result.message, {
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