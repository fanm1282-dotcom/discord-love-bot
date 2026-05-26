const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const {
  addMoney,
  getUser
} = require('../../utils/economy');

module.exports = {

  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('ทำงานหาเงิน'),

  async execute(interaction) {

    const user =
      await getUser(
        interaction.user.id
      );

    const now = Date.now();

    const cooldown =
      10 * 60 * 1000;

    if (user.lastWork) {

      const remaining =
        cooldown - (now - user.lastWork);

      if (remaining > 0) {

        const minutes =
          Math.floor(
            remaining / (1000 * 60)
          );

        const seconds =
          Math.floor(
            (remaining % (1000 * 60))
            / 1000
          );

        return interaction.reply({

          embeds: [
            new EmbedBuilder()

              .setTitle('⏳ ยังทำงานไม่ได้')

              .setDescription(
                `พักอีก ${minutes} นาที ${seconds} วินาที`
              )
          ],

          ephemeral: true

        });

      }

    }

    const jobs = {

      1: {
        name: 'เด็กเสิร์ฟ',
        min: 50,
        max: 100
      },

      2: {
        name: 'พนักงานเซเว่น',
        min: 80,
        max: 140
      },

      3: {
        name: 'ไรเดอร์ส่งอาหาร',
        min: 120,
        max: 180
      },

      4: {
        name: 'เด็กปั๊ม',
        min: 160,
        max: 220
      },

      5: {
        name: 'พนักงานร้านเกม',
        min: 200,
        max: 280
      },

      6: {
        name: 'ช่างคอม',
        min: 250,
        max: 350
      },

      7: {
        name: 'สตรีมเมอร์',
        min: 320,
        max: 420
      },

      8: {
        name: 'โปรแกรมเมอร์',
        min: 400,
        max: 520
      },

      9: {
        name: 'นักลงทุน',
        min: 500,
        max: 650
      },

      10: {
        name: 'เจ้าของร้าน',
        min: 650,
        max: 800
      },

      11: {
        name: 'เจ้าของบริษัท',
        min: 800,
        max: 1000
      },

      12: {
        name: 'เจ้าพ่อคาสิโน',
        min: 1000,
        max: 1300
      },

      13: {
        name: 'มหาเศรษฐี',
        min: 1300,
        max: 1700
      },

      14: {
        name: 'ราชาโลกใต้ดิน',
        min: 1700,
        max: 2200
      },

      15: {
        name: 'พระเจ้าแห่งเงิน',
        min: 2200,
        max: 3000
      }

    };

    // สร้างค่าเริ่มต้น
    if (!user.workLevel)
      user.workLevel = 1;

    if (!user.workXp)
      user.workXp = 0;

    const job =
      jobs[user.workLevel];

    // สุ่มเงิน
    const reward =
      Math.floor(
        Math.random() *
        (job.max - job.min + 1)
      ) + job.min;

    // เพิ่มเงิน
    await addMoney(
      interaction.user.id,
      reward
    );

    // EXP
    user.workXp += 1;

    // EXP ที่ต้องใช้
    const neededXp =
      user.workLevel * 5;

    let leveledUp = false;

    // เลื่อนขั้น
    if (
      user.workXp >= neededXp &&
      user.workLevel < 15
    ) {

      user.workXp = 0;

      user.workLevel += 1;

      leveledUp = true;

    }

    user.lastWork = now;

    await user.save();

    const nextJob =
      jobs[user.workLevel];

    const embed =
      new EmbedBuilder()

      .setTitle('💼 ทำงานสำเร็จ')

      .setDescription(`
🧑‍💼 อาชีพ:
${job.name}

💸 ได้รับ:
${reward.toLocaleString()}$

📈 เลเวลอาชีพ:
${user.workLevel}

⭐ EXP:
${user.workXp}/${neededXp}

${leveledUp
? `🎉 มึงเลื่อนขั้นเป็น "${nextJob.name}"`
: ''}
`);

    await interaction.reply({
      embeds: [embed]
    });

  }
};
