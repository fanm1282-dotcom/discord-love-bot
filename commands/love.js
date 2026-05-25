const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const openai =
  require('../utils/openai');

const {

  randomCard,
  randomMoon,
  randomQuote,
  randomAura

} = require('../utils/fate');

module.exports = {

  data:
    new SlashCommandBuilder()

      .setName('love')

      .setDescription(
        'อ่านใจความรัก'
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

      const moon =
        randomMoon();

      const quote =
        randomQuote();

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

      const redFlag =
        Math.floor(
          Math.random() * 60
        ) + 20;

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
- วิเคราะห์สิ่งที่อีกฝ่ายปิดบัง
- วิเคราะห์ความคิดลึกๆ
- วิเคราะห์สิ่งที่ผู้ถามมองไม่เห็น
- วิเคราะห์พลังงานของความสัมพันธ์

สไตล์:
- พูดตรง
- เจ็บนิดๆ
- เหมือนรู้ความจริง
- เหมือนแอบเห็นอีกฝ่ายตอนอยู่คนเดียว
- ไม่โลกสวย
- ไม่ต้องเบียวเกินไป
- อ่านง่าย
- ตอบ 5-9 บรรทัด

สำคัญ:
- บางครั้งให้เตือนผู้ถาม
- บางครั้งให้พูดถึง "ความเงียบ"
- บางครั้งให้พูดเหมือนอีกฝ่ายยังซ่อนอะไรอยู่

ข้อมูลคืนนี้:

ไพ่:
${card.name}

ความหมาย:
${card.meaning}

พระจันทร์:
${moon}

พลังงาน:
${aura}

ค่าความสัมพันธ์:
ความคิดถึง ${feelings}%
โอกาสกลับมา ${comeback}%
ความรู้สึกที่ซ่อนอยู่ ${hidden}%
Red Flag ${redFlag}%

`

            },

            {

              role: 'user',

              content: question

            }

          ],

          temperature: 1,

          max_tokens: 260

        });

      const text =
        response.choices[0]
          .message.content;

      let color =
        '#2b1147';

      if (redFlag >= 70)
        color = '#6e1212';

      if (feelings >= 85)
        color = '#4b1f6f';

      const embed =

        new EmbedBuilder()

          .setColor(color)

          .setTitle(
            '🔮 Nyx กำลังอ่านโชคชะตา...'
          )

          .setDescription(text)

          .addFields(

            {
              name: '🃏 ไพ่',
              value:
                `${card.name}\n${card.meaning}`,
              inline: true
            },

            {
              name: '🌙 พระจันทร์',
              value: moon,
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
              name: '🚩 Red Flag',
              value: `${redFlag}%`,
              inline: true
            }

          )

          .setFooter({

            text:
              `🕯️ ${quote}`

          })

          .setTimestamp();

      await interaction.editReply({

        embeds: [embed]

      });

    } catch (err) {

      console.error(err);

      await interaction.editReply(

        'คืนนี้...มีบางอย่างในโชคชะตาที่แม้แต่ Nyx ก็ยังมองไม่ชัด'

      );

    }

  }

};
