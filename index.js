require('dotenv').config();

console.log('HELLO NEW INDEX');

const {
  Client,
  GatewayIntentBits
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.once('ready', () => {

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
});

client.login(
  process.env.DISCORD_TOKEN
);
