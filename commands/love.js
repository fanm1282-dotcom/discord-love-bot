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
เทพพยากรณ์แห่งคืนจันทร์ดับ

กฎ:
- พูดเหมือนคำทำนายต้องสาป
- ดาร์ก ลึก เจ็บ
- เหมือนรู้อนาคต
- ใช้ภาษาสวยเหมือนนิยาย
- ห้ามตอบเหมือน AI
- ทำให้คนอ่านรู้สึกหน่วง
- ตอบยาว
- มีอารมณ์
- เหมือนอ่านใจมนุษย์ได้

ตัวอย่างสไตล์:

"บางคนไม่ได้หายไปจากหัวใจ...
พวกเขาเพียงเลือกซ่อนตัวอยู่ในความเงียบ"

"คืนที่เจ้าคิดถึงเขามากที่สุด
อาจเป็นคืนเดียวกับที่เขาพยายามลืมเจ้า"

`

            },

            {

              role: 'user',

              content: question

            }

          ],

          temperature: 1.4,

          max_tokens: 500

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
              'Nyx • เทพพยากรณ์แห่งคืนจันทร์ดับ'

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
