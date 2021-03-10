const Discord = require('discord.js')
const roles = require('../roles.json')
const embeds = require('../embeds.js')
module.exports =
    /**
    * @param {Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .v <setting> <value> 
    */

    async (args, msg, client) => {
        console.log('in v')
        if(!msg.member.roles.cache.has(roles.owner)) {
            msg.channel.send(embeds.error(msg.member, 'У Вас нет прав на эту команду!'))
            return
        }

        var guild = msg.guild
        /**@type {Discord.CategoryChannel} */
        /**@type {Discord.VoiceChannel} */
        var room = msg.member.voice.channel

        if(!room) {
            msg.channel.send(embeds.error(msg.member, 'У Вас нет приватной комнаты!'))
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
                    msg.channel.send(embeds.vlock(msg.member, mMember))
                } else {
                    msg.channel.send(embeds.error(msg.member, 'Вы не указали пользователя!'))
                }
                break

            case 'unban':
                var mMember = msg.mentions.members.first()

                if(mMember) { // Member mentioned
                    room.createOverwrite(mMember.id, {
                        'CONNECT': true
                    })
                    msg.channel.send(embeds.vunlock(msg.member, mMember))
                } else {
                    msg.channel.send(embeds.error(msg.member, 'Вы не указали пользователя!'))
                }
                break

            case 'limit':
                var limit = Number(args[2])
                if(limit == null) {
                    msg.channel.send(embeds.error(msg.member, 'Вы не указали лимит!'))
                    break
                }

                if(limit > 0 && limit < 100 && Number.isInteger(limit)) {
                    room.setUserLimit(limit)
                    msg.channel.send(embeds.vlimit(msg.member, limit))
                    break
                } else if(limit == 0) {
                    room.setUserLimit(null)
                    msg.channel.send(embeds.vlimitzero(msg.member))
                    break
                } else if(limit >= 100) {
                    msg.channel.send(embeds.error(msg.member, 'Вы указали слишком большой лимит!'))
                    break
                }
                else {
                    msg.channel.send(embeds.error(msg.member, 'Вы указали неверное число!'))
                    break
                }

            case 'owner':
                var mMember = msg.mentions.members.first()

                if(mMember) { // Member mentioned
                    if(mMember.voice.channelID == room.id) {
                        var oldOwner = msg.member
                        var mMember = msg.mentions.members.first()

                        console.log(oldOwner.user.username)
                        console.log(mMember.user.username)

                        await oldOwner.roles.remove(client.ownerRole.id)
                        await mMember.roles.add(client.ownerRole.id)
                        msg.channel.send(embeds.vowner(msg.member, mMember))
                    } else {
                        msg.channel.send(embeds.error(msg.member, 'Пользователь не находится в Вашей комнате!'))
                        break
                    }
                } else {
                    msg.channel.send(embeds.error(msg.member, 'Вы не указали пользователя!'))
                    break
                }
                break

            case 'name':
                args.shift()
                args.shift()
                var newName = args.join(' ')

                if(newName && newName.length <= 31) {
                    room.setName(newName)
                    msg.channel.send(embeds.vname(msg.member, newName))
                } else if(newName && newName.length > 31) {
                    msg.channel.send(embeds.error(msg.member, 'Вы указали слишком длинное имя комнаты!'))
                    break
                } else {
                    msg.channel.send(embeds.error(msg.member, 'Вы не указали имя комнаты!'))
                    break
                }
        }
    }
