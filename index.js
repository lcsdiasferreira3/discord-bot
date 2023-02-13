//Rodar a aplicação node index.js

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");

//dotenv
const dotenv = require("dotenv");
dotenv.config();
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

//importação do comandos
const fs = require("node:fs"); //Modulo do node nativo para mexer com arquivos
const path = require("node:path"); //Navegar entre pastas e puxar os comandos

const commandsPath = path.join(__dirname, "commands"); //caminho dos comandos //dirname = nome das pastas
const commnadFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js")); //alocar os arquivos

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

for (const file of commnadFiles) {
  // para cada arquivo
  const filePath = path.join(commandsPath, file);
  const commands = require(filePath);
  console.log(client.commands);

  if ("data" in commands && "execute" in commands) {
    client.commands.set(commands.data.name, commands);
  } else {
    console.log(
      `Essse comando em ${filePath} está com "data" ou "execute" ausente`
    );
  }
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
//Lofin do Bot
client.once(Events.ClientReady, (c) => {
  console.log(`Pronto! Login realizado como ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(TOKEN);

//listener de interações com o bot
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isStringSelectMenu()) {
    const selected = interaction.values[0];
    if (selected == "javascript") {
      await interaction.reply(
        "Documentação do Javascript: https://developer.mozilla.org/en-US/docs/Web/JavaScript"
      );
    } else if (selected == "python") {
      await interaction.reply("Documentação do Python: https://www.python.org");
    } else if (selected == "csharp") {
      await interaction.reply(
        "Documentação do C#: https://learn.microsoft.com/en-us/dotnet/csharp/"
      );
    } else if (selected == "discordjs") {
      await interaction.reply(
        "Documentação do Discord.js: https://discordjs.guide/#before-you-begin"
      );
    }
  }
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error("Comando não encontrado");
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    await interaction.reply("Houve um erro ao executar esse comando!");
  }
});
