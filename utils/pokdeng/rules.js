const {
  isFaceCard
} = require('./cards');

// 🔥 เด้ง
function getMultiplier(cards) {

  // 👥 ไพ่คู่
  if (
    cards.length === 2 &&
    cards[0] === cards[1]
  ) {

    return {

      name:
        '✨ ไพ่คู่ x2',

      multi: 2,

      rank: 3

    };

  }

  // 🟨 สามเหลือง
  if (

    cards.length === 3 &&

    cards.every(card =>
      isFaceCard(card)
    )

  ) {

    // 🔥 ตองสามเหลือง
    if (

      cards[0] === cards[1] &&
      cards[1] === cards[2]

    ) {

      return {

        name:
          '🔥 ตองสามเหลือง x8',

        multi: 8,

        rank: 6

      };

    }

    return {

      name:
        '🟨 สามเหลือง x4',

      multi: 4,

      rank: 5

    };

  }

  // ➖ ปกติ
  return {

    name:
      '➖ ปกติ x1',

    multi: 1,

    rank: 1

  };

}

// 👑 ป็อก
function getPok(
  score,
  cards
) {

  if (
    cards.length !== 2
  ) {

    return null;

  }

  // 👑 ป็อก 9
  if (score === 9) {

    return {

      name:
        '👑 ป็อก 9',

      rank: 8

    };

  }

  // 👑 ป็อก 8
  if (score === 8) {

    return {

      name:
        '👑 ป็อก 8',

      rank: 7

    };

  }

  return null;

}

// 🤖 AI จั่ว
function shouldAiDraw(
  aiScore
) {

  // 0-4 จั่วแน่
  if (aiScore <= 4) {

    return true;

  }

  // 5 ลุ้นจั่ว
  if (
    aiScore === 5 &&
    Math.random() < 0.5
  ) {

    return true;

  }

  return false;

}

module.exports = {

  getMultiplier,
  getPok,
  shouldAiDraw

};
