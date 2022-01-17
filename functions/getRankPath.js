exports.getRankPath = (rankType, guildId) => {
    console.log('Em "getRankPath":');
    const fs = require('fs');
    let rankPath = 'data\\rankings\\'+guildId+'\\';

    if (!fs.existsSync(rankPath) ){
        fs.mkdirSync(rankPath);
        fs.writeFileSync(rankPath+`gtfRankCountry.json`,'[]');
        fs.writeFileSync(rankPath+'gtfRankBR.json','[]');
        fs.writeFileSync(rankPath+'gtcRank.json','[]');
    }

    let name;
    if (rankType === 'gtfpaíses'){
        rankPath += 'gtfRankCountry.json';
        name = 'Guess The Flag - Paises';
    }
    else if (rankType === 'gtfestados'){
        rankPath += 'gtfRankBR.json';
        name = 'Guess The Flag - Estados';
    }
    else if (rankType === 'gtc'){
        rankPath += 'gtcRank.json';
        name = 'Guess The Capital';
    }

    console.log('\tname = ' + name, '\n\tpath = '+ rankPath);
    return {rankPath, name}
}