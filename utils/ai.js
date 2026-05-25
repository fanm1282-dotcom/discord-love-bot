require('dotenv').config();

const OpenAI = require('openai');

const ai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1'
});

async function askLoveAI(data) {

  const prompt = `
คุณคือหมอดูความรักที่จริงจัง เข้าใจความสัมพันธ์มนุษย์

กฎ:
- พูดภาษาไทย
- ไม่ฟันธงอนาคต 100%
- ไม่โลกสวยเกินจริง
- วิเคราะห์จากข้อมูลเท่านั้น

ตอบตามหัวข้อ:

🔮 ภาพรวมความรัก
❤️ อีกฝ่ายอาจกำลังรู้สึกอะไร
⚠️ สิ่งที่ควรระวัง
🗣️ คำแนะนำ
📈 แนวโน้มความสัมพันธ์ (1-100 พร้อมเหตุผล)
💭 ข้อความถึงคุณ

ข้อมูลผู้ใช้:

สถานะ: ${data.status}
ความกังวล: ${data.concern}
พฤติกรรมล่าสุด: ${data.behavior}
สิ่งที่อยากรู้: ${data.question}
`;

  const completion =
    await ai.chat.completions.create({
      model:
        'meta-llama/llama-3.3-70b-instruct:free',

      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

  return completion.choices[0].message.content;
}

module.exports = {
  askLoveAI
};
