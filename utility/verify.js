const Discord = require('discord.js')
const constants = require('../constants.json')
const utl = require('../utility')

const reward = (user, reaction, member, client) => {
    const emb = new Discord.MessageEmbed()
        .setDescription('Мы очень рады тебя видеть в нашей гостинице. Обязательно прочти [правила](https://discord.com/channels/718537792195657798/810202155079696414/821444057971556402) и заходи болтать, тебя уже заждались e-girls & e-boys.')
        .setImage('https://cdn.discordapp.com/attachments/810255515854569472/822563512634966056/welcome01.png')
        .setColor('#2F3136')
        .setFooter(`${user.username} • ${utl.embed.calculateTime(member)} `, user.avatarURL())

    var m = reaction.message.guild.channels.cache.get(constants.channels.general).send(`<@${user.id}> `, emb)
    if(!client.welcomeReactionReward) { // Enable if is false and add 1 min timeout
        client.welcomeReactionReward = true
        timeout = setTimeout(m => {
            client.welcomeReactionReward = false
            m.delete()
        }, 60000, m)
    } else { // If previous timeout hasn't finished, start a new one
        clearTimeout(timeout)
        timeout = setTimeout(m => {
            client.welcomeReactionReward = false
            m.delete()
        }, 60000, m)
    }
}

var timeout = null
/**
 * 
 * @param {Discord.MessageReaction} reaction 
 * @param {Discord.User} user 
 * @param {Discord.Client} client 
 */
module.exports.verify = async (reaction, user, client) => {
    if(reaction.message.id == client.verifyMsg) {
        var member = await reaction.message.guild.members.fetch(user.id)
        member.roles.remove(constants.roles.verify).then(console.log(`[VR] Verified user '${user.tag}'`))

        reward(user, reaction, member, client)
    }
}

/**
 * Marks new users for verification
 * @param {Discord.GuildMember} member
 */
module.exports.mark = member => {
    member.roles.add(constants.roles.verify)
        .then(m => {
            console.log(`[VR] Marked user '${m.user.username}'`)
        })
}