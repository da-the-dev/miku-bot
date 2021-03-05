const Discord = require('discord.js')
const embeds = require('../embeds')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .say <jsonData>
    */
    async (args, msg, client) => {
        args = args.join(' ').split('\n')
        args.shift()

        var stringData = args.join('\n')
        var jsonData = {}
        if(stringData == "") {
            msg.channel.send(embeds.embedBuilder())
            return
        }

        try {
            jsonData = JSON.parse(stringData)
        } catch(err) {
            msg.channel.send(embeds.error(msg.member, 'Некорректные данные для эмбеда!'))
            return
        }

        msg.channel.send(new Discord.MessageEmbed(jsonData))
    }