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
        if(!msg.member.roles.cache.has(constants.roles.owner)) {
            utl.embed(msg, 'У Вас нет прав на эту команду!')
            return
        }

        /**@type {Discord.VoiceChannel} */
        var room = msg.member.voice.channel

        if(!room) {
            utl.embed(msg, 'У Вас нет приватной комнаты!')
            return
        }

        switch(args[1]) {
            case 'ban':
                var mMember = msg.mentions.members.first()

                if(mMember) {
                    room.createOverwrite(mMember.id, {
                        'CONNECT': false
                    })
                    room.members.forEach(m => {
                        if(m.id == mMember.id)
                            m.voice.setChannel(null)
                    })
                    utl.embed(msg, `Вы **закрыли доступ** в свою комнату для <@${mMember.user.id}>`)
                } else
                    utl.embed(msg, 'Вы не указали пользователя!')
                break

            case 'unban':
                var mMember = msg.mentions.members.first()

                if(mMember) { // Member mentioned
                    room.createOverwrite(mMember.id, {
                        'CONNECT': true
                    })
                    utl.embed(msg, `Вы **открыли доступ** в свою комнату для <@${mMember.user.id}>`)
                } else
                    utl.embed(msg, 'Вы не указали пользователя!')
                break

            case 'limit':
                var limit = Number(args[2])
                if(limit == null) {
                    utl.embed(msg, 'Вы не указали лимит!')
                    break
                }

                if(limit > 0 && limit < 100 && Number.isInteger(limit)) {
                    room.setUserLimit(limit)
                    utl.embed(msg, `Вы успешно **поставили лимит** пользователей в своей комнате на \`${limit}\``)
                    break
                } else if(limit == 0) {
                    room.setUserLimit(null)
                    utl.embed(msg, `Вы успешно **убрали лимит** пользователей в своей комнате`)
                    break
                } else if(limit >= 100) {
                    utl.embed(msg, 'Вы указали слишком большой лимит!')
                    break
                }
                else {
                    utl.embed(msg, 'Вы указали неверное число!')
                    break
                }

            case 'owner':
                var mMember = msg.mentions.members.first()

                if(mMember) { // Member mentioned
                    if(mMember.voice.channelID == room.id) {
                        var oldOwner = msg.member
                        var mMember = msg.mentions.members.first()

                        await oldOwner.roles.remove(constants.roles.owner)
                        await mMember.roles.add(constants.roles.owner)
                        utl.embed(msg, `Вы **передали владение** приватной комнаты <@${mMember.id}>`)
                    } else {
                        utl.embed(msg, 'Пользователь не находится в Вашей комнате!')
                        break
                    }
                } else {
                    utl.embed(msg, 'Вы не указали пользователя!')
                    break
                }
                break

            case 'name':
                args.shift()
                args.shift()
                var newName = args.join(' ')

                if(newName && newName.length <= 31) {
                    room.setName(newName)
                    utl.embed(msg, `Вы успешно **изменили название** своей комнаты на \`${newName}\``)
                } else if(newName && newName.length > 31) {
                    utl.embed(msg, 'Вы указали слишком длинное имя комнаты!')
                    break
                } else {
                    utl.embed(msg, 'Вы не указали имя комнаты!')
                    break
                }
        }
    }
