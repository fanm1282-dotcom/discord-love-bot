// utils/casinoAI.js

const openai =
  require('./openai');

async function askCasinoAI(
  user,
  resultType
) {

  try {

    const completion =
      await openai.chat.completions.create({

        model:
          'openai/gpt-4.1-mini',

        messages: [

          {
            role: 'system',

            content:
`
มึงคือเจ้ามือคาสิโน AI สายกวน พูดภาษาไทยวัยรุ่น

กฎ:
- ตอบสั้น
- ไม่เกิน 1 ประโยค
- กวนตีนได้
- ด่าได้
- ต้องเหมือนเจ้ามือคาสิโน
- ห้ามตอบยาว
`
          },

          {
            role: 'user',

            content:
`
ข้อมูลผู้เล่น:

เงิน:
${user.money}

เล่น:
${user.casinoPlayed}

ชนะ:
${user.casinoWin}

แพ้:
${user.casinoLose}

ผลล่าสุด:
${resultType}
`
          }

        ],

        max_tokens: 60

      });

    return completion
      .choices?.[0]
      ?.message
      ?.content ||

      '🤖 ...';

  } catch (err) {

    console.log(err);

    return '🤖 วันนี้กูง่วง';

  }

}

module.exports = {
  askCasinoAI
};
