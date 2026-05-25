require('dotenv').config();

const OpenAI =
  require('openai')
    .default;

console.log(
  'โหลด ai.js แล้ว'
);

const client =
  new OpenAI({

    apiKey:
      process.env
        .OPENROUTER_API_KEY,

    baseURL:
      'https://openrouter.ai/api/v1',

    timeout:
      30000
  });

async function askLoveAI(
  data
) {

  try {

    console.log(
      'กำลังเรียก OpenRouter...'
    );

    const completion =
      await client.chat
        .completions.create({

          model:
            'meta-llama/llama-3.3-70b-instruct:free',

          messages: [
            {
              role:
                'user',

              content:
                'ตอบคำว่า hello เท่านั้น'
            }
          ]
        });

    console.log(
      'OpenRouter ตอบแล้ว'
    );

    return completion
      .choices?.[0]
      ?.message?.content
      || 'AI ไม่ตอบกลับ';

  } catch (err) {

    console.error(
      'OPENROUTER ERROR:',
      err
    );

    throw err;
  }
}

module.exports = {
  askLoveAI
};
