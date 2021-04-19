const Discord = require('discord.js')
const constants = require('../constants.json')
const utl = require('../utility')

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .v <setting> <value> 
    */
    async (args, msg, client) => {
        if(msg.member.voice.channel.parentID != constants.categories.privateRooms)
            return

        if(!msg.member.permissionsIn(msg.member.voice.channel).has('CREATE_INSTANT_INVITE')) {
            utl.embed(msg, 'У Вас нет прав на эту команду!')
            return
        }

        /**@type {Discord.VoiceChannel} */
        var room = msg.member.voice.channel

        if(!room) {
            utl.embed(msg, 'У Вас нет приватной комнаты!')
            return
        }

        args.shift()
        var newName = args.join(' ')

        if(newName && newName.length <= 31) {
            room.setName(newName)
            utl.embed(msg, `Название вашей комнаты изменено на \` ${newName} \``)
        } else if(newName && newName.length > 31)
            utl.embed(msg, 'Вы указали слишком длинное имя комнаты!')
        else
            utl.embed(msg, 'Вы не указали имя комнаты!')
    }