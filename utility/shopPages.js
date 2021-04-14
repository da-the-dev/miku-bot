const Discord = require('discord.js')
const emojies = ['➡️', '⬅️']
const utl = require('../utility')

/** 
 * Build and edit shop message
 * @param {number} page - Page to switch to
 * @param {string} footerUser - Username of user who sent shop message
 * @param {string} footerURL - User's avatar URL
 * @param {Discord.Message} msg - Message to edit
 */
const buildPage = (page, footerUser, footerURL, msg) => {
    var embed = new Discord.MessageEmbed()
        .setColor('#2F3136')
        .setFooter(`${footerUser} • ${utl.embed.calculateTime(msg)} • стр ${page}/2`, footerURL)

    utl.db.createClient(process.env.MURL).then(db => {


        db.get(msg.guild.id, 'serverSettings').then(serverSettings => {
            if(serverSettings) {
                db.close()

                var length = serverSettings.roles.slice((page - 1) * 9, (page - 1) * 9 + 9).length + (page - 1) * 9
                for(i = (page - 1) * 9; i < length; i++)
                    embed.addField(`⌗ ${i + 1} — ${serverSettings.roles[i].price}<:__:813854413579354143>`, ` <@&${serverSettings.roles[i].id}>`, true)

                msg.edit(embed)
                    .then(async m => {
                        await m.reactions.removeAll()
                        await m.react(emojies[page - 1])
                    })
            }
        })
    })
}

/**
 * Manages "shop" page reactions
 * @param {Discord.MessageReaction} reaction - Reaction
 * @param {Discord.User} user - Reaction's user
 * @param {Discord.Client} client - Bot client
 */
module.exports = (reaction, user, client) => {
    var msg = reaction.message
    if(!(!msg.embeds[0] || !msg.embeds[0].footer || !msg.embeds[0].footer.text.includes('стр') || user.id == client.user.id || user.bot)) {
        var footerUser = msg.embeds[0].footer.text.slice(0, msg.embeds[0].footer.text.indexOf('•') - 1)
        if(user.username != footerUser)
            return

        var footerURL = msg.embeds[0].footer.iconURL
        var footerPage = msg.embeds[0].footer.text.slice(msg.embeds[0].footer.text.indexOf('• стр'))

        var index1 = footerPage.indexOf('1')
        console.log(footerPage, reaction.emoji.name, index1)
        if(reaction.emoji.name == '⬅️' && index1 == -1) { // 
            console.log('Second page, flip to first')
            buildPage(1, footerUser, footerURL, msg)
        }
        else if(reaction.emoji.name == '➡️' && index1 != -1) { // 
            console.log('First page, flip to second')
            buildPage(2, footerUser, footerURL, msg)
        }
    }
}