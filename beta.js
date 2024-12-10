const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const settings = require('./settings.js');
const chalk = require('chalk');
const figlet = require('figlet');

const botToken = settings.telegramBotToken;
const ownerName = settings.ownerUsernames;
const ownerNumber = settings.ownerNumber;
const mess = require('./settings.js').mess; 
const imageUrl = settings.imageUrl;
const buttonUrl = settings.buttonUrl;
const api = settings.api;
const apikey = settings.apikey;
const bot = new TelegramBot(botToken, { polling: true });
const port = process.env.PORT || 9877;

const loadedPlugins = [];

let Start = new Date();
let senderInfo;
let dateInfo;

const logs = (message, color, senderInfo, dateInfo) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(chalk[color](`[${timestamp}] ${senderInfo} ${dateInfo} => ${message}`));
};

const Figlet = () => {
  figlet('Telebot', { font: 'Block', horizontalLayout: 'default' }, function (err, data) {
    if (err) {
      console.log('Error:', err);
      return;
    }
    console.log(chalk.yellow.bold(data));
    console.log(chalk.yellow(`Lann`));
  });
};

bot.on('polling_error', (error) => {
  logs(`Polling error: ${error.message}`, 'blue');
});

const options = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Script Bot',
          url: buttonUrl, // Ganti dengan URL yang sebenarnya
        },
      ],
    ],
  },
};

bot.on('new_chat_members', async (msg) => {
  const chatId = msg.chat.id;
  const newUser = msg.new_chat_members[0];

  // Get the user's profile photo or use a default image
  const profilePhoto = newUser && newUser.photo ? await bot.getFileLink(newUser.photo.big_file_id) : 'https://telegra.ph/file/24fa902ead26340f3df2c.png';

  // Create a spooky welcome message
  const welcomeMessage = `
👋 Welcome, ${newUser.first_name || newUser.username}! 🎃
You've just stepped into the haunted realm of *${msg.chat.title}*! 👻
🕒 **Time:** ${new Date(msg.date * 1000).toLocaleTimeString()}
📅 **Date:** ${new Date(msg.date * 1000).toLocaleDateString()}
We're thrilled (and a little spooked) to have you join us! Hope you can handle the chills and thrills! 😈

If you dare to ask questions or need any help, just summon us! 
  `;
  // Send the welcome message with the user's profile photo
  bot.sendPhoto(chatId, profilePhoto, { caption: welcomeMessage, parse_mode: 'Markdown' });
});

bot.on('left_chat_member', async (msg) => {
  const chatId = msg.chat.id;
  const leftUser = msg.left_chat_member;

  // Get the user's profile photo or use a default image
  const profilePhoto = leftUser && leftUser.photo ? await bot.getFileLink(leftUser.photo.big_file_id) : 'https://telegra.ph/file/24fa902ead26340f3df2c.png';

  // Create a spooky goodbye message
  const goodbyeMessage = `
🕯️ Farewell, ${leftUser.first_name || leftUser.username}... 🕯️
You've vanished from the shadows of *${msg.chat.title}*! 🌑
🕒 **Time:** ${new Date(msg.date * 1000).toLocaleTimeString()}
📅 **Date:** ${new Date(msg.date * 1000).toLocaleDateString()}
May the spirits guide you on your journey ahead. You shall be remembered in the echoes of this chat. 👻

If fate allows, may our paths cross again... 🌌
  `;

  // Send the goodbye message with the user's profile photo
  bot.sendPhoto(chatId, profilePhoto, { caption: goodbyeMessage, parse_mode: 'Markdown' });
});

// Load plugins
const pluginsPath = path.join(__dirname, 'plugins');
const pluginFiles = fs.readdirSync(pluginsPath).filter(file => file.endsWith('.js'));

const isOwner = (username) => {
  return !settings.ownerUsernames.includes(username);
};

const isGroup = (msg) => {
  return !msg.chat.type.includes('group');
};

pluginFiles.forEach(file => {
  const pluginPath = path.join(pluginsPath, file);
  const plugin = require(pluginPath);
  if (typeof plugin.init === 'function') {
    plugin.init(bot, { isOwner, isGroup, logs, Figlet, loadedPlugins, mess, buttonUrl, imageUrl, api, apikey, ownerName, ownerNumber });
    loadedPlugins.push(plugin);
  } else {
    console.error(`Error: ${file} does not have a proper init function.`);
  }
});


// express endpoint
app.set('json spaces', 2);
app.get('/', (req, res) => {
  const data = {
    status: 'true',
    message: `Telegram Bot Successfully Activated!`,
    author: 'Shirayuki',
  };
  const result = {
    response: data,
  };
  res.json(result);
});

function listenOnPort(port) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  app.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use. Trying another port...`);
      listenOnPort(port + 1);
    } else {
      console.error(err);
    }
  });
}

listenOnPort(port);
