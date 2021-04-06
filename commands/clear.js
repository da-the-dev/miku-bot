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
    async (args, msg, client) => {
        var chatCRole = msg.guild.roles.cache.get(constants.roles.chatControl)
        if(msg.member.roles.cache.find(r => r.position >= chatCRole.position)) {
            var msgAmount = Number(args[1])
            if(!msgAmount) {
                util.embed(msg, 'Не указано количество сообщений!')
                return
            }
            if(!Number.isInteger(msgAmount) && !Number.isFinite(msgAmount) && !Number.isNaN(msgAmount)) {
                util.embed(msg, 'Указано неверное количество сообщений!')
                return
            }

            var hundreds = Math.floor(msgAmount / 100)
            var rest = msgAmount % 100

            for(i = 0; i < hundreds; i++)
                msg.channel.bulkDelete(100)

            rest > 0 ? await msg.channel.bulkDelete(rest) : null
            util.embed(msg, `Удалено **${msgAmount}** сообщений`).then(m => m.delete({ timeout: 3000 }))
        } else
            util.embed(msg, 'У Вас нет прав на эту команду!')
    }
module.exports.allowedInGeneral = true