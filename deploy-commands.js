const { REST, Routes } = require("discord.js");

//dotenv
const dotenv = require("dotenv");
dotenv.config();
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const fs = require("node:fs"); //Modulo do node nativo para mexer com arquivos
const path = require("node:path"); //Navegar entre pastas e puxar os comandos

const commandsPath = path.join(__dirname, "commands"); //caminho dos comandos //dirname = nome das pastas
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js")); //alocar os arquivos

const commands = []; // Mesmo esquema do collection

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

// instancia REST
const rest = new REST({ version: "10" }).setToken(TOKEN);
// deploy
(async () => {
  try {
    console.log(`Resetando ${commands.length} comandos...`);

    //PUT
    const data = await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log("Comandos Registrados com sucesso! ");
  } catch (error) {
    console.error(error);
  }
})();

// Registrar comandos no prompt de comandos = node deploy-commands
