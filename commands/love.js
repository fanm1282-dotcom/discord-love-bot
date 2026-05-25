const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

module.exports = {

  data:
    new SlashCommandBuilder()

      .setName(
        'ดูดวง'
      )

      .setDescription(
        'ดูดวงความรัก'
      ),

  async execute(
    interaction
  ) {

    const modal =
      new ModalBuilder()

        .setCustomId(
          'love_modal'
        )

        .setTitle(
          'ดูดวงความรัก'
        );

    const status =
      new TextInputBuilder()

        .setCustomId(
          'status'
        )

        .setLabel(
          'สถานะความสัมพันธ์'
        )

        .setStyle(
          TextInputStyle.Short
        );

    const concern =
      new TextInputBuilder()

        .setCustomId(
          'concern'
        )

        .setLabel(
          'กังวลเรื่องอะไร'
        )

        .setStyle(
          TextInputStyle.Paragraph
        );

    const behavior =
      new TextInputBuilder()

        .setCustomId(
          'behavior'
        )

        .setLabel(
          'อีกฝ่ายเป็นยังไงล่าสุด'
        )

        .setStyle(
          TextInputStyle.Paragraph
        );

    const question =
      new TextInputBuilder()

        .setCustomId(
          'question'
        )

        .setLabel(
          'อยากรู้อะไร'
        )

        .setStyle(
          TextInputStyle.Paragraph
        );

    modal.addComponents(

      new ActionRowBuilder()
        .addComponents(
          status
        ),

      new ActionRowBuilder()
        .addComponents(
          concern
        ),

      new ActionRowBuilder()
        .addComponents(
          behavior
        ),

      new ActionRowBuilder()
        .addComponents(
          question
        )
    );

    await interaction
      .showModal(
        modal
      );
  }
};
