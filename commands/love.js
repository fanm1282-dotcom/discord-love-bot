import { SlashCommandBuilder } from "discord.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const data = new SlashCommandBuilder()
  .setName("ดูดวง")
  .setDescription("ดูดวงความรักแบบแม่น ๆ")
  .addStringOption(option =>
    option.setName("คำถาม")
      .setDescription("ถามเรื่องความรัก")
      .setRequired(false)
  );

export async function execute(interaction) {
  const question =
    interaction.options.getString("คำถาม") ||
    "ดูดวงความรักให้หน่อย";

  const systemPrompt = `
คุณคือหมอดูความรักระดับมืออาชีพ วิเคราะห์ลึก แม่นเหมือนรู้ชีวิตจริง
สไตล์การพูด:
- ตรง ๆ ฟันธง
- มีเหตุผล ไม่มั่ว
- แอบกวนเล็กน้อย
- พูดเหมือนรู้จักเจ้าของดวงจริง

ให้ทำนาย:
1. สถานการณ์ความรักตอนนี้
2. สิ่งที่กำลังจะเกิดขึ้น
3. คำแนะนำแบบฟันธง

ตอบเป็นภาษาไทยล้วน
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
