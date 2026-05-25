require('dotenv').config();

const fs =
  require('fs');

const path =
  require('path');

const {

  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes

} = require('discord.js');

const client =
  new Client({

    intents: [
      GatewayIntentBits.Guilds
    ]

  });

client.commands =
  new Collection();

const commands = [];

const commandsPath =
  path.join(
    __dirname,
    'commands'
  );

const commandFiles =

  fs.readdirSync(
    commandsPath
  )

  .filter(file =>
    file.endsWith('.js')
  );

for (const file of commandFiles) {

  const filePath =

    path.join(
      commandsPath,
      file
    );

  try {

    const command =
      require(filePath);

    if (
      !command.data ||
      !command.execute
    ) {

      console.log(
        `${file} โหลดไม่สำเร็จ`
      );

      continue;

    }

    client.commands.set(

      command.data.name,
      command

    );

    commands.push(
      command.data.toJSON()
    );

    console.log(
      `${file} โหลดสำเร็จ`
    );

  } catch (err) {

    console.error(
      `${file} ERROR`
    );

    console.error(err);

  }

}

const rest =

  new REST({

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

      Routes.applicationGuildCommands(

        process.env.CLIENT_ID,

        'ใส่เซิร์ฟเวอร์ไอดี'

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

client.once(
  'ready',

  () => {

    console.log(

      `${client.user.tag} ออนไลน์แล้ว`

    );

  }

);

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

      if (
        interaction.replied ||
        interaction.deferred
      ) {

        await interaction.editReply({

          content:
            'เกิดข้อผิดพลาดในการใช้คำสั่ง'

        });

      } else {

        await interaction.reply({

          content:
            'เกิดข้อผิดพลาดในการใช้คำสั่ง',

          ephemeral: true

        });

      }

    }

  }

);

client.login(
  process.env.DISCORD_TOKEN
);
