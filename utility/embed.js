const Discord = require('discord.js')

const calculateTime = (msg) => {
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
     * @returns {Promise<Discord.Message>}
     */
    (msg, message) => {
        return msg.channel.send(new Discord.MessageEmbed()
            .setDescription(message)
            .setColor('#2F3136')
            .setFooter(`${msg.member.displayName} • ${calculateTime(msg)}`, msg.author.avatarURL()))

    }

/**
 * Calculate time when the message was sent
 * @param {(Discord.Message|number)} source
 */
module.exports.calculateTime = (source) => {
    // var time = 'Сегодня, в '
    // if(typeof source == 'number') {
    //     var date = new Date(source)
    //     var offset = date.getTimezoneOffset() + 180
    //     var hours = (date.getHours() + offset / 60).toString().padStart(2, '0')
    //     var minutes = date.getMinutes().toString().padStart(2, '0')
    //     time += `${hours}:${minutes}`
    // } else {
    //     var offset = source.createdAt.getTimezoneOffset() + 180
    //     var hours = (source.createdAt.getHours() + offset / 60).toString().padStart(2, '0')
    //     var minutes = source.createdAt.getMinutes().toString().padStart(2, '0')
    //     time += `${hours}:${minutes}`
    // }
    // return time

    var time = 'Сегодня, в '
    var date
    if(typeof source == 'number')
        date = new Date(new Date(source).toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
    else
        date = new Date(new Date(source.createdAt).toLocaleString("en-US", { timeZone: "Europe/Moscow" }))

    var hours = date.getHours().toString().padStart(2, '0')
    var minutes = date.getMinutes().toString().padStart(2, '0')
    time += `${hours}:${minutes}`
    return time
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
        .setFooter(`${msg.member.displayName} • ${calculateTime(msg)}`, msg.author.avatarURL())
}

module.exports.def = (msg, value) => {
    var message = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setFooter(`${msg.author.tag} • ${calculateTime(msg)} `, msg.author.avatarURL())
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