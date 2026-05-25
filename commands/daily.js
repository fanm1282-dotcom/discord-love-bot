const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const openai =
  require('../utils/openai');

const DailyLove =
  require('../models/DailyLove');

const Streak =
  require('../models/Streak');

/* =========================
   COOLDOWN
========================= */

const cooldowns =
  new Map();

/* =========================
   DATA
========================= */

const cards = [

  'The Moon',
  'The Lovers',
  'The Devil',
  'Death',
  'The Star',
  'Justice',
  'The Tower',
  'Wheel of Fortune',
  'The Hermit',
  'Ace of Cups',
  'Three of Swords',
  'Ten of Swords',
  'Knight of Cups',
  'Queen of Wands',
  'King of Swords',
  'The Sun',
  'Judgement',
  'Temperance',
  'The Fool',
  'Strength'

];

const moods = [

  'คนเก่ากำลังย้อนกลับมาคิดถึงคุณ',
  'อีกฝ่ายกำลังแอบส่องคุณอยู่',
  'คืนนี้มีเกณฑ์เผลอทักคนเดิม',
  'ความสัมพันธ์ไม่ชัดเจนกำลังกลับมา',
  'อีกฝ่ายยังไม่ move on จริง',
  'มีบางอย่างยังค้างอยู่ในใจเขา',
  'ความเงียบของเขาเริ่มมีความหมาย',
  'วันนี้เสี่ยงกลับไป toxic relationship',
  'คนบางคนกำลังเช็คว่าคุณยังรออยู่ไหม',
  'คืนนี้หัวใจจะอ่อนแอกว่าปกติ',
  'มีเกณฑ์วนกลับไปคิดเรื่องเก่า',
  'ความสัมพันธ์เก่ากำลังย้อนกลับมา',
  'มีคนกำลังเฝ้าดูการเคลื่อนไหวของคุณ',
  'คืนนี้อารมณ์จะชนะเหตุผล',
  'มีบางคนยังไม่ลืมคุณจริงๆ'

];

const warnings = [

  'อย่าทักกลับเพราะเหงา',
  'อย่ากลับไปหาคนที่ทำร้ายคุณ',
  'คืนนี้อย่าคิดมากเกินไป',
  'บางคนกลับมาเพราะไม่มีใคร',
  'อย่ารอคำตอบจากคนที่เงียบใส่คุณ',
  'ความคิดถึง ไม่ได้แปลว่าไปต่อได้',
  'อย่าปล่อยให้ความเหงาพาคุณกลับไป',
  'คืนนี้มีเกณฑ์เผลอใจ',
  'อย่าซ่อมใจคนที่ทำร้ายคุณ',
  'ระวังความสัมพันธ์ไม่ชัดเจน',
  'อย่าเชื่อทุกคำพูดในคืนนี้',
  'คืนนี้คุณจะอ่อนแอกว่าปกติ',
  'อย่าหวังกับคนที่ไม่เคยชัดเจน',
  'ความเงียบก็คือคำตอบ',
  'บางคนคิดถึงคุณแค่ตอนเหงา'

];

