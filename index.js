require('dotenv').config();

const fs = require('fs');

const {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.commands =
  new Collection();

const commands = [];

const commandFiles =
  fs.readdirSync('./commands')
    .filter(file =>
      file.endsWith('.js')
    );

for (const file of commandFiles) {

  const command =
    require(`./commands/${file}`);

  client.commands.set(
    command.data.name,
    command
  );

  commands.push(
    command.data.toJSON()
  );

}

const rest = new REST({
  version: '10'
}).setToken(
  process.env.DISCORD_TOKEN
);

(async () => {

  try {

    console.log(
      'กำลังลงทะเบียน Slash Commands...'
    );

    await rest.put(

      Routes.applicationCommands(
        process.env.CLIENT_ID
      ),

      { body: commands }

    );

    console.log(
      'ลงทะเบียนสำเร็จ'
    );

  } catch (err) {

    console.error(err);

  }

})();

client.once('ready', () => {

  console.log(
    `${client.user.tag} ออนไลน์แล้ว`
  );

});

client.on(
  'interactionCreate',
  async interaction => {

    if (
      !interaction.isChatInputCommand()
    ) return;

    const command =
      client.commands.get(
        interaction.commandName
      );

    if (!command) return;

    try {

      await command.execute(
        interaction
      );

    } catch (err) {

      console.error(err);

    }

  }
);

client.login(
  process.env.DISCORD_TOKEN
);
