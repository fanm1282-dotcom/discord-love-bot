const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require('discord.js');

const {
  removeMoney
} = require('../../utils/economy');

module.exports = {

  data: new SlashCommandBuilder()

    .setName('removemoney')

    .setDescription('ลบเงินผู้เล่น')

    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('ผู้เล่น')
        .setRequired(true)
    )

    .addIntegerOption(option =>
      option
        .setName('amount')
        .setDescription('จำนวนเงิน')
        .setRequired(true)
    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {

    const target =
      interaction.options.getUser('user');

    const amount =
      interaction.options.getInteger('amount');

    if (amount <= 0) {

      return interaction.reply({

        content:
          '❌ จำนวนเงินต้องมากกว่า 0',

        ephemeral: true

      });

    }

    await removeMoney(
      target.id,
      amount
    );

    const embed =
      new EmbedBuilder()

      .setTitle('💸 ลบเงินสำเร็จ')

      .setDescription(`
👤 ผู้เล่น:
${target}

💰 ลบ:
${amount.toLocaleString()}$
`);

    await interaction.reply({
      embeds: [embed]
    });

  }
};
