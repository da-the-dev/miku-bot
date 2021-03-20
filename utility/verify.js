const Discord = require('discord.js')
const constants = require('../constants.json')
/**
 * 
 * @param {Discord.MessageReaction} reaction 
 * @param {Discord.User} user 
 */
module.exports.verify = async (reaction, user) => {
    if(reaction.message.id == 819295686415482921) {
        console.log(`[VR] Verified user '${user.tag}'`)
        const constants = require('../constants.json')
        reaction.message.guild.members.cache.find(m => m.user.id == user.id).roles.remove(reaction.message.guild.roles.cache.get(constants.roles.verify))
        const calculateTime = () => {
            var time = 'Сегодня, в '
            var offset = reaction.emoji.createdAt.getTimezoneOffset() + 180
            var hours = (reaction.emoji.createdAt.getHours() + offset / 60).toString().padStart(2, '0')
            var minutes = reaction.emoji.createdAt.getMinutes().toString().padStart(2, '0')
            time += `${hours}:${minutes}`
            return time
        }
        const emb = new Discord.MessageEmbed()
            .setDescription('Мы очень рады тебя видеть в нашей гостинице. Обязательно прочти [правила](https://discord.com/channels/718537792195657798/810202155079696414/821444057971556402) и заходи болтать, тебя уже заждались e-girls & e-boys.')
            .setImage('https://cdn.discordapp.com/attachments/810255515854569472/822563512634966056/welcome01.png')
            .setColor('#2F3136')
            .setFooter(`${user.tag} • ${calculateTime()}`, user.avatarURL())
        var msg = await reaction.message.guild.channels.cache.get(constants.channels.general).send(`<@${user.id}>`, emb)
        setTimeout((msg) => {
            msg.delete()
        }, 60000, msg)
    }
}

/**
 * @param {Discord.GuildMember} member
 */
module.exports.mark = (member) => {
    console.log(`[VR] Marked user '${member.user.username}'`)
    member.roles.add(member.guild.roles.cache.get(constants.roles.verify))
}