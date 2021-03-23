const Discord = require('discord.js')
const constants = require('../constants.json')

/**
 * @description Handles the room creation
 * @param {Discord.Client} client
 */
module.exports.createRoom = (client) => {
    // Create 'createRoom'
    var guild = client.guilds.cache.first()
    /**@type {Discord.CategoryChannel} */
    // var privateRoomCategory = guild.channels.find(c => c.type == "category" && c.name.toLowerCase().includes("private rooms"))
    var privateRoomCategory = guild.channels.cache.find(c => c.type == "category" && c.name == "⌗                       Private︰ 数字")
    /**@type {Discord.VoiceChannel} */
    var privateCreator = privateRoomCategory.children.find(c => c.type == 'voice' && c.name == "．create 部屋")
    if(!privateCreator)
        privateCreator = guild.channels.create('．create 部屋',
            {
                type: "voice",
                permissionOverwrites:
                    [
                        {
                            id: constants.roles.muted,
                            deny: ['VIEW_CHANNEL', "CONNECT"]
                        },
                        {
                            id: constants.roles.toxic,
                            deny: ['VIEW_CHANNEL', "CONNECT"]
                        },
                        {
                            id: constants.roles.localban,
                            deny: ['VIEW_CHANNEL', "CONNECT"]
                        },
                        {
                            id: guild.id,
                            allow: ['VIEW_CHANNEL', "CONNECT"]
                        }
                    ],
                parent: privateRoomCategory
            })
}

/**
 * @description Handles private room deletion
 * @param {Discord.VoiceState} oldState 
 * @param {Discord.VoiceState} newState  
 */
module.exports.roomDeletion = (oldState, newState) => {
    // Ignore if channel didn't change
    if(oldState.channelID == newState.channelID)
        return

    // Create private room
    if(newState.channel && newState.member.voice.channel.id == constants.channels.creator) {
        var guild = newState.member.guild
        var category = guild.channels.cache.get(constants.categories.privateRooms)
        guild.channels.create(newState.member.user.username,
            {
                type: 'voice',
                permissionOverwrites:
                    [
                        {
                            id: constants.roles.verify,
                            deny: ['VIEW_CHANNEL', "CONNECT"]
                        },
                        {
                            id: constants.roles.muted,
                            deny: ['VIEW_CHANNEL', "CONNECT"]
                        },
                        {
                            id: constants.roles.toxic,
                            deny: ['VIEW_CHANNEL', "CONNECT"]
                        },
                        {
                            id: constants.roles.localban,
                            deny: ['VIEW_CHANNEL', "CONNECT"]
                        },
                        {
                            id: newState.member.user.id,
                            allow: ['VIEW_CHANNEL', 'CONNECT']
                        }
                    ],
                parent: category
            })
            .then(c => {
                newState.member.voice.setChannel(c, 'Перемещаю в приватную команату')
                    .then(m => {
                        m.roles.add(constants.roles.owner)
                    })
            })
    }

    if(oldState.channel && oldState.channel.id != constants.channels.creator) {
        var channel = oldState.channel

        var role = oldState.member.roles.cache.get(constants.roles.owner)

        // Delete if owner left
        if(role) {
            console.log('[PR] delete owner room cause dis')
            oldState.member.roles.remove(constants.roles.owner)
            console.log('pm1 1')
            if(!channel.deleted)
                channel.delete()
                    .catch(console.log('[PR] fail to delete after owner left'))
            return
        }

        // Delete empty room
        if(channel.members.size <= 0 && channel.name != '．create 部屋' && channel.parent.name == "⌗                       Private︰ 数字") {
            console.log('[PR] delete empty room')
            if(!channel.deleted)
                channel.delete()
                    .catch(console.log('[PR] fail to delete after room empty'))
            return
        }
    }
}