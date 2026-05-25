const OpenAI = require('openai');

console.log('โหลด ai.js แล้ว');

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1'
});

async function askLoveAI(data) {
  try {
    console.log('กำลังเรียก OpenRouter...');

    const completion =
      await openai.chat.completions.create({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          {
            role: 'system',
            content:
              'คุณคือ AI ที่ให้คำปรึกษาความรัก ตอบแบบเข้าใจง่าย ตรงไปตรงมา และอบอุ่น'
          },
          {
            role: 'user',
            content: `
สถานะ: ${data.status}
เรื่องที่กังวล: ${data.concern}
พฤติกรรมอีกฝ่าย: ${data.behavior}
คำถาม: ${data.question}
            `
          }
        ]
      });

    console.log('AI ตอบสำเร็จ');

    return (
      completion.choices?.[0]?.message
        ?.content ||
      'ไม่มีคำตอบจาก AI'
    );
  } catch (err) {
    console.error(
      'OPENROUTER ERROR:',
      err
    );

    if (err.status === 429) {
      return 'AI คนใช้เยอะเกิน รอสักพักแล้วลองใหม่';
    }

    return 'AI พังหรือเชื่อมต่อไม่ได้';
  }
}

module.exports = {
  askLoveAI
};
