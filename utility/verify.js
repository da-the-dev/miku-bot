const Discord = require('discord.js')
const constants = require('../constants.json')

var timeout = null
/**
 * 
 * @param {Discord.MessageReaction} reaction 
 * @param {Discord.User} user 
 * @param {Discord.Client} client 
 */
module.exports.verify = async (reaction, user, client) => {
    if(reaction.message.id == client.verifyMsg) {
        console.log(`[VR] Verified user '${user.tag}'`)
        await reaction.message.guild.members.fetch({ cache: true })
        var member = await reaction.message.guild.members.cache.get(user.id).roles.remove(reaction.message.guild.roles.cache.get(constants.roles.verify))
        const calculateTime = () => {
            var time = 'Сегодня, в '
            var offset = member.joinedAt.getTimezoneOffset() + 180
            var hours = (member.joinedAt.getHours() + offset / 60).toString().padStart(2, '0')
            var minutes = member.joinedAt.getMinutes().toString().padStart(2, '0')
            time += `${hours}:${minutes}`
            return time
        }
        const emb = new Discord.MessageEmbed()
            .setDescription('Мы очень рады тебя видеть в нашей гостинице. Обязательно прочти [правила](https://discord.com/channels/718537792195657798/810202155079696414/821444057971556402) и заходи болтать, тебя уже заждались e-girls & e-boys.')
            .setImage('https://cdn.discordapp.com/attachments/810255515854569472/822563512634966056/welcome01.png')
            .setColor('#2F3136')
            .setFooter(`${user.tag} • ${calculateTime()}`, user.avatarURL())

        var m = await reaction.message.guild.channels.cache.get(constants.channels.general).send(`<@${user.id}>`, emb)
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