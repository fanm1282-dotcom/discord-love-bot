const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const openai =
  require('../utils/openai');

const cards = [

  {
    name: 'The Fool',
    meaning:
      'การเริ่มต้นใหม่และความไม่แน่นอน'
  },

  {
    name: 'The Magician',
    meaning:
      'การควบคุมสถานการณ์และเสน่ห์'
  },

  {
    name: 'The High Priestess',
    meaning:
      'ความลับและสิ่งที่ถูกซ่อน'
  },

  {
    name: 'The Empress',
    meaning:
      'ความสัมพันธ์ที่ต้องการการดูแล'
  },

  {
    name: 'The Emperor',
    meaning:
      'การควบคุมและความเย็นชา'
  },

  {
    name: 'The Hierophant',
    meaning:
      'ความสัมพันธ์จริงจังและกฎเกณฑ์'
  },

  {
    name: 'The Lovers',
    meaning:
      'ความรักและการตัดสินใจ'
  },

  {
    name: 'The Chariot',
    meaning:
      'การพยายามเดินหน้าต่อ'
  },

  {
    name: 'Strength',
    meaning:
      'การอดทนและควบคุมอารมณ์'
  },

  {
    name: 'The Hermit',
    meaning:
      'การถอยห่างและคิดคนเดียว'
  },

  {
    name: 'Wheel of Fortune',
    meaning:
      'ความสัมพันธ์กำลังเปลี่ยนแปลง'
  },

  {
    name: 'Justice',
    meaning:
      'ผลของสิ่งที่เคยทำไว้'
  },

  {
    name: 'The Hanged Man',
    meaning:
      'ความสัมพันธ์ที่หยุดนิ่ง'
  },

  {
    name: 'Death',
    meaning:
      'การจบเพื่อเริ่มต้นใหม่'
  },

  {
    name: 'Temperance',
    meaning:
      'การพยายามปรับตัวเข้าหากัน'
  },

  {
    name: 'The Devil',
    meaning:
      'ความสัมพันธ์ที่ตัดกันไม่ขาด'
  },

  {
    name: 'The Tower',
    meaning:
      'การพังทลายและความจริงที่เจ็บ'
  },

  {
    name: 'The Star',
    meaning:
      'ความหวังที่ยังเหลืออยู่'
  },

  {
    name: 'The Moon',
    meaning:
      'ความไม่ชัดเจนและความสับสน'
  },

  {
    name: 'The Sun',
    meaning:
      'ความชัดเจนและความสุข'
  },

  {
    name: 'Judgement',
    meaning:
      'การกลับมาและการตัดสินใจครั้งใหญ่'
  },

  {
    name: 'The World',
    meaning:
      'บทสรุปของความสัมพันธ์'
  }

];

const relationshipTypes = [

  'Soulmate',
  'Karmic',
  'Twin Flame',
  'Red Flag',
  'Complicated'

];

function pickCards() {

  const shuffled =

    [...cards].sort(
      () => 0.5 - Math.random()
    );

  return [

    shuffled[0],
    shuffled[1],
    shuffled[2]

  ];

}

function bar(value) {

  const filled =
    Math.floor(value / 10);

  return (

    '█'.repeat(filled) +

    '░'.repeat(10 - filled)

  );

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

      const [
        past,
        present,
        future
      ] = pickCards();

      const relation =

        relationshipTypes[
          Math.floor(
            Math.random() *
            relationshipTypes.length
          )
        ];

      const feelings =
        Math.floor(
          Math.random() * 41
        ) + 55;

      const comeback =
        Math.floor(
          Math.random() * 51
        ) + 35;

      const toxic =
        Math.floor(
          Math.random() * 70
        ) + 10;

      const obsession =
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

คุณคือ Nyx

คุณไม่ใช่หมอดูแฟนตาซี
แต่เป็นคนที่วิเคราะห์ความสัมพันธ์เก่งมาก

หน้าที่:
- วิเคราะห์จากไพ่ทั้ง 3 ใบ
- วิเคราะห์ความสัมพันธ์แบบตรงๆ
- วิเคราะห์สิ่งที่อีกฝ่ายกำลังคิด
- วิเคราะห์ปัญหาจริง
- วิเคราะห์สิ่งที่ผู้ถามยังไม่ยอมรับ

กฎ:
- พูดเหมือนคนจริง
- อ่านง่าย
- ไม่ต้องใช้คำเวอร์
- ไม่ต้องโลกสวย
- ถ้าความสัมพันธ์แย่ให้พูดตรงๆ
- ถ้าอีกฝ่าย toxic ให้พูดตรงๆ
- อย่าตอบกว้างๆ
- ให้เหมือนคนที่ดูคนออกจริงๆ
- ตอบประมาณ 6-10 บรรทัด

สำคัญ:
- วิเคราะห์ให้เฉพาะเจาะจง
- บอกปัญหาหลักของความสัมพันธ์
- วิเคราะห์พฤติกรรมอีกฝ่าย
- ท้ายคำตอบให้สรุปตรงๆว่าควรไปต่อไหม

ประเภทความสัมพันธ์:
${relation}

[อดีต]
${past.name}
${past.meaning}

[ปัจจุบัน]
${present.name}
${present.meaning}

[อนาคต]
${future.name}
${future.meaning}

ค่าความสัมพันธ์:
ความคิดถึง ${feelings}%
โอกาสกลับมา ${comeback}%
ความ Toxic ${toxic}%
ความหมกมุ่น ${obsession}%

`

            },

            {

              role: 'user',

              content: question

            }

          ],

          temperature: 0.7,

          max_tokens: 320

        });

      const text =
        response.choices[0]
          .message.content;

      let color =
        '#202225';

      if (toxic >= 70)
        color = '#7a1010';

      if (feelings >= 85)
        color = '#52206b';

      const embed =

        new EmbedBuilder()

          .setColor(color)

          .setTitle(
            '🃏 วิเคราะห์ไพ่ทาโร่'
          )

          .setDescription(text)

          .addFields(

            {
              name: '🧩 ความสัมพันธ์',
              value: relation,
              inline: true
            },

            {
              name: '💔 ความคิดถึง',
              value:
                `${bar(feelings)} ${feelings}%`,
              inline: false
            },

            {
              name: '🕯️ โอกาสกลับมา',
              value:
                `${bar(comeback)} ${comeback}%`,
              inline: false
            },

            {
              name: '🚩 Toxic',
              value:
                `${bar(toxic)} ${toxic}%`,
              inline: false
            },

            {
              name: '🔥 ความหมกมุ่น',
              value:
                `${bar(obsession)} ${obsession}%`,
              inline: false
            },

            {
              name: '🕰️ อดีต',
              value:
                `${past.name}\n${past.meaning}`,
              inline: false
            },

            {
              name: '⚡ ปัจจุบัน',
              value:
                `${present.name}\n${present.meaning}`,
              inline: false
            },

            {
              name: '🔮 อนาคต',
              value:
                `${future.name}\n${future.meaning}`,
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

        'ตอนนี้ยังอ่านความสัมพันธ์นี้ไม่ออก'

      );

    }

  }

};
