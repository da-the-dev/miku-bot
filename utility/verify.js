const Discord = require('discord.js')
const constants = require('../constants.json')
const utl = require('../utility')
var reward = false
var currentTimeout = null
/**
 * 
 * @param {Discord.MessageReaction} reaction 
 * @param {Discord.User} user 
 * @param {Discord.Client} client 
 */
module.exports = async (reaction, user, client) => {
    if(reaction.message.id == client.verifyMsg) {

        var member = await reaction.message.guild.members.fetch(user.id)
        await member.roles.remove(constants.roles.verify)
            .catch(err => console.log(err))

        console.log(`[VR] Verified user '${user.tag}'`)
        reward = true

        const emb = new Discord.MessageEmbed()
            .setDescription(`**Тепло приветствуем** ${user.username} <:__:827851416886312970>\nНадеемся, что тебе понравится у нас и ты останешься.\nЧтобы легче было ориентироваться, прочитай <#810202155079696414> <a:__:827590350083194930>`)
            .setImage("https://cdn.discordapp.com/attachments/826131659333042256/827862202488848394/00.gif")
            .setColor('#2F3136')
            .setFooter(`${user.username} • ${utl.embed.calculateTime(member)}`, user.avatarURL())

        reaction.message.guild.channels.cache.get(constants.channels.general).send(`<@${user.id}>`, { embed: emb })
            .then(m => {
                currentTimeout ? clearTimeout(currentTimeout) : null
                setTimeout(() => {
                    reward = false
                    m.delete()
                        .catch(e => { })
                }, 60000, m)
            })
    }
}

/**
 * Leaves reaction on users' welcome messages
 * @param {Discord.Message} msg - Message to react to
 * @param {Discord.Client} client - Client to check for perms to react
 */
const welcomeWords = ['добр', 'прив', 'хай', 'welcome', 'hi', 'салам']
module.exports.welcomeReward = (msg, client) => {
    if(reward) {
        var c = msg.content.toLocaleLowerCase()

        if(welcomeWords.find(w => c.includes(w)))
            msg.react('<:__:824359401895886908>')
    }
}

/**
 * Marks new users for verification
 * @param {Discord.GuildMember} member
 */
module.exports.mark = async member => {
    await member.roles.add(constants.roles.verify)
    console.log(`[VR] Marked user '${member.user.username}'`)

}