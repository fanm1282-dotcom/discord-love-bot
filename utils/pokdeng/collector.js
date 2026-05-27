const {
  ComponentType
} = require('discord.js');

const {
  drawCard,
  calculateScore
} = require('./cards');

const {
  getMultiplier,
  getPok,
  shouldAiDraw
} = require('./rules');

const {
  createReplayButtons
} = require('./buttons');

const {
  createResultEmbed
} = require('./embed');

const {
  updateStats
} = require('./stats');

const {
  rollEvent,
  getDealerMood
} = require('./events');

const {
  getAiText
} = require('./aiText');

const {
  addMoney,
  removeMoney,
  getUser
} = require('../economy');

// 🎮 collector
async function createGameCollector({

  msg,
  interaction,
  user,

  playerCards,
  aiCards,

  playerScore,
  aiScore,

  bet,

  runGame

}) {

  const collector =
    msg.createMessageComponentCollector({

      componentType:
        ComponentType.Button,

      time: 30000

    });

  collector.on(
    'collect',

    async i => {

      try {

        // ❌ กันคนอื่นกด
        if (
          i.user.id !==
          interaction.user.id
        ) {

          return i.reply({

            content:
              '❌ ไม่ใช่เกมมึง',

            ephemeral: true

          });

        }

        // =========================
        // 🎴 เล่นอีกครั้ง
        // =========================

        if (
          i.customId.startsWith(
            'again_'
          )
        ) {

          const replayBet =
            parseInt(

              i.customId
                .split('_')[1]

            );

          await i.deferUpdate();

          collector.stop();

          return runGame(
            i,
            replayBet
          );

        }

        // =========================
        // 🟢 จั่ว
        // =========================

        if (
          i.customId === 'draw'
        ) {

          playerCards.push(
            drawCard()
          );

        }

        // =========================
        // 🔴 พอ
        // =========================

        if (
          i.customId === 'stand'
        ) {

          // ไม่ต้องทำอะไร
          // ไปคำนวณต่อเลย

        }

        // =========================
        // 🤖 AI จั่ว
        // =========================

        if (
          shouldAiDraw(
            aiScore
          )
        ) {

          aiCards.push(
            drawCard()
          );

        }

        // 🎯 คำนวณใหม่
        playerScore =
          calculateScore(
            playerCards
          );

        aiScore =
          calculateScore(
            aiCards
          );

        // 🎴 multiplier
        const playerMulti =
          getMultiplier(
            playerCards
          );

        const aiMulti =
          getMultiplier(
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

        // 🎲 event
        const event =
          rollEvent();

        // 🤖 mood
        const mood =
          getDealerMood(
            user
          );

        let lose = false;

        let multi = 1;

        let playerRank =
          playerMulti.rank;

        let aiRank =
          aiMulti.rank;

        if (playerPok) {

          playerRank =
            playerPok.rank;

        }

        if (aiPok) {

          aiRank =
            aiPok.rank;

        }

        // =========================
        // 👑 ตัดสิน
        // =========================

        if (
          playerRank >
          aiRank
        ) {

          multi =
            playerMulti.multi;

        }

        else if (
          playerRank <
          aiRank
        ) {

          lose = true;

          multi =
            aiMulti.multi;

        }

        else {

          if (
            playerScore >
            aiScore
          ) {

            multi =
              playerMulti.multi;

          }

          else if (
            playerScore <
            aiScore
          ) {

            lose = true;

            multi =
              aiMulti.multi;

          }

        }

        // =========================
        // 🔥 event bonus
        // =========================

        if (event) {

          if (
            event.multi > 0
          ) {

            multi *=
              event.multi;

          }

          else {

            lose = true;

          }

        }

        // 💰 เงิน
        const money =
          bet * multi;

        let result =
          '🤝 เสมอ';

        let resultType =
          'draw';

        // 🎉 ชนะ
        if (
          !lose &&
          (
            playerScore >
            aiScore ||

            playerRank >
            aiRank
          )
        ) {

          await addMoney(

            interaction.user.id,
            money

          );

          result =
            `🎉 ชนะ +${money.toLocaleString()}$`;

          resultType =
            'win';

        }

        // 💀 แพ้
        else if (
          lose
        ) {

          await removeMoney(

            interaction.user.id,
            money

          );

          result =
            `💀 แพ้ -${money.toLocaleString()}$`;

          resultType =
            'lose';

        }

        // 📊 stats
        await updateStats(

          user,

          {
            result:
              resultType,

            amount:
              money
          }

        );

        // 👤 user ใหม่
        const updatedUser =
          await getUser(
            interaction.user.id
          );

        // 🤖 AI text
        const aiText =
          getAiText(

            updatedUser,
            resultType

          );

        // 🎴 embed
        const embed =
          createResultEmbed({

            user:
              updatedUser,

            aiCards,
            aiScore,
            aiPok,
            aiMulti,

            playerCards,
            playerScore,
            playerPok,
            playerMulti,

            result,
            aiText,

            event,
            mood,

            updatedMoney:
              updatedUser.money

          });

        // 🎴 replay button
        const replayRow =
          createReplayButtons(
            bet
          );

        // 🔄 update
        await i.update({

          embeds: [embed],

          components: [
            replayRow
          ]

        });

      } catch (err) {

        console.log(err);

      }

    }

  );

  // ⏰ หมดเวลา
  collector.on(
    'end',

    async () => {

      try {

        await msg.edit({

          components: []

        });

      } catch {}

    }

  );

}

module.exports = {

  createGameCollector

};
