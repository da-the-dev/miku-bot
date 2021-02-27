const Discord = require('discord.js')
const roles = require('../roles.json')
module.exports =
    /**
    * @param  Array<string>} args Command argument
    * @param {Discord.Message} msg Discord message object
    * @param {Discord.Client} client Discord client object
    * @description Usage: .v <arg> 
    */

    async (args, msg, client) => {
        var guild = msg.guild
        /**@type {Discord.CategoryChannel} */
        var category = guild.channels.find(c => c.name == "Chillzone")
        /**@type {Discord.VoiceChannel} */
        var room
        if(msg.member.permissions.has('CREATE_INSTANT_INVITE'))
            room = msg.member.voiceChannel
        if(!room) {
            msg.reply("you don't have any private rooms at your disposal! Go create one first!")
            return
        }

        // room.permissionOverwrites.find(p => p.id == msg.member.id)

        if(msg.member.permissions.has('CREATE_INSTANT_INVITE')) {
            console.log('has perms')
            switch(args[1]) {
                case 'lock':
                    var mMember = msg.mentions.members.first()

                    if(mMember) {
                        room.overwritePermissions(mMember.id, {
                            'CONNECT': false
                        })
                        room.members.forEach(m => {
                            if(m.id == mMember.id)
                                m.setVoiceChannel(null)
                        })
                    } else {
                        msg.reply('no member specified!')
                    }
                    break

                case 'unlock':
                    var mMember = msg.mentions.members.first()

                    if(mMember) { // Member mentioned
                        room.overwritePermissions(mMember.id, {
                            'CONNECT': true
                        })
                    } else {
                        msg.reply('no member specified!')
                    }
                    break

                case 'limit':
                    console.log(args[2])
                    var limit = Number(args[2])
                    console.log(limit)
                    if(limit == null) {
                        msg.reply('no limit specified!')
                        break
                    }

                    if(limit > 0 && Number.isInteger(limit)) {
                        room.setUserLimit(limit)
                        break
                    } else if(limit == 0) {
                        room.setUserLimit(null)
                        break
                    } else {
                        msg.reply('not a valid limit number')
                        break
                    }

                case 'owner':
                    var mMember = msg.mentions.members.first()

                    if(mMember) { // Member mentioned
                        var oldOwner = room.members.find(m => m.permissions.has('CREATE_INSTANT_INVITE'))
                        var mMember = msg.mentions.members.first()

                        room.overwritePermissions(mMember.id, {
                            'CREATE_INSTANT_INVITE': true
                        })
                        room.overwritePermissions(oldOwner.id, {
                            'CREATE_INSTANT_INVITE': false
                        })
                    } else {
                        msg.reply('no member specified!')
                    }
                    break

                case 'name':
                    args.shift()
                    args.shift()
                    var newName = args.join(' ')

                    if(newName) {
                        room.setName(newName)
                    } else {
                        msg.reply('no new name specified!')
                    }
                    break
            }
        }
        else {
            console.log('doent have perms')
        }
    }