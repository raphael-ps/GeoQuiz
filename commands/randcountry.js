const {SlashCommandBuilder} = require('@discordjs/builders');
const { getCountry } = require('../functions/randCountryOrState.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randcountry').setDescription('Replies with a random country, your capital and continent!'),

    async execute(interaction){   
        
        const a = getCountry(false);
    
        interaction.reply({content : " ", embeds: [a.embed], components: [a.row]}); 
        
    },    //, files: [a.file]
};

