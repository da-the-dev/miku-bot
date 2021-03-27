const Discord = require('discord.js')
/**
 * 
 * @param {Discord.Message} msg - Message to react to
 * @param {Discord.Client} client - Client to check for perms to react
 */
const welcomeWords = ['добрый', 'привет', 'хай', 'welcome', 'салам', 'добро']
module.exports = (msg, client) => {
    if(client.welcomeReactionReward) {
        var c = msg.content.toLocaleLowerCase()

        if(welcomeWords.find(w => c.includes(w)))
            msg.react('<:__:824359401895886908>')
    }
}