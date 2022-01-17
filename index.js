const {Intents, Client, Collection} = require('discord.js');
const fs = require('fs');
const {token} = require('./config.json');

const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_TYPING
    ]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter( file => file.endsWith('.js'));

for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}
/** Ajeitar interação do botão para só poder usar quem escreveu o comando */

client.once('ready', () => {
    console.log(`Bot: "${client.user.username}", " Status: "Online"`);  

    let status = [
        `BOT FEITO POR @HAPHA.EU`,
        "INSTAGRAM @_RAPHA.EU",
        'ETERNAMENTE EM BETA'
    ];
    let i = 0;

    setInterval(() => client.user.setActivity(`${status[i++ %
    status.length]}`, {
        type: "WATCHING"
    }), 5000);
    
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()){      
        if (interaction.customId === 'nextCountry' || interaction.customId === 'nextState'){
            const {buttonInteractionNext} = require('./functions/randCountryOrState.js');
            buttonInteractionNext(interaction);
        } 
    }
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    

    if (!command) return;
    
    try{
        await command.execute(interaction);

    } catch (error){
        console.error(error);
        await interaction.reply({content: 'There was an error while executing this commmand!', ephemeral: true});
    }
});

client.login(token); 

//fazer subcomando do GTF e adicionar GTF States. Fazer comando mostrar ranking