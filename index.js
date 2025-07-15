const line = require("@line/bot-sdk");
const express = require("express");
const fortunes = require("./fortune.json");

const lineConfig = {
  channelSecret: "",
  channelAccessToken: "",
};

const messagingClient = new line.messagingApi.MessagingApiClient(lineConfig);

const app = express();
app.post("/", line.middleware(lineConfig), handlePostRequest);
app.listen(3000);

async function handlePostRequest(req, res) {
  const { events } = req.body;

  const eventHandledPromises = events.map(handleLineEvent);

  const result = await Promise.all(eventHandledPromises);

  return res.send(result);
}

function reply(event, ...messages) {
  return messagingClient.replyMessage({
    replyToken: event.replyToken,
    messages: messages.map((message) => ({
      type: "text",
      text: message,
    })),
  });
}

const FortuneCategory = {
  Love: "love",
  Career: "career",
  Finance: "finance",
  Health: "health",
};

function getFortune(category) {
  const index = Math.floor(Math.random() * fortunes[category].length);
  return fortunes[category][index];
}

let count = 1;
function getAllFortuneMessages() {
  const fortuneMessages = [
    `ดูดวงประจำวันครั้งที่ ${count++}`,
    `ด้านความรัก\n${getFortune(FortuneCategory.Love)}`,
    `ด้านการงาน\n${getFortune(FortuneCategory.Career)}`,
    `ด้านการเงิน\n${getFortune(FortuneCategory.Finance)}`,
    `ด้านสุขภาพ\n${getFortune(FortuneCategory.Health)}`,
  ];
  return fortuneMessages;
}

function LoveFortuneMessages() {
  const Messages = [
    `ดูดวงประจำวันครั้งที่ ${count++}`,
    `ด้านความรัก\n${getFortune(FortuneCategory.Love)}`,
  ];
  return Messages;
}

function WorkFortuneMessages() {
  const Messages = [
    `ดูดวงประจำวันครั้งที่ ${count++}`,
    `ด้านความรัก\n${getFortune(FortuneCategory.Career)}`,
  ];
  return Messages;
}

function FinanceFortuneMessages() {
  const Messages = [
    `ดูดวงประจำวันครั้งที่ ${count++}`,
    `ด้านความรัก\n${getFortune(FortuneCategory.Finance)}`,
  ];
  return Messages;
}

function HealthFortuneMessages() {
  const Messages = [
    `ดูดวงประจำวันครั้งที่ ${count++}`,
    `ด้านความรัก\n${getFortune(FortuneCategory.Health)}`,
  ];
  return Messages;
}

function handleLineEvent(event) {
  const text = event.message.text;
  if (text === "ดูดวง") return reply(event, ...getAllFortuneMessages());
  else if (text === "ดูดวงด้านความรัก")
    return reply(event, ...LoveFortuneMessages());
  else if (text === "ดูดวงด้านการงาน")
    return reply(event, "ด้านการงาน\n" + WorkFortuneMessages());
  else if (text === "ดูดวงด้านการเงิน")
    return reply(event, "ด้านการเงิน\n" + FinanceFortuneMessages());
  else if (text === "ดูดวงด้านสุขภาพ")
    return reply(event, "ด้านสุขภาพ\n" + HealthFortuneMessages());
  else return reply(event, "กรุณาพิมพ์ 'ดูดวง' ");
}
