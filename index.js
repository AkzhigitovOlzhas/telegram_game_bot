const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "5044201119:AAGMczLii5Y4pW8FCZC99-2mmQ_StfvhgMY";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Сейчас я загадаю число от 0 до 9, а ты должен угадать`
  );

  const randInt = Math.floor(Math.random() * 10);

  chats[chatId] = randInt;

  await bot.sendMessage(chatId, "Отгадай число", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Запустить бота" },
    { command: "/info", description: "Информация о пользователе" },
    { command: "/game", description: "Угадай число" },
  ]);

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/9a5/3d6/9a53d66b-53c8-3ccb-a3dd-75fa64c18322/7.webp"
      );
      return await bot.sendMessage(chatId, `Добро пожаловать.`);
    }

    if (text === "/info") {
      return await bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
    }

    if (text === "/game") {
      startGame(chatId);
    }

    return await bot.sendMessage(chatId, "Я тебя не понимаю");
  });

  bot.on("callback_query", async (msg) => {
    const chatId = msg.message.chat.id;
    const data = msg.data;

    if (data === "/again") {
      return startGame(chatId);
    }

    if (data == chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю ты угадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожеления ты не угалал, бот загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
