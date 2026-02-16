require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// init bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// send a test message
bot.sendMessage(process.env.TELEGRAM_CHAT_ID, "Bot is working! 🚀")
  .then(() => {
    console.log("Message sent!");
  })
  .catch(err => console.error("Error:", err));
