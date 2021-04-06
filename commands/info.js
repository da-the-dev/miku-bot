const Discord = require('discord.js')
const utl = require('../utility')

/**@param {Discord.Client} */
const getTime = (client) => {
    var date = new Date(client.uptime)
    var hours = date.getHours() + date.getTimezoneOffset() / 60
    var minutes = date.getMinutes()
    var seconds = date.getSeconds()

    if(hours < 10)
        hours = '0' + hours.toString()
    else
        hours = hours.toString()

    if(minutes < 10)
        minutes = '0' + minutes.toString()
    else
        minutes = minutes.toString()

    if(seconds < 10)
        seconds = '0' + seconds.toString()
    else
        seconds = seconds.toString()

    return hours + ':' + minutes + ':' + seconds
}

module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
     * @description Usage: .info
    */
    (args, msg, client) => {
        var memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024

        var info =
            new Discord.MessageEmbed()
                .setColor('#2F3136')
                .setImage("https://cdn.discordapp.com/attachments/826131659333042256/828705514237198346/00.gif")
                .addField('Author', `\`\`\`${client.users.cache.find(u => u.id == process.env.MYID).tag}\`\`\``, true)
                .addField('Prefix', '```.```', true)
                .addField('RAM usage', `\`\`\`${memoryUsed.toFixed(2)} MB\`\`\``, true)
                .addField('Prog. Lang.', '```JavaScript```', true)
                .addField('Ping', `\`\`\`${Math.floor(client.ws.ping)}\`\`\``, true)
                .addField('Uptime', `\`\`\`${getTime(client)}\`\`\``, true)
                .setFooter(`${msg.author.tag} • ${utl.embed.calculateTime(msg)}`, msg.author.avatarURL())
        msg.channel.send(info)
    }