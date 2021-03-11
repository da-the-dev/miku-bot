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

        var embed = new Discord.MessageEmbed(jsonData)
        var plainText = ''
        if(jsonData.image) embed.setImage(jsonData.image)
        if(jsonData.plainText) msg.channel.send(jsonData.plainText)
        else msg.channel.send(embed)
    }
module.exports.allowedInGeneral = true