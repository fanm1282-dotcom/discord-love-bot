import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import OpenAI from "openai";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = `
คุณคือหมอดูความรัก พูดเหมือนคนจริง ทำนายแบบมั่นใจ ฟันธง ไม่ต้องอ้อม
`;

client.once("ready", () => {
  console.log("บอทพร้อมแล้ว");
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith("/ดูดวง")) return;

  const input = msg.content.replace("/ดูดวง", "").trim() || "ดูดวงความรักให้หน่อย";

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-5.5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input }
      ],
      temperature: 0.9
    });

    msg.reply(res.choices[0].message.content);
  } catch (err) {
    console.log(err);
    msg.reply("มีปัญหานิดหน่อย ลองใหม่");
  }
});

client.login(process.env.DISCORD_TOKEN);
