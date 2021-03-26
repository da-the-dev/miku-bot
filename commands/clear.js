const Discord = require('discord.js')
const util = require('../utility')
const constants = require('../constants.json')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Handles reaction commands
    */
    (args, msg, client) => {
        var chatCRole = msg.guild.roles.cache.get(constants.roles.chatControl)
        if(msg.member.roles.cache.find(r => r.position >= chatCRole.position)) {
            var msgAmount = args[1]
            if(!msgAmount) {
                util.embed(msg, 'Не указано количество сообщений!')
                return
            }
            msg.channel.bulkDelete(msgAmount, true)
                .then(msgs => util.embed(msg, `Удалено **${msgs.size}** сообщений`))
        } else
            util.embed(msg, 'У Вас нет прав на эту команду!')
    }