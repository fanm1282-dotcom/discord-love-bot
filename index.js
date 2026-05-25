require('dotenv').config();

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

  try {

    const result =
      await askLoveAI({
        status: 'คนคุย',
        concern: 'กลัวเขาหมดใจ',
        behavior:
          'ตอบช้าลงแต่ยังทักมา',
        question:
          'ควรไปต่อไหม'
      });

    console.log(result);

  } catch (err) {
    console.error(err);
  }

});

client.login(
  process.env.DISCORD_TOKEN
);
