const OpenAI = require("openai");

// OpenRouter client
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// 🔥 โมเดล fallback (ของจริงที่ยังใช้ได้บ่อย)
const MODELS = [
  "openchat/openchat-3.5-0106",
  "huggingfaceh4/zephyr-7b-beta",
  "mistralai/mistral-7b-instruct",
];

// ===============================
// 🧼 CLEAN INPUT (กัน 400 error)
// ===============================
function normalizePrompt(input) {
  if (!input) return "hello";

  if (typeof input === "string") return input;

  if (typeof input === "object") {
    return (
      input.content ||
      input.text ||
      input.message ||
      JSON.stringify(input)
    );
  }

  return String(input);
}

// ===============================
// 🧠 CALL OPENROUTER
// ===============================
async function callModel(model, prompt) {
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

// ===============================
// 🚀 MAIN FUNCTION
// ===============================
async function askLoveAI(input) {
  const prompt = normalizePrompt(input);

  // กันค่าว่าง
  if (!prompt || prompt.trim().length === 0) {
    return "ไม่มีข้อความให้ตอบ";
  }

  let lastError = null;

  for (const model of MODELS) {
    try {
      console.log(`[AI] Trying model: ${model}`);

      const res = await callModel(model, prompt);

      const text = res?.choices?.[0]?.message?.content;

      if (!text || typeof text !== "string") {
        throw new Error("Invalid AI response");
      }

      return text;
    } catch (err) {
      console.error(`[AI] Failed model: ${model}`, err.message);
      lastError = err;
      continue;
    }
  }

  console.error("ALL MODELS FAILED:", lastError);

  return "❌ AI ใช้งานไม่ได้ตอนนี้ ลองใหม่อีกครั้ง";
}

module.exports = {
  askLoveAI,
};
