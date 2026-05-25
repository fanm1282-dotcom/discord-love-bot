require('dotenv').config();

const OpenAI =
  require('openai').default;

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

  const completion =
    await client.chat
      .completions.create({

        model:
          'meta-llama/llama-3.3-70b-instruct:free',

        messages: [
          {
            role: 'user',
            content:
              'ตอบว่า hello'
          }
        ]
      });

  return completion
    .choices?.[0]
    ?.message?.content;
}

module.exports = {
  askLoveAI
};
