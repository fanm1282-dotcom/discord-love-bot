const {
  SlashCommandBuilder
} = require('discord.js');

const {
  getUser,
  addMoney,
  removeMoney
} = require('../../utils/economy');

const {
  drawCard,
  calculateScore
} = require('../../utils/pokdeng/cards');

const {
  getPok
} = require('../../utils/pokdeng/rules');

const {
  createGameButtons,
  createReplayButtons
} = require('../../utils/pokdeng/buttons');

const {
  createGameEmbed,
  createResultEmbed
} = require('../../utils/pokdeng/embed');

const {
  createGameCollector
} = require('../../utils/pokdeng/collector');

const {
  updateStats
} = require('../../utils/pokdeng/stats');

const {
  getAiText
} = require('../../utils/pokdeng/aiText');

// 🎮 เกมหลัก
async function runGame(
  interaction,
  bet
) {

  // 👤 user
  const user =
    await getUser(
      interaction.user.id
    );

  // ❌ เงินไม่พอ
  if (
    user.money < bet
  ) {

    // 🎴 replay มาจากปุ่ม
    if (
      interaction.isButton()
    ) {

      return interaction.followUp({

        content:
          '❌ เงินมึงไม่พอ',

        flags: 64

      });

    }

    return interaction.reply({

      content:
        '❌ เงินมึงไม่พอ',

      flags: 64

    });

  }

  // 🃏 แจกไพ่
  const playerCards = [

    drawCard(),
    drawCard()

  ];

  const aiCards = [

    drawCard(),
    drawCard()

  ];

  // 🎯 แต้ม
  let playerScore =
    calculateScore(
      playerCards
    );

  let aiScore =
    calculateScore(
      aiCards
    );

  // 👑 ป็อก
  const playerPok =
    getPok(
      playerScore,
      playerCards
    );

  const aiPok =
    getPok(
      aiScore,
      aiCards
    );

  // 🤖 AI text
  const aiText =
    getAiText(
      user,
      'start'
    );

  // =========================
  // 🔥 มีป็อก
  // =========================

  if (
    playerPok ||
    aiPok
  ) {

    let result =
      '🤝 เสมอ';

    let resultType =
      'draw';

    let lose = false;

    // 🎉 ชนะ
    if (
      playerPok &&
      !aiPok
    ) {

      result =
        `🎉 ชนะ +${bet.toLocaleString()}$`;

      resultType =
        'win';

    }

    // 💀 แพ้
    else if (
      !playerPok &&
      aiPok
    ) {

      lose = true;

      result =
        `💀 แพ้ -${bet.toLocaleString()}$`;

      resultType =
        'lose';

    }

    // 👑 เทียบ rank
    else if (
      playerPok &&
      aiPok
    ) {

      if (
        playerPok.rank >
        aiPok.rank
      ) {

        result =
          `🎉 ชนะ +${bet.toLocaleString()}$`;

        resultType =
          'win';

      }

      else if (
        playerPok.rank <
        aiPok.rank
      ) {

        lose = true;

        result =
          `💀 แพ้ -${bet.toLocaleString()}$`;

        resultType =
          'lose';

      }

    }

    // 💰 เงิน
    if (
      resultType === 'win'
    ) {

      await addMoney(

        interaction.user.id,
        bet

      );

    }

    else if (
      resultType === 'lose'
    ) {

      await removeMoney(

        interaction.user.id,
        bet

      );

    }

    // 📊 stats
    await updateStats(

      user,

      {
        result:
          resultType,

        amount:
          bet
      }

    );

    // 👤 user ใหม่
    const updatedUser =
      await getUser(
        interaction.user.id
      );

    // 🎴 replay
    const replayRow =
      createReplayButtons(
        bet
      );

    // 🎴 embed
    const embed =
      createResultEmbed({

        user:
          updatedUser,

        aiCards,
        aiScore,

        aiPok,

        aiMulti: {

          name:
            '➖ ปกติ'

        },

        playerCards,
        playerScore,

        playerPok,

        playerMulti: {

          name:
            '➖ ปกติ'

        },

        result,

        aiText:
          getAiText(

            updatedUser,
            resultType

          ),

        updatedMoney:
          updatedUser.money

      });

    // 🎴 replay จากปุ่ม
    if (
      interaction.isButton()
    ) {

      await interaction.update({

        embeds: [embed],

        components: [
          replayRow
        ]

      });

      const msg =
        await interaction.fetchReply();

      return createGameCollector({

        msg,
        interaction,

        user:
          updatedUser,

        playerCards,
        aiCards,

        playerScore,
        aiScore,

        bet,

        runGame

      });

    }

    // 🎴 รอบแรก
    const msg =
      await interaction.reply({

        embeds: [embed],

        components: [
          replayRow
        ],

        fetchReply: true

      });

    return createGameCollector({

      msg,
      interaction,

      user:
        updatedUser,

      playerCards,
      aiCards,

      playerScore,
      aiScore,

      bet,

      runGame

    });

  }

  // =========================
  // 🎮 เล่นปกติ
  // =========================

  const gameRow =
    createGameButtons();

  // 🎴 embed
  const embed =
    createGameEmbed({

      user,

      playerCards,
      playerScore,

      bet,

      aiText

    });

  let msg;

  // 🎴 replay จากปุ่ม
  if (
    interaction.isButton()
  ) {

    await interaction.update({

      embeds: [embed],

      components: [
        gameRow
      ]

    });

    msg =
      await interaction.fetchReply();

  }

  // 🎴 รอบแรก
  else {

    msg =
      await interaction.reply({

        embeds: [embed],

        components: [
          gameRow
        ],

        fetchReply: true

      });

  }

  // 🎮 collector
  await createGameCollector({

    msg,
    interaction,

    user,

    playerCards,
    aiCards,

    playerScore,
    aiScore,

    bet,

    runGame

  });

}

module.exports = {

  data:
    new SlashCommandBuilder()

      .setName(
        'pokdeng'
      )

      .setDescription(
        'เล่นป๊อกเด้ง'
      )

      .addIntegerOption(

        option =>

          option

            .setName(
              'bet'
            )

            .setDescription(
              'เงินเดิมพัน'
            )

            .setRequired(
              true
            )

      ),

  async execute(
    interaction
  ) {

    const bet =
      interaction.options
        .getInteger(
          'bet'
        );

    // ❌ จำกัดเดิมพัน
    if (

      bet < 100 ||

      bet > 2000

    ) {

      return interaction.reply({

        content:
          '❌ เดิมพันได้ 100 - 2000',

        flags: 64

      });

    }

    return runGame(
      interaction,
      bet
    );

  }

};
