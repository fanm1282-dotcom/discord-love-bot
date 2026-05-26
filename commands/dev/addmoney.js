const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require('discord.js');

const {
  addMoney
} = require('../../utils/economy');

module.exports = {

  data: new SlashCommandBuilder()

    .setName('addmoney')

    .setDescription('เสกเงินให้ผู้เล่น')

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

    // เฉพาะแอดมินใช้ได้
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

    await addMoney(
      target.id,
      amount
    );

    const embed =
      new EmbedBuilder()

      .setTitle('💸 เสกเงินสำเร็จ')

      .setDescription(`
👤 ผู้เล่น:
${target}

💰 จำนวน:
${amount.toLocaleString()}$
`);

    await interaction.reply({
      embeds: [embed]
    });

  }
};
