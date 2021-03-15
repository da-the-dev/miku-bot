const Discord = require('discord.js')

/**
 * Calculate time when the message was sent
 * @param {Discord.Message} msg
 */
module.exports.calculateTime = (msg) => {
    var time = 'Сегодня, в '
    var offset = msg.createdAt.getTimezoneOffset() + 180
    var hours = (msg.createdAt.getHours() + offset / 60).toString().padStart(2, '0')
    var minutes = msg.createdAt.getMinutes().toString().padStart(2, '0')
    time += `${hours}:${minutes}`
    return time
}

module.exports =
    /**
     * Standard embed reply
     * @param {Discord.Message} msg - Disord message
     * @param {string} message - Text message to send
     */
    (msg, message) => {
        msg.channel.send(new Discord.MessageEmbed()
            .setDescription(message)
            .setColor('#2F3136')
            .setFooter(`${msg.author.tag} • ${this.calculateTime(msg)}`, msg.author.avatarURL()))
    }

/**
 * Return MessageEmbeded embed reply
 * @param {Discord.Message} msg - Disord message
 * @param {string} message - Text message to send
 */
module.exports.build = (msg, message) => {
    return new Discord.MessageEmbed()
        .setDescription(message)
        .setColor('#2F3136')
}

module.exports.def = (msg, value) => {
    var message = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setFooter(`${msg.author.tag} • ${this.calculateTime(msg)} `, msg.author.avatarURL())
    if(value)
        message.setDescription(`Антикраш защита **включена**!`)
    else
        message.setDescription(`Антикраш защита **выключена**!`)

    return message
}
module.exports.sus = (client, reason) => {
    return new Discord.MessageEmbed()
        .setColor('#2F3136')
        .setAuthor('С Вас были сняты роли за подозрительную деятельность', 'https://cdn.discordapp.com/attachments/810255515854569472/813821208670765057/photodraw.ru-35920.png')
        .setDescription(`С Вас были сняты все роли с правами администратора за подозрительную деятельность: \`${reason}\``)
        .setFooter(`Уведомила ${client.user.username} Обратитесь к другим администраторам для выяснения обстоятельств`, client.user.avatarURL())
}