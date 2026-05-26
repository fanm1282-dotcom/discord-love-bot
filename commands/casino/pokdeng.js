const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} = require('discord.js');

const {
  getUser,
  addMoney,
  removeMoney
} = require('../../utils/economy');

const cards = [
  'A', '2', '3', '4', '5',
  '6', '7', '8', '9',
  '10', 'J', 'Q', 'K'
];

function drawCard() {

  return cards[
    Math.floor(
      Math.random() * cards.length
    )
  ];

}

function getValue(card) {

  if (
    ['10', 'J', 'Q', 'K']
      .includes(card)
  ) return 0;

  if (card === 'A')
    return 1;

  return parseInt(card);

}

function calculateScore(cards) {

  const total =
    cards.reduce(
      (sum, c) =>
        sum + getValue(c),
      0
    );

  return total % 10;

}

function getMultiplier(cards) {

  // ไพ่คู่
  if (
    cards.length === 2 &&
    cards[0] === cards[1]
  ) {

    return {
      name: '✨ ไพ่คู่ x2',
      multi: 2,
      rank: 3
    };

  }

  const yellow =
    ['J', 'Q', 'K'];

  // สามเหลือง
  if (
    cards.length === 3 &&
    cards.every(c =>
      yellow.includes(c)
    )
  ) {

    // ตองสามเหลือง
    if (
      cards[0] === cards[1] &&
      cards[1] === cards[2]
    ) {

      return {
        name: '🔥 ตองสามเหลือง x8',
        multi: 8,
        rank: 6
      };

    }

    return {
      name: '🟨 สามเหลือง x4',
      multi: 4,
      rank: 5
    };

  }

  return {
    name: '➖ ปกติ x1',
    multi: 1,
    rank: 1
  };

}

function getPok(score, cards) {

  if (cards.length !== 2)
    return null;

  if (score === 9)
    return {
      name: '👑 ป็อก 9',
      rank: 8
    };

  if (score === 8)
    return {
      name: '👑 ป็อก 8',
      rank: 7
    };

  return null;

}

function getAiText(user) {

  let aiTexts = [

    '🤖 คาสิโนไม่เคยขาดทุน',
    '🤖 ดวงมึงกากจัด',
    '🤖 มาอีกตาไหม',
    '🤖 เงินมึงหอมดี',
    '🤖 กูอ่านไพ่มึงออก',
    '🤖 วันนี้กูดวงแรง',
    '🤖 เอาเงินมา',
    '🤖 กูคือเจ้ามือ',
    '🤖 รีบเล่น',
    '🤖 วันนี้มึงไม่น่ารอด'

  ];

  // คนเล่นบ่อย
  if (user.casinoPlayed >= 10) {

    aiTexts.push(

      '🤖 อ้าว มึงอีกแล้วเหรอ',
      '🤖 วันนี้ยังจะเสียอีก?',
      '🤖 กูเริ่มจำหน้ามึงได้ละ',
      '🤖 มึงนี่เล่นทุกวันเลยนะ'

    );

  }

  // คนแพ้เยอะ
  if (user.casinoLose >= 15) {

    aiTexts.push(

      '🤖 คาสิโนรักมึงมาก',
      '🤖 เงินมึงเข้ากระเป๋ากูหมดละ',
      '🤖 มึงนี่สายเปย์จริงๆ',
      '🤖 ขอบคุณที่บริจาค'

    );

  }

  // คนชนะเยอะ
  if (user.casinoWin >= 10) {

    aiTexts.push(

      '🤖 กูเริ่มไม่ชอบหน้ามึงละ',
      '🤖 มึงโกงปะเนี่ย',
      '🤖 วันนี้ดวงมึงแรงเกิน',
      '🤖 กูต้องเอาคืนมึง'

    );

  }

  return aiTexts[
    Math.floor(
      Math.random() *
      aiTexts.length
    )
  ];

}

async function sendGame(
  interaction,
  data
) {

  const payload = {

    embeds: [data.embed],

    components: data.components || [],

    fetchReply: true

  };

  if (
    interaction.replied ||
    interaction.deferred
  ) {

    return await interaction.followUp(
      payload
    );

  }

  return await interaction.reply(
    payload
  );

}

