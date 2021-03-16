const Discord = require('discord.js')
const emojies = ['➡️', '⬅️']
const calculateTime = (msg) => {
    var time = 'Сегодня, в '
    var offset = msg.createdAt.getTimezoneOffset() + 180
    var hours = (msg.createdAt.getHours() + offset / 60).toString().padStart(2, '0')
    var minutes = msg.createdAt.getMinutes().toString().padStart(2, '0')
    time += `${hours}:${minutes}`
    return time
}

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
        .setFooter(`${footerUser} • ${calculateTime(msg)} • стр ${page}/2`, footerURL)

    const rClient = require('redis').createClient(process.env.RURL)
    rClient.get('roles', (err, res) => {
        if(err) throw err
        if(res) {
            /**@type {Array<object>} */
            var rolesData = JSON.parse(res)
            rolesData.sort((a, b) => {
                if(a.pos > b.pos) return 1
                if(a.pos < b.pos) return -1
                return 0
            })

            var length = rolesData.slice((page - 1) * 9, (page - 1) * 9 + 9).length + (page - 1) * 9
            console.log(length)
            for(i = (page - 1) * 9; i < length; i++)
                embed.addField(`⌗ ${rolesData[i].pos} — ${rolesData[i].price}<:__:813854413579354143>`, ` <@&${rolesData[i].id}>`, true)

            rClient.quit()
            msg.edit(embed)
                .then(async m => {
                    await m.reactions.removeAll()
                    await m.react(emojies[page - 1])
                })
        }
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
    // console.log(!msg.embeds[0], !msg.embeds[0].footer, !msg.embeds[0].footer.text.includes('стр'), user.id == client.user.id, user.bot)
    // console.log(!(!msg.embeds[0] || !msg.embeds[0].footer || !msg.embeds[0].footer.text.includes('стр') || user.id == client.user.id || user.bot))
    if(!(!msg.embeds[0] || !msg.embeds[0].footer || !msg.embeds[0].footer.text.includes('стр') || user.id == client.user.id || user.bot)) {
        var footerUser = msg.embeds[0].footer.text.slice(0, msg.embeds[0].footer.text.indexOf('•') - 1)
        if(user.username != footerUser)
            return

        var footerURL = msg.embeds[0].footer.iconURL
        var footerPage = msg.embeds[0].footer.text.slice(msg.embeds[0].footer.text.indexOf('•'))

        var index1 = footerPage.indexOf('1')

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