const {
  Events,
  EmbedBuilder
} = require('discord.js');

const {
  askLoveAI
} = require(
  '../utils/ai'
);

module.exports = {

  name:
    Events.InteractionCreate,

  async execute(
    interaction,
    client
  ) {

    if (
      interaction
        .isChatInputCommand()
    ) {

      const command =
        client.commands.get(
          interaction.commandName
        );

      if (!command)
        return;

      await command.execute(
        interaction
      );
    }

    if (
      interaction
        .isModalSubmit()
    ) {

      if (
        interaction.customId !==
        'love_modal'
      ) return;

      await interaction
        .deferReply();

      const result =
        await askLoveAI({

          status:
            interaction.fields.getTextInputValue(
              'status'
            ),

          concern:
            interaction.fields.getTextInputValue(
              'concern'
            ),

          behavior:
            interaction.fields.getTextInputValue(
              'behavior'
            ),

          question:
            interaction.fields.getTextInputValue(
              'question'
            )
        });

      const embed =
        new EmbedBuilder()

          .setTitle(
            '🔮 ดูดวงความรัก'
          )

          .setDescription(
            result
          );

      await interaction
        .editReply({
          embeds: [embed]
        });
    }
  }
};
