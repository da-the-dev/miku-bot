const Discord = require('discord.js')
const embeds = require('../embeds')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .edit <id>\n<jsonData>
    */
    async (args, msg, client) => {
        args.shift()
        args = args.join(' ').split('\n')
        console.log(args)
        var messageID = args[0]
        args.shift()
        if(!messageID) {
            msg.channel.send(embeds.error(msg.member, 'Не указан ID эмбеда!'))
            return
        }

        var stringData = args.join('\n').trim()
        console.log(stringData)
        var jsonData = {}
        if(!stringData) {
            msg.channel.send(embeds.error(msg.member, 'Вы не указали данные для эмбеда!'))
            return
        }

        try {
            jsonData = JSON.parse(stringData)
        } catch(err) {
            msg.channel.send(embeds.error(msg.member, 'Некорректные данные для эмбеда!'))
            return
        }

        var editMsg = msg.channel.messages.cache.find(m => m.id == messageID)
        if(!editMsg) {
            msg.channel.send(embeds.error(msg.member, 'Не найдено сообщение! Проверьте ID!'))
            return
        }

        var embed = new Discord.MessageEmbed(jsonData)
        if(jsonData.image) embed.setImage(jsonData.image)
        editMsg.edit(embed)
    }