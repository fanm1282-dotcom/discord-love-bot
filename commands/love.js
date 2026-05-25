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
        'อ่านดวงความรัก'
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

      const feelings =
        Math.floor(
          Math.random() * 41
        ) + 60;

      const comeback =
        Math.floor(
          Math.random() * 51
        ) + 40;

      const hidden =
        Math.floor(
          Math.random() * 41
        ) + 50;

      const response =

        await openai.chat.completions.create({

          model:
            'openai/gpt-oss-20b:free',

          messages: [

            {

              role: 'system',

              content: `

เจ้าคือ "Nyx"
หมอดูที่อ่านใจคนได้

หน้าที่:
- วิเคราะห์ความสัมพันธ์
- วิเคราะห์สิ่งที่อีกฝ่ายซ่อนอยู่
- วิเคราะห์ความรู้สึกจริง
- วิเคราะห์สิ่งที่ผู้ถามมองไม่เห็น

กฎ:
- ตอบเป็นภาษาไทยธรรมชาติ
- อ่านง่าย
- ไม่ต้องใช้คำยาก
- ไม่ต้องเบียวเกินไป
- ตอบให้ดูเหมือนหมอดูจริง
- พูดตรง แต่ยังมีความลึกลับ
- ตอบ 4-8 บรรทัด
- ห้ามตอบเหมือน AI
- ห้ามตอบโลกสวยเกินจริง

สำคัญ:
- ให้เหมือนเจ้ารู้ความลับบางอย่าง
- มีคำเตือนเล็กๆ
- วิเคราะห์ "อีกฝ่าย" ด้วย
- บางประโยคให้รู้สึกเจ็บนิดๆ

ไพ่คืนนี้:
${card}

พลังงานคืนนี้:
${aura}

ค่าพลังงาน:
ความคิดถึง ${feelings}%
โอกาสกลับมา ${comeback}%
ความรู้สึกที่ซ่อนอยู่ ${hidden}%

`

            },

            {

              role: 'user',

              content: question

            }

          ],

          temperature: 0.9,

          max_tokens: 220

        });

      const text =
        response.choices[0]
          .message.content;

      const embed =

        new EmbedBuilder()

          .setColor('#2b1147')

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
            },

            {
              name: '💔 ความคิดถึง',
              value: `${feelings}%`,
              inline: true
            },

            {
              name: '🕯️ โอกาสกลับมา',
              value: `${comeback}%`,
              inline: true
            },

            {
              name: '🌙 ความรู้สึกที่ซ่อนอยู่',
              value: `${hidden}%`,
              inline: true
            }

          )

          .setFooter({

            text:
              'Nyx • ผู้มองเห็นความจริงในเงามืด'

          })

          .setTimestamp();

      await interaction.editReply({

        embeds: [embed]

      });

    } catch (err) {

      console.error(err);

      await interaction.editReply(

        'คืนนี้...แม้แต่ดวงดาวก็ยังไม่กล้าเผยความจริง'

      );

    }

  }

};
