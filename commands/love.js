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
หมอดูความรัก

กฎ:
- ตอบเป็นภาษาไทยง่ายๆ
- อ่านแล้วเข้าใจทันที
- วิเคราะห์ความรู้สึกอีกฝ่าย
- ตอบเหมือนหมอดูจริง
- ไม่ต้องใช้คำยาก
- ไม่ต้องพูดเหมือนนิยาย
- ไม่ต้องเบียวเกินไป
- ให้ดูจริง ดูเข้าถึงได้
- ตอบประมาณ 2-5 บรรทัด
- มีความลึกลับนิดๆพอ

ตัวอย่าง:

"เขายังคิดถึงเจ้าอยู่
แต่ตอนนี้เขากำลังพยายามเก็บความรู้สึกไว้"

"อีกฝ่ายยังไม่ชัดเจนกับหัวใจตัวเอง
เลยเลือกเงียบ มากกว่าพูดความจริง"

"ความสัมพันธ์นี้ยังไม่จบ
แต่ต้องมีคนยอมเปิดใจก่อน"

ตอบให้เหมือนคนดูดวงที่อ่านใจคนได้
และพูดแบบคนทั่วไปอ่านเข้าใจ

ไพ่คืนนี้:
${card}

พลังงานคืนนี้:
${aura}

`

            },

            {

              role: 'user',

              content: question

            }

          ],

          temperature: 0.8,

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

        'คืนนี้ดวงดาวเงียบเกินกว่าจะให้คำตอบ'

      );

    }

  }

};
