const cards = [
  'A', '2', '3', '4', '5',
  '6', '7', '8', '9',
  '10', 'J', 'Q', 'K'
];

// 🃏 จั่วไพ่
function drawCard() {

  return cards[
    Math.floor(
      Math.random() *
      cards.length
    )
  ];

}

// 🔢 ค่าไพ่
function getValue(card) {

  if (
    ['10', 'J', 'Q', 'K']
      .includes(card)
  ) {

    return 0;

  }

  if (card === 'A') {

    return 1;

  }

  return parseInt(card);

}

// 🎯 คำนวณแต้ม
function calculateScore(cards) {

  const total =
    cards.reduce(

      (sum, card) =>

        sum +
        getValue(card),

      0

    );

  return total % 10;

}

// 🟨 ไพ่หน้า
function isFaceCard(card) {

  return [
    'J',
    'Q',
    'K'
  ].includes(card);

}

// 🎴 format ไพ่
function formatCards(cards) {

  return cards.join(
    ' | '
  );

}

module.exports = {

  cards,
  drawCard,
  getValue,
  calculateScore,
  isFaceCard,
  formatCards

};
