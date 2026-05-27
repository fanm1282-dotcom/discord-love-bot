require('dotenv').config();

const fs =
  require('fs');

const path =
  require('path');

const mongoose =
  require('mongoose');

const {

  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes

} = require('discord.js');

/* =========================
   CLIENT
========================= */

const client =
  new Client({

    intents: [

      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent

    ]

  });

client.commands =
  new Collection();

/* =========================
   MONGODB
========================= */

mongoose.connect(

  process.env.MONGO_URI

).then(() => {

  console.log(
    'MongoDB Connected'
  );

}).catch(err => {

  console.error(
    'MongoDB Error'
  );

  console.error(err);

});

/* =========================
   LOAD COMMANDS
========================= */

const commands = [];

const foldersPath =
  path.join(
    __dirname,
    'commands'
  );

const commandFolders =
  fs.readdirSync(
    foldersPath
  );

for (const folder of commandFolders) {

  const folderPath =
    path.join(
      foldersPath,
      folder
    );

  // ข้ามถ้าไม่ใช่โฟลเดอร์
  if (
    !fs
      .lstatSync(folderPath)
      .isDirectory()
  ) continue;

  const commandFiles =
    fs.readdirSync(
      folderPath
    )

    .filter(file =>
      file.endsWith('.js')
    );

  for (const file of commandFiles) {

    const filePath =
      path.join(
        folderPath,
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

}

/* =========================
   REGISTER COMMANDS
========================= */

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

        process.env.GUILD_ID

      ),

      { body: commands }

    );

    console.log(
      'ลงทะเบียนสำเร็จ'
    );

  } catch (err) {

    console.error(
      'ลงทะเบียน Slash Command ไม่สำเร็จ'
    );

    console.error(err);

  }

})();

/* =========================
   READY
========================= */

client.once(
  'ready',

  () => {

    console.log(

      `${client.user.tag} ออนไลน์แล้ว`

    );

  }

);

/* =========================
   INTERACTION
========================= */

client.on(
  'interactionCreate',

  async interaction => {

    // Slash Commands
    if (
      interaction.isChatInputCommand()
    ) {

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

        try {

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

        } catch {}

      }

    }

    // Buttons
    if (
      interaction.isButton()
    ) {

      // ปล่อยให้ collector
      // ใน pokdeng.js จัดการเอง

      return;

    }

  }

);

/* =========================
   LOGIN
========================= */

client.login(
  process.env.DISCORD_TOKEN
);