async function runGame(
  interaction,
  bet
) {

  const user =
    await getUser(
      interaction.user.id
    );

  if (user.money < bet) {

    if (
      interaction.replied ||
      interaction.deferred
    ) {

      return interaction.followUp({

        content:
          '❌ เงินมึงไม่พอ',

        ephemeral: true

      });

    }

    return interaction.reply({

      content:
        '❌ เงินมึงไม่พอ',

      ephemeral: true

    });

  }

  user.casinoPlayed += 1;

  await user.save();

  const playerCards = [
    drawCard(),
    drawCard()
  ];

  const aiCards = [
    drawCard(),
    drawCard()
  ];

  let playerScore =
    calculateScore(playerCards);

  let aiScore =
    calculateScore(aiCards);

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

  // ไม่มีป็อก
  if (!playerPok && !aiPok) {

    const row =
      new ActionRowBuilder()

        .addComponents(

          new ButtonBuilder()

            .setCustomId('draw')

            .setLabel('🟢 จั่ว')

            .setStyle(
              ButtonStyle.Success
            ),

          new ButtonBuilder()

            .setCustomId('stand')

            .setLabel('🔴 พอ')

            .setStyle(
              ButtonStyle.Danger
            )

        );

    const embed =
      new EmbedBuilder()

        .setTitle('🃏 ป็อกเด้ง')

        .setDescription(`
${getAiText(user)}

🤖 AI:
🂠 🂠

━━━━━━━━━━━━━━

👤 มึง:
${playerCards.join(' | ')}

🎯 แต้ม:
${playerScore}

━━━━━━━━━━━━━━

💰 เดิมพัน:
${bet.toLocaleString()}$
`);

    const msg =
      await sendGame(

        interaction,

        {
          embed,
          components: [row]
        }

      );

    const collector =
      msg.createMessageComponentCollector({

        componentType:
          ComponentType.Button,

        time: 30000

      });

    collector.on(
      'collect',

      async i => {

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

        // เล่นอีกครั้ง
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

          return runGame(
            i,
            replayBet
          );

        }

        collector.stop();

        // จั่ว
        if (
          i.customId === 'draw'
        ) {

          playerCards.push(
            drawCard()
          );

        }

        // AI logic
        if (aiScore <= 4) {

          aiCards.push(
            drawCard()
          );

        }

        else if (
          aiScore === 5 &&
          Math.random() < 0.5
        ) {

          aiCards.push(
            drawCard()
          );

        }

        playerScore =
          calculateScore(
            playerCards
          );

        aiScore =
          calculateScore(
            aiCards
          );

        const playerMulti =
          getMultiplier(
            playerCards
          );

        const aiMulti =
          getMultiplier(
            aiCards
          );

        const finalPlayerPok =
          getPok(
            playerScore,
            playerCards
          );

        const finalAiPok =
          getPok(
            aiScore,
            aiCards
          );

        let lose = false;

        let multi = 1;

        let playerRank =
          playerMulti.rank;

        let aiRank =
          aiMulti.rank;

        if (finalPlayerPok)
          playerRank =
            finalPlayerPok.rank;

        if (finalAiPok)
          aiRank =
            finalAiPok.rank;

        if (playerRank > aiRank) {

          multi =
            playerMulti.multi;

        }

        else if (
          playerRank < aiRank
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

        const money =
          bet * multi;

        let result = '';

        if (
          playerScore === aiScore &&
          playerRank === aiRank
        ) {

          result =
            '🤝 เสมอ';

        }

        else if (!lose) {

          await addMoney(
            interaction.user.id,
            money
          );

          user.casinoWin += 1;

          await user.save();

          result =
            `🎉 มึงชนะ +${money.toLocaleString()}$`;

        }

        else {

          await removeMoney(
            interaction.user.id,
            money
          );

          user.casinoLose += 1;

          await user.save();

          result =
            `💀 มึงแพ้ -${money.toLocaleString()}$`;

        }

        const updatedUser =
          await getUser(
            interaction.user.id
          );

        const playAgainRow =
          new ActionRowBuilder()

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

        const finalEmbed =
          new EmbedBuilder()

            .setTitle(
              '🃏 ป็อกเด้ง'
            )

            .setDescription(`
${getAiText(user)}

🤖 AI:
${aiCards.join(' | ')}

🎯 แต้ม:
${aiScore}

${finalAiPok
? finalAiPok.name
: aiMulti.name}

━━━━━━━━━━━━━━

👤 มึง:
${playerCards.join(' | ')}

🎯 แต้ม:
${playerScore}

${finalPlayerPok
? finalPlayerPok.name
: playerMulti.name}

━━━━━━━━━━━━━━

💰 เดิมพัน:
${bet.toLocaleString()}$

${result}

━━━━━━━━━━━━━━

📊 สถิติคาสิโน:
🎮 เล่น:
${updatedUser.casinoPlayed}

🏆 ชนะ:
${updatedUser.casinoWin}

💀 แพ้:
${updatedUser.casinoLose}

━━━━━━━━━━━━━━

💵 เงินคงเหลือ:
${updatedUser.money.toLocaleString()}$
`);

        await i.update({

          embeds: [finalEmbed],

          components: [
            playAgainRow
          ]

        });

      }

    );

    return;

  }

  // ป็อก
  let lose = false;

  let result = '';

  if (playerPok && !aiPok) {

    result =
      '🎉 มึงชนะ';

  }

  else if (
    !playerPok && aiPok
  ) {

    lose = true;

    result =
      '💀 มึงแพ้';

  }

  else {

    if (
      playerPok.rank >
      aiPok.rank
    ) {

      result =
        '🎉 มึงชนะ';

    }

    else if (
      playerPok.rank <
      aiPok.rank
    ) {

      lose = true;

      result =
        '💀 มึงแพ้';

    }

    else {

      result =
        '🤝 เสมอ';

    }

  }

  if (result !== '🤝 เสมอ') {

    if (!lose) {

      await addMoney(
        interaction.user.id,
        bet
      );

      user.casinoWin += 1;

    }

    else {

      await removeMoney(
        interaction.user.id,
        bet
      );

      user.casinoLose += 1;

    }

    await user.save();

  }

  const updatedUser =
    await getUser(
      interaction.user.id
    );

  const row =
    new ActionRowBuilder()

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

  const embed =
    new EmbedBuilder()

      .setTitle(
        '🃏 ป็อกเด้ง'
      )

      .setDescription(`
${getAiText(user)}

🤖 AI:
${aiCards.join(' | ')}

${aiPok
? aiPok.name
: ''}

━━━━━━━━━━━━━━

👤 มึง:
${playerCards.join(' | ')}

${playerPok
? playerPok.name
: ''}

━━━━━━━━━━━━━━

💰 เดิมพัน:
${bet.toLocaleString()}$

${result}

━━━━━━━━━━━━━━

📊 สถิติคาสิโน:
🎮 เล่น:
${updatedUser.casinoPlayed}

🏆 ชนะ:
${updatedUser.casinoWin}

💀 แพ้:
${updatedUser.casinoLose}

━━━━━━━━━━━━━━

💵 เงินคงเหลือ:
${updatedUser.money.toLocaleString()}$
`);

  await sendGame(

    interaction,

    {
      embed,
      components: [row]
    }

  );

}

module.exports = {

  data: new SlashCommandBuilder()

    .setName('pokdeng')

    .setDescription('เล่นป็อกเด้งกับ AI')

    .addIntegerOption(option =>
      option
        .setName('bet')
        .setDescription('เงินเดิมพัน 100 - 5000')
        .setRequired(true)
    ),

  async execute(interaction) {

    const bet =
      interaction.options
        .getInteger('bet');

    if (
      bet < 100 ||
      bet > 5000
    ) {

      return interaction.reply({

        content:
          '❌ เดิมพันได้ 100 - 5,000 เท่านั้น',

        ephemeral: true

      });

    }

    return runGame(
      interaction,
      bet
    );

  }

};
