import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";
import OpenAI from "openai";

/* =========================
   CONFIG
========================= */

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* =========================
   CREATE COMMAND
========================= */

const commands = [
  new SlashCommandBuilder()
    .setName("ดูดวง")
    .setDescription("ดูดวงความรักแบบแม่น ๆ")
    .addStringOption(option =>
      option
        .setName("คำถาม")
        .setDescription("ถามเรื่องความรัก")
        .setRequired(false)
    )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

// deploy command อัตโนมัติ
async function deployCommands() {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("ลงคำสั่ง /ดูดวง แล้ว");
  } catch (err) {
    console.log("deploy พัง:", err);
  }
}

/* =========================
   BOT READY
========================= */

client.once("ready", async () => {
  console.log("บอทออนไลน์แล้ว");
  await deployCommands(); // 🔥 deploy ตอนเปิดบอทเลย
});

/* =========================
   COMMAND HANDLER
========================= */

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ดูดวง") {
    const question =
      interaction.options.getString("คำถาม") ||
      "ดูดวงความรักให้หน่อย";

    const systemPrompt = `
คุณคือหมอดูความรักระดับสูง วิเคราะห์แม่นเหมือนรู้ชีวิตจริง

สไตล์:
- พูดตรง ฟันธง
- มีเหตุผล ไม่มั่ว
- กวนเล็กน้อย
- ใช้ภาษาคนจริง

ต้องตอบ:
1. สถานการณ์ตอนนี้
2. อนาคตใกล้
3. คำแนะนำฟันธง

ตอบเป็นภาษาไทยเท่านั้น
`;

    await interaction.deferReply();

    try {
      const res = await openai.chat.completions.create({
        model: "gpt-5.5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        temperature: 0.9
      });

      await interaction.editReply(res.choices[0].message.content);

    } catch (err) {
      console.log(err);
      await interaction.editReply("ดูดวงพลาดว่ะ ลองใหม่");
    }
  }
});

/* =========================
   LOGIN
========================= */

client.login(process.env.DISCORD_TOKEN);
