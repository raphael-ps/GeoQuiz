const {SlashCommandBuilder} = require('@discordjs/builders');
const {getBasicEmbed} = require('../functions/randCountryOrState.js');
const {getRankPath} = require('../functions/getRankPath.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank').setDescription('Shows score ranking.')
        .addSubcommand(choices => choices.setName('gtfpaíses').setDescription("Mostra o ranking de pontos do gtf países."))
        .addSubcommand(choices => choices.setName('gtfestados').setDescription("Mostra o ranking de pontos do gtf estados."))
        .addSubcommand(choices => choices.setName('gtc').setDescription('Mostra o ranking do "Guess The Capital".'))
        ,
    async execute(interaction){
        const date = Date.now();
        const type = interaction.options._subcommand;
        const {rankPath, name} = getRankPath(type, interaction.guildId);
        const rank = require('..\\'+rankPath);
        const embed = getBasicEmbed();
       
        const medals = [':first_place:', '\n:second_place:', '\n:third_place:', '\n:four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:', ':keycap_ten:'];
        
        embed.title = name + ' - RANKING DE PONTOS';
        embed.description = '';
        embed.thumbnail = null;

        for (let i = 0; i < rank.length; i++){
            let time = parseInt((date - rank[i].endTime) / 3600000);
            let timeNeeded = rank[i].timeNeeded;
            const min = parseInt(timeNeeded / 60).toString(), seg = parseInt(timeNeeded % 60).toString();
            const days = parseInt(time / 24), hours = parseInt(time % 24);

            let userName;
    
            try{
                userName = interaction.guild.members.cache.get(rank[i].userId).user.username;
            } catch (error){
                userName = rank[i].username;
            }

            embed.description += `${medals[i]}\`${userName.toString().padEnd(27, " ")} ${rank[i].score.toString().padStart(4, " ")} pontos em ${min.padStart(4)}m${seg.padEnd(2)}s - há ${days}d${hours}h\n\``;
        }
        interaction.reply({embeds: [embed]}); 
    }
}