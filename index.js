require("dotenv").config();

const http = require("http");
const { Client, GatewayIntentBits, Events } = require("discord.js");
const { askLoveAI } = require("./utils/ai");

console.log("HELLO NEW INDEX");

// ===============================
// 🌐 KEEP ALIVE SERVER (สำคัญมาก กัน SIGTERM / idle kill)
// ===============================
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
  })
  .listen(process.env.PORT || 3000, () => {
    console.log("HTTP server running on port", process.env.PORT || 3000);
  });

// ===============================
// 🧠 ERROR HANDLING
// ===============================
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

// ===============================
// 🤖 DISCORD CLIENT
// ===============================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // 🔥 สำคัญมาก
  ],
});

// ===============================
// 🚀 READY EVENT
// ===============================
client.once(Events.ClientReady, () => {
  console.log(`${client.user.tag} ออนไลน์แล้ว`);

  console.log("TOKEN:", process.env.DISCORD_TOKEN ? "มี" : "ไม่มี");
  console.log(
    "OPENROUTER:",
    process.env.OPENROUTER_API_KEY ? "มี" : "ไม่มี"
  );

  console.log("BOT READY ✔ (no AI spam on boot)");
});

// ===============================
// 💬 MESSAGE HANDLER
// ===============================
client.on(Events.MessageCreate, async (message) => {
  try {
    if (message.author.bot) return;
    if (!message.content) return;

    console.log("[MSG]", message.content);

    const reply = await askLoveAI(message.content);

    await message.reply(reply);
  } catch (err) {
    console.error("MESSAGE ERROR:", err);
  }
});

// ===============================
// 💓 HEARTBEAT (กัน sleep แต่ไม่ spam)
// ===============================
setInterval(() => {
  console.log("heartbeat:", new Date().toISOString());
}, 60000);

// ===============================
// 🔑 LOGIN
// ===============================
client.login(process.env.DISCORD_TOKEN);
