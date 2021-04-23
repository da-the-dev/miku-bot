const Discord = require('discord.js')
const constants = require('../constants.json')
const utl = require('../utility')

module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .vuban <member> 
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

        var mMember = msg.mentions.members.first()

        if(mMember) { // Member mentioned
            room.createOverwrite(mMember.id, {
                'CONNECT': true
            })
            utl.embed(msg, `Закрыт доступ для <@${mMember.user.id}> в вашей комнате`)
        } else
            utl.embed(msg, 'Вы не указали пользователя!')
    }
