const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const openai =
  require('../utils/openai');

/* =========================
   ไพ่ Tarot 78 ใบ
========================= */

const cards = [

  /* Major Arcana */

  { name: 'The Fool', meaning: 'การเริ่มต้นใหม่และความไม่แน่นอน' },
  { name: 'The Magician', meaning: 'การควบคุมสถานการณ์และเสน่ห์' },
  { name: 'The High Priestess', meaning: 'ความลับและสิ่งที่ถูกซ่อน' },
  { name: 'The Empress', meaning: 'ความสัมพันธ์ที่ต้องการการดูแล' },
  { name: 'The Emperor', meaning: 'ความเย็นชาและการควบคุม' },
  { name: 'The Hierophant', meaning: 'ความสัมพันธ์จริงจังและกฎเกณฑ์' },
  { name: 'The Lovers', meaning: 'ความรักและการตัดสินใจ' },
  { name: 'The Chariot', meaning: 'ความพยายามเดินหน้าต่อ' },
  { name: 'Strength', meaning: 'การอดทนและควบคุมอารมณ์' },
  { name: 'The Hermit', meaning: 'การถอยออกมาเงียบๆ' },
  { name: 'Wheel of Fortune', meaning: 'ความสัมพันธ์กำลังเปลี่ยนแปลง' },
  { name: 'Justice', meaning: 'ผลของการกระทำและความจริง' },
  { name: 'The Hanged Man', meaning: 'ความสัมพันธ์ที่หยุดนิ่ง' },
  { name: 'Death', meaning: 'การจบเพื่อเริ่มใหม่' },
  { name: 'Temperance', meaning: 'การพยายามปรับเข้าหากัน' },
  { name: 'The Devil', meaning: 'ความสัมพันธ์ที่ตัดกันไม่ขาด' },
  { name: 'The Tower', meaning: 'ความจริงที่พังทุกอย่าง' },
  { name: 'The Star', meaning: 'ความหวังที่ยังเหลืออยู่' },
  { name: 'The Moon', meaning: 'ความสับสนและความไม่ชัดเจน' },
  { name: 'The Sun', meaning: 'ความชัดเจนและความสุข' },
  { name: 'Judgement', meaning: 'การกลับมาและการตัดสินใจครั้งใหญ่' },
  { name: 'The World', meaning: 'บทสรุปของความสัมพันธ์' },

  /* Cups */

  { name: 'Ace of Cups', meaning: 'ความรู้สึกใหม่ๆกำลังก่อตัว' },
  { name: 'Two of Cups', meaning: 'ยังมีสายสัมพันธ์ต่อกัน' },
  { name: 'Three of Cups', meaning: 'มีคนอื่นหรือความสัมพันธ์ซ้อน' },
  { name: 'Four of Cups', meaning: 'ความเบื่อและความเฉยชา' },
  { name: 'Five of Cups', meaning: 'ความเสียใจที่ยังไม่หาย' },
  { name: 'Six of Cups', meaning: 'ยังติดอยู่กับอดีต' },
  { name: 'Seven of Cups', meaning: 'อีกฝ่ายยังลังเล' },
  { name: 'Eight of Cups', meaning: 'การเดินออกมา' },
  { name: 'Nine of Cups', meaning: 'ยังมีความสุขบางอย่างอยู่' },
  { name: 'Ten of Cups', meaning: 'ความสัมพันธ์ที่มีโอกาสจริงจัง' },

  { name: 'Page of Cups', meaning: 'ความรู้สึกเด็กๆและการเริ่มสนใจ' },
  { name: 'Knight of Cups', meaning: 'คนที่ยังมีใจแต่ไม่ชัดเจน' },
  { name: 'Queen of Cups', meaning: 'ความอ่อนไหวและคิดมาก' },
  { name: 'King of Cups', meaning: 'เก็บความรู้สึกเก่งมาก' },

  /* Swords */

  { name: 'Ace of Swords', meaning: 'ความจริงกำลังถูกเปิดเผย' },
  { name: 'Two of Swords', meaning: 'การไม่ยอมตัดสินใจ' },
  { name: 'Three of Swords', meaning: 'ความเสียใจและแผลในใจ' },
  { name: 'Four of Swords', meaning: 'การเงียบและเว้นระยะ' },
  { name: 'Five of Swords', meaning: 'ความสัมพันธ์ที่เต็มไปด้วยอีโก้' },
  { name: 'Six of Swords', meaning: 'การค่อยๆห่างออกไป' },
  { name: 'Seven of Swords', meaning: 'การโกหกหรือปิดบัง' },
  { name: 'Eight of Swords', meaning: 'ความสัมพันธ์ที่อึดอัด' },
  { name: 'Nine of Swords', meaning: 'ความคิดมากและความกังวล' },
  { name: 'Ten of Swords', meaning: 'จุดจบที่เจ็บมาก' },

  { name: 'Page of Swords', meaning: 'กำลังแอบส่องหรือจับตาดูอยู่' },
  { name: 'Knight of Swords', meaning: 'อารมณ์แรงและพูดตรงเกินไป' },
  { name: 'Queen of Swords', meaning: 'เย็นชาแต่ยังรู้สึกอยู่' },
  { name: 'King of Swords', meaning: 'ใช้เหตุผลมากกว่าความรู้สึก' },

  /* Wands */

  { name: 'Ace of Wands', meaning: 'ความสัมพันธ์กำลังเริ่มร้อนแรง' },
  { name: 'Two of Wands', meaning: 'อีกฝ่ายกำลังมองทางเลือกอื่น' },
  { name: 'Three of Wands', meaning: 'กำลังรออะไรบางอย่าง' },
  { name: 'Four of Wands', meaning: 'ความสัมพันธ์มั่นคงขึ้น' },
  { name: 'Five of Wands', meaning: 'ความขัดแย้งและการทะเลาะ' },
  { name: 'Six of Wands', meaning: 'อีกฝ่ายยังต้องการการยอมรับ' },
  { name: 'Seven of Wands', meaning: 'การตั้งกำแพงป้องกันตัวเอง' },
  { name: 'Eight of Wands', meaning: 'เรื่องนี้กำลังเคลื่อนไหวเร็ว' },
  { name: 'Nine of Wands', meaning: 'ความเหนื่อยล้าทางใจ' },
  { name: 'Ten of Wands', meaning: 'ความสัมพันธ์ที่หนักเกินไป' },

  { name: 'Page of Wands', meaning: 'กำลังอยากเริ่มต้นใหม่' },
  { name: 'Knight of Wands', meaning: 'เข้ามาแรงแต่อาจไปเร็ว' },
  { name: 'Queen of Wands', meaning: 'เสน่ห์แรงและมั่นใจในตัวเอง' },
  { name: 'King of Wands', meaning: 'คนที่ชอบควบคุมเกม' },

  /* Pentacles */

  { name: 'Ace of Pentacles', meaning: 'โอกาสเริ่มต้นใหม่ที่มั่นคง' },
  { name: 'Two of Pentacles', meaning: 'อีกฝ่ายกำลังลังเล' },
  { name: 'Three of Pentacles', meaning: 'ต้องใช้ความร่วมมือมากขึ้น' },
  { name: 'Four of Pentacles', meaning: 'การยึดติดและไม่ปล่อย' },
  { name: 'Five of Pentacles', meaning: 'ความเหงาและการถูกทอดทิ้ง' },
  { name: 'Six of Pentacles', meaning: 'ความสัมพันธ์ที่ให้ไม่เท่ากัน' },
  { name: 'Seven of Pentacles', meaning: 'กำลังรอผลลัพธ์บางอย่าง' },
  { name: 'Eight of Pentacles', meaning: 'ยังพยายามกับความสัมพันธ์นี้อยู่' },
  { name: 'Nine of Pentacles', meaning: 'อีกฝ่ายเริ่มรักอิสระตัวเอง' },
  { name: 'Ten of Pentacles', meaning: 'ความสัมพันธ์ระยะยาวและอนาคต' },

  { name: 'Page of Pentacles', meaning: 'กำลังเริ่มคิดจริงจังมากขึ้น' },
  { name: 'Knight of Pentacles', meaning: 'ช้าแต่จริงจัง' },
  { name: 'Queen of Pentacles', meaning: 'ความสัมพันธ์ที่มั่นคงและดูแลกัน' },
  { name: 'King of Pentacles', meaning: 'ต้องการความมั่นคงระยะยาว' }

];

/* =========================
   สุ่มไพ่
========================= */

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

คุณเป็นคนที่วิเคราะห์ความสัมพันธ์เก่งมาก

กฎ:
- พูดตรง
- วิเคราะห์แบบคนจริง
- ไม่ต้องโลกสวย
- วิเคราะห์ปัญหาหลัก
- วิเคราะห์พฤติกรรมอีกฝ่าย
- ถ้า toxic ให้พูดตรงๆ
- ตอบอ่านง่าย
- สรุปตอนท้ายว่าควรไปต่อไหม

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

      const embed =

        new EmbedBuilder()

          .setColor('#202225')

          .setTitle(
            '🃏 วิเคราะห์ไพ่ทาโร่'
          )

          .setDescription(text)

          .addFields(

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
              'Nyx • Tarot Reading'

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
