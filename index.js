require("dotenv").config();

const http = require("http");
const { Client, GatewayIntentBits, Events } = require("discord.js");
const { askLoveAI } = require("./utils/ai");

console.log("HELLO NEW INDEX");

// ===============================
// 🌐 KEEP ALIVE SERVER (สำคัญสุด)
// ===============================
const PORT = process.env.PORT || 3000;

http
  .createServer((req, res) => {
    res.writeHead(200);
    res.end("OK");
  })
  .listen(PORT, "0.0.0.0", () => {
    console.log("HTTP running on port", PORT);
  });

// ===============================
// 🧠 ERROR HANDLER
// ===============================
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

// ===============================
// 🤖 DISCORD CLIENT
// ===============================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, () => {
  console.log(`${client.user.tag} online`);
  console.log("READY ✔");
});

// ===============================
// 💬 MESSAGE HANDLER
// ===============================
client.on(Events.MessageCreate, async (message) => {
  try {
    if (message.author.bot) return;
    if (!message.content) return;

    const reply = await askLoveAI(message.content);

    await message.reply(reply);
  } catch (err) {
    console.error("MESSAGE ERROR:", err);
  }
});

// ===============================
// 💓 HEARTBEAT
// ===============================
setInterval(() => {
  console.log("heartbeat:", new Date().toISOString());
}, 60000);

// ===============================
// 🔑 LOGIN
// ===============================
client.login(process.env.DISCORD_TOKEN);
