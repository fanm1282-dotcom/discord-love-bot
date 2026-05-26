const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require('discord.js');

const {
  getUser
} = require('../../utils/economy');

module.exports = {

  data: new SlashCommandBuilder()

    .setName('setmoney')

    .setDescription('ตั้งค่าเงินผู้เล่น')

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

    if (amount < 0) {

      return interaction.reply({

        content:
          '❌ เงินติดลบไม่ได้',

        ephemeral: true

      });

    }

    const user =
      await getUser(target.id);

    user.money = amount;

    await user.save();

    const embed =
      new EmbedBuilder()

      .setTitle('💰 ตั้งค่าเงินสำเร็จ')

      .setDescription(`
👤 ผู้เล่น:
${target}

💸 เงินใหม่:
${amount.toLocaleString()}$
`);

    await interaction.reply({
      embeds: [embed]
    });

  }
};
