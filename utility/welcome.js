const Discord = require('discord.js')
const constats = require('../constants.json')
/**
 * Send a welcome message then delete it
 * @param {Discord.GuildMember} member - New member
 * @param {Discord.Guild} guild - Guild to find the channel
 */
module.exports = async (member, guild) => {
    const emb = new Discord.MessageEmbed()
        .setDescription('Мы очень рады тебя видеть в нашей гостинице. Обязательно прочти [правила](https://discord.com/channels/718537792195657798/810202155079696414/821444057971556402) сервера и заходи болтать, тебя уже заждались e-girls & e-boys.')
        .setImage('https://cdn.discordapp.com/attachments/810255515854569472/822563512634966056/welcome01.png')
        .setColor('#2F3136')

    var msg = await guild.channels.cache.get(constats.channels.general).send(`<@${member.id}>`, emb)
    console.log(msg)
    setTimeout((msg) => {
        msg.delete()
    }, 60000, msg)
}