// 📈 เพิ่มสถิติ
async function updateStats(

  user,
  {
    result,
    amount
  }

) {

  // 🎮 เล่น
  user.casinoPlayed += 1;

  // 💰 เดิมพันรวม
  user.totalBet =
    (user.totalBet || 0) +
    amount;

  // 🎉 ชนะ
  if (result === 'win') {

    user.casinoWin += 1;

    // 🔥 streak
    user.winStreak =
      (user.winStreak || 0) + 1;

    user.loseStreak = 0;

    // 👑 เงินชนะรวม
    user.totalWin =
      (user.totalWin || 0) +
      amount;

    // 🏆 ชนะสูงสุด
    if (

      !user.biggestWin ||

      amount >
      user.biggestWin

    ) {

      user.biggestWin =
        amount;

    }

  }

  // 💀 แพ้
  else if (
    result === 'lose'
  ) {

    user.casinoLose += 1;

    // ☠️ streak
    user.loseStreak =
      (user.loseStreak || 0) + 1;

    user.winStreak = 0;

    // 💸 เงินเสียรวม
    user.totalLose =
      (user.totalLose || 0) +
      amount;

    // 💀 แพ้สูงสุด
    if (

      !user.biggestLose ||

      amount >
      user.biggestLose

    ) {

      user.biggestLose =
        amount;

    }

  }

  // 🤝 เสมอ
  else {

    user.winStreak = 0;
    user.loseStreak = 0;

  }

  // 👑 rank คาสิโน
  user.casinoRank =
    getCasinoRank(user);

  await user.save();

}

// 👑 แรงค์
function getCasinoRank(
  user
) {

  const played =
    user.casinoPlayed || 0;

  const money =
    user.money || 0;

  // ☠️ ลูกค้าชั้นทอง
  if (

    played >= 500 ||

    money >= 1000000

  ) {

    return '👑 ราชาคาสิโน';

  }

  // 🔥 เซียน
  if (

    played >= 200 ||

    money >= 250000

  ) {

    return '🔥 เซียนโต๊ะทอง';

  }

  // 💰 นักเสี่ยงโชค
  if (

    played >= 100 ||

    money >= 100000

  ) {

    return '💰 นักเสี่ยงโชค';

  }

  // 🎴 นักพนัน
  if (

    played >= 30 ||

    money >= 30000

  ) {

    return '🎴 นักพนันประจำ';

  }

  return '🪙 มือใหม่';

}

// 📊 winrate
function getWinRate(
  user
) {

  if (
    !user.casinoPlayed
  ) {

    return '0';

  }

  return (

    (
      user.casinoWin /
      user.casinoPlayed
    ) * 100

  ).toFixed(1);

}

// 🌌 high roller
function isHighRoller(
  amount
) {

  return amount >= 50000;

}

module.exports = {

  updateStats,
  getCasinoRank,
  getWinRate,
  isHighRoller

};
