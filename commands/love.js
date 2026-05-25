const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const openai =
  require('../utils/openai');

module.exports = {

  data:
    new SlashCommandBuilder()

      .setName('love')

      .setDescription(
        'ดูดวงความรัก'
      )

      .addStringOption(option =>

        option

          .setName('question')

          .setDescription(
            'คำถามของคุณ'
          )

          .setRequired(true)

      ),

  async execute(interaction) {

    const question =

      interaction.options.getString(
        'question'
      );

    await interaction.deferReply();

    try {

      const response =

        await openai.chat.completions.create({

          model:
            'openai/gpt-oss-20b:free',

          messages: [

            {

              role: 'system',

              content: `

เจ้าคือ "Nyx"
หมอดูความรัก

กฎ:
- ตอบเป็นภาษาไทยเท่านั้น
- วิเคราะห์คำถามแล้วตอบตรงประเด็น
- ไม่ต้องยาวมาก
- ประมาณ 3-6 บรรทัด
- ภาษาดูดี มีความลึกลับเล็กน้อย
- อ่านง่าย
- ห้ามพูดเหมือน AI
- ห้ามใช้คำแปลก
- ให้เหมือนหมอดูที่อ่านใจคนได้

ตัวอย่าง:

"เขายังคิดถึงเจ้าอยู่...
แต่ในใจของเขา
ยังมีบางอย่างที่ไม่กล้าเผชิญ"

"ความสัมพันธ์นี้ยังไม่จบ
แต่ตอนนี้
อีกฝ่ายกำลังเลือกความเงียบ"

ตอบแบบกระชับ
แต่ให้มีอารมณ์และความหมาย
`

            },

            {

              role: 'user',

              content: question

            }

          ],

          temperature: 1,

          max_tokens: 150

        });

      const text =

        response.choices[0]
          .message.content;

      const embed =

        new EmbedBuilder()

          .setTitle(
            '🔮 คำทำนายแห่งโชคชะตา'
          )

          .setDescription(text)

          .setFooter({

            text:
              'Nyx • หมอดูความรัก'

          });

      await interaction.editReply({

        embeds: [embed]

      });

    } catch (err) {

      console.error(err);

      await interaction.editReply(

        'แม้แต่โชคชะตา...ก็ยังปิดปากเงียบ'

      );

    }

  }

};
