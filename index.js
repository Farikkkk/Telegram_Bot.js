const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options.js");

const token = "7309433227:AAFyRjSrbnRAVkDoU-QJjR1Hw0fdTlZJIy8";

const bot = new TelegramApi(token, { polling: true });

const chat = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "I will choose random number from 0 to 9,and you have to know it!"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chat[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Guess the number", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Greetings!!" },
    { command: "/info", description: "Description about user" },
    { command: "/game", description: "Play game" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendMessage(chatId, "Welcome to my bot!!!");
      return bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.jpg"
      );
    }

    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Your  name is ${msg.from.first_name} ${msg.from.last_name}`
      );
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "I do not undersand you!!");
  });

  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }

    if (data === chat[chatId]) {
      return bot.sendMessage(
        chatId,
        `You Win! Bot's number is ${chat[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `you Lose! Bot's number is ${chat[chatId]}`,
        againOptions
      );
    }
  });
};

start();
