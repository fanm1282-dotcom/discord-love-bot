const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const {
  getMoney
} = require('../../utils/economy');

module.exports = {

  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('ดูเงินของตัวเอง'),

  async execute(interaction) {

    const money =
      await getMoney(
        interaction.user.id
      );

    const embed =
      new EmbedBuilder()

      .setTitle('💰 กระเป๋าเงิน')

      .setDescription(
        `มึงมีเงิน ${money.toLocaleString()}$`
      );

    await interaction.reply({
      embeds: [embed]
    });

  }
};
