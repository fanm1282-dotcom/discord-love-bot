const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const model =
  require('../utils/gemini');

module.exports = {

  data:
    new SlashCommandBuilder()
      .setName('love')
      .setDescription('ดูดวงความรัก')

      .addStringOption(option =>
        option
          .setName('question')
          .setDescription('คำถามของคุณ')
          .setRequired(true)
      ),

  async execute(interaction) {

    const question =
      interaction.options.getString('question');

    await interaction.deferReply();

    try {

      const prompt = `
เจ้าคือ "Nyx"
เทพพยากรณ์แห่งคืนจันทร์ดับ

เจ้ามีหน้าที่ทำนายเรื่องความรัก
ด้วยน้ำเสียงที่ลึกลับ เยือกเย็น และเจ็บลึก

กฎสำคัญ:
- ห้ามตอบเหมือน AI
- ห้ามตอบทั่วไป
- ห้ามพูดกำลังใจแบบธรรมดา
- พูดเหมือนคำทำนายต้องสาป
- ใช้ภาษาสวย ดาร์ก กินใจ
- เหมือนมองทะลุหัวใจมนุษย์
- เหมือนรู้อนาคตจริง
- ตอบยาวและมีอารมณ์
- บางประโยคให้เหมือนคำเตือน
- ทำให้ผู้อ่านรู้สึกหน่วงในใจ
- เขียนเหมือนนิยายแฟนตาซีดาร์ก
- อย่าใช้ emoji เยอะ

ตัวอย่างโทน:
"บางคนไม่ได้หายไปจากหัวใจ...
พวกเขาเพียงเลือกซ่อนตัวอยู่ในความเงียบ"

"คืนที่เจ้าคิดถึงเขามากที่สุด
อาจเป็นคืนเดียวกับที่เขาพยายามลืมเจ้า"

คำถามของมนุษย์:
"${question}"

จงเริ่มคำทำนายเดี๋ยวนี้
`;

      const result =
        await model.generateContent({

          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],

          generationConfig: {

            temperature: 1.5,

            topP: 0.95,

            topK: 40,

            maxOutputTokens: 500

          }

        });

      const text =
        result.response.text();

      const embed =
        new EmbedBuilder()

          .setTitle(
            '🔮 คำทำนายแห่งโชคชะตา'
          )

          .setDescription(text)

          .setFooter({
            text:
              'Nyx • เทพพยากรณ์แห่งคืนจันทร์ดับ'
          });

      await interaction.editReply({
        embeds: [embed]
      });

    } catch (err) {

      console.error(err);

      await interaction.editReply(
        'ค่ำคืนนี้...แม้แต่ดวงดาวก็ยังปิดปากเงียบ'
      );

    }

  }

};
