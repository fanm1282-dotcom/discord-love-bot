const {
  SlashCommandBuilder
} = require('discord.js');

const {
  askCasinoAI
} = require('../../utils/casinoAI');

const {
  getUser
} = require('../../utils/economy');

module.exports = {

  data:
    new SlashCommandBuilder()

      .setName('dealer')

      .setDescription(
        'คุยกับเจ้ามือคาสิโน'
      )

      .addStringOption(option =>

        option

          .setName('message')

          .setDescription(
            'ข้อความ'
          )

          .setRequired(true)

      ),

  async execute(interaction) {

    const message =

      interaction.options
        .getString('message');

    const user =
      await getUser(
        interaction.user.id
      );

    try {

      const aiReply =
        await askCasinoAI(
          user,
          message
        );

      await interaction.reply({

        content:
          `🤖 ${aiReply}`

      });

    } catch (err) {

      console.log(err);

      await interaction.reply({

        content:
          '🤖 วันนี้กูง่วง'

      });

    }

  }

};
