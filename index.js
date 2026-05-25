require('dotenv').config();

console.log('HELLO NEW INDEX');

const {
  Client,
  GatewayIntentBits
} = require('discord.js');

const {
  askLoveAI
} = require('./utils/ai');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.once('ready', async () => {

  console.log(
    `${client.user.tag} ออนไลน์แล้ว`
  );

  console.log(
    'TOKEN:',
    process.env.DISCORD_TOKEN
      ? 'มี'
      : 'ไม่มี'
  );

  console.log(
    'OPENROUTER:',
    process.env.OPENROUTER_API_KEY
      ? 'มี'
      : 'ไม่มี'
  );

  try {

    console.log('เริ่มยิง AI');

    const result =
      await askLoveAI({
        status: 'คนคุย',
        concern: 'กลัวเขาหมดใจ',
        behavior:
          'ตอบช้าลงแต่ยังทักมา',
        question:
          'ควรไปต่อไหม'
      });

    console.log('AI ตอบแล้ว');
    console.log(result);

  } catch (err) {

    console.error(
      'AI ERROR:',
      err
    );

  }

});

client.login(
  process.env.DISCORD_TOKEN
);
