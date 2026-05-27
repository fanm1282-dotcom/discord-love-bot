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

function getAiText(
  user,
  resultType
) {

  const texts = {

    start: [

      '🤖 พร้อมเสียยัง',
      '🤖 ขอเงินหน่อย',
      '🤖 ตานี้กูเอาจริง',
      '🤖 อย่าร้องทีหลังนะ'

    ],

    win: [

      '🤖 เหี้ยเอ้ย ได้ไงวะ',
      '🤖 ฟลุ๊คจัด',
      '🤖 ตาหน้ากูเอาคืน',
      '🤖 วันนี้ดวงมึงแรง'

    ],

    lose: [

      '🤖 เงินเข้ากระเป๋ากูละ',
      '🤖 กูบอกแล้ว',
      '🤖 กลับไปฟาร์มเงินมา',
      '🤖 คาสิโนรักมึง'

    ],

    draw: [

      '🤖 รอดตัวไป',
      '🤖 ยังไม่จบ',
      '🤖 ตานี้ไม่นับ',
      '🤖 เสมอเฉย'

    ]

  };

  if (user.casinoPlayed >= 10) {

    texts.start.push(

      '🤖 อ้าว มึงอีกแล้ว',
      '🤖 วันนี้ยังไม่เข็ด?',
      '🤖 กูจำมึงได้ละ'

    );

  }

  return texts[resultType][

    Math.floor(
      Math.random() *
      texts[resultType].length
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

  // ปุ่ม
  if (
    interaction.isButton()
  ) {

    return await interaction.editReply(
      payload
    );

  }

  // Slash Command
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
${getAiText(user, 'start')}

🤖 AI: 🂠 🂠

👤 มึง:
${playerCards.join(' | ')}
🎯 ${playerScore} แต้ม

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

        // 🎴 เล่นอีกครั้ง
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

        // ปิด collector รอบเก่า
        collector.stop();

        // 🟢 จั่ว
        if (
          i.customId === 'draw'
        ) {

          playerCards.push(
            drawCard()
          );

        }

        // 🤖 AI logic
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

        // 🔥 ตัดสินแพ้ชนะ
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
        let resultType = 'draw';

        // 🤝 เสมอ
        if (
          playerScore === aiScore &&
          playerRank === aiRank
        ) {

          result =
            '🤝 เสมอ';

          resultType =
            'draw';

        }

        // 🎉 ชนะ
        else if (!lose) {

          await addMoney(
            interaction.user.id,
            money
          );

          user.casinoWin += 1;

          await user.save();

          result =
            `🎉 มึงชนะ +${money.toLocaleString()}$`;

          resultType =
            'win';

        }

        // 💀 แพ้
        else {

          await removeMoney(
            interaction.user.id,
            money
          );

          user.casinoLose += 1;

          await user.save();

          result =
            `💀 มึงแพ้ -${money.toLocaleString()}$`;

          resultType =
            'lose';

        }

        const updatedUser =
          await getUser(
            interaction.user.id
          );

        // 🎴 ปุ่มเล่นอีกครั้ง
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

        // 📦 Embed
        const finalEmbed =
          new EmbedBuilder()

            .setTitle(
              '🃏 ป็อกเด้ง'
            )

            .setDescription(`
${getAiText(user, resultType)}

🤖 AI:
${aiCards.join(' | ')}
🎯 ${aiScore} แต้ม
${finalAiPok
? finalAiPok.name
: aiMulti.name}

👤 มึง:
${playerCards.join(' | ')}
🎯 ${playerScore} แต้ม
${finalPlayerPok
? finalPlayerPok.name
: playerMulti.name}

${result}

💵 เงิน:
${updatedUser.money.toLocaleString()}$
`);

        // 🔄 อัปเดตข้อความเดิม
        await i.update({

          embeds: [finalEmbed],

          components: [
            playAgainRow
          ]

        });

      }

    );

    // ⏰ หมดเวลา → ลบปุ่ม
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

    return;

  }

  // 🔥 ป็อกจบเลย
  let lose = false;

  let result = '';
  let resultType = 'draw';

  if (playerPok && !aiPok) {

    result =
      '🎉 มึงชนะ';

    resultType =
      'win';

  }

  else if (
    !playerPok && aiPok
  ) {

    lose = true;

    result =
      '💀 มึงแพ้';

    resultType =
      'lose';

  }

  else {

    if (
      playerPok.rank >
      aiPok.rank
    ) {

      result =
        '🎉 มึงชนะ';

      resultType =
        'win';

    }

    else if (
      playerPok.rank <
      aiPok.rank
    ) {

      lose = true;

      result =
        '💀 มึงแพ้';

      resultType =
        'lose';

    }

    else {

      result =
        '🤝 เสมอ';

      resultType =
        'draw';

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
${getAiText(user, resultType)}

🤖 AI:
${aiCards.join(' | ')}
${aiPok
? aiPok.name
: ''}

👤 มึง:
${playerCards.join(' | ')}
${playerPok
? playerPok.name
: ''}

${result}

💵 เงิน:
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
