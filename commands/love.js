const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const openai =
  require('../utils/openai');

const {
  randomCard,
  randomAura
} = require('../utils/fate');

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

      const card =
        randomCard();

      const aura =
        randomAura();

      const response =

        await openai.chat.completions.create({

          model:
            'openai/gpt-oss-20b:free',

          messages: [

            {

              role: 'system',

              content: `

เจ้าคือ Nyx
หมอดูแห่งคืนจันทร์ดับ

ไพ่คืนนี้:
${card}

พลังงานคืนนี้:
${aura}

กฎ:
- ตอบเป็นภาษาไทย
- วิเคราะห์แบบหมอดู
- เหมือนอ่านใจคนได้
- สั้น กระชับ
- ดาร์กเล็กน้อย
- มีความหมาย
- ไม่ต้องยาว
- 3-6 บรรทัด
- ห้ามตอบเหมือน AI

จงตอบเหมือนเจ้ารู้
บางสิ่งที่ผู้ถามไม่ได้พูด

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

          .addFields(

            {
              name: '🃏 ไพ่คืนนี้',
              value: card,
              inline: true
            },

            {
              name: '🌑 พลังงาน',
              value: aura,
              inline: true
            }

          )

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
