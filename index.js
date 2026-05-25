require("dotenv").config();

const http = require("http");
const { Client, GatewayIntentBits, Events } = require("discord.js");
const { askLoveAI } = require("./utils/ai");

// ===============================
// 🧠 กันรันซ้ำ (สำคัญมากบน Railway)
// ===============================
if (global.__BOT_RUNNING__) {
  console.log("Bot already running → exit duplicate instance");
  process.exit(0);
}
global.__BOT_RUNNING__ = true;

console.log("HELLO NEW INDEX");

// ===============================
// 🌐 HTTP SERVER (FIX HEALTH CHECK)
// ===============================
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("OK");
  }

  res.writeHead(200);
  res.end("ALIVE");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("HTTP running on port", PORT);
});

// ===============================
// 🧠 ERROR HANDLING
// ===============================
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

// ===============================
// 🤖 DISCORD BOT
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
  console.log("PID:", process.pid);
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
// 💓 HEARTBEAT (ลดโหลด ไม่ spam CPU)
// ===============================
setInterval(() => {
  console.log("heartbeat:", new Date().toISOString());
}, 60000);

// ===============================
// 🔑 LOGIN
// ===============================
client.login(process.env.DISCORD_TOKEN);

// ===============================
// 🧯 GRACEFUL SHUTDOWN (FIX SIGTERM)
// ===============================
process.on("SIGTERM", () => {
  console.log("SIGTERM received → shutting down cleanly");
  server.close();
  client.destroy();
  process.exit(0);
});
