const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const {
  randomCard,
  randomAura
} = require('../utils/fate');

module.exports = {

  data:
    new SlashCommandBuilder()

      .setName('daily')

      .setDescription(
        'ดวงความรักประจำวัน'
      ),

  async execute(interaction) {

    const card =
      randomCard();

    const aura =
      randomAura();

    const messages = [

      'คืนนี้หัวใจบางดวงกำลังคิดถึงกันเงียบๆ',

      'ความเงียบของใครบางคน ไม่ได้แปลว่าไร้ความรู้สึก',

      'โชคชะตากำลังผลักบางคนกลับมา',

      'มีบางอย่างในอดีตกำลังจะหวนคืน',

      'คืนนี้เหมาะกับการปล่อยวาง มากกว่าการรอคอย'

    ];

    const text =

      messages[
        Math.floor(
          Math.random() *
          messages.length
        )
      ];

    const embed =

      new EmbedBuilder()

        .setTitle(
          '🌙 ดวงความรักวันนี้'
        )

        .setDescription(text)

        .addFields(

          {
            name: '🃏 ไพ่ประจำวัน',
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
            'Nyx • เสียงกระซิบแห่งโชคชะตา'

        });

    await interaction.reply({

      embeds: [embed]

    });

  }

};
