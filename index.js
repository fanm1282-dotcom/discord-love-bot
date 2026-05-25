require("dotenv").config();

const { Client, GatewayIntentBits, Events } = require("discord.js");
const { askLoveAI } = require("./utils/ai");

console.log("HELLO NEW INDEX");

// ===============================
// 🧠 GLOBAL ERROR HANDLING
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
    GatewayIntentBits.MessageContent, // 🔥 สำคัญมาก (คุณขาดตัวนี้)
  ],
});

// ===============================
// 🚀 BOT READY
// ===============================
client.once(Events.ClientReady, async () => {
  console.log(`${client.user.tag} ออนไลน์แล้ว`);

  console.log(
    "TOKEN:",
    process.env.DISCORD_TOKEN ? "มี" : "ไม่มี"
  );

  console.log(
    "OPENROUTER:",
    process.env.OPENROUTER_API_KEY ? "มี" : "ไม่มี"
  );

  console.log("BOT READY (ไม่ยิง AI แล้ว ❌ กัน crash)");

  // ❌ เอา AI test ออก (อันนี้ทำให้คุณ crash + spam API)
});

// ===============================
// 💬 MESSAGE HANDLER (ตัวจริง)
// ===============================
client.on(Events.MessageCreate, async (message) => {
  try {
    // กัน bot loop
    if (message.author.bot) return;

    // กัน empty
    if (!message.content) return;

    console.log("[MSG]", message.content);

    const reply = await askLoveAI(message.content);

    await message.reply(reply);
  } catch (err) {
    console.error("MESSAGE HANDLER ERROR:", err);
  }
});

// ===============================
// 💓 HEARTBEAT (กัน Railway kill)
// ===============================
setInterval(() => {
  console.log("ยังรันอยู่...");
}, 30000); // 🔥 เปลี่ยนจาก 2 วิ → 30 วิ (2 วิมัน spam log + เปลือง CPU)

// ===============================
// 🔑 LOGIN
// ===============================
client.login(process.env.DISCORD_TOKEN);
