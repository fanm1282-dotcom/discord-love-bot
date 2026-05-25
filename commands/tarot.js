const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const openai =
  require('../utils/openai');

const cards = [

  {
    name: 'The Lovers',
    meaning:
      'ความสัมพันธ์และการตัดสินใจ'
  },

  {
    name: 'The Moon',
    meaning:
      'ความไม่ชัดเจนและความลับ'
  },

  {
    name: 'Death',
    meaning:
      'การจบเพื่อเริ่มใหม่'
  },

  {
    name: 'The Devil',
    meaning:
      'ความสัมพันธ์ที่ตัดไม่ขาด'
  },

  {
    name: 'The Star',
    meaning:
      'ความหวังที่ยังเหลืออยู่'
  },

  {
    name: 'The Hermit',
    meaning:
      'การถอยออกมาเงียบๆ'
  },

  {
    name: 'Justice',
    meaning:
      'ความจริงและผลของการกระทำ'
  },

  {
    name: 'The High Priestess',
    meaning:
      'สิ่งที่ถูกซ่อนเอาไว้'
  },

  {
    name: 'Three of Swords',
    meaning:
      'ความเสียใจและแผลในใจ'
  }

];

function randomCard() {

  const card =

    cards[
      Math.floor(
        Math.random() *
        cards.length
      )
    ];

  const reversed =
    Math.random() < 0.35;

  return {

    ...card,

    reversed,

    title:
      reversed
      ? `${card.name} (กลับหัว)`
      : card.name

  };

}

module.exports = {

  data:
    new SlashCommandBuilder()

      .setName('tarot')

      .setDescription(
        'เปิดไพ่ทาโร่ความรัก'
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

      const card1 =
        randomCard();

      const card2 =
        randomCard();

      const card3 =
        randomCard();

      const response =

        await openai.chat.completions.create({

          model:
            'openai/gpt-oss-20b:free',

          messages: [

            {

              role: 'system',

              content: `

คุณคือ Nyx

คุณไม่ใช่หมอดูแฟนตาซี
แต่เป็นคนที่วิเคราะห์ความสัมพันธ์และอ่านความรู้สึกคนเก่งมาก

หน้าที่:
- วิเคราะห์จากไพ่ทั้ง 3 ใบ
- วิเคราะห์ความสัมพันธ์แบบตรงๆ
- วิเคราะห์สิ่งที่อีกฝ่ายกำลังคิด
- วิเคราะห์ปัญหาจริงของความสัมพันธ์
- วิเคราะห์สิ่งที่ผู้ถามยังไม่ยอมรับ

กฎ:
- พูดเหมือนคนจริง
- อ่านง่าย
- ไม่ต้องใช้คำสวยเกินไป
- ไม่ต้องเบียว
- ไม่ต้องพูดเรื่องจักรวาล
- ไม่ต้องโลกสวย
- บางครั้งให้พูดแรงได้
- ให้เหมือนนักจิตวิทยาความสัมพันธ์
- ตอบประมาณ 5-8 บรรทัด

ตัวอย่าง:

"เขาไม่ได้หมดความรู้สึก
แต่เขาเริ่มเหนื่อยกับความสัมพันธ์นี้"

"ปัญหาคืออีกฝ่ายไม่เคยพูดตรงๆ
แล้วปล่อยให้ความเงียบทำลายทุกอย่าง"

"ลึกๆแล้วเขายังสนใจอยู่
แต่ตอนนี้เขาเลือกตัวเองมากกว่า"

ไพ่ที่เปิดได้:

1. ${card1.title}
ความหมาย: ${card1.meaning}

2. ${card2.title}
ความหมาย: ${card2.meaning}

3. ${card3.title}
ความหมาย: ${card3.meaning}

`

            },

            {

              role: 'user',

              content: question

            }

          ],

          temperature: 0.7,

          max_tokens: 250

        });

      const text =
        response.choices[0]
          .message.content;

      const embed =

        new EmbedBuilder()

          .setColor('#1f1f1f')

          .setTitle(
            '🃏 วิเคราะห์ไพ่ทาโร่'
          )

          .setDescription(text)

          .addFields(

            {
              name: 'ใบที่ 1',
              value:
                `${card1.title}\n${card1.meaning}`,
              inline: false
            },

            {
              name: 'ใบที่ 2',
              value:
                `${card2.title}\n${card2.meaning}`,
              inline: false
            },

            {
              name: 'ใบที่ 3',
              value:
                `${card3.title}\n${card3.meaning}`,
              inline: false
            }

          )

          .setFooter({

            text:
              'Nyx • Relationship Analysis'

          })

          .setTimestamp();

      await interaction.editReply({

        embeds: [embed]

      });

    } catch (err) {

      console.error(err);

      await interaction.editReply(

        'ตอนนี้ยังวิเคราะห์ความสัมพันธ์นี้ไม่ชัดพอ'

      );

    }

  }

};
