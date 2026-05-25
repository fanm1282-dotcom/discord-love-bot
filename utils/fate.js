const tarotCards = [

  {
    name: 'The Lovers',
    meaning:
      'ความสัมพันธ์ที่ยังมีสายใย'
  },

  {
    name: 'The Moon',
    meaning:
      'ความไม่ชัดเจนและความลับ'
  },

  {
    name: 'Death',
    meaning:
      'การจบเพื่อเริ่มใหม่'
  },

  {
    name: 'The Devil',
    meaning:
      'ความสัมพันธ์ที่ตัดไม่ขาด'
  },

  {
    name: 'The Star',
    meaning:
      'ความหวังที่ยังเหลืออยู่'
  },

  {
    name: 'The Hermit',
    meaning:
      'การถอยออกมาเงียบๆ'
  }

];

const moonPhases = [

  '🌕 พระจันทร์เต็มดวง',
  '🌑 คืนจันทร์ดับ',
  '🌘 ข้างแรม',
  '🌗 ครึ่งดวง',
  '🌒 จันทร์เสี้ยว'

];

const universeQuotes = [

  'บางความสัมพันธ์ไม่ได้จบเพราะหมดรัก',

  'ความเงียบของเขา อาจซ่อนบางอย่างไว้มากกว่าที่คิด',

  'คนบางคนหายไป เพื่อให้เรารู้ว่าเคยสำคัญแค่ไหน',

  'หัวใจที่ยังรู้สึก มักหนีความจริงไม่พ้น',

  'คืนนี้ มีบางคนกำลังคิดถึงใครบางคนอยู่เงียบๆ'

];

const auras = [

  '💔 พลังแห่งความคิดถึง',

  '🌑 พลังแห่งความเงียบ',

  '🕯️ พลังแห่งอดีต',

  '🌙 พลังแห่งการรอคอย'

];

function randomCard() {

  return tarotCards[
    Math.floor(
      Math.random() *
      tarotCards.length
    )
  ];

}

function randomMoon() {

  return moonPhases[
    Math.floor(
      Math.random() *
      moonPhases.length
    )
  ];

}

function randomQuote() {

  return universeQuotes[
    Math.floor(
      Math.random() *
      universeQuotes.length
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
  randomMoon,
  randomQuote,
  randomAura

};
