function rollEvent() {

  const random =
    Math.random();

  // 👑 แจ็คพอต
  if (random < 0.005) {

    return {

      type: 'jackpot',

      name:
        '👑 JACKPOT',

      multi: 10,

      text:
        '💰 แจ็คพอตแตก!'

    };

  }

  // 🔥 ไพ่ปีศาจ
  if (random < 0.02) {

    return {

      type: 'demon',

      name:
        '🔥 ไพ่ปีศาจ',

      multi: 4,

      text:
        '🔥 ไพ่ปีศาจทำงาน'

    };

  }

  // ☠️ ไพ่แตก
  if (random < 0.04) {

    return {

      type: 'bust',

      name:
        '☠️ ไพ่แตก',

      multi: -2,

      text:
        '☠️ ดวงมึงพัง'

    };

  }

  // 🌌 ดวงเทพ
  if (random < 0.07) {

    return {

      type: 'lucky',

      name:
        '🌌 โหมดดวงเทพ',

      multi: 3,

      text:
        '🌌 ดวงมึงโคตรแรง'

    };

  }

  return null;

}

// 🤖 เจ้ามือหัวร้อน
function getDealerMood(
  user
) {

  // 👑 ผู้เล่นชนะติด
  if (
    user.winStreak >= 5
  ) {

    return {

      mood:
        'angry',

      text:
        '🤖 กูเริ่มหัวร้อนจริงละ'

    };

  }

  // 💀 ผู้เล่นแพ้ติด
  if (
    user.loseStreak >= 5
  ) {

    return {

      mood:
        'evil',

      text:
        '🤖 วันนี้มึงหมดตัวแน่'

    };

  }

  // 🎴 ปกติ
  return {

    mood:
      'normal',

    text:
      '🤖 พร้อมเล่นยัง'

  };

}

// 🎰 โบนัสสุ่ม
function getRandomBonus() {

  const chance =
    Math.random();

  // 💰 โบนัสเงิน
  if (chance < 0.03) {

    return {

      type:
        'money',

      amount:
        5000,

      text:
        '💰 โบนัสคาสิโน 5,000$'

    };

  }

  // 🔥 โบนัสเด้ง
  if (chance < 0.06) {

    return {

      type:
        'multi',

      multi:
        2,

      text:
        '🔥 โบนัสเด้ง x2'

    };

  }

  return null;

}

module.exports = {

  rollEvent,
  getDealerMood,
  getRandomBonus

};
