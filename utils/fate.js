const tarotCards = [

  'The Lovers',
  'The Moon',
  'Death',
  'The Devil',
  'The Star',
  'The Hermit',
  'The Fool',
  'Justice',
  'The Empress',
  'The High Priestess'

];

const auras = [

  '🌑 พลังแห่งความเงียบ',
  '💔 พลังแห่งความคิดถึง',
  '🩶 พลังแห่งการรอคอย',
  '🕯️ พลังแห่งอดีต',
  '🌙 พลังแห่งคืนจันทร์ดับ'

];

function randomCard() {

  return tarotCards[
    Math.floor(
      Math.random() *
      tarotCards.length
    )
  ];

}

function randomAura() {

  return auras[
    Math.floor(
      Math.random() *
      auras.length
    )
  ];

}

module.exports = {

  randomCard,
  randomAura

};
