const {SlashCommandBuilder} = require('@discordjs/builders');
const {getBasicEmbed} = require('../functions/randCountryOrState.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping').setDescription('Replies with "Pong!"'),

    async execute(interaction){     
        const embed = getBasicEmbed();
        embed.title = "Pong! :ping_pong:";
        embed.url = "https://pt.wikipedia.org/wiki/Tênis_de_mesa";
        return interaction.reply({content : " ", embeds: [embed]});
    },
};