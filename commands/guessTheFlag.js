const {SlashCommandBuilder} = require('@discordjs/builders');
const {getBasicEmbed, removerSpecials} = require('../functions/randCountryOrState.js');
const {isRankScore} = require('../functions/isRankScore.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gtf').setDescription('Starts the "Guess The Flag" minigame.')
        .addSubcommand(choices => choices.setName('países').setDescription("Faz o jogo utilizar bandeiras de países"))
        .addSubcommand(choices => choices.setName('br').setDescription("Faz o jogo utilizar bandeiras de estados brasileiros"))
        ,
    async execute(interaction){
    
        interaction.reply(`\`Desdobrando bandeiras...\`:checkered_flag:`);
        await wait(3000);
        interaction.deleteReply();

        const {filesInfos, gameRules, userInfos} = setBasicInfos(interaction.options._subcommand, interaction.user.id, interaction.user.username);
        let elements = require('../data/'+ filesInfos.fileName);

        const previousElements = [];
        
        const embed = getBasicEmbed();
        const startTime = Date.now();
        
        while (gameRules.userLifes && elements.length){
            let index = Math.floor( (Math.random() * elements.length) );
            
            const element = elements[index];

            elements.splice(index, 1);
            previousElements.push(element);

            const file = { "attachment": `./data/flags/${filesInfos.flagsDir}/${element.iso2.toLowerCase()}.png`};

            let description =  `**Vidas: **`+gameRules.hearts.join(" ")+` --- **Pontuação: ${userInfos.score}**\n
                                \`Rápido, você só tem ${gameRules.answerTime} segundos...\` :hourglass_flowing_sand:`;

            embed.image = {"url": `attachment://${element.iso2.toLowerCase()}.png`};
            embed.title = "Guess The flag";
            embed.description = description;
            
            let sent = await interaction.channel.send({ embeds: [embed], fetchReply: true, files: [file]});

            const filter = response => {   
                        return response.author.id === interaction.user.id;
            };
            let collected = await interaction.channel.awaitMessages({ filter, max: 1, time: gameRules.answerTime * 1000});
            sent.delete();
            embed.image = null;

            if (collected.first() !== undefined){
            
                if ( element.name.some( answer => removerSpecials(answer) === removerSpecials(collected.first().content)) ){
                    userInfos.score++;
                    description = `**Vidas: **`+gameRules.hearts.join(' ') + ` --- **Pontuação: ${userInfos.score}` + 
                    `\n\nParabéns! Você acertou!** :clap: :clap: :clap:\n
                    \`Prepare-se para a próxima bandeira em ${gameRules.intervalTime} segundos...\`:hourglass:\n`;
        
                } else {
                    gameRules.hearts[gameRules.totalLifes - gameRules.userLifes] = ' :x: ';
                    gameRules.userLifes--;    
                    description = `**Vidas: **` + gameRules.hearts.join(' ') + ` --- **Pontuação: ${userInfos.score} 
                                \nInfelizmente, você errou. A reposta era: "${element.name[0]}".\n
                                Mas você ainda tem ${gameRules.userLifes} vidas.**\n
                                \`Prepare-se para a próxima bandeira em ${gameRules.intervalTime} segundos...\`:hourglass:\n`;  
                 
                }
                embed.description = description;
                let msg = await collected.first().reply({embeds: [embed]})         
                await wait(gameRules.intervalTime * 1000);
                await collected.first().delete();
                await msg.delete();
      
            } else {
                gameRules.hearts[gameRules.totalLifes - gameRules.userLifes] = ' :x: ';
                gameRules.userLifes--;    
                description = `**Vidas: **` + gameRules.hearts.join(' ') + ` --- **Pontuação: ${userInfos.score} 
                            \nO tempo acabou e nenhuma reposta foi recebida. Então, você errou!\n
                            Mas você ainda tem ${gameRules.userLifes} vidas.**\n
                            \`Prepare-se para a próxima bandeira em ${gameRules.intervalTime} segundos...\`:hourglass:\n`;    
                embed.description = description;
                let msgSent = await interaction.channel.send({embeds: [embed]});
                await wait(gameRules.intervalTime * 1000);
                await msgSent.delete();
            }
        }
        userInfos.endTime = Date.now();
        userInfos.timeNeeded = ((userInfos.endTime - startTime) / 1000) - (previousElements.length * gameRules.intervalTime);

        if (gameRules.userLifes === 0){
            embed.description = '**Suas vidas acabaram!\n';
        }
        else{
            embed.description = '**As bandeiras acabaram!\n';
        }
        
        embed.description += `\nVocê conseguiu ${userInfos.score} pontos em ${userInfos.timeNeeded.toFixed(2)} segundos\n`;
        const pos = isRankScore(userInfos, filesInfos.rankFile, interaction.guildId);
        if(pos === false){
            embed.description += '\nMas não foi suficiente para o Top 10\n**';
        } else {
            embed.description += `\nCom isso, você conseguiu a ${pos}ª posição no Top 10.\n**`;
        }
        
        let msgSent1 = await interaction.channel.send({embeds: [embed]});
        await wait(gameRules.intervalTime * 1000 + 5000);
        msgSent1.delete();
        previousElements.forEach( element => elements.push(element));
        
        return;
    },
}


function setBasicInfos(subCommandName, userId, username){
    const filesInfos = {};
    const gameRules = {};
    const userInfos = {};
    
    userInfos.score = 0;
    userInfos.username = username;
    userInfos.userId = userId;
    gameRules.intervalTime=6;
    gameRules.answerTime=46;

    if (subCommandName === 'países'){
        filesInfos.fileName = 'countries.json';
        filesInfos.flagsDir = 'countryFlags';
        gameRules.totalLifes = 5;
        filesInfos.rankFile = 'gtfRankCountry.json';
    }
    else if (subCommandName === 'br'){
        filesInfos.fileName = 'states.json';
        filesInfos.flagsDir = 'stateFlags';
        gameRules.totalLifes = 3;
        filesInfos.rankFile = 'gtfRankBR.json';
    }
    gameRules.userLifes = gameRules.totalLifes;
    gameRules.hearts = [];
    for(let i = 0; i < gameRules.totalLifes; i++) gameRules.hearts.push(':green_heart:');

    return {filesInfos, gameRules, userInfos};
    
}
