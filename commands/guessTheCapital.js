const {SlashCommandBuilder} = require('@discordjs/builders');
const {getBasicEmbed} = require('../functions/randCountryOrState.js');
const {isRankScore} = require('../functions/isRankScore.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder().setName('gtc').setDescription('Starts "Guess The Capital" minigame.'),

    async execute(interaction){
        await interaction.reply('`Decorando capitais...`:nerd:');
        await wait(3000);
        await interaction.deleteReply();

        const gameRules = {"intervalTime": 6, "answerTime": 46, "totalLifes": 3, "userLifes": 3, "hearts": [], "correctCapital": 5, "correctContinent": 1};
        const userInfos = {"userId": interaction.user.id, "score": 0, "username": interaction.user.username};
        const elements = require('../data/countries.json'), auxElements = [];
        const capitals = [], auxCapitals = [];
        const worldContinents = ["África", "América", "Ásia", "Oceania", "Europa"];

        for(let i = 0; i < gameRules.totalLifes; i++) gameRules.hearts.push(':green_heart:');
        for (let i = 0; i < elements.length; i++) capitals[i] = Object.values(elements[i])[1][0];

        const startTime = Date.now();
        const embed = getBasicEmbed();
        while (gameRules.userLifes && elements.length){
            let index = Math.floor( Math.random() * elements.length);
            let drawedElement = elements.splice(index, 1)[0];

            auxElements.push(drawedElement);
            auxCapitals.push(capitals.splice(capitals.indexOf(drawedElement.capital[0]), 1)[0]);

            for (let i = 0; i < 4; i++) auxCapitals.push(capitals.splice( Math.floor(Math.random() * capitals.length), 1 )[0]);

            let choicesNames = ["A", "B", "C", "D", "E"], choiceIndex;
            let char;

            embed.title = 'Guess The Capital';    
            embed.description = '**_Atenção! Responda apenas com a letra da alternativa._\n\n';
            embed.description += `Vidas: `+gameRules.hearts.join(" ")+` --- Pontuação: ${userInfos.score}\n\n`;                 
            embed.description += `Valendo ${gameRules.correctCapital} ponto(s).\n\nQual é a capital do(a)  __${drawedElement.name[0]}__?** :flag_${drawedElement.iso2.toLowerCase()}:\n\n`;      
            
            for (let i = 0, j = 5; i < 5; i++, j--){
                choiceIndex = Math.floor( Math.random() * j);
                embed.description += `\`${choicesNames[i].padStart(2, " ")}. ${auxCapitals[choiceIndex].padEnd(50, " ")}\`\n`;

                if (auxCapitals[choiceIndex] === drawedElement.capital[0]){
                    char = choicesNames[i];
                }

                capitals.unshift(auxCapitals.splice(choiceIndex, 1)[0]);
            }

            embed.description += `\n**_Rápido, você só tem __${gameRules.answerTime} segundos__..._ **:hourglass_flowing_sand:\n`;
            
            let sent = await interaction.channel.send({embeds: [embed]});
            const filter = response => {   
                return response.author.id === interaction.user.id;
            };
            let collected = await interaction.channel.awaitMessages({filter, max: 1, time: gameRules.answerTime * 1000});
            sent.delete();

            if (collected.first() !== undefined){
                
                if (collected.first().content.toLowerCase() === char.toLowerCase()){
                    userInfos.score += gameRules.correctCapital;
                    embed.description = `**Vidas: **`+gameRules.hearts.join(' ') + ` --- **Pontuação: ${userInfos.score}\n\n`
                    embed.description += `Parabéns! Você acertou!** :clap: :clap: :clap:\n\n`

                } else {
                    gameRules.hearts[gameRules.totalLifes - gameRules.userLifes] = ' :x: ';
                    gameRules.userLifes--;    
                    embed.description = `**Vidas: **` + gameRules.hearts.join(' ') + ` --- **Pontuação: ${userInfos.score}\n\n`
                    embed.description += `Infelizmente, você errou.\n\nA reposta era: "__${char} - ${[drawedElement.capital[0]]}__".\n\n`
                    embed.description += `Mas você ainda tem ${gameRules.userLifes} vidas.**\n\n`;               
                }
                setTimeout(() => {collected.first().delete();}, gameRules.intervalTime * 1000); 
            } else {
                gameRules.hearts[gameRules.totalLifes - gameRules.userLifes] = ' :x: ';
                gameRules.userLifes--;    
                embed.description = `**Vidas: **` + gameRules.hearts.join(' ') + `** --- Pontuação: ${userInfos.score}\n\n`;
                embed.description += `O tempo acabou e nenhuma reposta foi recebida.\n\nEntão, você errou!\n\n`;
                embed.description += `Mas você ainda tem ${gameRules.userLifes} vidas.**\n\n`;  
            }
            embed.description += `\`Prepare-se para a próxima pergunta em ${gameRules.intervalTime} segundos...\`:hourglass:\n\n`;
            let msgSent = await interaction.channel.send({embeds: [embed]});
            await wait(gameRules.intervalTime * 1000);
            await msgSent.delete();

            let charBonus;
            embed.description = `**Atenção para a pergunta bônus! Você __NÃO__ perde vida.\n\nValendo ${gameRules.correctContinent} ponto(s).\n\n`
            embed.description += `Em qual continente fica o(a)  __${drawedElement.name[0]}__? :flag_${drawedElement.iso2.toLowerCase()}:\n\n`; 
            for (let i = 0; i < 5; i++){
                embed.description += `\`${choicesNames[i].padStart(2, " ")}. ${worldContinents[i].padEnd(50, " ")}\`\n`;
                if (worldContinents[i] === drawedElement.continent){
                    charBonus = choicesNames[i];
                }
            }
            embed.description += `\n_Rápido, você só tem __${gameRules.answerTime/2} segundos__..._**:hourglass_flowing_sand:\n`;

            let bonus = await interaction.channel.send({embeds: [embed]});
            let collectedBonus = await interaction.channel.awaitMessages({filter, max: 1, time: gameRules.answerTime * 1000 / 2});
            bonus.delete();

            if (collectedBonus.first() !== undefined){
                if (collectedBonus.first().content.toUpperCase() === charBonus){
                    userInfos.score += gameRules.correctContinent;
                    embed.description = `**Parabéns! :clap: :clap: :clap:\n`
                    embed.description += `\nVocê acertou e ganhou ${gameRules.correctContinent} ponto(s) extra(s)!**\n\n`; 
                }
                else{
                    embed.description = `**Infelizmente, você errou\n\nA reposta era: "__${charBonus} - ${[drawedElement.continent]}__".\n\n`;
                    embed.description += `Você não recebeu nenhum ponto extra.** :worried:\n\n`
                }
                setTimeout(() => {collectedBonus.first().delete();}, gameRules.intervalTime * 1000); 
            } else { 
                embed.description = '**O tempo acabou e nenhuma reposta foi recebida.\n\nEntão, você errou!\n\n';
                embed.description += `Você não recebeu nenhum ponto extra.** :worried:\n\n`
            }
            embed.description += `\`Prepare-se para a próxima pergunta em ${gameRules.intervalTime} segundos...\`:hourglass:\n\n`;
            let cata_lixo = await interaction.channel.send({embeds: [embed]});
            await wait(gameRules.intervalTime * 1000);
            await cata_lixo.delete();
        }

        userInfos.endTime = Date.now();
        userInfos.timeNeeded = ((userInfos.endTime - startTime) / 1000) - (auxElements.length * gameRules.intervalTime * 2);

        if (gameRules.userLifes === 0){
            embed.description = '**Suas vidas acabaram!\n';
        }
        else{
            embed.description = '**Os países acabaram!\n';
        }
        embed.description += `\nVocê conseguiu ${userInfos.score} pontos em ${userInfos.timeNeeded.toFixed(2)} segundos\n`;
        
        const pos = isRankScore(userInfos, "gtcRank.json", interaction.guildId);

        if(pos === false){
            embed.description += '\nMas não foi suficiente para o Top 10\n**';
        } else {
            embed.description += `\nCom isso, você conseguiu a ${pos}ª posição no Top 10.\n**`;
        }
        
        let msgSent1 = await interaction.channel.send({embeds: [embed]});
        await wait(gameRules.intervalTime * 1000 + 5000);
        msgSent1.delete();
        auxElements.forEach(element => elements.push(element));
        
        return;
    } 
}