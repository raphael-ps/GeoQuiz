const {SlashCommandBuilder} = require('@discordjs/builders');
const { getState } = require('../functions/randCountryOrState.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randstate').setDescription('Replies with a random state of Brazil, your capital and region!'),

    async execute(interaction){   
        
        const a = getState();
    
        interaction.reply({content : " ", embeds: [a.embed], components: [a.row]}); 
        
    },    //, files: [a.file]
};