const quotes = [

  'บางคนกลับมา เพราะไม่มีใคร ไม่ใช่เพราะรัก',
  'เขาอาจคิดถึงคุณ แต่ไม่ได้อยากกลับมา',
  'การเงียบ คือคำตอบที่ชัดที่สุด',
  'คนที่รักจริง จะไม่ทำให้คุณต้องเดา',
  'ความรักที่ดี ไม่ควรทำให้เหนื่อยทุกวัน',
  'บางครั้งการไม่ทัก คือการรักษาใจตัวเอง',
  'เขาอาจเสียดายคุณ ไม่ใช่อยากกลับมา',
  'ความคิดถึง ไม่ได้แปลว่าไปต่อได้',
  'คุณกำลังรักความทรงจำ ไม่ใช่ตัวเขา',
  'อย่ากลับไป เพราะแค่เหงา',
  'บางคนมีไว้คิดถึง ไม่ได้มีไว้กลับไปหา',
  'เขารู้ว่าคุณรอ เลยไม่รีบกลับมา',
  'ถ้าต้องเดาตลอด มันไม่ใช่ความสัมพันธ์ที่ดี',
  'คนที่อยากมีคุณจริง จะไม่หายไปเฉยๆ',
  'อย่าพยายามเป็นคนเดิม เพื่อให้ใครกลับมา',
  'เขาอาจรักคุณ แต่ไม่พอจะรักษาคุณ',
  'การรอคนที่ไม่ชัดเจน คือการทำร้ายตัวเอง',
  'บางความสัมพันธ์จบไปนานแล้ว แต่ใจยังไม่ยอมรับ',
  'ความเงียบของเขา กำลังพูดทุกอย่างอยู่',
  'คนที่รักจริง จะไม่ปล่อยให้คุณสับสน',
  'บางคนกลับมา แค่เช็คว่าคุณยังอยู่ไหม',
  'เขาไม่ได้ลืมคุณ แค่เลือกเงียบ',
  'คืนนี้คุณจะคิดถึงคนที่ไม่ควรคิดถึง',
  'บางคนเก่งเรื่องทำให้เราหวัง',
  'เขาไม่ได้อยากเสียคุณ แค่อยากมีคุณไว้',
  'อย่ารอข้อความ จากคนที่เลือกหายไป',
  'คนที่ทำให้คุณร้องไห้บ่อย ไม่ใช่ safe zone',
  'บางครั้ง closure คือการที่เขาไม่กลับมาอีกเลย',
  'คุณไม่ได้อ่อนแอ แค่ผูกพันมากเกินไป',
  'เขาอาจยังดูคุณอยู่ แค่ไม่กล้ากลับมา',
  'คนบางคนคิดถึงเรา ตอนที่ไม่มีใคร',
  'คุณกำลังเหนื่อย เพราะพยายามอยู่ฝ่ายเดียว',
  'อย่าตามหาคำตอบ จากคนที่ไม่เคยชัดเจน',
  'บางครั้งการ move on คือการหยุดหวัง',
  'ความสัมพันธ์นี้กำลังอยู่ได้ด้วยความผูกพัน',
  'เขายังจำวันที่มีคุณได้ แค่ไม่กลับไปแล้ว',
  'อย่ากลับไปซ่อมความสัมพันธ์ ที่พังคุณไปแล้ว',
  'คนที่อยากอยู่ จะหาทางอยู่',
  'คืนนี้มีเกณฑ์เผลอเปิดแชทเก่า',
  'เขาอาจกำลังดูว่าคุณ move on หรือยัง',
  'บางคนรักคุณ ในแบบที่ทำร้ายคุณ',
  'อย่าฝืนความสัมพันธ์ที่หมดแรงแล้ว',
  'บางคนชอบตอนที่คุณยังรอ',
  'คืนนี้อารมณ์จะชนะเหตุผล',
  'คุณสมควรได้ความรักที่ชัดเจน',
  'บางคนทำให้คุณติด เพราะเขาไม่เคยชัดเจน',
  'คืนนี้มีเกณฑ์ย้อนกลับไปคิดเรื่องเก่า',
  'คุณไม่ได้แพ้ แค่รักผิดคน',
  'เขาอาจคิดถึงคุณมากกว่าที่พูด',
  'บางคนเข้ามา เพื่อสอน ไม่ได้อยู่ตลอดไป'

];

