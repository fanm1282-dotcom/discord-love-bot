const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// ===============================
// 🔥 MODEL LIST (fallback)
// ===============================
const MODELS = [
  "openchat/openchat-3.5-0106",
  "huggingfaceh4/zephyr-7b-beta",
  "mistralai/mistral-7b-instruct",
];

// ===============================
// 🧼 CLEAN INPUT
// ===============================
function normalize(input) {
  if (!input) return "hello";
  if (typeof input === "string") return input;
  if (typeof input === "object") return input.text || input.content || JSON.stringify(input);
  return String(input);
}

// ===============================
// 🔌 CALL MODEL
// ===============================
async function call(model, prompt) {
  return await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });
}

// ===============================
// 🚀 MAIN
// ===============================
async function askLoveAI(input) {
  const prompt = normalize(input);

  if (!prompt || prompt.trim().length === 0) {
    return "ไม่มีข้อความให้ตอบ";
  }

  let lastError;

  for (const model of MODELS) {
    try {
      console.log("[AI] try:", model);

      const res = await call(model, prompt);

      const text = res?.choices?.[0]?.message?.content;

      if (!text) throw new Error("empty response");

      return text;
    } catch (err) {
      console.error("[AI FAIL]", model, err.message);
      lastError = err;
    }
  }

  console.error("ALL FAILED:", lastError);

  return "AI ใช้งานไม่ได้ตอนนี้";
}

module.exports = { askLoveAI };
