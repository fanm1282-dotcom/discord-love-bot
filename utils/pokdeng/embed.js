const {
  EmbedBuilder
} = require('discord.js');

const {
  formatCards
} = require('./cards');

const {
  getWinRate
} = require('./stats');

// 🎴 embed ตอนเล่น
function createGameEmbed({

  user,
  playerCards,
  playerScore,
  bet,
  aiText

}) {

  return new EmbedBuilder()

    .setTitle(
      '🃏 ป็อกเด้ง'
    )

    .setDescription(`

${aiText}

🤖 AI:
🂠 🂠

👤 มึง:
${formatCards(playerCards)}

🎯 แต้ม:
${playerScore}

💰 เดิมพัน:
${bet.toLocaleString()}$

🔥 Win Streak:
${user.winStreak || 0}

👑 Rank:
${user.casinoRank || '🪙 มือใหม่'}

`);

}

// 🎉 embed ตอนจบ
function createResultEmbed({

  user,
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

  updatedMoney

}) {

  return new EmbedBuilder()

    .setTitle(
      '🃏 ป็อกเด้ง'
    )

    .setDescription(`

${mood?.text || ''}

${aiText}

${event
? `\n${event.text}\n`
: ''}

🤖 AI:
${formatCards(aiCards)}

🎯 แต้ม:
${aiScore}

${aiPok
? aiPok.name
: aiMulti.name}

━━━━━━━━━━━━━━

👤 มึง:
${formatCards(playerCards)}

🎯 แต้ม:
${playerScore}

${playerPok
? playerPok.name
: playerMulti.name}

━━━━━━━━━━━━━━

${result}

💵 เงิน:
${updatedMoney.toLocaleString()}$

🔥 Win Streak:
${user.winStreak || 0}

☠️ Lose Streak:
${user.loseStreak || 0}

📈 Winrate:
${getWinRate(user)}%

👑 Rank:
${user.casinoRank || '🪙 มือใหม่'}

`);

}
module.exports = {

  createGameEmbed,
  createResultEmbed

};
