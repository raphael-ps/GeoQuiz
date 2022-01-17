exports.isRankScore = (userInfos, rankFile, guildId) => {
    console.log('Em "isRankScore": ');
    const fs = require('fs');
    
    let path = `data\\rankings\\${guildId}\\`;

    if (!fs.existsSync(path) ){
        fs.mkdirSync(path);
        fs.writeFileSync(path+`gtfRankCountry.json`,'[]');
        fs.writeFileSync(path+'gtfRankBR.json','[]');
        fs.writeFileSync(path+'gtcRank.json','[]');
    }

    const ranking = require(`..\\${path}${rankFile}`);
    console.log(`\tRank path = ..\\${path}${rankFile}`);
    let userIndex = ranking.findIndex( user => {
        return user.userId === userInfos.userId
    });
    let changed = false;
    const rankLength = ranking.length;

    if (userIndex < 0){
        
        if (rankLength < 10) changed = true; 

        for (userIndex = 0; userIndex < rankLength; userIndex++){
            if ( ranking[userIndex].score < userInfos.score || (ranking[userIndex].score === userInfos.score && userInfos.timeNeeded < ranking[userIndex].timeNeeded) ){
                changed = true;
                break;
            }
        }
        if (changed){
            ranking.splice(userIndex, 0, userInfos);
            if (rankLength > 9) ranking.pop();
        }
    } else{
        const rankUser = ranking[userIndex];
        if ( rankUser.score < userInfos.score || (rankUser.score === userInfos.score && userInfos.timeNeeded < rankUser.timeNeeded) ){
            ranking[userIndex] = userInfos;
            changed = true;
        }
    }

    if (changed){
       fs.writeFileSync("data\\rankings\\"+guildId+"\\"+rankFile, JSON.stringify(ranking));
        console.log('\tRanking atualizado...');
    }
    return (changed) ? userIndex+1 : false; 

}
