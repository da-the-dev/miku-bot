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

        var member = await client.guilds.cache.first().members.fetch(user.id)
        await member.roles.remove(constants.roles.verify)

        console.log(`[VR] Verified user '${user.tag}'`)
        reward = true

        const emb = new Discord.MessageEmbed()
            .setDescription('Мы очень рады тебя видеть в нашей гостинице. Обязательно прочти [правила](https://discord.com/channels/718537792195657798/810202155079696414/821444057971556402) и заходи болтать, тебя уже заждались e-girls & e-boys.')
            .setImage('https://cdn.discordapp.com/attachments/810255515854569472/822563512634966056/welcome01.png')
            .setColor('#2F3136')
            .setFooter(`${user.tag} • ${utl.embed.calculateTime(member)}`, user.avatarURL())

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