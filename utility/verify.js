const Discord = require('discord.js')
const constants = require('../constants.json')
/**
 * 
 * @param {Discord.MessageReaction} reaction 
 * @param {Discord.User} user 
 */
module.exports.verify = async (reaction, user) => {
    if(reaction.message.id == '819295686415482921') {
        console.log(`[VR] Verified user '${user.tag}'`)

        var member = await reaction.message.guild.members.cache.find(m => m.user.id == user.id).roles.remove(reaction.message.guild.roles.cache.get(constants.roles.verify))
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

        if(user.id != '810942432274415636') { // My second account ID
            var m = await reaction.message.guild.channels.cache.get(constants.channels.general).send(`<@${user.id}>`, emb)
            m.react('<:__:824359401895886908>')
            setTimeout(m => {
                m.delete()
            }, 60000, m)

        } else // Send my 2 acc's welcome message to dev channel instead
            reaction.message.guild.channels.cache.get(constants.channels.dev).send(`<@${user.id}>`, emb)

    }
}

/**
 * Marks new users for verification
 * @param {Discord.GuildMember} member
 */
module.exports.mark = async (member) => {
    member.roles.add(constants.roles.verify)
        .then(m => {
            console.log(`[VR] Marked user '${m.user.username}'`)
            m.roles.cache.array().forEach(r => console.log(r.name))
        })
}