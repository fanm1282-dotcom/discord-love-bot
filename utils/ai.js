const OpenAI = require("openai");

// OpenRouter client (ใช้ SDK ของ openai แต่ชี้ baseURL ไป openrouter)
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// 🔥 MODEL LIST (fallback กันล่ม)
const MODELS = [
  "openchat/openchat-3.5-0106",          // stable ฟรี
  "huggingfaceh4/zephyr-7b-beta",       // ฟรีอีกตัว
  "mistralai/mistral-7b-instruct",      // บางช่วงใช้ได้ (ไม่มี :free แล้ว)
];

async function callOpenRouter(model, prompt) {
  return await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });
}

// 🔥 MAIN FUNCTION (ตัวที่ bot เรียก)
async function askLoveAI(prompt) {
  let lastError = null;

  for (const model of MODELS) {
    try {
      console.log(`[AI] Trying model: ${model}`);

      const res = await callOpenRouter(model, prompt);

      const text = res?.choices?.[0]?.message?.content;

      if (!text) throw new Error("Empty response");

      return text;
    } catch (err) {
      console.error(`[AI] Model failed: ${model}`, err.message);
      lastError = err;
      continue;
    }
  }

  console.error("ALL MODELS FAILED:", lastError);
  return "ตอนนี้ AI ใช้งานไม่ได้ ลองใหม่อีกครั้งนะ";
}

module.exports = {
  askLoveAI,
};
