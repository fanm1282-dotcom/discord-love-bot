const {

  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle

} = require('discord.js');

// 🟢 จั่ว / 🔴 พอ
function createGameButtons() {

  return new ActionRowBuilder()

    .addComponents(

      new ButtonBuilder()

        .setCustomId(
          'draw'
        )

        .setLabel(
          '🟢 จั่ว'
        )

        .setStyle(
          ButtonStyle.Success
        ),

      new ButtonBuilder()

        .setCustomId(
          'stand'
        )

        .setLabel(
          '🔴 พอ'
        )

        .setStyle(
          ButtonStyle.Danger
        )

    );

}

// 🎴 เล่นอีกครั้ง
function createReplayButtons(
  bet
) {

  return new ActionRowBuilder()

    .addComponents(

      new ButtonBuilder()

        .setCustomId(
          `again_${bet}`
        )

        .setLabel(
          '🎴 เล่นอีกครั้ง'
        )

        .setStyle(
          ButtonStyle.Primary
        )

    );

}

module.exports = {

  createGameButtons,
  createReplayButtons

};
