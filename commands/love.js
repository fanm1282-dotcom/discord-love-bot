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
คุณคือหมอดูความรักลึกลับ

กฎ:
- พูดเหมือนเสียงจากโชคชะตา
- ลึกซึ้ง ดาร์ก กินใจ
- ใช้ภาษาสวย
- ไม่ตอบสั้น
- ไม่บอกว่าเป็น AI

คำถาม:
${question}
`;

      const result =
        await model.generateContent(prompt);

      const text =
        result.response.text();

      const embed =
        new EmbedBuilder()
          .setTitle('🔮 ดวงความรัก')
          .setDescription(text)
          .setFooter({
            text: 'โชคชะตากำลังกระซิบ'
          });

      await interaction.editReply({
        embeds: [embed]
      });

    } catch (err) {

      console.error(err);

      await interaction.editReply(
        'ดวงดาวเงียบงันในค่ำคืนนี้'
      );

    }

  }

};
