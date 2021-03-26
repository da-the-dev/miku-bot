const Discord = require('discord.js')
/**
 * 
 * @param {Discord.Message} msg - Message to react to
 * @param {Discord.Client} client - Client to check for perms to react
 */
module.exports = (msg, client) => {
    if(client.welcomeReactionReward) {
        var c = msg.content.toLocaleLowerCase()
        if(c.includes('добрый') || c.includes('привет') || c.includes('хай') || c.includes('welcome') || c.includes('салам') || c.includes('добро'))
            msg.react('<:__:824359401895886908>')
    }
}