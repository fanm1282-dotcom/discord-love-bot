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
    .setName('daily')
    .setDescription('รับเงินฟรีรายวัน'),

  async execute(interaction) {

    const user =
      await getUser(
        interaction.user.id
      );

    const now = Date.now();

    const cooldown =
      24 * 60 * 60 * 1000;

    if (user.lastDaily) {

      const remaining =
        cooldown - (now - user.lastDaily);

      if (remaining > 0) {

        const hours =
          Math.floor(
            remaining / (1000 * 60 * 60)
          );

        const minutes =
          Math.floor(
            (remaining % (1000 * 60 * 60))
            / (1000 * 60)
          );

        return interaction.reply({

          embeds: [
            new EmbedBuilder()

              .setTitle('⏳ ยังรับไม่ได้')

              .setDescription(
                `มารับใหม่อีก ${hours} ชม. ${minutes} นาที`
              )
          ],

          ephemeral: true

        });

      }

    }

    const reward = 300;

    await addMoney(
      interaction.user.id,
      reward
    );

    user.lastDaily = now;

    await user.save();

    const embed =
      new EmbedBuilder()

      .setTitle('💸 Daily Reward')

      .setDescription(
        `มึงได้รับ ${reward}$`
      );

    await interaction.reply({
      embeds: [embed]
    });

  }
};
