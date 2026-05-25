const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// ===============================
// 🔥 MODELS (fallback)
// ===============================
const MODELS = [
  "openchat/openchat-3.5-0106",
  "huggingfaceh4/zephyr-7b-beta",
  "mistralai/mistral-7b-instruct",
];

// ===============================
// 🧼 SAFE CLEAN INPUT (กัน 400 error)
// ===============================
function clean(input) {
  if (!input) return "hello";

  if (typeof input === "string") {
    return input.trim() || "hello";
  }

  if (typeof input === "object") {
    const text =
      input.content ||
      input.text ||
      input.message ||
      "";

    return String(text).trim() || "hello";
  }

  return "hello";
}

// ===============================
// 🔌 CALL MODEL
// ===============================
async function call(model, prompt) {
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
  const prompt = clean(input);

  if (!prompt) return "ไม่มีข้อความให้ตอบ";

  let lastError;

  for (const model of MODELS) {
    try {
      console.log("[AI] trying:", model);

      const res = await call(model, prompt);

      const text = res?.choices?.[0]?.message?.content;

      if (text && text.trim()) {
        return text;
      }

      throw new Error("empty response");
    } catch (err) {
      console.error("[AI FAIL]", model, err.message);
      lastError = err;
    }
  }

  console.error("ALL MODELS FAILED:", lastError);

  return "AI ใช้งานไม่ได้ตอนนี้ ลองใหม่อีกครั้ง";
}

module.exports = { askLoveAI };
