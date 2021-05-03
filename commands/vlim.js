const Discord = require('discord.js')
const constants = require('../constants.json')
const utl = require('../utility')
const sMsg = 'Приватные комнаты'

module.exports =
    /**
     * @param {Array<string>} args Command argument
     * @param {Discord.Message} msg Discord message object
     * @param {Discord.Client} client Discord client object
     * @description Usage: .vlim <limit>
     */
    async (args, msg, client) => {
        if(msg.member.voice.channel.parentID != constants.categories.privateRooms)
            return

        if(!msg.member.permissionsIn(msg.member.voice.channel).has('CREATE_INSTANT_INVITE')) {
            utl.embed(msg, sMsg, 'У Вас нет прав на эту команду!')
            return
        }

        /**@type {Discord.VoiceChannel} */
        var room = msg.member.voice.channel

        if(!room) {
            utl.embed(msg, sMsg, 'У Вас нет приватной комнаты!')
            return
        }

        var limit = Number(args[1])
        if(limit == null) {
            utl.embed(msg, sMsg, 'Вы не указали лимит!')
            return
        }

        if(limit > 0 && limit < 100 && Number.isInteger(limit)) {
            room.setUserLimit(limit)
            utl.embed(msg, sMsg, `Установлен лимит пользователей на \` ${limit} \` в вашей комнате`)
        } else if(limit == 0) {
            room.setUserLimit(null)
            utl.embed(msg, sMsg, `Лимит пользователей снят с вашей комнаты`)
        } else if(limit >= 100)
            utl.embed(msg, sMsg, 'Вы указали слишком большой лимит!')
        else
            utl.embed(msg, sMsg, 'Вы указали неверное число!')
    }