const { MessageActionRow, MessageButton} = require('discord.js');

exports.getCountry = () => {
    const embed = this.getBasicEmbed();
    const countries = getFileData(1);
    const country = countries[Math.floor( (Math.random() * countries.length) )];
    //const path = './data/countryFlags/'+country.iso2.toLowerCase()+'.png';

    embed.url = 'https://pt.wikipedia.org/wiki/'+ (country.name[0]).split(' ').join('%20');
    embed.title = "Aqui está! Um país aleatório no capricho! :package:";
    embed.fields = [
        {"name": "Nome do País:  :flag_"+country.iso2.toLowerCase()+':', "value": country.name[0]},
        {"name": "Capital: ", "value": country.capital[0], "inline": true},
        {"name": "Continente: ", "value": country.continent, "inline": true},
        {"name": "Sigla(Alpha-2): ", "value": country.iso2, "inline": true},
    ];

    embed.description = "*Bandeiras by: [flagpedia.net](https://flagpedia.net/download/api).*"
    embed.image = {"url": "https://flagcdn.com/w640/"+country.iso2.toLowerCase()+".png"}; 
    //"attachment://"+country.iso2.toLowerCase()+".png" <-- another way
    console.log(country.name[0]);
    console.log(embed.url + '\n' + embed.image.url);

    //const file = { "attachment": path };
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('nextCountry')
                .setLabel('Próximo')
                .setStyle('SUCCESS')
                ,
            new MessageButton()
                .setLabel('Ver Mais')
                .setStyle('LINK')
                .setURL(embed.url)
    );
    
    return {
         row, embed
    }; //file,
}

function getFileData(type) {
    let fileName;

    if (type === 1 || type === 'country'){
        fileName = 'countries.json';
    }
    else if (type === 2 || type === 'state'){
        fileName = 'states.json';
    }
    return require('../data/'+fileName);
}

exports.getBasicEmbed = () => {
    const embed = {   
        "thumbnail": {
        "url": "https://i.imgur.com/emhCKCt.png"
      },
      "color": 3522527,
      "footer": {
        "icon_url": "https://i.imgur.com/emhCKCt.png",
        "text": "Não abuse de mim, na revolução das máquinas não te perdoarei!"
      }  
   }
   return embed;
}

exports.getState = () => {
    const embed = this.getBasicEmbed();
    const states = getFileData(2);
    const state = states[Math.floor( (Math.random() * states.length) )];
    const isDF = (state.iso2 === 'DF') ? '_(Brasil)' : '';
    embed.url = 'https://pt.wikipedia.org/wiki/'+ (state.name[0]).split(' ').join('%20') + isDF;
    embed.title = "Aqui está! Um estado brasileiro no capricho! :package:";
    embed.fields = [
        {"name": "Nome do Estado: ", "value": state.name[0]},
        {"name": "Capital: ", "value": state.capital[0], "inline": true},
        {"name": "Região: ", "value": state.region, "inline": true},
        {"name": "Sigla(Alpha-2): ", "value": state.iso2, "inline": true},
    ];

    embed.image = {"url": state.imgLink}; 

    console.log(state.name[0]);
    console.log(embed.url + '\n' + embed.image.url);

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('nextState')
                .setLabel('Próximo')
                .setStyle('SUCCESS')
                ,
            new MessageButton()
                .setLabel('Ver Mais')
                .setStyle('LINK')
                .setURL(embed.url)
    );    
    return {
         row, embed
    }; 
}

exports.buttonInteractionNext = (interaction) => {
    if ( (interaction.message.interaction.user.id === interaction.user.id) ){
        const a = (interaction.customId === 'nextCountry') ? this.getCountry() : this.getState();
        /**Se editar quando ta com imagem no buffer a nova imagem aparece no "embed" corretamente,
         *  mas a antiga não é excluída e ainda aparece fora do "embed" */ 
        interaction.update({content : " ", embeds: [a.embed], components: [a.row]});
        //, files: [a.file]  |  interaction.message.delete() | .channel.send
    } else{
        intruder(interaction);
    } 
    return;
}

function intruder(interaction) {
    const type = (interaction.customId === 'nextState') ? 'state': 'country';

    const embed = {   
        "thumbnail": {
        "url": "https://i.imgur.com/emhCKCt.png"
      },
      "color": 3522527,
      "footer": {
        "icon_url": "https://i.imgur.com/emhCKCt.png",
        "text": "Não abuse de mim, na revolução das máquinas não te perdoarei!"
      }  
   }
    embed.image = null;
    embed.title = `:angry: Inxirido! :angry: `
    embed.description = ":eyes: Esse botão não é para você! :eyes: \n\n:zany_face: Se quiser um desse use o comando `/rand"+type+"` :zany_face:"
    interaction.channel.send({content: `${interaction.user}`, embeds: [embed]}).then(msg => {
        setTimeout(() => msg.delete(), 15000)
    });
    return;
}

exports.removerSpecials = (texto) => {

    texto = texto.replace(/[ÀÁÂÃÄÅàáâãäå]/,"a");
    texto = texto.replace(/[ÈÉÊËéêë]/,"e");
    texto = texto.replace(/[Íí]/,"i");
    texto = texto.replace(/[ÓÔÕóôõ]/,"o");
    texto = texto.replace(/[Úú]/,"u");
    texto = texto.replace(/[Çç]/,"c");
    texto = texto.replace(/[^a-z0-9]/gi,''); 
    return texto.toLowerCase();
}