function random(arr) {

  return arr[
    Math.floor(
      Math.random() *
      arr.length
    )
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

      .setName('dailylove')

      .setDescription(
        'ดูดวงความรักรายวัน'
      ),

  async execute(interaction) {

    /* =========================
       COOLDOWN
    ========================= */

    const userId =
      interaction.user.id;

    const cooldown =
      12 * 60 * 60 * 1000;

    const now =
      Date.now();

    if (
      cooldowns.has(userId)
    ) {

      const expiration =

        cooldowns.get(userId) +
        cooldown;

      if (now < expiration) {

        const left =
          expiration - now;

        const hours =
          Math.floor(
            left / 3600000
          );

        const minutes =
          Math.floor(
            (left % 3600000)
            / 60000
          );

        return interaction.reply({

          content:
            `⏳ คุณดูดวงไปแล้ว\nรออีก ${hours} ชั่วโมง ${minutes} นาที`,

          ephemeral: true

        });

      }

    }

    cooldowns.set(
      userId,
      now
    );

    await interaction.deferReply();

    try {

      const today =

        new Date()

        .toISOString()

        .split('T')[0];

      /* =========================
         DAILY CHECK
      ========================= */

      let daily =

        await DailyLove.findOne({

          userId:
            interaction.user.id,

          date: today

        });

      /* =========================
         STREAK
      ========================= */

      let streakData =

        await Streak.findOne({

          userId:
            interaction.user.id

        });

      if (!streakData) {

        streakData =
          await Streak.create({

            userId:
              interaction.user.id,

            streak: 1,

            lastDate: today

          });

      } else {

        if (
          streakData.lastDate !==
          today
        ) {

          streakData.streak += 1;

          streakData.lastDate =
            today;

          await streakData.save();

        }

      }

      /* =========================
         USE OLD DAILY
      ========================= */

      if (daily) {

        return interaction.editReply({

          embeds: [daily.result]

        });

      }

      /* =========================
         RANDOM VALUES
      ========================= */

      const charm =
        Math.floor(
          Math.random() * 41
        ) + 55;

      const ex =
        Math.floor(
          Math.random() * 70
        ) + 10;

      const toxic =
        Math.floor(
          Math.random() * 60
        ) + 20;

      const overthink =
        Math.floor(
          Math.random() * 70
        ) + 20;

      const stalking =
        Math.floor(
          Math.random() * 80
        ) + 10;

      const moveon =
        Math.floor(
          Math.random() * 70
        ) + 10;

      const card =
        random(cards);

      const mood =
        random(moods);

      const warning =
        random(warnings);

      const quote =
        random(quotes);

      /* =========================
         AI
      ========================= */

      const response =

        await openai.chat.completions.create({

          model:
            'openai/gpt-oss-20b:free',

          messages: [

            {

              role: 'system',

              content: `

คุณคือ Nyx

AI ดูดวงความรักรายวัน

กฎ:
- พูดตรง
- พูดเหมือนคนจริง
- ไม่เบียว
- อ่านง่าย
- วิเคราะห์เหมือนรู้จริง
- ตอบสั้น 4-6 บรรทัด
- ถ้าความสัมพันธ์แย่ให้พูดตรง
- ตอนท้ายต้องมี "สรุป:"

ค่าดวง:
เสน่ห์ ${charm}%
คนเก่าทัก ${ex}%
Toxic ${toxic}%
คิดมาก ${overthink}%
เขาแอบส่อง ${stalking}%
Move on ${moveon}%

พลังวันนี้:
${mood}

ไพ่:
${card}

คำเตือน:
${warning}

คำแทงใจ:
${quote}

`

            },

            {

              role: 'user',

              content:
                'ดูดวงความรักวันนี้'

            }

          ],

          temperature: 0.9,

          max_tokens: 140

        });

      const text =
        response.choices[0]
          .message.content;

      /* =========================
         EMBED
      ========================= */

      const embed =

        new EmbedBuilder()

          .setColor('#ff4d6d')

          .setTitle(
            '💘 ดวงความรักวันนี้'
          )

          .setDescription(text)

          .addFields(

            {
              name:
                '🩶 พลังวันนี้',

              value: mood,

              inline: false
            },

            {
              name:
                '🃏 ไพ่วันนี้',

              value: card,

              inline: false
            },

            {
              name:
                '🔥 Streak',

              value:
                `${streakData.streak} วัน`,

              inline: false
            },

            {
              name:
                '💋 เสน่ห์',

              value:
                `${bar(charm)} ${charm}%`,

              inline: false
            },

            {
              name:
                '📩 คนเก่าทัก',

              value:
                `${bar(ex)} ${ex}%`,

              inline: false
            },

            {
              name:
                '📡 เขาแอบส่อง',

              value:
                `${bar(stalking)} ${stalking}%`,

              inline: false
            },

            {
              name:
                '🧠 คิดมาก',

              value:
                `${bar(overthink)} ${overthink}%`,

              inline: false
            },

            {
              name:
                '🚩 Toxic',

              value:
                `${bar(toxic)} ${toxic}%`,

              inline: false
            },

            {
              name:
                '🧊 Move On',

              value:
                `${bar(moveon)} ${moveon}%`,

              inline: false
            },

            {
              name:
                '⚠️ คำเตือน',

              value: warning,

              inline: false
            },

            {
              name:
                '🖤 คำแทงใจ',

              value: quote,

              inline: false
            }

          )

          .setFooter({

            text:
              'Nyx • Daily Love'

          })

          .setTimestamp();

      /* =========================
         SAVE DAILY
      ========================= */

      await DailyLove.create({

        userId:
          interaction.user.id,

        date: today,

        result:
          embed.toJSON()

      });

      await interaction.editReply({

        embeds: [embed]

      });

    } catch (err) {

      console.error(err);

      await interaction.editReply(
        'วันนี้ยังอ่านดวงไม่ได้'
      );

    }

  }

};
